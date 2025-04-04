import React, { useEffect, useState } from "react";
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
import { useNavigation } from "@react-navigation/native";
import ModalApartmentDisplayer from "../../components/ModalApartmentDisplayer"; // Import the modal
import { getUserApartments } from "../../api/myApartments"; // Import the function to fetch apartmentsapartment"; // Adjust the import path as needed

const ApartmentScreen = () => {
  const [apartments, setApartments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const data = await getUserApartments();
        console.log("Fetched apartments:", data);
        console.log("Number of apartments:", data.length); // Log the data.length
        setApartments(data);
      } catch (error) {
        console.error(
          "Failed to load apartments:",
          error.response?.data?.detail || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);
  const handleAddApartment = () => {
    navigation.navigate("CreateApartment");
  };

  const handleDelete = (id) => {
    console.log(`Delete Apartment with ID: ${id}`);
    setApartments(apartments.filter((apartment) => apartment.id !== id));
  };

  const handleEdit = (id) => {
    console.log(`Edit Apartment with ID: ${id}`);
    // Logic for editing the apartment (e.g., opening a modal or form)
  };

  const handleView = (id) => {
    const apartment = apartments.find((apt) => apt.id === id);
    setSelectedApartment(apartment);
    setModalVisible(true);
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>טוען דירות...</Text>
      </View>
    );
  }

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
                    source={{ uri: apartment.photo }} // Adjust image logic as needed
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
            </View>

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
      </ScrollView>

      {/* Modal Component */}

      {selectedApartment && (
        <View style={styles.modalContainer}>
          <ModalApartmentDisplayer
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
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
