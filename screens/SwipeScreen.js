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
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ImageDisplayer from "../components/ImageDisplayer";
import SearchTags from "../components/SearchTags";
import UserDisplayer from "../components/UserDisplayer";
import { likeApartment, unlikeApartment } from "../api/likes";
const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 120;

const SwipeScreen = (props) => {
  const { onSwipe, apartment } = props; // Prop to notify the parent of swipe action

  const {
    address,
    images,
    aboutApartment,
    tags,
    user,
    price,
    rooms,
    availableRooms,
  } = apartment;

  const position = useRef(new Animated.ValueXY()).current;
  const [currentSwipe, setCurrentSwipe] = useState(null); // 'like' or 'dislike' or null

  // Animation values for overlay effects
  const likeOpacity = useRef(new Animated.Value(0)).current;
  const dislikeOpacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const rotation = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;

  // Reset animations when apartment changes
  useEffect(() => {
    console.log("🏠 Apartment changed:", apartment);
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
        } else if (gesture.dx < 0) {
          dislikeOpacity.setValue(Math.abs(gesture.dx) / (SCREEN_WIDTH / 2));
          likeOpacity.setValue(0);
          setCurrentSwipe("dislike");
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
          toValue: direction === "like" ? 0.2 : -0.2,
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
        rotate: Animated.add(
          rotation,
          position.x.interpolate({
            inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
            outputRange: ["-8deg", "0deg", "8deg"],
            extrapolate: "clamp",
          })
        ),
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
      "rgba(120, 62, 12, 0.5)",
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
    currentSwipe === "dislike" ? styles.activeButton : {},
  ];

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
      >
        <Animated.View style={{ opacity: contentOpacity }}>
          {/* Address Section */}
          <View style={styles.headerContainer}>
            <MaterialCommunityIcons
              name="map-marker"
              size={24}
              color="black"
              style={styles.gpsIcon}
            />
            <Text style={styles.addressHeader}>{address}</Text>
          </View>

          {/* Images Section */}
          <View style={styles.imageDisplayerContainer}>
            <ImageDisplayer images={images} isLocal={true} />
          </View>

          {/* Key Details Section */}
          <View style={styles.keyDetailsContainer}>
            <View style={styles.keyDetail}>
              <MaterialCommunityIcons
                name="currency-ils"
                size={22}
                color="#333"
              />
              <Text style={styles.keyDetailText}>
                ₪{price.toLocaleString()}
              </Text>
            </View>
            <View style={styles.keyDetail}>
              <MaterialCommunityIcons name="door" size={22} color="#333" />
              <Text style={styles.keyDetailText}>{rooms} Rooms</Text>
            </View>
            <View style={styles.keyDetail}>
              <MaterialCommunityIcons name="door-open" size={22} color="#333" />
              <Text style={styles.keyDetailText}>
                {availableRooms} Available
              </Text>
            </View>
          </View>

          {/* About Section */}
          <View style={styles.aboutContainer}>
            <Text style={styles.textHeader}>אודות הדירה</Text>
            <Text style={styles.text}>{aboutApartment}</Text>
          </View>

          {/* Tags Section */}
          <View style={styles.tagsContainer}>
            <Text style={styles.sectionTitle}>Tags</Text>
            <SearchTags tags={tags} selectedTags={tags} />
          </View>

          {/* User Section */}
          <View style={styles.userContainer}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <UserDisplayer
              avatarSource={user.image}
              name={user.name}
              facebookLink={user.link}
            />
          </View>

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
    padding: 20,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  gpsIcon: {
    marginRight: 10,
  },
  addressHeader: {
    fontSize: 22,
    fontFamily: "comfortaaBold",
    color: "rgb(0, 0, 0)",
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
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  keyDetail: {
    alignItems: "center",
    justifyContent: "center",
  },
  keyDetailText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  aboutContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 15,
    paddingHorizontal: 15,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    textAlign: "center",
  },
  textHeader: {
    fontSize: 24,
    fontFamily: "comfortaaBold",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontFamily: "comfortaaRegular",
    textAlign: "right",
    lineHeight: 24,
  },
  tagsContainer: {
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  userContainer: {
    marginBottom: 15,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonContainer: {
    marginTop: 5,
    marginBottom: 10,
    marginHorizontal: 40,
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
  },
  dislikeButton: {
    borderColor: "#783e0c",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  likeButton: {
    borderColor: "#FFC107",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  activeButton: {
    transform: [{ scale: 1.1 }],
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
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
    backgroundColor: "rgba(120, 62, 12, 0.2)",
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
});

export default SwipeScreen;
