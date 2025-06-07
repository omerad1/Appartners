import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";
import { useDispatch, useSelector } from "react-redux";
import { updateOnboardingData, resetOnboarding } from "../../store/redux/slices/onboardingSlice";
import { registerUser } from "../../api/registration";

const StepSeven = () => {
  const dispatch = useDispatch();
  const onboardingData = useSelector((state) => state.onboarding);
  const [selected, setSelected] = useState(onboardingData.userType || null);

  const handleSelect = (type) => {
    setSelected(type);
    dispatch(updateOnboardingData({ userType: type }));
  };

  const handleNext = async () => {
    if (!selected) {
      Alert.alert(
        "Error",
        "Please select whether you want to find or list an apartment"
      );
      return false;
    }

    try {
      // Prepare registration data
      const stringDate = onboardingData.birthDate.split("T")[0]
      const registrationData = {
        email: onboardingData.email,
        phone_number: onboardingData.phoneNumber,
        first_name: onboardingData.firstName,
        last_name: onboardingData.lastName,
        password: onboardingData.password,
        birth_date: stringDate,
        occupation: onboardingData.occupation,
        gender: onboardingData.gender,
        preferred_city: onboardingData.location,
        about_me: onboardingData.aboutMe,
        user_type: onboardingData.userType,
        photo: onboardingData.photo,
      };
      console.log(registrationData)
      // Send registration request
      const response = await registerUser(registrationData);

      if (response && !response.error) {
        // Reset the onboarding state to initial values
        dispatch(resetOnboarding())
        return true; // Continue to next step
      } else {
        console.log("❌ Registration failed:", response);
        // Display the detailed error message from the server
        const errorMessage = response.message 
          ? typeof response.message === 'object' 
            ? JSON.stringify(response.message) 
            : response.message
          : "Registration failed. Please try again.";
        
        Alert.alert("Registration Error", errorMessage);
        return false;
      }
    } catch (error) {
      console.log("❌ Registration failed:", error);
      // Extract error message if available
      const errorMessage = error.response?.data 
        ? typeof error.response.data === 'object'
          ? JSON.stringify(error.response.data)
          : error.response.data
        : error.message || "Registration failed. Please try again.";
      
      Alert.alert("Registration Error", errorMessage);
      return false;
    }
  };

  return (
    <OnBoardingLayout
      title={"Are You Looking To Find An Apartment Or List One?"}
      next={true}
      direction={"StepEight"}
      onPress={handleNext}
    >
      <View style={styles.container}>
        {/* Row container for GIFs and text */}
        <View style={styles.row}>
          {/* First GIF and text */}
          <TouchableOpacity
            style={[styles.item, selected === "find" && styles.selectedItem]}
            onPress={() => handleSelect("find")}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={require("../../assets/icons/swipe-house.gif")}
                style={styles.icon}
              />
            </View>
            <Text style={styles.text}>Find Apartment</Text>
          </TouchableOpacity>

          {/* Second GIF and text */}
          <TouchableOpacity
            style={[styles.item, selected === "list" && styles.selectedItem]}
            onPress={() => handleSelect("list")}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={require("../../assets/icons/add-house-1.gif")}
                style={styles.icon}
              />
            </View>
            <Text style={styles.text}>List Apartment</Text>
          </TouchableOpacity>
        </View>
      </View>
    </OnBoardingLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  item: {
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    marginTop: 40,
  },
  selectedItem: {
    backgroundColor: "rgba(223, 223, 223, 0.2)",
  },
  icon: {
    width: 100,
    height: 100,
    opacity: 1,
  },
  text: {
    fontSize: 19,
    fontFamily: "comfortaaBold",
    color: "Black",
    marginTop: 10,
  },
});

export default StepSeven;
