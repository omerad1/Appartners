import React, { useRef } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Animated,
  PanResponder,
  Text,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ImageDisplayer from "../components/ImageDisplayer";
import SearchTags from "../components/SearchTags";
import UserDisplayer from "../components/UserDisplayer";

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

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
      onPanResponderMove: (_, gesture) => {
        position.setValue({ x: gesture.dx, y: 0 });
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx > 120) {
          // Swipe right for like
          triggerSwipeAnimation("like");
        } else if (gesture.dx < -120) {
          // Swipe left for dislike
          triggerSwipeAnimation("dislike");
        } else {
          // Reset position if swipe is too short
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const triggerSwipeAnimation = (direction) => {
    const x = direction === "like" ? 500 : -500; // Move off-screen
    Animated.timing(position, {
      toValue: { x, y: 0 },
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      onSwipe(direction); // Notify the parent
      position.setValue({ x: 0, y: 0 }); // Reset for the next apartment
    });
  };

  return (
    <Animated.View
      {...panResponder.panHandlers}
      style={[
        styles.card,
        {
          transform: [
            { translateX: position.x },
            {
              rotate: position.x.interpolate({
                inputRange: [-500, 0, 500],
                outputRange: ["-10deg", "0deg", "10deg"],
              }),
            },
          ],
        },
      ]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
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

        {/* About Section */}
        <View style={styles.aboutContainer}>
          <Text style={styles.textHeader}>אודות הדירה</Text>
          <Text style={styles.text}>{aboutApartment}</Text>
        </View>

        {/* Details Section */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Total Price:</Text>
            <Text style={styles.detailValue}>₪{price.toLocaleString()}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Number of Rooms:</Text>
            <Text style={styles.detailValue}>{rooms}</Text>
          </View>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Available Rooms:</Text>
            <Text style={styles.detailValue}>{availableRooms}</Text>
          </View>
        </View>

        {/* Tags Section */}
        <View style={styles.tagsContainer}>
          <SearchTags tags={tags} selectedTags={tags} />
        </View>

        {/* User Section */}
        <View style={styles.userContainer}>
          <UserDisplayer
            avatarSource={user.image}
            name={user.name}
            facebookLink={user.link}
          />
        </View>

        {/* Like and Dislike Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.dislikeButton]}
            onPress={() => triggerSwipeAnimation("dislike")}
          >
            <MaterialCommunityIcons name="heart-broken" size={30} color="red" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={() => triggerSwipeAnimation("like")}
          >
            <MaterialCommunityIcons name="heart" size={30} color="#039912" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 20,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "center",
    backgroundColor: "rgba(185, 185, 185, 0.8)",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  gpsIcon: {
    marginRight: 10,
  },
  addressHeader: {
    fontSize: 24,
    fontFamily: "comfortaaBold",
    color: "rgb(0, 0, 0)",
  },
  imageDisplayerContainer: {
    marginBottom: 20,
  },
  aboutContainer: {
    alignItems: "center",
    paddingVertical: 20,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 15,
    elevation: 7,
  },
  textHeader: {
    fontSize: 24,
    fontFamily: "comfortaaBold",
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
    fontFamily: "comfortaaRegular",
    textAlign: "right",
    lineHeight: 24,
  },
  detailsContainer: {
    marginBottom: 20,
    backgroundColor: "rgba(245, 245, 245, 0.9)",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 7,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontFamily: "comfortaaSemiBold",
    color: "#555",
  },
  detailValue: {
    fontSize: 16,
    fontFamily: "comfortaaRegular",
    color: "#333",
  },
  tagsContainer: {
    marginBottom: 20,
  },
  userContainer: {
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
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
  },
  dislikeButton: {
    borderColor: "red",
  },
  likeButton: {
    borderColor: "#039912",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 5,
  },
});

export default SwipeScreen;
