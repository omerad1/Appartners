import React, { useState } from "react";
import {
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
} from "react-native";
import InputField from "../../../components/onBoarding/InputField";
import DatePicker from "../../../components/DatePicker";
import dayjs from "dayjs";
import NumberSlider from "../../../components/NumberSlider";
import AddApartmentLayout from "../../../components/layouts/AddApartmentLayout";
import { useNavigation } from "@react-navigation/native";
const AddApartmentScreen = () => {
  const [entryDay, setEntryDay] = useState(dayjs());
  const navigation = useNavigation();

  const handleRoomsChange = (rooms) => {
    console.log("Rooms:", rooms);
  };

  const handleNext = () => {
    navigation.navigate("PropertyTagsScreen");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <AddApartmentLayout
          title="Post An Apartment"
          direction="PropertyTagsScreen"
          next="Next"
          onPress={handleNext}
        >
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
            <View>
              <DatePicker
                title="Select Entry Date"
                date={entryDay}
                setDate={setEntryDay}
              />
            </View>
          </View>
        </AddApartmentLayout>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddApartmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  sliderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  label: {
    marginRight: 10,
    fontSize: 18,
    fontFamily: "comfortaaSemiBold",
    color: "#333",
    marginLeft: 5,
  },
});
