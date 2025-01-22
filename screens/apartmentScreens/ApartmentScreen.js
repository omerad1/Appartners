import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Card, Paragraph, IconButton } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import Title from "../../components/Title"; // Import your custom Title component
import { myApartments } from "../../data/mockData/myApartments"; // Import mock data
import { useNavigation } from "@react-navigation/native";
import ModalApartmentDisplayer from "../../components/ModalApartmentDisplayer"; // Import the modal

const ApartmentScreen = () => {
  const [apartments, setApartments] = useState(myApartments);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const navigation = useNavigation();

  const handleAddApartment = () => {
    if (apartments.length <= 3) {
      navigation.navigate("CreateApartment");
    }
  };

  const handleDelete = (id) => {
    console.log(`Delete Apartment with ID: ${id}`);
    setApartments(apartments.filter((apartment) => apartment.id !== id));
  };

  const handleEdit = (id) => {
    console.log(`Edit Apartment with ID: ${id}`);
  };

  const handleView = (id) => {
    const apartment = apartments.find((apt) => apt.id === id);
    setSelectedApartment(apartment);
    setModalVisible(true);
  };

  const isAddButtonDisabled = apartments.length > 3;

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Title style={styles.title}>הדירות שלי</Title>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Apartment Cards or No Apartments Message */}
        {apartments.length > 0 ? (
          <>
            <View style={styles.cardWrapper}>
              {apartments.map((apartment) => (
                <Card key={apartment.id} style={styles.card}>
                  {/* Card Cover */}
                  <Card.Cover
                    source={{ uri: apartment.images[0] }} // Adjust image logic as needed
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
                      {apartment.aboutApartment.length > 50
                        ? `${apartment.aboutApartment.substring(0, 50)}...`
                        : apartment.aboutApartment}
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
            </View>
          </>
        ) : (
          <View style={styles.noApartmentsContainer}>
            <Text style={styles.noApartmentsText}>לא הועלו דירות עדיין</Text>
          </View>
        )}
      </ScrollView>

      {/* Plus Button for Adding Apartments */}
      <View style={styles.addButtonContainer}>
        <TouchableOpacity
          style={[
            styles.addButton,
            isAddButtonDisabled && styles.disabledButton,
          ]}
          onPress={handleAddApartment}
          disabled={isAddButtonDisabled}
        >
          <Ionicons name="add" size={40} color="white" />
        </TouchableOpacity>
      </View>

      {/* Modal Component */}
      {selectedApartment && (
        <View style={styles.modalContainer}>
          <ModalApartmentDisplayer
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            apartment={selectedApartment}
          />
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
  scrollContainer: {
    paddingBottom: 100, // Ensure space for the floating add button
  },
  cardWrapper: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden", // Ensures content stays within rounded corners
    elevation: 4, // Adds shadow on Android
  },
  card: {
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
  addButtonContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: "center", // Center horizontally
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000", // Black background color for button
    justifyContent: "center",
    alignItems: "center",
    elevation: 5, // Adds shadow on Android
  },
  disabledButton: {
    backgroundColor: "gray", // Lighter color to indicate it's disabled
  },
  actions: {
    flexDirection: "row", // RTL alignment for action buttons
    justifyContent: "flex-start",
    paddingHorizontal: 10,
  },
  titleContainer: {
    paddingTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
});
