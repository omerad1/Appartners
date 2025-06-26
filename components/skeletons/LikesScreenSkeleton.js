import React from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import BackgroundImage from "../layouts/BackgroundImage";


// Main LikesScreen skeleton component
const LikesScreenSkeleton = () => {
  // Simulating the active tab state
  const activeTab = "apartments"; // Default tab

  return (
    <BackgroundImage>
      <SafeAreaView style={styles.container}>
        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <LinearGradient
            colors={["rgba(91, 89, 85, 0.88)", "rgba(91, 89, 85, 0.95)"]}
            style={styles.tabGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {/* Apartments Tab */}
            <TouchableOpacity
              style={[styles.tab, activeTab === "apartments" && styles.activeTab]}
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

            {/* People Tab */}
            <TouchableOpacity
              style={[styles.tab, activeTab === "people" && styles.activeTab]}
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

        {/* Content Container */}
        <View style={styles.contentContainer}>
          {activeTab === "apartments" ? (
            <ApartmentsILikedSkeleton />
          ) : (
            <PeopleLikedMyApartmentSkeleton />
          )}
        </View>
      </SafeAreaView>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -80, // Shift the content higher on the screen
  },
  loadingText: {
    marginTop: 10,
    color: "#888",
    fontSize: 16,
  },
  // Additional skeleton-specific styles
  skeletonCard: {
    width: "90%",
    height: 150,
    backgroundColor: "rgba(200, 200, 200, 0.3)",
    borderRadius: 16,
    marginVertical: 10,
    overflow: "hidden",
  },
  skeletonGradient: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default LikesScreenSkeleton;
