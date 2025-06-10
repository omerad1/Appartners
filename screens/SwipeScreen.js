import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Animated,
  PanResponder,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  FontAwesome,
  FontAwesome5,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import ImageDisplayer from "../components/general/ImageDisplayer";
import SearchTags from "../components/apartmentsComp/SearchTags";
import { likeApartment, unlikeApartment } from "../api/apartments/index";
import QuestionCompatibilityDrawer from "../components/survey/QuestionCompatibilityDrawer";
import { useSelector } from 'react-redux';
import {calculateAge} from '../api/utils'



const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 120;
const defaultUserImage = require("../assets/placeholders/default-user-image.jpg");

const SwipeScreen = (props) => {
  const { onSwipe, apartment } = props; // Prop to notify the parent of swipe action

  const {
    address,
    images,
    aboutApartment,
    tags,
    price,
    rooms,
    availableRooms,
    entryDate,
  } = apartment;
  const [loadingOwner, setLoadingOwner] = useState(false);
  // Inside your component
  const currentUser = useSelector((state) => state.user.currentUser);
  const position = useRef(new Animated.ValueXY()).current;
  const [currentSwipe, setCurrentSwipe] = useState(null); // 'like' or 'dislike' or null

  // Animation values for overlay effects
  const likeOpacity = useRef(new Animated.Value(0)).current;
  const dislikeOpacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const contactButtonScale = useRef(new Animated.Value(1)).current;

  const [ownerLoaded, setOwnerLoaded] = useState(false);
  const [ownerData, setOwnerData] = useState(null);
  const [questionDrawerVisible, setQuestionDrawerVisible] = useState(false);
  const compatibilityScore = Math.floor(Math.random() * 40) + 60; // Random score between 60-99%


  useEffect(() => {
    // Pulse animation for contact button
    Animated.loop(
      Animated.sequence([
        Animated.timing(contactButtonScale, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(contactButtonScale, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Function to handle liking or disliking an apartment
  const setLikedOrDisliked = async (direction) => {
    try {
      if (!apartment || !apartment.id) {
        console.error("No apartment ID available for like/dislike action");
        return;
      }

      if (direction === "like") {
        console.log("👍 Liking apartment", apartment.id);
        await likeApartment(apartment.id);
      } else if (direction === "dislike") {
        console.log("👎 Disliking apartment", apartment.id);
        await unlikeApartment(apartment.id);
      }
    } catch (error) {
      console.error(
        `Error ${direction === "like" ? "liking" : "disliking"} apartment:`,
        error
      );
    }
  };

  // Reset animations when apartment changes
  useEffect(() => {
    //console.log("🏠 Apartment changed:", apartment);
    likeOpacity.setValue(0);
    dislikeOpacity.setValue(0);
    scale.setValue(1);
    rotation.setValue(0);
    contentOpacity.setValue(1);
    setCurrentSwipe(null);
  }, [apartment]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: gesture.dy * 0.2 });

        // Update overlay opacity based on swipe distance
        if (gesture.dx > 0) {
          likeOpacity.setValue(gesture.dx / (SCREEN_WIDTH / 2));
          dislikeOpacity.setValue(0);
          setCurrentSwipe("like");
          // Set rotation value directly for smoother animation
          rotation.setValue(gesture.dx * 0.005); // Positive rotation for right swipe
        } else if (gesture.dx < 0) {
          dislikeOpacity.setValue(Math.abs(gesture.dx) / (SCREEN_WIDTH / 2));
          likeOpacity.setValue(0);
          setCurrentSwipe("dislike");
          // Set rotation value directly for smoother animation
          rotation.setValue(gesture.dx * 0.008); // Negative rotation for left swipe (with amplification)
        }

        // Fade content slightly when swiping far
        if (Math.abs(gesture.dx) > SCREEN_WIDTH / 4) {
          const newOpacity =
            1 - (Math.abs(gesture.dx) - SCREEN_WIDTH / 4) / (SCREEN_WIDTH / 2);
          contentOpacity.setValue(Math.max(0.5, newOpacity));
        } else {
          contentOpacity.setValue(1);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > SWIPE_THRESHOLD) {
          // Swipe right for like
          triggerSwipeAnimation("like");
        } else if (gesture.dx < -SWIPE_THRESHOLD) {
          // Swipe left for dislike
          triggerSwipeAnimation("dislike");
        } else {
          // Reset position if swipe is too short
          Animated.parallel([
            Animated.spring(position, {
              toValue: { x: 0, y: 0 },
              friction: 5,
              useNativeDriver: false,
            }),
            Animated.timing(likeOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(dislikeOpacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: false,
            }),
            Animated.timing(contentOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: false,
            }),
          ]).start(() => setCurrentSwipe(null));
        }
      },
    })
  ).current;

  const triggerSwipeAnimation = (direction) => {
    setCurrentSwipe(direction);
    setLikedOrDisliked(direction);
    const x = direction === "like" ? SCREEN_WIDTH * 1.5 : -SCREEN_WIDTH * 1.5;
    const y = direction === "like" ? 50 : -50;

    // Visual effects for the swipe
    const swipeEffects = [
      // Move card off screen
      Animated.timing(position, {
        toValue: { x, y },
        duration: 300,
        useNativeDriver: false,
      }),

      // Scale effect
      Animated.sequence([
        Animated.timing(scale, {
          toValue: 1.1,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: false,
        }),
      ]),

      // Rotation pop
      Animated.sequence([
        Animated.timing(rotation, {
          toValue: direction === "like" ? 0.2 : -0.4,
          duration: 100,
          useNativeDriver: false,
        }),
        Animated.timing(rotation, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]),

      // Overlay opacity
      Animated.timing(direction === "like" ? likeOpacity : dislikeOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),

      // Fade content
      Animated.timing(contentOpacity, {
        toValue: 0.5,
        duration: 200,
        useNativeDriver: false,
      }),
    ];

    Animated.parallel(swipeEffects).start(() => {
      // Notify parent and reset animations
      onSwipe(direction);
      position.setValue({ x: 0, y: 0 });
      scale.setValue(1);
      rotation.setValue(0);
      likeOpacity.setValue(0);
      dislikeOpacity.setValue(0);
      contentOpacity.setValue(1);
      setCurrentSwipe(null);
    });
  };

  // Calculate card animation styles
  const cardStyle = {
    transform: [
      { translateX: position.x },
      { translateY: position.y },
      { scale },
      {
        rotate: position.x.interpolate({
          inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
          outputRange: ["-10deg", "0deg", "10deg"],
          extrapolate: "clamp",
        }),
      },
    ],
    opacity: position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: [0.5, 1, 0.5],
    }),
  };

  // Card border color based on swipe direction
  const cardBorderStyle = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 4, 0, SCREEN_WIDTH / 4],
    outputRange: [
      "rgba(120, 62, 12, 0.8)",
      "rgba(0, 0, 0, 0.1)",
      "rgba(255, 193, 7, 0.5)",
    ],
    extrapolate: "clamp",
  });

  // Button highlight based on current swipe
  const likeButtonStyle = [
    styles.actionButton,
    styles.likeButton,
    currentSwipe === "like" ? styles.activeButton : {},
  ];

  const dislikeButtonStyle = [
    styles.actionButton,
    styles.dislikeButton,
    currentSwipe === "dislike" ? styles.activeDislikeButton : {},
  ];

  const loadOwnerData = async () => {
    if (ownerLoaded) return; // Already loaded, don't reload
    setLoadingOwner(true);
    try {
      // Check if apartment has user_details - use it directly
      if (apartment && apartment.user_details) {
        setOwnerData(apartment.user_details);
      } else {
        // Fallback in case user_details is not available
        console.log(
          "[Owner Data] No user_details found in apartment data, using fallback"
        );
        setOwnerData({
          first_name: "Apartment",
          last_name: "Owner",
          occupation: "Property Owner",
          about_me: "No information available about this apartment owner.",
          photo_url: null,
        });
      }
    } catch (error) {
      console.error("[Owner Data] Error processing owner data:", error);
    } finally {
      setOwnerLoaded(true);
      setLoadingOwner(false);
    }
  };

  // Modify the useEffect to have better dependency handling and preserve data
  useEffect(() => {
    // Only run if we have apartment data and haven't loaded the owner yet
    if (apartment && !ownerLoaded) {
      console.log(
        "[Owner Data] Loading owner data for apartment:",
        apartment.id
      );
      loadOwnerData();
    }

    // Clean up function that only runs when apartment changes, not on every re-render
    return () => {
      if (apartment?.id !== prevApartmentRef.current?.id) {
        console.log("[Owner Data] Apartment changed, resetting owner data");
        setOwnerLoaded(false);
        setOwnerData(null);
        prevApartmentRef.current = apartment;
      }
    };
  }, [apartment, ownerLoaded]);

  // Add a ref to track previous apartment
  const prevApartmentRef = useRef(null);

  const handlePress = () => {
    // Open the QuestionCompatibilityDrawer with the apartment owner's questionnaire responses
    setQuestionDrawerVisible(true);
  };
    

  // Update the renderContactSection function to handle data more consistently
  const renderContactSection = () => {
    // Don't show loading if we already have data
    if (loadingOwner && !ownerData) {
      return (
        <LinearGradient
          colors={["rgba(139, 69, 19, 0.85)", "rgba(160, 82, 45, 0.8)"]}
          style={styles.ownerProfileContainer}
        >
          <Text style={styles.ownerSectionTitle}>Loading owner details...</Text>
        </LinearGradient>
      );
    }

    // Use a default URL if none exists
    const facebookUrl = "https://facebook.com";

    // Only use fallback name if we actually don't have owner data
    const fullName =
      ownerData && (ownerData.first_name || ownerData.last_name)
        ? `${ownerData.first_name || ""} ${ownerData.last_name || ""}`.trim()
        : "Property Owner";

    return (
      <LinearGradient
        colors={["rgba(139, 69, 19, 0.85)", "rgba(160, 82, 45, 0.8)"]}
        style={styles.ownerProfileContainer}
      >
        <View style={styles.ownerHeader}>
          <View style={styles.matchBadgeContainer}>
          <TouchableOpacity onPress={handlePress} style={styles.matchBadgeContainer}>
            <LinearGradient
              colors={["#FFC107", "#FFD54F"]}
              style={styles.compatibilityBadge}
            >
              <Text style={styles.compatibilityText}>
                {compatibilityScore}% Match
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          </View>
        </View>

        <View style={styles.ownerProfileContent}>
          <View style={styles.ownerImageContainer}>
            <Image
              source={
                ownerData?.photo_url
                  ? { uri: ownerData.photo_url }
                  : defaultUserImage
              }
              style={styles.ownerImage}
            />
          </View>

          <View style={styles.ownerDetails}>
            <Text style={styles.ownerName}>{fullName}</Text>
            
            {/* Gender and Age Row */}
            <View style={styles.ownerInfoRow}>
              {apartment.user_details?.gender && (
                <View style={styles.ownerInfoItem}>
                  {apartment.user_details.gender.toLowerCase() === 'male' ? (
                    <FontAwesome5 name="mars" size={14} color="#4169E1" />
                  ) : apartment.user_details.gender.toLowerCase() === 'female' ? (
                    <FontAwesome5 name="venus" size={14} color="#FF69B4" />
                  ) : (
                    <FontAwesome5 name="genderless" size={14} color="#808080" />
                  )}
                  <Text style={styles.ownerInfoText}>
                    {apartment.user_details.gender}
                  </Text>
                </View>
              )}
              
              {apartment.user_details?.birth_date && (
                <View style={styles.ownerInfoItem}>
            <MaterialCommunityIcons name="badge-account-horizontal-outline" size={14} color="#9370DB" />
            <Text style={styles.ownerInfoText}>
                    {calculateAge(apartment.user_details.birth_date)}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.check}>
            <Text style={styles.ownerOccupation}>
              {ownerData?.occupation || "Not specified"}
            </Text>

            <TouchableOpacity
              style={styles.facebookButton}
            >
              <FontAwesome name="facebook-square" size={20} color="#3b5998" />
            </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.aboutSection}>
          <Text style={styles.aboutSectionTitle}>About the Owner</Text>
          <Text style={styles.aboutText}>
            {ownerData?.about_me ||
              "No additional information provided by the owner."}
          </Text>
        </View>
      </LinearGradient>
    );
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[styles.card, cardStyle, { borderColor: cardBorderStyle }]}
    >
      {/* Like Overlay */}
      <Animated.View
        style={[styles.overlay, styles.likeOverlay, { opacity: likeOpacity }]}
        pointerEvents="none"
      >
        <MaterialCommunityIcons
          name="heart"
          size={150}
          color="rgba(255, 193, 7, 0.8)"
        />
        <Text style={styles.overlayText}>LIKE</Text>
      </Animated.View>

      {/* Dislike Overlay */}
      <Animated.View
        style={[
          styles.overlay,
          styles.dislikeOverlay,
          { opacity: dislikeOpacity },
        ]}
        pointerEvents="none"
      >
        <MaterialCommunityIcons
          name="heart-broken"
          size={150}
          color="rgba(120, 62, 12, 0.8)"
        />
        <Text style={styles.overlayText}>DISLIKE</Text>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ opacity: contentOpacity }}>
          {/* Address Section */}
          <LinearGradient
            colors={["rgba(139, 69, 19, 0.9)", "rgba(160, 82, 45, 0.85)"]}
            style={styles.headerContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <MaterialCommunityIcons
              name="map-marker"
              size={26}
              color="#FFF"
              style={styles.gpsIcon}
            />
            <Text style={styles.addressHeader}>{address}</Text>
          </LinearGradient>

          {/* Images Section */}
          <View style={styles.imageDisplayerContainer}>
            <ImageDisplayer images={images} isLocal={true} />
          </View>

          {/* Key Details Section */}
          <LinearGradient
            colors={["rgba(205, 133, 63, 0.8)", "rgba(244, 164, 96, 0.85)"]}
            style={styles.keyDetailsContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.keyDetail}>
              <MaterialCommunityIcons
                name="currency-ils"
                size={24}
                color="#FFFFFF"
              />
              <Text style={styles.keyDetailText}>
                ₪{price?.toLocaleString() || "N/A"}
              </Text>
            </View>
            <View style={styles.keyDetail}>
              <MaterialCommunityIcons name="door" size={24} color="#FFFFFF" />
              <Text style={styles.keyDetailText}>{rooms || "?"} Rooms</Text>
            </View>
            <View style={styles.keyDetail}>
              <MaterialCommunityIcons
                name="door-open"
                size={24}
                color="#FFFFFF"
              />
              <Text style={styles.keyDetailText}>
                {availableRooms || "?"} Available
              </Text>
            </View>
            {entryDate && (
              <View style={styles.keyDetail}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={22}
                  color="#FFFFFF"
                />
                <Text style={styles.keyDetailText}>
                  {new Date(entryDate)
                    .toLocaleDateString("en-GB")
                    .substring(0, 5)}
                </Text>
              </View>
            )}
          </LinearGradient>

          {/* About Section */}
          <LinearGradient
            colors={["rgba(245, 245, 245, 0.9)", "rgba(235, 235, 235, 0.95)"]}
            style={styles.aboutContainer}
          >
            <Text style={styles.textHeader}>About</Text>
            <Text style={styles.text}>
              {aboutApartment || "No description provided."}
            </Text>
          </LinearGradient>

          {/* Tags Section */}
          {tags && tags.length > 0 && (
            <LinearGradient
              colors={["rgba(245, 245, 245, 0.9)", "rgba(235, 235, 235, 0.95)"]}
              style={styles.tagsContainer}
            >
              <Text style={styles.sectionTitle}>Apartment Features</Text>
              <SearchTags tags={tags} selectedTags={tags} />
            </LinearGradient>
          )}

          {/* Contact Section */}
          {renderContactSection()}

          {/* Like and Dislike Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={dislikeButtonStyle}
              onPress={() => triggerSwipeAnimation("dislike")}
            >
              <MaterialCommunityIcons
                name="heart-broken"
                size={30}
                color="#783e0c"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={likeButtonStyle}
              onPress={() => triggerSwipeAnimation("like")}
            >
              <MaterialCommunityIcons name="heart" size={30} color="#FFC107" />
            </TouchableOpacity>
          </View>
        </Animated.View>
        <QuestionCompatibilityDrawer
          visible={questionDrawerVisible}
          onClose={() => setQuestionDrawerVisible(false)}
          myAnswers={currentUser.questionnaire_responses}
          otherAnswers={apartment.user_details.questionnaire_responses}
        ></QuestionCompatibilityDrawer>
      </ScrollView>
    </Animated.View>

  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.68)",
  },
  contentContainer: {
    padding: 15,
    paddingTop: 15,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "center",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gpsIcon: {
    marginRight: 10,
  },
  addressHeader: {
    fontSize: 22,
    fontFamily: "comfortaaBold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  imageDisplayerContainer: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  keyDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    borderRadius: 10,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3.84,
    elevation: 3,
  },
  keyDetail: {
    alignItems: "center",
    justifyContent: "center",
  },
  keyDetailText: {
    marginTop: 8,
    fontSize: 16,
    fontFamily: "comfortaaSemiBold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  aboutContainer: {
    alignItems: "center",
    paddingVertical: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15,
    paddingHorizontal: 20,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#D2B48C",
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "comfortaaBold",
    marginBottom: 15,
    color: "#5D4037",
    textAlign: "center",
  },
  textHeader: {
    fontSize: 24,
    fontFamily: "comfortaaBold",
    marginBottom: 12,
    color: "#8B4513",
  },
  text: {
    fontSize: 16,
    fontFamily: "comfortaaRegular",
    textAlign: "center",
    lineHeight: 24,
    color: "#5D4037",
  },
  tagsContainer: {
    marginBottom: 15,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#D2B48C",
  },
  contactContainer: {
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    alignItems: "center",
  },
  contactSectionTitle: {
    fontSize: 22,
    fontFamily: "comfortaaBold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 15,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  contactButton: {
    marginVertical: 10,
    width: 200,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  contactButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  contactButtonText: {
    color: "#8B4513",
    fontFamily: "comfortaaBold",
    fontSize: 16,
    marginLeft: 10,
  },
  contactPrompt: {
    fontFamily: "comfortaaSemiBold",
    fontSize: 14,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 10,
    fontStyle: "italic",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  buttonContainer: {
    marginTop: 5,
    marginBottom: 30,
    marginHorizontal: 50,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dislikeButton: {
    borderColor: "#783e0c",
    backgroundColor: "white",
  },
  likeButton: {
    borderColor: "#FFC107",
    backgroundColor: "white",
  },
  activeButton: {
    transform: [{ scale: 1.15 }],
    shadowColor: "#FFC107",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  activeDislikeButton: {
    transform: [{ scale: 1.15 }],
    backgroundColor: "rgba(255, 240, 240, 0.9)",
    borderWidth: 3,
    shadowColor: "#783e0c",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  card: {
    flex: 1,
    borderRadius: 15,
    backgroundColor: "rgba(189, 78, 78, 0)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    overflow: "hidden",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  likeOverlay: {
    backgroundColor: "rgba(255, 193, 7, 0.2)",
  },
  dislikeOverlay: {
    backgroundColor: "rgba(120, 62, 12, 0.4)",
  },
  overlayText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  contactModalContainer: {
    width: "100%",
    maxWidth: 350,
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  contactModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
    paddingBottom: 10,
  },
  contactModalTitle: {
    fontSize: 24,
    fontFamily: "comfortaaBold",
    color: "#FFF",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  closeModalButton: {
    padding: 5,
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    fontFamily: "comfortaa",
  },
  ownerInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  ownerImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#FFF",
  },
  ownerTextInfo: {
    marginLeft: 15,
    flex: 1,
  },
  ownerName: {
    fontSize: 18,
    fontFamily: "comfortaaBold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  ownerBio: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    fontFamily: "comfortaa",
  },
  contactOptionsContainer: {
    marginTop: 10,
  },
  contactOption: {
    marginBottom: 15,
    borderRadius: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  contactOptionGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  contactOptionText: {
    color: "white",
    fontFamily: "comfortaaSemiBold",
    fontSize: 16,
    marginLeft: 15,
    textShadowColor: "rgba(0,0,0,0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  noContactInfo: {
    padding: 20,
    alignItems: "center",
  },
  noContactText: {
    color: "white",
    fontSize: 16,
    fontFamily: "comfortaa",
    textAlign: "center",
  },
  ownerProfileContainer: {
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  ownerHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  matchBadgeContainer: {
    alignItems: "center",
  },
  compatibilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  compatibilityText: {
    color: "#8B4513",
    fontFamily: "comfortaaBold",
    fontSize: 16,
  },
  ownerProfileContent: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  ownerImageContainer: {
    marginRight: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 4,
  },
  ownerImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: "white",
  },
  ownerDetails: {
    flex: 1,
    justifyContent: "center",
  },
  ownerName: {
    fontSize: 22,
    fontFamily: "comfortaaBold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  ownerInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    flexWrap: "wrap", // Allow wrapping if needed
  },
  ownerInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
    marginBottom: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  ownerInfoText: {
    color: "#FFFFFF",
    fontFamily: "comfortaa",
    fontSize: 14,
    marginLeft: 6,
    fontWeight: "500",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0.5, height: 0.5 },
    textShadowRadius: 1,
  },
  ownerOccupation: {
    fontSize: 16,
    fontFamily: "comfortaaSemiBold",
    color: "#F5F5F5",
    marginBottom: 12,
  },
  facebookButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
  },

  aboutSection: {
    padding: 15,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  aboutSectionTitle: {
    fontSize: 18,
    fontFamily: "comfortaaBold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  aboutText: {
    fontSize: 15,
    fontFamily: "comfortaaRegular",
    color: "#FFFFFF",
    lineHeight: 22,
    textAlign: "center",
    fontStyle: "italic",
  },
  check:{
    display:"flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    alignContent: "center",
  }
});

export default SwipeScreen;
