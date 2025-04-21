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
  const [formData, setFormData] = useState({
    city: '',
    area: '',
    street: '',
    buildingNumber: '',
    apartmentNumber: '',
    floor: '',
    apartmentType: '',
    rooms: 1,
    availableRooms: 1,
    totalPrice: '',
  });
  const navigation = useNavigation();

  const handleRoomsChange = (rooms) => {
    setFormData(prev => ({ ...prev, rooms }));
    console.log("Rooms:", rooms);
  };

  const handleAvailableRoomsChange = (availableRooms) => {
    setFormData(prev => ({ ...prev, availableRooms }));
    console.log("Available Rooms:", availableRooms);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    console.log("Form data:", formData);
    // Navigate to the next screen in the CreateApartmentNavigator
    navigation.navigate("PropertyTagsScreen");
    return true; // Return true to allow navigation
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
          <View style={styles.formContainer}>
            <InputField
              placeholder="Enter City"
              type="text"
              onChange={(text) => handleInputChange('city', text)}
              label="City"
              value={formData.city}
            />
            <InputField
              placeholder="Enter Area"
              type="text"
              onChange={(text) => handleInputChange('area', text)}
              label="Area"
              value={formData.area}
            />
            <InputField
              placeholder="Enter Street"
              type="text"
              onChange={(text) => handleInputChange('street', text)}
              label="Street"
              value={formData.street}
            />
            <View style={styles.addressContainer}>
              <View style={styles.addressInputWrapper}>
                <InputField
                  placeholder="Enter No."
                  type="numeric"
                  onChange={(text) => handleInputChange('buildingNumber', text)}
                  label="Building"
                  value={formData.buildingNumber}
                  containerStyle={styles.addressInput}
                />
              </View>
              <View style={styles.addressInputWrapper}>
                <InputField
                  placeholder="Enter No."
                  type="numeric"
                  onChange={(text) => handleInputChange('apartmentNumber', text)}
                  label="Apt."
                  value={formData.apartmentNumber}
                  containerStyle={styles.addressInput}
                />
              </View>
              <View style={styles.addressInputWrapper}>
                <InputField
                  placeholder="Enter No."
                  type="numeric"
                  onChange={(text) => handleInputChange('floor', text)}
                  label="Floor"
                  value={formData.floor}
                  containerStyle={styles.addressInput}
                />
              </View>
            </View>
            <InputField
              placeholder="Enter Apartment Type"
              type="text"
              onChange={(text) => handleInputChange('apartmentType', text)}
              label="Apartment Type"
              value={formData.apartmentType}
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
              onChange={(text) => handleInputChange('totalPrice', text)}
              label="Total Price"
              value={formData.totalPrice}
            />
            <View style={styles.datePickerContainer}>
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
    flexGrow: 1,
  },
  formContainer: {
    width: '100%',
  },
  addressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: '100%',
    marginBottom: 5,
  },
  addressInputWrapper: {
    flex: 1,
    paddingHorizontal: 3,
  },
  addressInput: {
    width: '100%',
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
    marginTop: 10,
  },
});
