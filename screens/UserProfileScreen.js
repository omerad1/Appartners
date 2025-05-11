import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { ProgressBar, Colors } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import BackgroundImage from "../components/BackgroundImage";
import FilterScreen from "./FilterScreen";
import { useSelector, useDispatch } from "react-redux";
import { saveUserPreferences, fetchUserPreferences } from "../store/redux/userThunks";
import QuestionnaireModal from "../components/QuestionnaireModal";

export default function UserProfileScreen() {
  const [preferencesVisible, setPreferencesVisible] = useState(false);
  const [questionnaireVisible, setQuestionnaireVisible] = useState(false);
  const dispatch = useDispatch();
  
  // Get preferences from Redux store
  const preferences = useSelector(state => state.user.preferences);
  const isLoading = useSelector(state => state.user.isLoading);
  const error = useSelector(state => state.user.error);
  
  // Fetch preferences when component mounts if they're not already loaded
  useEffect(() => {
    if (!preferences) {
      dispatch(fetchUserPreferences())
        .catch(err => console.error("Failed to load preferences:", err));
    }
  }, [dispatch, preferences]);
  
  // Handle applying new preferences
  const handleApplyPreferences = async (newPreferences) => {
    try {
      // Save new preferences to Redux store
      await dispatch(saveUserPreferences(newPreferences));
      console.log("Preferences updated successfully");
    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };
  return (
    <BackgroundImage>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity>
              <View style={styles.settingsIcon}>
                <Ionicons name="settings" size={30} color="black" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Profile Section */}
          <View style={styles.profileContainer}>
            {/* Profile Picture */}
            <View style={styles.profileImageWrapper}>
              <Image
                source={require("../assets/icons/crime.png")} // Replace with actual profile image
                style={styles.profileImage}
              />
              <TouchableOpacity style={styles.editButton}>
                <View style={styles.editIcon}>
                  <Ionicons name="pencil" size={35} color="black" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <ProgressBar
                progress={0.85}
                color="#FFA500" // Hex code for orange color
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>85% COMPLETE</Text>
            </View>
        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <TouchableOpacity 
            style={styles.cardPlaceholder}
            onPress={() => setPreferencesVisible(true)}
          >
            <Ionicons name="options-outline" size={30} color="white" />
            <Text style={styles.cardText}>Preferences</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.cardPlaceholder}
            onPress={() => setQuestionnaireVisible(true)}
          >
            <Ionicons name="help-circle-outline" size={30} color="white" />
            <Text style={styles.cardText}>Questionnaire</Text>
          </TouchableOpacity>
          <View style={styles.cardPlaceholder}>
            <Ionicons name="home-outline" size={30} color="white" />
            <Text style={styles.cardText}>Apartments</Text>
          </View>
        </View>
        <View style={styles.bottomSection}>
          <Image
            source={require("../assets/icons/logo.png")} // Replace with your logo
            style={styles.logo}
          />
        </View>
        
        {/* Preferences Drawer */}
        <FilterScreen 
          visible={preferencesVisible}
          onClose={() => setPreferencesVisible(false)}
          onApply={handleApplyPreferences}
          initialPreferences={preferences}
        />
        
        {/* Questionnaire Modal */}
        <QuestionnaireModal
          visible={questionnaireVisible}
          onClose={() => setQuestionnaireVisible(false)}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    marginBottom: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "right",
    alignContent: "right",
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 150,
    resizeMode: "contain",
  },
  settingsIcon: {
    width: 30,
    height: 30,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  profileImageWrapper: {
    position: "relative",
  },
  profileImage: {
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 7,
    resizeMode: "cover", // Use 'cover' for better image fit
    borderColor: "#d4af37", // Gold-like color for border
  },

  editButton: {
    position: "absolute",
    bottom: 10,
    right: 20,
    backgroundColor: "#fff",
    borderRadius: "100%",
    padding: 5,
  },
  editIcon: {
    width: 35,
    alignContent: "center",
    resizeMode: "contain",
    alignItems: "center",
    height: 35,
  },
  progressBarContainer: {
    marginTop: 10,
    width: "70%",
    alignItems: "center",
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    color: "#FFA500",
    width: "100%",
  },
  progressText: {
    marginTop: 5,
    fontSize: 12,
    color: "#444",
    fontWeight: "bold",
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  bottomSection: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },
  cardPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(8, 7, 0, 0.8)", // 80% opacity white
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    padding: 5,
  },
  cardText: {
    color: "white",
    fontSize: 10,
    marginTop: 5,
    textAlign: "center",
    fontFamily: "comfortaaRegular",
  },
});
