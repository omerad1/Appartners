import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
  Alert,
} from "react-native";
import InputField from "../../../components/onBoarding/InputField";
import DatePicker from "../../../components/general/DatePicker";
import dayjs from "dayjs";
import NumberSlider from "../../../components/general/NumberSlider";
import AddApartmentLayout from "../../../components/layouts/AddApartmentLayout";
import { useNavigation, useRoute } from "@react-navigation/native";
import BackgroundImage from "../../../components/layouts/BackgroundImage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";

import { Card } from "react-native-paper";
import CitySearchInput from "../../../components/apartmentsComp/CitySearchInput";
import AreaSearchInput from "../../../components/apartmentsComp/AreaSearchInput";

const AddApartmentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const editingApartment = route.params?.apartment;
  const isEditing = !!editingApartment;

  // Log received apartment data for debugging
  useEffect(() => {
    if (isEditing) {
      console.log("Received apartment data for editing:", editingApartment);
    }
  }, [isEditing, editingApartment]);

  const [entryDay, setEntryDay] = useState(
    isEditing && editingApartment.available_entry_date
      ? dayjs(editingApartment.available_entry_date)
      : dayjs()
  );

  // State for selected city object
  const [selectedCity, setSelectedCity] = useState(
    isEditing && editingApartment.city_details
      ? editingApartment.city_details
      : null
  );

  const [formData, setFormData] = useState({
    city: isEditing ? editingApartment.city_details.id : "",
    area: isEditing ? editingApartment.area || "" : "",
    street: isEditing ? editingApartment.street : "",
    buildingNumber: isEditing
      ? editingApartment.house_number?.toString() || ""
      : "",
    floor: isEditing ? editingApartment.floor?.toString() || "" : "",
    apartmentType: isEditing ? editingApartment.type || "" : "",
    rooms: isEditing ? editingApartment.number_of_rooms || 1 : 1,
    availableRooms: isEditing ? editingApartment.available_rooms || 1 : 1,
    totalPrice: isEditing ? editingApartment.total_price?.toString() || "" : "",
    about: isEditing ? editingApartment.about || "" : "",
  });

  // Check for any saved form data on component mount
  useEffect(() => {
    const loadSavedFormData = async () => {
      try {
        const savedData = await AsyncStorage.getItem("apartmentFormData");
        if (savedData && !isEditing) {
          const parsedData = JSON.parse(savedData);
          console.log("Loaded saved apartment form data:", parsedData);

          // Only use saved data if we're not editing and if we explicitly want to load saved data
          if (route.params?.loadSavedData) {
            setFormData((prevData) => ({
              ...prevData,
              ...parsedData,
            }));

            // Restore city object if it exists
            if (parsedData.cityObject) {
              setSelectedCity(parsedData.cityObject);
            }

            // Restore entry day if it exists
            if (parsedData.entryDayStr) {
              setEntryDay(dayjs(parsedData.entryDayStr));
            }
          } else {
            // Clear saved data if we don't want to load it
            await AsyncStorage.removeItem("apartmentFormData");
          }
        }
      } catch (error) {
        console.error("Error loading saved form data:", error);
      }
    };

    loadSavedFormData();
  }, [isEditing, route.params?.loadSavedData]);

  // Update form data if editing apartment changes
  useEffect(() => {
    if (isEditing && editingApartment) {
      setFormData({
        city: editingApartment.city_details.id || "",
        area: editingApartment.area || "",
        street: editingApartment.street || "",
        buildingNumber: editingApartment.house_number?.toString() || "",
        floor: editingApartment.floor?.toString() || "",
        apartmentType: editingApartment.type || "",
        rooms: editingApartment.number_of_rooms || 1,
        availableRooms: editingApartment.available_rooms || 1,
        totalPrice: editingApartment.total_price?.toString() || "",
        about: editingApartment.about || "",
      });

      // Set the selected city object
      if (editingApartment.city_details) {
        setSelectedCity(editingApartment.city_details);
      }

      if (editingApartment.available_entry_date) {
        setEntryDay(dayjs(editingApartment.available_entry_date));
      }
    }
  }, [isEditing, editingApartment]);

  const handleRoomsChange = (rooms) => {
    setFormData((prev) => ({ ...prev, rooms }));
  };

  const handleAvailableRoomsChange = (availableRooms) => {
    setFormData((prev) => ({ ...prev, availableRooms }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle city selection
  const handleCityChange = (city) => {
    console.log("City selection changed:", city);
    setSelectedCity(city);

    if (city) {
      setFormData((prev) => ({ ...prev, city: city.id }));
      // Reset area when city changes
      setFormData((prev) => ({ ...prev, area: "" }));
    } else {
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  };

  // Handle area selection
  const handleAreaChange = (area) => {
    setFormData((prev) => ({ ...prev, area: area || "" }));
  };

  const validateForm = () => {
    const requiredFields = ["city", "street", "floor", "totalPrice"];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length > 0) {
      Alert.alert(
        "Missing Information",
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (!validateForm()) return false;

    // Save complete form data to AsyncStorage before navigating
    try {
      // Save form data including city object for later restoration
      const dataToSave = {
        ...formData,
        cityObject: selectedCity, // Save the full city object
        entryDayStr: format(entryDay, "yyyy-MM-dd"),
      };

      await AsyncStorage.setItem(
        "apartmentFormData",
        JSON.stringify(dataToSave)
      );
      console.log("Saved form data to AsyncStorage:", dataToSave);
    } catch (error) {
      console.error("Error saving form data:", error);
      // Continue with navigation even if saving fails
    }

    // Store the form data in global state or pass it as a parameter
    navigation.navigate("PropertyTagsScreen", {
      formData,
      entryDay: format(entryDay, "yyyy-MM-dd"),
      isEditing,
      apartmentId: isEditing ? editingApartment.id : null,
      apartment: editingApartment,
    });
    return true;
  };

  return (
    <BackgroundImage>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <AddApartmentLayout
            title={isEditing ? "Edit Apartment" : "Post An Apartment"}
            direction="PropertyTagsScreen"
            next="Next"
            onPress={handleNext}
          >
            <Card style={styles.card}>
              <Card.Content style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Location Details</Text>
                <View style={styles.input}>
                  <Text style={styles.label}>City</Text>
                  <CitySearchInput
                    value={selectedCity}
                    onChange={handleCityChange}
                  />
                </View>
                <View style={styles.input}>
                  <Text style={styles.label}>Area</Text>
                  <AreaSearchInput
                    value={formData.area}
                    onChange={handleAreaChange}
                    selectedCity={selectedCity}
                  />
                </View>
                <InputField
                  placeholder="Enter Street"
                  type="text"
                  onChange={(text) => handleInputChange("street", text)}
                  label="Street"
                  value={formData.street}
                  containerStyle={styles.input}
                />
                <View style={styles.addressContainer}>
                  <View style={styles.addressInputWrapper}>
                    <InputField
                      placeholder="Enter No."
                      type="numeric"
                      onChange={(text) =>
                        handleInputChange("buildingNumber", text)
                      }
                      label="Building"
                      value={formData.buildingNumber}
                      containerStyle={styles.addressInput}
                    />
                  </View>
                  <View style={styles.addressInputWrapper}>
                    <InputField
                      placeholder="Enter No."
                      type="numeric"
                      onChange={(text) => handleInputChange("floor", text)}
                      label="Floor"
                      value={formData.floor}
                      containerStyle={styles.addressInput}
                    />
                  </View>
                </View>
              </Card.Content>
            </Card>

            <Card style={[styles.card, styles.cardMargin]}>
              <Card.Content style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Apartment Details</Text>
                <InputField
                  placeholder="Enter Apartment Type"
                  type="text"
                  onChange={(text) => handleInputChange("apartmentType", text)}
                  label="Apartment Type"
                  value={formData.apartmentType}
                  containerStyle={styles.input}
                />
                <View style={styles.sliderRow}>
                  <View style={styles.sliderContainer}>
                    <Text style={styles.label}>Rooms</Text>
                    <NumberSlider
                      min={1}
                      max={10}
                      step={1}
                      initialValue={formData.rooms}
                      onValueChange={handleRoomsChange}
                    />
                  </View>
                  <View style={styles.sliderContainer}>
                    <Text style={styles.label}>Available Rooms</Text>
                    <NumberSlider
                      min={1}
                      max={10}
                      step={1}
                      initialValue={formData.availableRooms}
                      onValueChange={handleAvailableRoomsChange}
                    />
                  </View>
                </View>
                <InputField
                  placeholder="Enter Total Price"
                  type="numeric"
                  onChange={(text) => handleInputChange("totalPrice", text)}
                  label="Total Price"
                  value={formData.totalPrice}
                  containerStyle={styles.input}
                />
                <View style={styles.datePickerContainer}>
                  <Text style={styles.label}>Entry Date</Text>
                  <DatePicker
                    placeholder="Select Entry Date"
                    value={entryDay}
                    onDateConfirm={setEntryDay}
                    mode="entryDate"
                  />
                </View>
              </Card.Content>
            </Card>

            <Card style={[styles.card, styles.cardMargin]}>
              <Card.Content style={styles.formContainer}>
                <Text style={styles.sectionTitle}>Description</Text>
                <InputField
                  placeholder="Enter description about the apartment"
                  type="text"
                  onChange={(text) => handleInputChange("about", text)}
                  label="About"
                  value={formData.about}
                  multiline={true}
                  numberOfLines={4}
                  containerStyle={styles.input}
                />
              </Card.Content>
            </Card>
          </AddApartmentLayout>
        </ScrollView>
      </KeyboardAvoidingView>
    </BackgroundImage>
  );
};

export default AddApartmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  formContainer: {
    width: "100%",
  },

  card: {
    borderRadius: 10,
    elevation: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  cardMargin: {
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "comfortaaBold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    marginBottom: 10,
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 5,
  },
  addressInputWrapper: {
    flex: 1,
    paddingHorizontal: 3,
  },
  addressInput: {
    width: "100%",
  },
  sliderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  sliderContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    marginHorizontal: 5,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontFamily: "comfortaaSemiBold",
    color: "#333",
    textAlign: "center",
  },
  datePickerContainer: {
    marginTop: 15,
  },
});
