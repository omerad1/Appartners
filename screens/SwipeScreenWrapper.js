import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import SwipeScreen from "./SwipeScreen"; // Ensure this is the correct import path
import { fetchMockApartments } from "../mocks/FetchingData"; // Import the mock function

const SwipeScreenWrapper = () => {
  const [apartments, setApartments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const data = await fetchMockApartments(); // Call the mock function
        setApartments(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch apartments:", error);
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  const handleSwipe = (direction) => {
    console.log(direction === "like" ? "Liked" : "Disliked");

    // Update to the next apartment or show "No more apartments" message
    if (currentIndex < apartments.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    } else {
      console.log("No more apartments to display.");
      setCurrentIndex(apartments.length); // Go beyond the last index to trigger the fallback UI
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading apartments...</Text>
      </View>
    );
  }

  if (apartments.length === 0) {
    return (
      <View style={styles.messageContainer}>
        <Text>No apartments available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapperContainer}>
      {currentIndex < apartments.length ? (
        <SwipeScreen
          key={currentIndex} // Ensure the SwipeScreen resets when the index changes
          apartment={apartments[currentIndex]}
          onSwipe={handleSwipe} // Pass the swipe handler to the SwipeScreen
        />
      ) : (
        <View style={styles.noMoreContainer}>
          <Text style={styles.noMoreText}>No more apartments to display.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  wrapperContainer: {
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
});

export default SwipeScreenWrapper;
