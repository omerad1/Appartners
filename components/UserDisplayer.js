import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Linking,
} from "react-native";
import { Avatar } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const UserDisplayer = ({ avatarSource, name, facebookLink }) => {
  return (
    <View style={styles.container}>
      {/* Text Section */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Apartment poster</Text>
        <Text style={styles.name}>{name}</Text>
        <TouchableOpacity onPress={() => Linking.openURL(facebookLink)}>
          <View style={styles.facebookContainer}>
            <MaterialCommunityIcons
              name="facebook"
              size={20}
              color="#4267B2"
              style={styles.facebookIcon}
            />
            <Text style={styles.facebookText}>Facebook link</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Avatar Section */}
      <Avatar.Image size={80} source={avatarSource} style={styles.avatar} />
    </View>
  );
};

export default UserDisplayer;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFEBCD", // Light beige background
    padding: 10,
    borderRadius: 10,
    elevation: 8,
  },
  textContainer: {
    flex: 1,
    marginRight: 10,
    alignItems: "flex-end",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  facebookContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  facebookIcon: {
    marginRight: 5,
  },
  facebookText: {
    fontSize: 14,
    color: "#4267B2",
    textDecorationLine: "underline",
  },
  avatar: {
    backgroundColor: "#f0f0f0", // Fallback background color for avatar
  },
});
