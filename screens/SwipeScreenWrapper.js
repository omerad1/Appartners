import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import SwipeScreen from "./SwipeScreen";
import { fetchMockApartments } from "../mocks/FetchingData";

const SwipeScreenWrapper = () => {
  const [apartments, setApartments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApartments();
  }, []);

  const fetchApartments = async (filters = {}) => {
    setLoading(true);
    try {
      const data = await fetchMockApartments(filters); // Pass filters to the fetch function
      setApartments(data);
      setCurrentIndex(0); // Reset to the first apartment
    } catch (error) {
      console.error("Failed to fetch apartments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterPress = () => {
    console.log("Filter button pressed!");
    // Open a filter modal, show options, or implement custom filter logic
  };

  const handleSwipe = (direction) => {
    console.log(direction === "like" ? "Liked" : "Disliked");
    if (currentIndex < apartments.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      console.log("No more apartments to display.");
      setCurrentIndex(apartments.length); // Trigger fallback UI
    }
  };

  return (
    <View style={styles.wrapperContainer}>
      {/* Header with Filter Button */}
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Image
            style={styles.logo}
            source={require("../assets/icons/logo-close.png")}
          />
        </View>
        <View
          style={{
            paddingTop: 10,
          }}
        >
          <TouchableOpacity onPress={handleFilterPress}>
            <Image
              style={styles.icon}
              source={require("../assets/icons/tune.png")}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading apartments...</Text>
        </View>
      ) : apartments.length === 0 ? (
        <View style={styles.messageContainer}>
          <Text>No apartments available.</Text>
        </View>
      ) : (
        <View style={styles.swipeContainer}>
          {currentIndex < apartments.length ? (
            <SwipeScreen
              key={currentIndex}
              apartment={apartments[currentIndex]}
              onSwipe={handleSwipe}
            />
          ) : (
            <View style={styles.noMoreContainer}>
              <Text style={styles.noMoreText}>
                No more apartments to display.
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperContainer: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    marginTop: 30,
    paddingVertical: 15,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  icon: {
    width: 34,
    height: 34,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  swipeContainer: {
    flex: 1,
  },
  noMoreContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noMoreText: {
    fontSize: 18,
    color: "#555",
  },
  logo: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
});

export default SwipeScreenWrapper;
