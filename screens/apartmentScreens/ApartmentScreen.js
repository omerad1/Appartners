import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Card, Paragraph, IconButton } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import Title from "../../components/Title"; // Import your custom Title component

const ApartmentScreen = () => {
  const apartments = [
    {
      id: 1,
      photo: "../../assets/apt/y2_1pa_010214_20250114110125.jpeg", // Replace with actual image URL
      uploadDate: "2023-01-15",
      address: "רחוב הראשי 123",
      description:
        "דירה יפהפייה עם 3 חדרי שינה, סלון מרווח ואבזור מודרני. מושלם למשפחות ואנשי מקצוע.",
    },
    {
      id: 2,
      photo: "../../assets/apt/y2_1pa_010214_20250114110125.jpeg",
      uploadDate: "2023-01-10",
      address: "רחוב אלם 456",
      description:
        "דירת 2 חדרי שינה נעימה בלב מרכז העיר. מרחק הליכה לחנויות ומסעדות.",
    },
    {
      id: 3,
      photo: "../../assets/apt/y2_1pa_010214_20250114110125.jpeg",
      uploadDate: "2023-01-10",
      address: "רחוב אלם 456",
      description:
        "דירת 2 חדרי שינה נעימה בלב מרכז העיר. מרחק הליכה לחנויות ומסעדות.",
    },
  ];

  const handleAddApartment = () => {
    console.log("Add Apartment Triggered");
    // Logic for adding a new apartment
  };

  const handleDelete = (id) => {
    console.log(`Delete Apartment with ID: ${id}`);
    // Logic for deleting the apartment
  };

  const handleEdit = (id) => {
    console.log(`Edit Apartment with ID: ${id}`);
    // Logic for editing the apartment
  };

  const handleView = (id) => {
    console.log(`View Apartment with ID: ${id}`);
    // Logic for viewing the apartment
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <Title>הדירות שלי</Title>

      {/* Apartment Cards or No Apartments Message */}
      {apartments.length > 0 ? (
        <>
          {apartments.map((apartment) => (
            <Card key={apartment.id} style={styles.card}>
              {/* Card Cover */}
              <Card.Cover
                source={require("../../assets/apt/y2_1pa_010214_20250114110125.jpeg")}
                style={styles.cardImage}
              />

              {/* Card Content */}
              <Card.Content>
                <Paragraph style={styles.cardAddress}>
                  {apartment.address}
                </Paragraph>
                <Paragraph style={styles.dateText}>
                  תאריך העלאה: {apartment.uploadDate}
                </Paragraph>
                <Paragraph style={styles.descriptionText}>
                  {apartment.description.length > 50
                    ? `${apartment.description.substring(0, 50)}...`
                    : apartment.description}
                </Paragraph>
              </Card.Content>

              {/* Action Buttons */}
              <Card.Actions style={styles.actions}>
                <IconButton
                  icon="eye"
                  size={24}
                  onPress={() => handleView(apartment.id)}
                />
                <IconButton
                  icon="pencil"
                  size={24}
                  onPress={() => handleEdit(apartment.id)}
                />
                <IconButton
                  icon="trash-can"
                  size={24}
                  onPress={() => handleDelete(apartment.id)}
                />
              </Card.Actions>
            </Card>
          ))}

          {/* Plus Button for Adding Apartments */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddApartment}
          >
            <Ionicons name="add" size={40} color="white" />
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.noApartmentsContainer}>
          <Text style={styles.noApartmentsText}>לא הועלו דירות עדיין</Text>
          {/* Plus Button for Adding Apartments */}
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddApartment}
          >
            <Ionicons name="add" size={40} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default ApartmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 40,
  },
  card: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden", // Ensures content stays within rounded corners
    elevation: 4, // Adds shadow on Android
    flexDirection: "column",
  },
  cardImage: {
    height: 150, // Fixed height for consistent layout
  },
  cardAddress: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "right",
  },
  dateText: {
    fontSize: 12,
    color: "gray",
    marginBottom: 5,
    textAlign: "right",
  },
  descriptionText: {
    fontSize: 14,
    color: "#333",
    textAlign: "right",
  },
  noApartmentsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noApartmentsText: {
    fontSize: 16,
    color: "gray",
    marginBottom: 20,
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000", // Black background color for button
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Adds shadow on Android
  },
  actions: {
    flexDirection: "row", // RTL alignment for action buttons
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
});
