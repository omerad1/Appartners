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

const UserDisplayer = ({ avatarSource, name, facebookLink, bio, onPress }) => {
  return (
    <TouchableOpacity style={styles.outerContainer} onPress={onPress}>
      <View style={styles.container}>
        {/* Text Section */}
        <View style={styles.textContainer}>
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
          {bio && (
            <Text style={styles.bioText} numberOfLines={3} ellipsizeMode="tail">
              {bio}
            </Text>
          )}
        </View>

        {/* Avatar Section */}
        <Avatar.Image
          size={80}
          source={typeof avatarSource === 'string' ? { uri: avatarSource } : avatarSource}
          style={styles.avatar}
        />
      </View>
    </TouchableOpacity>
  );
};

export default UserDisplayer;

const styles = StyleSheet.create({
  outerContainer: {
    marginVertical: 8,
    marginHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
    alignItems: "flex-end",
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  facebookContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  facebookIcon: {
    marginRight: 5,
  },
  facebookText: {
    fontSize: 14,
    color: "#4267B2",
    textDecorationLine: "underline",
  },
  bioText: {
    fontSize: 15,
    color: "#555",
    textAlign: "right",
    marginTop: 8,
    lineHeight: 20,
  },
  avatar: {
    backgroundColor: "#f0f0f0", // Fallback background color for avatar
  },
});
