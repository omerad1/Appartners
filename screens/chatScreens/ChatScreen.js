import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MaterialCommunityIcons, FontAwesome } from "@expo/vector-icons";
import BackgroundImage from "../../components/BackgroundImage";

// Default user image
const defaultUserImage = require("../../assets/placeholders/default-user-image.jpg");

// Mock responses for fun chat interactions
const MOCK_RESPONSES = [
  "I'd be happy to show you the apartment!",
  "When would you like to schedule a viewing?",
  "The apartment is still available!",
  "Yes, pets are allowed in the building 🐶",
  "The neighbors are very friendly and quiet.",
  "Internet and water are included in the rent.",
  "Sure, I can send you more photos!",
  "I've been living in this area for 5 years, it's great!",
  "There's a grocery store just around the corner.",
  "Public transportation is very convenient from here.",
  "Feel free to ask me any other questions!",
  "The apartment was renovated last year.",
  "Yes, there's parking available for residents.",
];

const MOCK_GREETINGS = [
  "Hi there! Thanks for your interest in my apartment.",
  "Hello! I'm glad you like my apartment listing.",
  "Hey! I'm happy to answer any questions about the place.",
  "Hi! Thanks for reaching out about the apartment.",
];

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { owner, apartmentId, apartmentAddress } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef(null);
  const typingDots = useRef(new Animated.Value(0)).current;

  // Current user - you
  const currentUser = {
    id: "currentUser",
    name: "You",
  };

  // Owner from params
  const ownerUser = {
    id: "owner",
    name: owner?.first_name
      ? `${owner.first_name} ${owner.last_name || ""}`
      : "Apartment Owner",
    photoUrl: owner?.photo_url,
    occupation: owner?.occupation || "Property Owner",
  };

  useEffect(() => {
    // Set up the navigation title
    navigation.setOptions({
      title: ownerUser.name,
    });

    // Add initial greeting message with delay
    setTimeout(() => {
      const greeting =
        MOCK_GREETINGS[Math.floor(Math.random() * MOCK_GREETINGS.length)];
      addNewMessage(greeting, ownerUser.id);
    }, 1000);
  }, []);

  useEffect(() => {
    // Animate typing dots
    Animated.loop(
      Animated.timing(typingDots, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: false,
      })
    ).start();
  }, []);

  const addNewMessage = (text, senderId) => {
    const message = {
      id: Date.now().toString(),
      text,
      senderId,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Add user message
      addNewMessage(newMessage, currentUser.id);
      setNewMessage("");

      // Simulate owner typing
      setIsTyping(true);

      // Random response delay between 1-3 seconds
      const responseDelay = Math.floor(Math.random() * 2000) + 1000;

      // Simulate owner response
      setTimeout(() => {
        setIsTyping(false);
        const randomResponse =
          MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
        addNewMessage(randomResponse, ownerUser.id);
      }, responseDelay);
    }
  };

  const renderMessage = ({ item }) => {
    const isSentByMe = item.senderId === currentUser.id;
    const messageTime = new Date(item.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        style={[
          styles.messageContainer,
          isSentByMe ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        {!isSentByMe && (
          <Image
            source={
              ownerUser.photoUrl
                ? { uri: ownerUser.photoUrl }
                : defaultUserImage
            }
            style={styles.avatar}
          />
        )}

        <View
          style={[
            styles.messageContent,
            isSentByMe
              ? styles.sentMessageContent
              : styles.receivedMessageContent,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isSentByMe ? styles.sentMessageText : styles.receivedMessageText,
            ]}
          >
            {item.text}
          </Text>
          <Text
            style={[
              styles.timestamp,
              isSentByMe ? styles.sentTimestamp : styles.receivedTimestamp,
            ]}
          >
            {messageTime}
          </Text>
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    const translateY = typingDots.interpolate({
      inputRange: [0, 0.3, 0.6, 1],
      outputRange: [0, -5, 0, 0],
    });

    return (
      <View style={styles.typingContainer}>
        <Image
          source={
            ownerUser.photoUrl ? { uri: ownerUser.photoUrl } : defaultUserImage
          }
          style={styles.typingAvatar}
        />
        <View style={styles.typingBubble}>
          <Animated.View style={{ flexDirection: "row" }}>
            <Animated.Text
              style={[
                styles.typingDot,
                {
                  transform: [
                    {
                      translateY: typingDots.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, -4, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              ●
            </Animated.Text>
            <Animated.Text
              style={[
                styles.typingDot,
                {
                  transform: [
                    {
                      translateY: typingDots.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, -5, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              ●
            </Animated.Text>
            <Animated.Text
              style={[
                styles.typingDot,
                {
                  transform: [
                    {
                      translateY: typingDots.interpolate({
                        inputRange: [0, 0.5, 1],
                        outputRange: [0, -6, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              ●
            </Animated.Text>
          </Animated.View>
        </View>
      </View>
    );
  };

  return (
    <BackgroundImage>
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.9)", "rgba(245, 245, 245, 0.8)"]}
        style={styles.container}
      >
        {/* Chat Header with Apartment Details */}
        <View style={styles.header}>
          <View style={styles.headerContainer}>
            <View style={styles.avatarContainer}>
              <Image
                source={
                  ownerUser.photoUrl
                    ? { uri: ownerUser.photoUrl }
                    : defaultUserImage
                }
                style={styles.headerAvatar}
              />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>{ownerUser.name}</Text>
              <Text style={styles.headerSubtitle}>{ownerUser.occupation}</Text>
            </View>
          </View>
          <LinearGradient
            colors={["#8B4513", "#A0522D"]}
            style={styles.apartmentBadge}
          >
            <MaterialCommunityIcons name="home" size={16} color="#FFF" />
            <Text style={styles.apartmentAddress}>
              {apartmentAddress || "Apartment Chat"}
            </Text>
          </LinearGradient>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.emptyChat}>
              <MaterialCommunityIcons name="chat" size={60} color="#8B4513" />
              <Text style={styles.emptyText}>
                Send a message to start chatting
              </Text>
            </View>
          }
          ListFooterComponent={renderTypingIndicator}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={newMessage}
              onChangeText={setNewMessage}
              placeholder="Type a message..."
              multiline
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendMessage}
              disabled={!newMessage.trim()}
            >
              <LinearGradient
                colors={["#8B4513", "#A0522D"]}
                style={[
                  styles.sendButtonGradient,
                  !newMessage.trim() && styles.sendButtonDisabled,
                ]}
              >
                <Ionicons name="send" size={20} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </BackgroundImage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
  },
  header: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatarContainer: {
    borderWidth: 2,
    borderColor: "#8B4513",
    borderRadius: 25,
    padding: 2,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  headerTextContainer: {
    marginLeft: 10,
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: "comfortaaBold",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: "comfortaa",
    color: "#666",
  },
  apartmentBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  apartmentAddress: {
    color: "#FFF",
    marginLeft: 5,
    fontSize: 12,
    fontFamily: "comfortaaRegular",
  },
  messagesList: {
    padding: 15,
    paddingBottom: 30,
  },
  emptyChat: {
    alignItems: "center",
    justifyContent: "center",
    padding: 50,
    opacity: 0.7,
  },
  emptyText: {
    marginTop: 10,
    color: "#8B4513",
    fontFamily: "comfortaaRegular",
    textAlign: "center",
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 5,
    maxWidth: "80%",
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    alignSelf: "flex-end",
    marginBottom: 15,
  },
  messageContent: {
    borderRadius: 20,
    padding: 12,
  },
  sentMessage: {
    alignSelf: "flex-end",
    marginLeft: "auto",
  },
  sentMessageContent: {
    backgroundColor: "#8B4513",
    borderTopRightRadius: 5,
  },
  receivedMessage: {
    alignSelf: "flex-start",
  },
  receivedMessageContent: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderTopLeftRadius: 5,
  },
  messageText: {
    fontSize: 16,
    fontFamily: "comfortaaRegular",
    lineHeight: 22,
  },
  sentMessageText: {
    color: "#fff",
  },
  receivedMessageText: {
    color: "#333",
  },
  timestamp: {
    fontSize: 11,
    marginTop: 4,
  },
  sentTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
    alignSelf: "flex-end",
  },
  receivedTimestamp: {
    color: "#888",
    alignSelf: "flex-end",
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginVertical: 5,
  },
  typingAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  typingBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 20,
    padding: 12,
    paddingHorizontal: 18,
    flexDirection: "row",
  },
  typingDot: {
    fontSize: 10,
    color: "#8B4513",
    marginHorizontal: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    fontFamily: "comfortaaRegular",
    borderWidth: 1,
    borderColor: "rgba(139, 69, 19, 0.3)",
  },
  sendButton: {
    overflow: "hidden",
    borderRadius: 20,
  },
  sendButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});

export default ChatScreen;
