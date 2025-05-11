import React, { useState, useEffect } from "react";
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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import ApartmentLike from "../components/ApartmentLike";
import ModalApartmentDisplayer from "../components/ModalApartmentDisplayer";
import UserDisplayer from "../components/UserDisplayer";
import UserDisplayerModal from "../components/UserDisplayerModal";

// Synthetic data for apartments I liked
const MOCK_LIKED_APARTMENTS = [
  {
    id: 1,
    image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267", // Will use fallback image
    address: "דיזינגוף 12, תל אביב",
    tags: ["Spacious", "Central", "Balcony"],
    price_per_month: 5500,
    rooms: 3,
    area_sqm: 85,
  },
  {
    id: 2,
    image_url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    address: "רח' הלם 345 , חיפה",
    tags: ["Cozy", "Newly renovated", "Parking"],
    price_per_month: 4200,
    rooms: 2,
    area_sqm: 65,
  },
  {
    id: 3,
    image_url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
    address: "סמטת פיין 12, ירושלים",
    tags: ["Garden", "Quiet", "Pet friendly"],
    price_per_month: 6800,
    rooms: 4,
    area_sqm: 110,
  },
  {
    id: 4,
    image_url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    address: "יצחק רגר 13, באר שבע",
    tags: ["Sea view", "Modern", "Gym"],
    price_per_month: 7500,
    rooms: 3,
    area_sqm: 95,
  },
];

// Synthetic data for people who liked my apartment
const MOCK_USERS_LIKED_MY_APARTMENT = [
  {
    id: 1,
    name: "מאיה רוזנברג",
    profile_image: "https://randomuser.me/api/portraits/women/44.jpg",
    facebook_link: "https://www.facebook.com/maya.rosenberg",
    bio: "סטודנטית לתואר שני בפסיכולוגיה באוניברסיטת תל אביב. אוהבת לטייל, לקרוא ספרים ולבלות עם חברים. מחפשת דירה שקטה באזור המרכז עם גישה נוחה לאוניברסיטה. יש לי חתול קטן בשם לונה שמאוד אוהב מרפסות.",
    age: 24,
    university: "אוניברסיטת תל אביב",
  },
  {
    id: 2,
    name: "דניאל כהן",
    profile_image: "https://randomuser.me/api/portraits/men/32.jpg",
    facebook_link: "https://www.facebook.com/daniel.cohen",
    bio: "מהנדס תוכנה בחברת היי-טק. עובד מהבית רוב השבוע ומחפש דירה מרווחת עם פינת עבודה. חובב ספורט, במיוחד ריצה וכדורסל. מעוניין בדירה לטווח ארוך באזור שקט. אוהב לבשל ומחפש מטבח מאובזר היטב.",
    age: 28,
    university: "הטכניון",
  },
  {
    id: 3,
    name: "נועה לוי",
    profile_image: "https://randomuser.me/api/portraits/women/68.jpg",
    facebook_link: "https://www.facebook.com/noa.levi",
    bio: "רופאה מתמחה בבית חולים איכילוב. עובדת במשמרות ומחפשת דירה קרובה לבית החולים. אוהבת אמנות, מוזיקה קלאסית ובישול. מעדיפה דירה מרוהטת באזור שקט. מחפשת שותפים שמבינים את אורח החיים של רופאה במשמרות.",
    age: 30,
    university: "האוניברסיטה העברית",
  },
  {
    id: 4,
    name: "אלון ברק",
    profile_image: "https://randomuser.me/api/portraits/men/75.jpg",
    facebook_link: "https://www.facebook.com/alon.barak",
    bio: "סטודנט לתואר ראשון במשפטים וכלכלה באוניברסיטה העברית. מחפש דירת שותפים באזור ירושלים. חובב מוזיקה, מנגן בגיטרה ואוהב לארח חברים. מעוניין בדירה עם סלון מרווח ואווירה חברתית. יכול לעזור בתיקונים קטנים בבית.",
    age: 22,
    university: "האוניברסיטה העברית",
  },
];

const ApartmentsILiked = ({ apartments, loading, error, onApartmentPress }) => {
  if (loading) {
    return (
      <View style={styles.placeholderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading apartments you liked...</Text>
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
    />
  );
};

const PeopleLikedMyApartment = ({ users, loading, error, onUserPress }) => {
  if (loading) {
    return (
      <View style={styles.placeholderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.hebrewText}>
          טוען משתמשים שאהבו את הדירה שלך...
        </Text>
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
        <View style={styles.userCardWrapper}>
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
      )}
      contentContainerStyle={styles.userList}
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

  useEffect(() => {
    // Simulate fetching data
    const apartmentsTimer = setTimeout(() => {
      setLikedApartments(MOCK_LIKED_APARTMENTS);
      setLoadingApartments(false);
    }, 1000);

    const usersTimer = setTimeout(() => {
      setUsersWhoLikedMyApartment(MOCK_USERS_LIKED_MY_APARTMENT);
      setLoadingUsers(false);
    }, 1500);

    return () => {
      clearTimeout(apartmentsTimer);
      clearTimeout(usersTimer);
    };
  }, []);

  const handleApartmentPress = (apartment) => {
    setSelectedApartment(apartment);
    setModalVisible(true);
  };

  const handleUserPress = (user) => {
    setSelectedUser(user);
    setUserModalVisible(true);
  };

  const handleLikeUser = () => {
    // In a real app, this would call an API to like the user
    console.log("Liked user:", selectedUser?.name);
    setUserModalVisible(false);
  };

  const handleDislikeUser = () => {
    // In a real app, this would call an API to dislike the user
    console.log("Disliked user:", selectedUser?.name);
    setUserModalVisible(false);
  };

  const renderTab = () => {
    if (activeTab === "apartments") {
      return (
        <ApartmentsILiked
          apartments={likedApartments}
          loading={loadingApartments}
          error={apartmentsError}
          onApartmentPress={handleApartmentPress}
        />
      );
    } else {
      return (
        <PeopleLikedMyApartment
          users={usersWhoLikedMyApartment}
          loading={loadingUsers}
          error={usersError}
          onUserPress={handleUserPress}
        />
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <LinearGradient
          colors={["rgba(91, 89, 85, 0.88)", "rgba(91, 89, 85, 0.95)"]}
          style={styles.tabGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableOpacity
            style={[styles.tab, activeTab === "apartments" && styles.activeTab]}
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
      />
    </SafeAreaView>
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
    alignItems: 'center', // Center items horizontally
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
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
});

export default LikesScreen;
