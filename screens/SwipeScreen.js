import React from "react";
import ImageDisplayer from "../components/ImageDisplayer";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SearchTags from "../components/SearchTags";
import UserDisplayer from "../components/UserDisplayer";

const SwipeScreen = (props) => {
  const { address, images, aboutApartment, tags, user } = props.apartment;

  // Function to resolve local image paths
  const resolveAsset = (imagePath) => {
    switch (imagePath) {
      case "../assets/apt/y2_1pa_010214_20250114110125.jpeg":
        return require("../assets/apt/y2_1pa_010214_20250114110125.jpeg");
      case "../assets/apt/y2_1pa_010353_20250114110124.jpeg":
        return require("../assets/apt/y2_1pa_010353_20250114110124.jpeg");
      case "../assets/apt/y2_1pa_010418_20250114110124.jpeg":
        return require("../assets/apt/y2_1pa_010418_20250114110124.jpeg");
      case "../assets/icons/avi-avatar.jpg":
        return require("../assets/icons/avi-avatar.jpg");
      case "../assets/apt/y2_1pa_010626_20250114110124.jpeg":
        return require("../assets/apt/y2_1pa_010626_20250114110124.jpeg");
      case "../assets/apt/y2_1pa_010692_20250114110124.jpeg":
        return require("../assets/apt/y2_1pa_010692_20250114110124.jpeg");
      case "../assets/apt/y2_1pa_010920_20250114110124.jpeg":
        return require("../assets/apt/y2_1pa_010920_20250114110124.jpeg");
      default:
        return null;
    }
  };

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Address Header */}
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons
          name="map-marker"
          size={24}
          color="black"
          style={styles.gpsIcon}
        />
        <Text style={styles.addressHeader}>{address}</Text>
      </View>

      {/* Image Displayer */}
      <View style={styles.imageDisplayerContainer}>
        <ImageDisplayer
          images={images.map((image) => resolveAsset(image))}
          isLocal={true}
        />
      </View>

      {/* About Apartment */}
      <View style={styles.aboutContainer}>
        <Text style={styles.textHeader}> אודות הדירה </Text>
        <Text style={styles.text}>{aboutApartment}</Text>
      </View>

      {/* Tags */}
      <View style={styles.tagsContainer}>
        <SearchTags tags={tags} selectedTags={tags} />
      </View>

      {/* User Info */}
      <View style={styles.userContainer}>
        <UserDisplayer
          avatarSource={resolveAsset(user.image)}
          name={user.name}
          facebookLink={user.link}
        />
      </View>

      {/* Like and Dislike Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.dislikeButton]}
          onPress={() => console.log("Disliked")}
        >
          <MaterialCommunityIcons name="heart-broken" size={30} color="red" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.likeButton]}
          onPress={() => console.log("Liked")}
        >
          <MaterialCommunityIcons name="heart" size={30} color="#039912" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
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
});
export default SwipeScreen;
