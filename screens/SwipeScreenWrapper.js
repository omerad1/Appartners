import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
  Dimensions,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserPreferences } from "../store/redux/userThunks";
import SwipeScreen from "./SwipeScreen";
import { LinearGradient } from "expo-linear-gradient";
import { getApartments } from "../api/apartments/index";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;

// Brown color instead of purple
const DISLIKE_COLOR = "#8B4513";
const LIKE_COLOR = "#FFC107";

const SwipeScreenWrapper = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // Get user preferences from Redux store
  const userPreferences = useSelector((state) => state.user.preferences);
  const isPreferencesLoading = useSelector((state) => state.user.isLoading);

  const [apartments, setApartments] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeAction, setSwipeAction] = useState(null); // 'like' or 'dislike'
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [allApartmentsLoaded, setAllApartmentsLoaded] = useState(false);
  const [filterPreferences, setFilterPreferences] = useState({});

  // Animations
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const backgroundColorAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fetch user preferences if they're not already loaded
    if (!userPreferences) {
      dispatch(fetchUserPreferences())
        .then((result) => {
          // Use the fetched preferences for filtering apartments
          if (result) {
            setFilterPreferences(result);
            fetchApartments(result);
          } else {
            fetchApartments();
          }
        })
        .catch((err) => {
          console.error("Failed to load preferences:", err);
          fetchApartments();
        });
    } else {
      // Use existing preferences from Redux
      setFilterPreferences(userPreferences);
      fetchApartments(userPreferences);
    }

    // Start pulse animation for UI elements
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();
  }, [userPreferences]);

  useEffect(() => {
    if (swipeAction) {
      // Reset after animation completes
      const timer = setTimeout(() => {
        setSwipeAction(null);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [swipeAction]);

  // Watch for when the index reaches 10 to load more apartments
  useEffect(() => {
    if (currentIndex === 10 && !isLoadingMore && !allApartmentsLoaded) {
      console.log("Loading more apartments at index 10");
      loadMoreApartments();
    }
  }, [currentIndex]);

  const fetchApartments = async (filters = {}) => {
    setLoading(true);
    try {
      // Use the provided filters, or fall back to user preferences from Redux, or local state
      const preferencesToUse =
        Object.keys(filters).length > 0
          ? filters
          : userPreferences || filterPreferences || {};

      const data = await getApartments(preferencesToUse);
      // Check if we received apartments or an empty array
      if (data && data.apartments && data.apartments.length > 0) {
        setApartments(data.apartments);
        setAllApartmentsLoaded(false);
      } else {
        setAllApartmentsLoaded(true);
      }

      setCurrentIndex(0); // Reset to the first apartment
    } catch (error) {
      console.error("Failed to fetch apartments:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreApartments = async () => {
    if (isLoadingMore || allApartmentsLoaded) return;

    setIsLoadingMore(true);
    try {
      // Use user preferences from Redux if available, otherwise use local state
      const preferencesToUse = userPreferences || filterPreferences || {};
      const data = await getApartments(preferencesToUse);
      console.log("🔄 Loading more apartments at index:", currentIndex);
      setCurrentIndex(0);
      if (data && data.apartments && data.apartments.length > 0) {
        setApartments((prevApartments) => [
          ...prevApartments,
          ...data.apartments,
        ]);
        setAllApartmentsLoaded(false);
      } else {
        setAllApartmentsLoaded(true);
      }
    } catch (error) {
      console.error("Failed to load more apartments:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleFilterPress = () => {
    console.log("Filter button pressed - navigating to filter screen");

    // Add animation to filter button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to filter screen with current preferences
    navigation.navigate("Filter", {
      initialPreferences: userPreferences || filterPreferences || {},
      onApply: (newPreferences) => {
        setFilterPreferences(newPreferences);
        fetchApartments(newPreferences);
      },
    });
  };

  const handleSwipe = (direction) => {
    console.log(direction === "like" ? "Liked" : "Disliked");

    // Set swipe action for animation
    setSwipeAction(direction);

    // Animate background color flash
    Animated.sequence([
      Animated.timing(backgroundColorAnim, {
        toValue: direction === "like" ? 1 : 2,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(backgroundColorAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();

    // Fade out current apartment
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      // Move to next apartment
      if (currentIndex < apartments.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        console.log("No more apartments to display.");
        setCurrentIndex(apartments.length); // Trigger fallback UI
      }

      // Fade in next apartment
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };
  // Replace with your specified icons
  const logoSource = require("../assets/icons/logo-close.png");

  // Helper function to format apartment data for SwipeScreen
  const formatApartmentForSwipe = (apartment) => {
    return {
      id: apartment.id,
      address: apartment.street + (apartment.area ? ", " + apartment.area : ""),
      images: apartment.photo_urls || [],
      aboutApartment: apartment.about || "No description available",
      tags: apartment.feature_details?.map((feature) => feature.name) || [],
      user_details: apartment.user_details,
      price: parseFloat(apartment.total_price) || 0,
      rooms: apartment.number_of_rooms || 0,
      availableRooms: apartment.number_of_available_rooms || 0,
    };
  };

  return (
    <ImageBackground
      source={require("../assets/background.jpg")}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <LinearGradient
        colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.2)", "rgba(255,255,255,0.1)"]}
        style={styles.gradientOverlay}
      >
        <Animated.View
          style={[styles.wrapperContainer, { backgroundColor: "transparent" }]}
        >
          {/* Header with Filter Button */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={logoSource}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <View style={styles.filterButtonContainer}>
              <TouchableOpacity
                style={styles.filterButton}
                onPress={handleFilterPress}
              >
                <Animated.View
                  style={[
                    styles.filterIcon,
                    { transform: [{ scale: scaleAnim }] },
                  ]}
                >
                  <Image
                    source={require("../assets/icons/tune.png")}
                    style={styles.filterIconImage}
                  />
                </Animated.View>
                <Text style={styles.filterText}>Filter</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Content */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#ffffff" />
              <Text style={styles.loadingText}>
                Finding perfect apartments for you...
              </Text>
            </View>
          ) : apartments.length === 0 ? (
            <View style={styles.messageContainer}>
              <Text style={styles.noApartmentsText}>
                No apartments available.
              </Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={() => fetchApartments()}
              >
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Animated.View
              style={[styles.swipeContainer, { opacity: fadeAnim }]}
            >
              {currentIndex < apartments.length ? (
                <View style={styles.cardWrapper}>
                  <SwipeScreen
                    key={currentIndex}
                    apartment={formatApartmentForSwipe(
                      apartments[currentIndex]
                    )}
                    onSwipe={handleSwipe}
                  />
                  {isLoadingMore && (
                    <View style={styles.loadingMoreIndicator}>
                      <ActivityIndicator size="small" color="#FFC107" />
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.noMoreContainer}>
                  <Text style={styles.endEmoji}>🏢</Text>
                  <Text style={styles.noMoreText}>
                    {isLoadingMore
                      ? "Loading more apartments..."
                      : "That's all for now!"}
                  </Text>
                  <Text style={styles.subText}>
                    {isLoadingMore
                      ? "Please wait while we find more options for you"
                      : "You've seen all available apartments"}
                  </Text>
                  <TouchableOpacity
                    style={styles.refreshButton}
                    onPress={() => fetchApartments()}
                  >
                    <Text style={styles.refreshButtonText}>Start Over</Text>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          )}

          {/* Footer */}
        </Animated.View>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  gradientOverlay: {
    flex: 1,
  },
  wrapperContainer: {
    flex: 1,
    paddingBottom: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 110,
    height: 50,
  },
  loadingMoreIndicator: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: 15,
    padding: 5,
    zIndex: 1000,
  },
  filterButtonContainer: {
    alignItems: "center",
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(220, 220, 220, 0.9)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  filterIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  filterIconImage: {
    width: 20,
    height: 20,
  },
  filterIconText: {
    fontSize: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    margin: 20,
    borderRadius: 15,
  },
  loadingText: {
    fontSize: 18,
    color: "white",
    marginTop: 15,
    marginBottom: 20,
  },
  loadingEmoji: {
    fontSize: 80,
    marginTop: 20,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    margin: 20,
    borderRadius: 15,
    padding: 20,
  },
  noApartmentsText: {
    fontSize: 22,
    color: "#333",
    marginBottom: 20,
  },
  swipeContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  cardWrapper: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.5,
    shadowRadius: 13.16,
    elevation: 20,
  },
  noMoreContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    margin: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  endEmoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  noMoreText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  refreshButton: {
    backgroundColor: "#4c8bf5",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  refreshButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  feedbackContainer: {
    position: "absolute",
    top: 100,
    left: "10%",
    right: "10%",
    padding: 15,
    borderRadius: 30,
    zIndex: 1000,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  feedbackText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    padding: 10,
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  footerText: {
    color: "#555",
    fontSize: 14,
  },
});

export default SwipeScreenWrapper;
