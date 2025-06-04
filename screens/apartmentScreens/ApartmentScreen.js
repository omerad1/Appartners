import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  RefreshControl,
  Dimensions,
  ImageBackground,
} from "react-native";
import {
  Card,
  Paragraph,
  IconButton,
  ActivityIndicator,
  Button,
  Surface,
} from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import Title from "../../components/Title"; // Import your custom Title component
import { useNavigation } from "@react-navigation/native";
import ModalApartmentDisplayer from "../../components/ModalApartmentDisplayer"; // Import the modal

import { getUserApartments } from "../../api/myApartments"; // Import the function to fetch apartments
import { deleteApartment } from "../../api/deleteApartment"; // Import the function to delete apartments
import BackgroundImage from "../../components/BackgroundImage";

const { width } = Dimensions.get("window");

const ApartmentScreen = () => {
  const [apartments, setApartments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchApartments = async () => {
    try {
      setLoading(true);
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
      Alert.alert(
        "Error",
        "Failed to load apartments. Please try again later."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApartments();
  }, []);

  const handleAddApartment = () => {
    navigation.navigate("CreateApartment", { loadSavedData: false });
  };

  const handleDelete = async (id) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this apartment?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteApartment(id);
              setApartments(
                apartments.filter((apartment) => apartment.id !== id)
              );
            } catch (error) {
              console.error("Failed to delete apartment:", error);
              Alert.alert(
                "Error",
                "Failed to delete apartment. Please try again later."
              );
            }
          },
        },
      ]
    );
  };

  const handleEdit = (id) => {
    const apartment = apartments.find((apt) => apt.id === id);
    if (apartment) {
      // Log the apartment details to verify what's being passed
      console.log("Editing apartment:", apartment);

      // Navigate directly to the AddApartmentScreen with the apartment data
      navigation.navigate("CreateApartment", {
        screen: "AddApartmentScreen",
        params: { apartment: apartment },
      });
    }
  };

  const handleView = (id) => {
    const apartment = apartments.find((apt) => apt.id === id);
    setSelectedApartment(apartment);
    setModalVisible(true);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchApartments();
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <Surface style={styles.headerSurface}>
            <Title style={styles.title}>My Apartments</Title>
            <Text style={styles.subtitle}>Manage your property listings</Text>
          </Surface>

          <TouchableOpacity
            style={styles.floatingAddButton}
            onPress={handleAddApartment}
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        >
          {/* Apartment Cards or Loading Indicator */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Loading apartments...</Text>
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
                    source={{
                      uri:
                        apartment.photo_urls && apartment.photo_urls.length > 0
                          ? apartment.photo_urls[0]
                          : "https://via.placeholder.com/300x200?text=No+Image",
                    }}
                    style={styles.cardImage}
                  />
                  {/* Card Content */}
                  <Card.Content style={styles.cardContent}>
                    <Paragraph style={styles.cardAddress}>
                      {apartment.street} {apartment.house_number || ""}
                    </Paragraph>
                    <View style={styles.detailsRow}>
                      <View style={styles.detailItem}>
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color="#555"
                        />
                        <Text style={styles.detailText}>
                          {apartment.created_at.split("T")[0]}
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="home-outline" size={16} color="#555" />
                        <Text style={styles.detailText}>
                          {apartment.number_of_rooms} rooms
                        </Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="cash-outline" size={16} color="#555" />
                        <Text style={styles.detailText}>
                          ${apartment.total_price}
                        </Text>
                      </View>
                    </View>
                    <Paragraph style={styles.descriptionText}>
                      {apartment.about && apartment.about.length > 50
                        ? `${apartment.about.substring(0, 50)}...`
                        : apartment.about || "No description available"}
                    </Paragraph>
                  </Card.Content>
                  {/* Action Buttons */}
                  <Card.Actions style={styles.actions}>
                    <IconButton
                      icon="eye"
                      size={24}
                      onPress={() => handleView(apartment.id)}
                      style={styles.actionButton}
                      color="#444"
                    />
                    <IconButton
                      icon="pencil"
                      size={24}
                      onPress={() => handleEdit(apartment.id)}
                      style={styles.actionButton}
                      color="#444"
                    />
                    <IconButton
                      icon="trash-can"
                      size={24}
                      onPress={() => handleDelete(apartment.id)}
                      style={styles.actionButton}
                      color="#d32f2f"
                    />
                  </Card.Actions>
                </Card>
              ))}
            </View>
          ) : (
            <View style={styles.noApartmentsContainer}>
              <View style={styles.emptyStateCard}>
                <Ionicons name="home-outline" size={80} color="#888" />
                <Text style={styles.noApartmentsText}>
                  You don't have any apartments yet
                </Text>
                <Button
                  mode="contained"
                  onPress={handleAddApartment}
                  style={styles.emptyAddButton}
                  labelStyle={styles.addButtonLabel}
                  icon="plus"
                >
                  Add Your First Apartment
                </Button>
              </View>
            </View>
          )}
        </ScrollView>
        {/* Modal Component */}
        {selectedApartment && (
          <ModalApartmentDisplayer
            visible={modalVisible}
            onClose={() => setModalVisible(false)}
            apartment={{
              ...selectedApartment,
              address: `${selectedApartment.street || ""} ${
                selectedApartment.house_number || ""
              }`,
              images: selectedApartment.photo_urls || [],
              aboutApartment: selectedApartment.about || "",
              tags:
                selectedApartment.feature_details?.map(
                  (feature) => feature.name
                ) || [],
              price: selectedApartment.total_price,
              rooms: selectedApartment.number_of_rooms,
              availableRooms: selectedApartment.number_of_available_rooms,
              entryDate: selectedApartment.available_entry_date,
            }}
          />
        )}
      </View>
    </BackgroundImage>
  );
};

export default ApartmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    paddingTop: 40,
  },
  headerContainer: {
    marginBottom: 20,
    position: "relative",
    paddingBottom: 15,
  },
  headerSurface: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    elevation: 4,
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontFamily: "comfortaaBold",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#555",
    fontFamily: "comfortaa",
    textAlign: "center",
  },
  floatingAddButton: {
    position: "absolute",
    right: 15,
    bottom: -20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
    zIndex: 100,
  },
  scrollContainer: {
    paddingBottom: 30,
  },
  cardWrapper: {
    gap: 20,
  },
  card: {
    borderRadius: 15,
    overflow: "hidden",
    elevation: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    marginBottom: 5,
  },
  firstCard: {
    marginTop: 5,
  },
  cardImage: {
    height: 180,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  cardContent: {
    padding: 16,
  },
  cardAddress: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "left",
    fontFamily: "comfortaaBold",
    color: "#333",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  detailText: {
    fontSize: 13,
    color: "#555",
    fontFamily: "comfortaa",
    marginLeft: 4,
  },
  descriptionText: {
    fontSize: 14,
    color: "#333",
    textAlign: "left",
    fontFamily: "comfortaa",
    lineHeight: 20,
  },
  noApartmentsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 400,
  },
  emptyStateCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 15,
    padding: 30,
    alignItems: "center",
    width: "100%",
    elevation: 4,
  },
  noApartmentsText: {
    fontSize: 16,
    color: "#666",
    marginVertical: 20,
    fontFamily: "comfortaa",
    textAlign: "center",
  },
  emptyAddButton: {
    marginTop: 20,
    backgroundColor: "#333",
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
  },
  addButtonLabel: {
    fontSize: 14,
    fontFamily: "comfortaaSemiBold",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "rgba(250, 250, 250, 0.9)",
  },
  actionButton: {
    margin: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    minHeight: 300,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#fff",
    fontFamily: "comfortaa",
  },
});
