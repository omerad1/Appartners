import React, { useState, useEffect, cache } from "react";
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
import { saveUserPreferences, fetchUserPreferences, loadUserData } from "../store/redux/userThunks";
import { getUserDataFromStorage } from "../api/user";
import QuestionnaireModal from "../components/QuestionnaireModal";
import EditProfileModal from "../components/EditProfileModal";
import UserDisplayerModal from "../components/UserDisplayerModal";
import SettingsDrawerModal from "../components/SettingsDrawerModal";

export default function UserProfileScreen() {
  const [preferencesVisible, setPreferencesVisible] = useState(false);
  const [questionnaireVisible, setQuestionnaireVisible] = useState(false);
  const [editProfileVisible, setEditProfileVisible] = useState(false);
  const [previewProfileVisible, setPreviewProfileVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  // Add a state to force rerenders when profile is updated
  const [profileUpdateCounter, setProfileUpdateCounter] = useState(0);
  const dispatch = useDispatch();
  
  // Get preferences and user data from Redux store
  const preferences = useSelector(state => state.user.preferences);
  const currentUser = useSelector(state => state.user.currentUser);
  const isLoading = useSelector(state => state.user.isLoading);
  const error = useSelector(state => state.user.error);
  
  // Fetch preferences and user data when component mounts if they're not already loaded
  useEffect(() => {
    const fetchData = async () => {
      try{
        // fetch user data
        const userData = await loadUserData();
        if (userData){
        } else {
          console.log('UserProfileScreen: No user data returned from loadUserData()');
        }
      }
      catch(err){
        console.error("Error fetching user data:", err);
      }
    }
    fetchData();
    if (!preferences) {
      dispatch(fetchUserPreferences())
        .then(result => console.log('UserProfileScreen: Preferences fetched:', JSON.stringify(result?.payload, null, 2)))
        .catch(err => console.error("Failed to load preferences:", err));
    }
  }, [dispatch, preferences,  profileUpdateCounter]);
  
  
  // Function to explicitly fetch user data from AsyncStorage
  const refreshUserDataFromStorage = async () => {
    try {
      const userData = await getUserDataFromStorage();
      if (userData) {
        
        // Manually update Redux store with the fetched data
        dispatch({ 
          type: 'user/updateUserProfile', 
          payload: userData 
        });
        
        // Force immediate rerender
        setProfileUpdateCounter(prev => prev + 1);
      } else {
      }
    } catch (err) {
      console.error('Failed to refresh user data from storage:', err);
    }
  };
  
  // Handle applying new preferences
  const handleApplyPreferences = async (newPreferences) => {
    try {
      // Save new preferences to Redux store
      const result = await dispatch(saveUserPreferences(newPreferences));

    } catch (error) {
      console.error("Error updating preferences:", error);
    }
  };
  
  // Dummy handlers for preview profile actions
  const handleLikeProfile = () => {

    setPreviewProfileVisible(false);
  };
  
  const handleDislikeProfile = () => {

    setPreviewProfileVisible(false);
  };
  
  // Format user data for the UserDisplayerModal
  const formatUserForPreview = () => {
    if (!currentUser) return null;
    
    // Calculate age from birth_date
    let age = null;
    if (currentUser.birth_date) {
      const birthDate = new Date(currentUser.birth_date);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      // Adjust age if birthday hasn't occurred yet this year
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }
    

    return {
      name: `${currentUser.first_name} ${currentUser.last_name}`,
      profile_image: currentUser.photo_url || null, // Pass null if no photo URL exists
      bio: currentUser.about_me || 'No bio available',
      age: age, // Use calculated age
      university: currentUser.university || null,
      occupation: currentUser.occupation || null // Add occupation field
    };
  };
  return (
    <BackgroundImage>
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => setSettingsVisible(true)}
            >
              <Ionicons name="settings-outline" size={30} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Profile Section */}
          <View style={styles.profileContainer}>
            {/* Profile Picture */}
            <View style={styles.profileImageWrapper}>
              <Image
                source={currentUser?.photo_url ? { uri: currentUser.photo_url } : require("../assets/icons/crime.png")}
                style={styles.profileImage}
                // Add key prop with photo_url to force re-render when the image changes
                key={currentUser?.photo_url || 'default-profile'}
              />
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setEditProfileVisible(true)}
              >
                <View style={styles.editIcon}>
                  <Ionicons name="pencil" size={35} color="black" />
                </View>
              </TouchableOpacity>
            </View>
            
            {/* User Name and Info */}
            {currentUser && (
              <View style={styles.userInfoContainer}>
                <Text style={styles.userName}>
                  {currentUser.first_name} {currentUser.last_name}
                </Text>
              </View>
            )}

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
              <ProgressBar
                progress={0.85}
                color="#FFA500" // Hex code for orange color
                style={styles.progressBar}
              />
              <Text style={styles.progressText}>85% COMPLETE</Text>
            </View>
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
          <TouchableOpacity 
            style={styles.cardPlaceholder}
            onPress={() => setPreviewProfileVisible(true)}
          >
            <Ionicons name="eye-outline" size={30} color="white" />
            <Text style={styles.cardText}>Preview Profile</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomSection}>
          <Image
            source={require("../assets/icons/logo.png")} // Replace with your logo
            style={styles.logo}
          />
        </View>
        
        {/* Preferences Drawer */}
        {/* Debug preferences data */}
        {console.log('UserProfileScreen - Preferences being passed to FilterScreen:', 
          JSON.stringify(preferences, null, 2))}
        
        <FilterScreen 
          visible={preferencesVisible}
          onClose={() => setPreferencesVisible(false)}
          onApply={handleApplyPreferences}
          initialPreferences={preferences || {}}
        />
        
        {/* Preview Profile Modal */}
        <UserDisplayerModal
          visible={previewProfileVisible}
          onClose={() => setPreviewProfileVisible(false)}
          user={formatUserForPreview()}
          onLike={handleLikeProfile}
          onDislike={handleDislikeProfile}
          showActions={false} // Hide action buttons when viewing own profile
        />
        
        {/* Questionnaire Modal */}
        <QuestionnaireModal
          visible={questionnaireVisible}
          onClose={() => setQuestionnaireVisible(false)}
        />
        
        {/* Edit Profile Modal */}
        <EditProfileModal
          visible={editProfileVisible}
          onClose={() => setEditProfileVisible(false)}
          onProfileUpdated={async (result, shouldRefetch) => {
            if (shouldRefetch) {
              // Explicitly fetch fresh data from AsyncStorage
              await refreshUserDataFromStorage();
            }
            // Increment counter to force a rerender
            setProfileUpdateCounter(prev => prev + 1);

          }}
        />
        
        {/* Settings Drawer Modal */}
        <SettingsDrawerModal
          visible={settingsVisible}
          onClose={() => setSettingsVisible(false)}
        />
      </View>
    </SafeAreaView>
    </BackgroundImage>
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
  userInfoContainer: {
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "comfortaaSemiBold",
    textAlign: "center",
  },
  userOccupation: {
    fontSize: 16,
    color: "#555",
    marginTop: 5,
    fontFamily: "comfortaaRegular",
    textAlign: "center",
  },
  userLocation: {
    fontSize: 14,
    color: "#777",
    marginTop: 5,
    fontFamily: "comfortaaRegular",
    textAlign: "center",
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
