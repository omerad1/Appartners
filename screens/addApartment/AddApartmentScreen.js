import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Title from "../../components/Title";
import InputField from "../../components/onBoarding/InputField";
import DatePicker from "../../components/DatePicker";
import dayjs from "dayjs";
import NumberSlider from "../../components/NumberSlider";

const AddApartmentScreen = () => {
  const [entryDay, setEntryDay] = useState(dayjs());

  const handleRoomsChange = (rooms) => {
    // Handle rooms change
    console.log("Rooms:", rooms);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <FlatList
        data={[{ key: "content" }]} // A workaround to manage non-FlatList content
        renderItem={() => (
          <>
            {/* Main Content */}
            <View style={styles.logoContainer}>
              <Image
                source={require("../../assets/icons/logo.png")}
                style={styles.logo}
              />
              <Title>Post An Apartment</Title>
            </View>
            <View>
              <InputField
                placeholder="Enter City"
                type="text"
                onChange={() => {}}
                label="City"
              />
              <InputField
                placeholder="Enter Area"
                type="text"
                onChange={() => {}}
                label="Area"
              />
              <InputField
                placeholder="Enter Street"
                type="text"
                onChange={() => {}}
                label="Street"
              />
              <View style={styles.addressContainer}>
                <InputField
                  placeholder="Enter No."
                  type="numeric"
                  onChange={() => {}}
                  label="Building"
                />
                <InputField
                  placeholder="Enter No."
                  type="numeric"
                  onChange={() => {}}
                  label="Apt."
                />
                <InputField
                  placeholder="Enter No."
                  type="numeric"
                  onChange={() => {}}
                  label="Floor"
                />
              </View>

              <InputField
                placeholder="Enter Apartment Type"
                type="text"
                onChange={() => {}}
                label="Apartment Type"
              />

              {/* Number Sliders with Labels to the Left */}
              <View style={styles.sliderRow}>
                <View style={styles.sliderContainer}>
                  <Text style={styles.label}>Rooms</Text>
                  <NumberSlider
                    min={1}
                    max={10}
                    step={1}
                    initialValue={1}
                    onValueChange={handleRoomsChange}
                  />
                </View>
                <View style={styles.sliderContainer}>
                  <Text style={styles.label}>Available Rooms</Text>
                  <NumberSlider
                    min={1}
                    max={10}
                    step={1}
                    initialValue={1}
                    onValueChange={handleRoomsChange}
                  />
                </View>
              </View>

              <InputField
                placeholder="Enter Total Price"
                type="numeric"
                onChange={() => {}}
                label="Total Price"
              />

              <DatePicker
                title={"Select entry Date"}
                date={entryDay}
                setDate={setEntryDay}
              />
            </View>
            <TouchableOpacity style={styles.nextButton} onPress={() => {}}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </>
        )}
        contentContainerStyle={styles.scrollContainer}
      />
    </KeyboardAvoidingView>
  );
};

export default AddApartmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Space items evenly
    alignItems: "center", // Align items vertically
    marginBottom: 5,
  },

  scrollContainer: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
  },
  logo: {
    width: 80,
    height: 80,
  },
  sliderRow: {
    flexDirection: "row",
    justifyContent: "space-between", // Space sliders evenly
    marginVertical: 15,
  },
  sliderContainer: {
    flexDirection: "row", // Text and slider side by side
    alignItems: "center",
    marginHorizontal: 10, // Spacing between sliders
  },
  label: {
    marginRight: 10, // Space between text and slider
    fontSize: 18,
    fontFamily: "comfortaaSemiBold",
    color: "#333",
    marginLeft: 5,
  },
  nextButton: {
    backgroundColor: "#000000",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    borderRadius: 10,
  },
  nextButtonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "comfortaaBold",
  },
});
