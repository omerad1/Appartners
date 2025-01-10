import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  FlatList,
} from "react-native";
import Title from "../components/Title";
import InputField from "../components/onBoarding/InputField";
import DatePicker from "../components/DatePicker";
import dayjs from "dayjs";
import SearchTags from "../components/SearchTags";
import PhotoUploader from "../components/PhotoUploader"; // Import the PhotoUploader component
import { propertyTags } from "../data/tags/propertyTags"; // Import the property tags array

const AddApartmentScreen = () => {
  const [entryDay, setEntryDay] = useState(dayjs());
  const [selectedTags, setSelectedTags] = useState([]); // Store selected tags

  const handleTagAdd = (tag) => {
    setSelectedTags([...selectedTags, tag]); // Add tag
  };

  const handleTagRemove = (tag) => {
    setSelectedTags(selectedTags.filter((item) => item !== tag)); // Remove tag
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
                source={require("../assets/icons/logo.png")}
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
              <InputField
                placeholder="Enter House Number"
                type="numeric"
                onChange={() => {}}
                label="House Number"
              />
              <InputField
                placeholder="Enter Apartment floor"
                type="numeric"
                onChange={() => {}}
                label="Apartment floor"
              />
              <InputField
                placeholder="Enter Apartment Type"
                type="text"
                onChange={() => {}}
                label="Apartment Type"
              />
              <InputField
                placeholder="Enter Number Of Rooms"
                type="numeric"
                onChange={() => {}}
                label="Number Of Rooms"
              />
              <InputField
                placeholder="Enter Available Rooms"
                type="numeric"
                onChange={() => {}}
                label="Number Of Available Rooms"
              />
              <InputField
                placeholder="Enter Total Price"
                type="numeric"
                onChange={() => {}}
                label="Total Price"
              />
              {/* Tag Search Component */}
              <View style={styles.tagContainer}>
                <Text style={styles.text}>Select Property Tags</Text>
                <SearchTags
                  tags={propertyTags}
                  selectedTags={selectedTags}
                  onTagAdd={handleTagAdd}
                  onTagRemove={handleTagRemove}
                />
              </View>

              <DatePicker
                title={"Select entry Date"}
                date={entryDay}
                setDate={setEntryDay}
              />

              {/* Photos Section */}
              <PhotoUploader />
            </View>
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
  text: {
    fontSize: 20,
    fontFamily: "comfortaaSemiBold",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: -14,
    marginLeft: 10,
    color: "#333",
  },
  tagContainer: {
    marginBottom: 20,
    justifyContent: "center",
  },
});
