import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { Avatar, Text, Badge, IconButton } from "react-native-paper";
import Title from "../../components/Title"; // Import your custom Title component
import BackgroundImage from "../../components/BackgroundImage";
const AllChatsScreen = () => {
  // Fictive chat data in Hebrew
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: "לופי",
      image:
        "https://static1.cbrimages.com/wordpress/wp-content/uploads/2019/09/One-Piece-Monkey-D.-Luffy-Cropped.jpg?q=50&fit=crop&w=1140&h=&dpr=1.5",
      text: "אני טס לאיטליה הערב...",
      isUnread: true,
    },
    {
      id: 2,
      name: "זורו",
      image:
        "https://i0.wp.com/spellmana.com/wp-content/uploads/2024/07/roronoa-zoro-deck-guide.webp?fit=768%2C429&ssl=1",
      text: "איך את מכירה את יונתן?",
      isUnread: false,
    },
    {
      id: 3,
      name: "נאמי",
      image:
        "https://static.wikia.nocookie.net/fairypirates/images/d/dd/Nami.png/revision/latest/scale-to-width-down/250?cb=20161022095010",
      text: "כן! אני פנויה להיפגש בראשון...",
      isUnread: true,
    },
    {
      id: 4,
      name: "רובין",
      image:
        "https://static1.cbrimages.com/wordpress/wp-content/uploads/2024/09/nico-robin-and-poneglyph.jpg",
      text: "אני אוהבת את בית הקפה ההוא",
      isUnread: false,
    },
    {
      id: 5,
      name: "פראנקי",
      image:
        "https://staticg.sportskeeda.com/editor/2023/05/50b87-16836967920057-1920.jpg?w=640",
      text: "הכלב שלך כל כך חמוד",
      isUnread: false,
    },
  ]);

  const handleDelete = (id) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message.id !== id)
    );
  };

  const onLongPressChat = (id, name) => {
    Alert.alert(
      `Delete Chat with ${name}?`,
      "This will remove the chat from the list.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDelete(id),
        },
      ]
    );
  };

  return (
    <BackgroundImage>
      <View style={styles.container}>
        {/* Icon and Title */}
        <View style={styles.iconAndTitle}>
          <Image
            source={require("../../assets/icons/logo.png")}
            style={styles.logo}
          />
          <Title>צ'אטים</Title>
        </View>

        {/* Transparent Chat Container */}
        <View style={styles.chatContainer}>
          {/* Chat List or No Active Chats Message */}
          {messages.length === 0 ? (
            <View style={styles.noChatsContainer}>
              <Text style={styles.noChatsText}>אין צ'אטים פעילים</Text>
            </View>
          ) : (
            <ScrollView>
              {messages.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.messageItem}
                  onPress={() => console.log(`Opening chat with ${item.name}`)}
                  onLongPress={() => onLongPressChat(item.id, item.name)}
                >
                  {/* Avatar */}
                  <Avatar.Image
                    size={50}
                    source={{ uri: item.image }}
                    style={styles.messageAvatar}
                  />

                  {/* Chat Content */}
                  <View style={styles.messageContent}>
                    <Text style={styles.messageName}>{item.name}</Text>
                    <Text style={styles.messageText} numberOfLines={1}>
                      {item.text}
                    </Text>
                  </View>

                  {/* Unread Badge */}
                  {item.isUnread && <Badge style={styles.unreadBadge} />}

                  {/* House Icon */}
                  <IconButton
                    icon="home-outline"
                    size={24}
                    onPress={() =>
                      console.log(`Viewing apartment of ${item.name}`)
                    }
                    style={styles.houseIcon}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </BackgroundImage>
  );
};

export default AllChatsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 50,
  },
  iconAndTitle: {
    flexDirection: "column",
    alignContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  noChatsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noChatsText: {
    fontSize: 18,
    color: "gray",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
    borderWidth: 2,
    borderColor: "#333", // Dark border color
    borderRadius: 10,
    padding: 10,
  },
  messageItem: {
    flexDirection: "row-reverse", // Align items from right to left
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333", // Dark border color
  },
  messageAvatar: {
    backgroundColor: "#f0f0f0",
  },
  logo: {
    width: 121,
    height: 121,
    resizeMode: "contain",
  },
  messageContent: {
    flex: 1,
    marginRight: 10, // Add margin between the avatar and text
  },
  messageName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    textAlign: "right", // Align text to the right
  },
  messageText: {
    fontSize: 14,
    color: "#666",
    textAlign: "right", // Align text to the right
  },
  unreadBadge: {
    backgroundColor: "#FF5864",
    position: "absolute",
    left: 5,
    top: 5,
  },
  houseIcon: {
    marginLeft: 10,
  },
});
