import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import OnBoardingLayout from "../../components/onBoarding/OnBoardingLayout";

const StepSeven = () => {
  const [selected, setSelected] = useState(null); // State to track the selected item

  return (
    <OnBoardingLayout
      title={"Are You Looking To Find An Apartment Or List One?"}
      next={true}
      direction={"StepEight"}
    >
      <View style={styles.container}>
        {/* Row container for GIFs and text */}
        <View style={styles.row}>
          {/* First GIF and text */}
          <TouchableOpacity
            style={[
              styles.item,
              selected === "find" && styles.selectedItem, // Apply selected style if chosen
            ]}
            onPress={() => setSelected("find")}
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
            style={[
              styles.item,
              selected === "list" && styles.selectedItem, // Apply selected style if chosen
            ]}
            onPress={() => setSelected("list")}
          >
            <View style={styles.imageWrapper}>
              <Image
                source={require("../../assets/icons/add-house-1.gif")} // Replace with your second GIF
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

export default StepSeven;

const styles = StyleSheet.create({
  container: {
    alignItems: "center", // Center items horizontally
    justifyContent: "center", // Center items vertically
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-around", // Equal spacing between items
    alignItems: "center",
  },
  item: {
    alignItems: "center", // Center-align text and icon
    padding: 10,
    borderRadius: 10, // Smooth corners
    marginTop: 40,
  },
  selectedItem: {
    backgroundColor: "rgba(223, 223, 223, 0.2)", // Light grey background to highlight selection
  },
  icon: {
    width: 100, // Width of the GIF
    height: 100, // Height of the GIF
    opacity: 1, // Default opacity
  },
  text: {
    fontSize: 19, // Larger font size for better readability
    fontFamily: "comfortaaBold",
    color: "Black",
    marginTop: 10, // Add spacing between the image and text
  },
});
