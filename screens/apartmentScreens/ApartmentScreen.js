import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  Card,
  Paragraph,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
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
        // Ensure data is an array before setting it
        if (Array.isArray(data)) {
          console.log("Number of apartments:", data.length);
          setApartments(data);
        } else if (data && data.apartments) {
          // If data has an apartments property that's an array
          console.log("Number of apartments:", data.apartments.length);
          setApartments(data.apartments);
        } else if (data) {
          // If data is not null but is a single object, convert it to an array
          const dataArray = [data].filter(Boolean);
          console.log("Number of apartments:", dataArray.length);
          setApartments(dataArray);
        } else {
          // If data is null or undefined, set empty array
          console.log("No apartments data received");
          setApartments([]);
        }
      } catch (error) {
        console.error(
          "Failed to load apartments:",
          error.response?.data?.detail || error.message
        );
        setApartments([]); // Set empty array on error
      } finally {
        setApartments([]);
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  const handleAddApartment = () => {
    if (!isAddButtonDisabled) {
      navigation.navigate("CreateApartment");
    }
  };

  const handleDelete = (id) => {
    console.log(`Delete Apartment with ID: ${id}`);
    setApartments(apartments.filter((apartment) => apartment.id !== id));
  };

  const handleEdit = (id) => {
    console.log(`Edit Apartment with ID: ${id}`);
    // Logic for editing the apartment
  };

  const handleView = (id) => {
    const apartment = apartments.find((apt) => apt.id === id);
    setSelectedApartment(apartment);
    setModalVisible(true);
  };
  let isAddButtonDisabled = null;

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.titleContainer}>
        <Title style={styles.title}>הדירות שלי</Title>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Apartment Cards or Loading Indicator */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : apartments?.length > 0 ? (
          <View style={styles.cardWrapper}>
            {apartments.map((apartment, index) => (
              <Card
                key={apartment.id}
                style={[styles.card, index === 0 && styles.firstCard]}
              >
                {/* Card Cover */}
                <Card.Cover
                  source={{ uri: apartment.photo }}
                  style={styles.cardImage}
                />
                {/* Card Content */}
                <Card.Content>
                  <Paragraph style={styles.cardAddress}>
                    {apartment.street} {apartment.house_number}
                  </Paragraph>
                  <Paragraph style={styles.dateText}>
                    תאריך העלאה: {apartment.created_at.split("T")[0]}
                  </Paragraph>
                  <Paragraph style={styles.descriptionText}>
                    {apartment.about && apartment.about.length > 50
                      ? `${apartment.about.substring(0, 50)}...`
                      : apartment.about || "לא נכתב תיאור"}
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
        ) : (
          <View style={styles.noApartmentsContainer}>
            <Text style={styles.noApartmentsText}>אין לך דירות עדיין</Text>
            {/* Plus Button for Adding Apartments */}
            <View style={styles.addButtonWrapper}>
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
          </View>
        )}
      </ScrollView>
      {/* Modal Component */}
      {selectedApartment && (
        <ModalApartmentDisplayer
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          apartment={selectedApartment}
        />
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
    paddingBottom: 20, // Ensures proper spacing at the bottom
  },
  cardWrapper: {
    gap: 15, // Adds spacing between cards
  },
  cardContainer: {
    borderRadius: 10,
    overflow: "hidden", // Moves overflow style here to avoid shadow issues
    elevation: 4, // Adds shadow on Android
  },
  card: {
    flexDirection: "column",
  },
  firstCard: {
    marginTop: 10, // Adds margin to the top card
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
  addButtonWrapper: {
    marginTop: 20, // Space above the button
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 200, // Ensures the loader is visible even when there's no content
  },
});
