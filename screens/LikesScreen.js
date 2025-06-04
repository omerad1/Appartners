import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Image,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Linking,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import BackgroundImage from "../components/layouts/BackgroundImage";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ApartmentLike from "../components/apartmentsComp/ApartmentLike";
import ModalApartmentDisplayer from "../components/apartmentsComp/ModalApartmentDisplayer";
import UserDisplayer from "../components/userProfileComp/UserDisplayer";
import UserDisplayerModal from "../components/userProfileComp/UserDisplayerModal";
import {
  getLikedApartments,
  getUsersWhoLikedMyApartment,
  likeApartment,
  unlikeApartment,
} from "../api/likes";
import AppartnersLoader from "../components/general/ApartnersLoader";

const ApartmentsILiked = ({
  apartments,
  loading,
  error,
  onApartmentPress,
  onRefresh,
}) => {
  if (loading && !apartments.length) {
    return (
      <View style={styles.placeholderContainer}>
        <AppartnersLoader />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.placeholderContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!apartments || apartments.length === 0) {
    return (
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>
          You haven't liked any apartments yet.
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={apartments}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ApartmentLike apartment={item} onPress={onApartmentPress} />
      )}
      contentContainerStyle={styles.apartmentList}
      showsVerticalScrollIndicator={false}
      centerContent={true}
      refreshing={loading}
      onRefresh={onRefresh}
    />
  );
};

const PeopleLikedMyApartment = ({
  users,
  loading,
  error,
  onUserPress,
  onRefresh,
  onApartmentPress,
}) => {
  if (loading && !users.length) {
    return (
      <View style={styles.placeholderContainer}>
        <AppartnersLoader />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.placeholderContainer}>
        <Text style={styles.hebrewText}>שגיאה: {error}</Text>
      </View>
    );
  }

  if (!users || users.length === 0) {
    return (
      <View style={styles.placeholderContainer}>
        <Text style={styles.hebrewText}>אף אחד עדיין לא אהב את הדירה שלך.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <View style={styles.likeCardContainer}>
          <LinearGradient
            colors={["rgba(91, 89, 85, 0.7)", "rgba(91, 89, 85, 0.85)"]}
            style={styles.likeCardGradient}
          >
            {/* User info section */}
            <View style={styles.userSection}>
              <UserDisplayer
                avatarSource={
                  item.profile_image || "../assets/icons/avi-avatar.jpg"
                }
                name={item.name}
                facebookLink={item.facebook_link}
                bio={item.bio}
                onPress={() => onUserPress(item)}
              />
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Apartment info section */}
            <TouchableOpacity
              style={styles.apartmentSection}
              onPress={() =>
                item.liked_apartment && onApartmentPress(item.liked_apartment)
              }
            >
              <View style={styles.apartmentHeader}>
                <Ionicons name="home" size={18} color="#FFFFFF" />
                <Text style={styles.apartmentHeaderText}>Liked Apartment</Text>
              </View>

              {item.liked_apartment ? (
                <View style={styles.apartmentDetails}>
                  <Text style={styles.apartmentTitle}>
                    {item.liked_apartment.street || "Apartment"}
                  </Text>
                  <Text style={styles.apartmentInfo}>
                    {item.liked_apartment.price &&
                      `₪${item.liked_apartment.price} • `}
                    {item.liked_apartment.location &&
                      `${item.liked_apartment.location}`}
                  </Text>
                  {item.liked_apartment.room_count && (
                    <Text style={styles.apartmentInfo}>
                      {`${item.liked_apartment.room_count} rooms • ${
                        item.liked_apartment.floor
                          ? `Floor ${item.liked_apartment.floor}`
                          : "N/A"
                      }`}
                    </Text>
                  )}
                  <Text style={styles.viewApartmentLink}>
                    View apartment details →
                  </Text>
                </View>
              ) : (
                <Text style={styles.apartmentInfo}>
                  Apartment information not available
                </Text>
              )}
            </TouchableOpacity>
          </LinearGradient>
        </View>
      )}
      contentContainerStyle={styles.userList}
      refreshing={loading}
      onRefresh={onRefresh}
    />
  );
};

const LikesScreen = () => {
  const [activeTab, setActiveTab] = useState("apartments");
  const [likedApartments, setLikedApartments] = useState([]);
  const [usersWhoLikedMyApartment, setUsersWhoLikedMyApartment] = useState([]);
  const [loadingApartments, setLoadingApartments] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [apartmentsError, setApartmentsError] = useState(null);
  const [usersError, setUsersError] = useState(null);

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Use useFocusEffect to refresh data whenever the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log("LikesScreen is focused - refreshing data");
      fetchLikedApartments();
      fetchUsersWhoLikedMyApartment();
    }, [])
  );

  // Refresh data when switching tabs
  useEffect(() => {
    if (activeTab === "apartments") {
      fetchLikedApartments();
    } else {
      fetchUsersWhoLikedMyApartment();
    }
  }, [activeTab]);

  // Function to fetch apartments that the user has liked
  const fetchLikedApartments = async () => {
    try {
      setLoadingApartments(true);
      setApartmentsError(null);

      const data = await getLikedApartments();
      console.log("Fetched liked apartments:", data.length);

      // Check if the data is in the expected format
      if (Array.isArray(data)) {
        setLikedApartments(data);
      } else if (data && Array.isArray(data.results)) {
        // Handle case where data might be wrapped in a results array
        setLikedApartments(data.results);
      } else {
        console.error("Unexpected data format for liked apartments:", data);
        setLikedApartments([]);
      }
    } catch (error) {
      console.error("Error fetching liked apartments:", error);
      setApartmentsError(error.message || "Failed to load liked apartments");
    } finally {
      setLoadingApartments(false);
    }
  };

  // Function to fetch users who liked the user's apartment
  const fetchUsersWhoLikedMyApartment = async () => {
    try {
      setLoadingUsers(true);
      setUsersError(null);

      const data = await getUsersWhoLikedMyApartment();
      console.log("Fetched users who liked my apartment:", JSON.stringify(data, null, 2));

      // Check if the data is in the expected format
      if (Array.isArray(data)) {
        setUsersWhoLikedMyApartment(data);
      } else if (data && Array.isArray(data.results)) {
        // Handle case where data might be wrapped in a results array
        setUsersWhoLikedMyApartment(data.results);
      } else {
        console.error(
          "Unexpected data format for users who liked my apartment:",
          data
        );
        setUsersWhoLikedMyApartment([]);
      }
    } catch (error) {
      console.error("Error fetching users who liked my apartment:", error);
      setUsersError(
        error.message || "Failed to load users who liked your apartment"
      );
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleApartmentPress = (apartment) => {
    console.log("Opening apartment details:", apartment);

    // Format apartment data to include all necessary fields for ModalApartmentDisplayer
    const formattedApartment = {
      ...apartment,
      // Map feature_details to tags if they exist, otherwise use existing tags or empty array
      tags: apartment.feature_details
        ? apartment.feature_details
            .map((feature) =>
              typeof feature === "object" ? feature.name : feature
            )
            .filter((name) => name)
        : apartment.tags || [],

      // Ensure all fields expected by ModalApartmentDisplayer are present
      address: `${apartment.street || ""} ${apartment.house_number || ""}`,
      images: apartment.photo_urls || apartment.images || [],
      aboutApartment: apartment.about || apartment.aboutApartment || "",
      price: apartment.total_price || apartment.price,
      rooms: apartment.number_of_rooms || apartment.rooms,
      availableRooms: apartment.available_rooms || apartment.availableRooms,
      entryDate: apartment.available_entry_date || apartment.entryDate,
    };

    console.log("Formatted apartment with tags:", formattedApartment.tags);
    setSelectedApartment(formattedApartment);
    setModalVisible(true);
  };

  const handleUserPress = (user) => {
    setSelectedUser(user);
    setUserModalVisible(true);
  };

  const handleLikeUser = async () => {
    if (!selectedUser || !selectedUser.id) {
      console.error("No user selected or user ID missing");
      setUserModalVisible(false);
      return;
    }

    try {
      // Here you would call the API to match with the user
      // For now, we'll just show a success message
      Alert.alert(
        "Match Request Sent",
        `You've sent a match request to ${selectedUser.name}!`,
        [{ text: "OK" }]
      );

      // Refresh the users list after matching
      fetchUsersWhoLikedMyApartment();
      setUserModalVisible(false);
    } catch (error) {
      console.error("Error liking user:", error);
      Alert.alert("Error", "Failed to send match request. Please try again.");
    }
  };

  const handleDislikeUser = async () => {
    if (!selectedUser || !selectedUser.id) {
      console.error("No user selected or user ID missing");
      setUserModalVisible(false);
      return;
    }

    try {
      // Here you would call the API to reject the user
      // For now, we'll just close the modal

      // Refresh the users list after rejecting
      fetchUsersWhoLikedMyApartment();
      setUserModalVisible(false);
    } catch (error) {
      console.error("Error disliking user:", error);
      Alert.alert("Error", "Failed to reject. Please try again.");
    }
  };

  const renderTab = () => {
    if (activeTab === "apartments") {
      return (
        <ApartmentsILiked
          apartments={likedApartments}
          loading={loadingApartments}
          error={apartmentsError}
          onApartmentPress={handleApartmentPress}
          onRefresh={fetchLikedApartments}
        />
      );
    } else {
      return (
        <PeopleLikedMyApartment
          users={usersWhoLikedMyApartment}
          loading={loadingUsers}
          error={usersError}
          onUserPress={handleUserPress}
          onRefresh={fetchUsersWhoLikedMyApartment}
          onApartmentPress={handleApartmentPress}
        />
      );
    }
  };

  return (
    <BackgroundImage>
      <SafeAreaView style={styles.container}>
        <View style={styles.tabContainer}>
          <LinearGradient
            colors={["rgba(91, 89, 85, 0.88)", "rgba(91, 89, 85, 0.95)"]}
            style={styles.tabGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === "apartments" && styles.activeTab,
              ]}
              onPress={() => setActiveTab("apartments")}
            >
              <Ionicons
                name="home-outline"
                size={20}
                color={activeTab === "apartments" ? "#FFFFFF" : "#BDAEB4"}
                style={styles.tabIcon}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "apartments" && styles.activeTabText,
                ]}
              >
                Apartments I Liked
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "people" && styles.activeTab]}
              onPress={() => setActiveTab("people")}
            >
              <Ionicons
                name="people-outline"
                size={20}
                color={activeTab === "people" ? "#FFFFFF" : "#BDAEB4"}
                style={styles.tabIcon}
              />
              <Text
                style={[
                  styles.tabText,
                  activeTab === "people" && styles.activeTabText,
                ]}
              >
                Liked My Apartment
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={() => {
              if (activeTab === "apartments") {
                fetchLikedApartments();
              } else {
                fetchUsersWhoLikedMyApartment();
              }
            }}
          >
            <Ionicons name="refresh-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.contentContainer}>{renderTab()}</View>

        {/* Apartment Modal */}
        <ModalApartmentDisplayer
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          apartment={selectedApartment}
        />

        {/* User Modal */}
        <UserDisplayerModal
          visible={userModalVisible}
          onClose={() => setUserModalVisible(false)}
          user={selectedUser}
          onLike={handleLikeUser}
          onDislike={handleDislikeUser}
          showQuestion={true}
        />
      </SafeAreaView>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  headerIcon: {
    width: 30,
    height: 30,
  },
  tabContainer: {
    backgroundColor: "#fff",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  tabGradient: {
    flexDirection: "row",
    height: 50,
    borderRadius: 0,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#FFFFFF",
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#BDAEB4",
    fontFamily: "comfortaaMedium",
  },
  activeTabText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  contentContainer: {
    flex: 1,
  },
  apartmentList: {
    padding: 10,
    alignItems: "center", // Center items horizontally
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -80, // Shift the content higher on the screen
  },
  placeholderText: {
    color: "#888",
    textAlign: "center",
    fontSize: 16,
  },
  loadingText: {
    marginTop: 10,
    color: "#0000ff",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
  userCardWrapper: {
    margin: 10,
    borderRadius: 10,
  },
  userList: {
    padding: 10,
  },
  hebrewText: {
    textAlign: "right",
    color: "#888",
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 5,
    paddingBottom: 5,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(91, 89, 85, 0.6)",
  },
  // New styles for enhanced UI
  likeCardContainer: {
    marginVertical: 10,
    borderRadius: 16,
    overflow: "hidden",
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  likeCardGradient: {
    borderRadius: 16,
    overflow: "hidden",
  },
  userSection: {
    padding: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginHorizontal: 15,
  },
  apartmentSection: {
    padding: 15,
  },
  apartmentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  apartmentHeaderText: {
    fontFamily: "comfortaaMedium",
    fontSize: 15,
    color: "#FFFFFF",
    marginLeft: 6,
    fontWeight: "600",
  },
  apartmentDetails: {
    marginLeft: 24,
  },
  apartmentTitle: {
    fontFamily: "comfortaaMedium",
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "bold",
    marginBottom: 4,
  },
  apartmentInfo: {
    fontFamily: "comfortaa",
    fontSize: 14,
    color: "#E0E0E0",
    marginBottom: 2,
  },
  viewApartmentLink: {
    fontFamily: "comfortaaMedium",
    fontSize: 14,
    color: "#B3F4E0",
    marginTop: 6,
    fontWeight: "600",
  },
});

export default LikesScreen;
