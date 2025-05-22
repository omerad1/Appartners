import React, { useEffect, useState, useCallback } from "react";
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
import {getUserChatRooms, createChatRoomById} from "../../api/chat";
import {getUserDataFromStorage} from "../../api/user";
import { useSelector } from "react-redux";
import { registerSocketMessageHandler, isSocketConnected } from "../../api/socket";

const AllChatsScreen = () => {
  const [messages, setMessages] = useState([]);
  const currentUser = useSelector(state => state.user.currentUser);

  // Function to fetch chat rooms
  const fetchChatRooms = useCallback(async () => {
    try {
      const chatRooms = await getUserChatRooms();
      console.log("Fetched chat rooms:", JSON.stringify(chatRooms, null, 2));
      setMessages(chatRooms);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  }, []);

  // Initial fetch of chat rooms
  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);
  
  // Handle room updates from WebSocket
  const handleRoomUpdate = useCallback((room) => {
    console.log('Room update received in component:', room);
    // Update the specific room in the messages list
    setMessages(prevMessages => {
      // Check if the room already exists in our list
      const roomIndex = prevMessages.findIndex(msg => msg.id === room.id);
      if (roomIndex >= 0) {
        // Update existing room
        const updatedMessages = [...prevMessages];
        updatedMessages[roomIndex] = room;
        return updatedMessages;
      } else {
        // Add new room to the beginning of the list
        return [room, ...prevMessages];
      }
    });
  }, []);

  // Handle new message notifications
  const handleNewMessageNotification = useCallback((chatId, senderId, message) => {
    console.log(`New message notification in room ${chatId} from user ${senderId}`);
    // Refresh the chat rooms to get the updated list with new messages
    fetchChatRooms();
  }, [fetchChatRooms]);

  // Handle user presence updates
  const handleUserPresence = useCallback((userId, isOnline, roomId) => {
    console.log(`User ${userId} is ${isOnline ? 'online' : 'offline'} in room ${roomId || 'all rooms'}`);
    // You could update the UI to show online status if needed
  }, []);

  // Handle read receipts
  const handleReadReceipt = useCallback((messageIds, readerId, roomId) => {
    console.log(`Messages ${messageIds.join(', ')} were read by user ${readerId} in room ${roomId}`);
    // Update the messages to show read status
    if (readerId !== currentUser?.id) {
      setMessages(prevMessages => {
        return prevMessages.map(room => {
          if (room.id === roomId) {
            return {
              ...room,
              last_message_read_at: new Date().toISOString()
            };
          }
          return room;
        });
      });
    }
  }, [currentUser]);

  // Register WebSocket message handlers
  useEffect(() => {
    // Only register handlers if we have a current user
    if (!currentUser) return;

    console.log('Registering WebSocket message handlers');
    
    // Register handlers for different message types
    const unregisterRoomUpdate = registerSocketMessageHandler('room_update', handleRoomUpdate);
    const unregisterMessageNotification = registerSocketMessageHandler('chat.message.notification', handleNewMessageNotification);
    const unregisterUserPresence = registerSocketMessageHandler('user_presence', handleUserPresence);
    const unregisterReadReceipt = registerSocketMessageHandler('read_receipt', handleReadReceipt);
    
    // Clean up handlers when component unmounts
    return () => {
      unregisterRoomUpdate();
      unregisterMessageNotification();
      unregisterUserPresence();
      unregisterReadReceipt();
      console.log('WebSocket message handlers unregistered');
    };
  }, [currentUser, handleRoomUpdate, handleNewMessageNotification, handleUserPresence, handleReadReceipt]);
  
  // Log socket connection status
  useEffect(() => {
    try {
      const socketStatus = isSocketConnected();
      console.log('Socket connection status:', socketStatus ? 'Connected' : 'Disconnected');
    } catch (error) {
      console.error('Error checking socket connection status:', error);
    }
    
    // Check connection status periodically
    const intervalId = setInterval(() => {
      try {
        const status = isSocketConnected();
        if (!status) {
          console.log('Socket disconnected, messages may not update in real-time');
        }
      } catch (error) {
        console.error('Error in periodic socket status check:', error);
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);
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
              {messages.map((room) => {
                // Defensive: ensure participants is an array
                if (!room.participants || !Array.isArray(room.participants)) {
                  console.error('Room missing participants:', room);
                  return null;
                }
                
                // Find the other participant (not the current user)
                const otherParticipant = currentUser ? 
                  room.participants.find(p => p.id !== currentUser.id) : room.participants[0];
                
                // Get participant name or default to "Unknown User"
                const participantName = otherParticipant ? 
                  `${otherParticipant.first_name} ${otherParticipant.last_name}` : 'Unknown User';
                
                // Get the last message content or default to "New match created"
                const lastMessageContent = room.last_message && room.last_message.content ? 
                  room.last_message.content : 'New match created';
                
                return (
                  <TouchableOpacity
                    key={room.id}
                    style={styles.messageItem}
                    onPress={() => console.log(`Opening chat with ${participantName}`)}
                    onLongPress={() => onLongPressChat(room.id, participantName)}
                  >
                    {/* Avatar - use participant's image if available */}
                    <Avatar.Image
                      size={50}
                      source={{ uri: otherParticipant?.profile_image || 'https://via.placeholder.com/50' }}
                      style={styles.messageAvatar}
                    />

                    {/* Chat Content */}
                    <View style={styles.messageContent}>
                      <View style={styles.nameContainer}>
                        <Text style={styles.messageName}>{participantName}</Text>
                        
                        {/* Add checkmarks if the last message was sent by the current user */}
                        {room.was_last_message_sent_by_me && room.last_message && (
                          <Text style={[styles.checkmarks, room.last_message_read_at ? styles.read : styles.delivered]}>
                            ✓✓
                          </Text>
                        )}
                      </View>
                      
                      <Text style={styles.messageText} numberOfLines={1}>
                        {lastMessageContent}
                      </Text>
                    </View>

                    {/* Unread Badge */}
                    {room.unread_count > 0 && (
                      <Badge style={styles.unreadBadge}>{room.unread_count}</Badge>
                    )}

                    {/* House Icon */}
                    <IconButton
                      icon="home-outline"
                      size={24}
                      onPress={() =>
                        console.log(`Viewing apartment of ${participantName}`)
                      }
                      style={styles.houseIcon}
                    />
                  </TouchableOpacity>
                );
              })}
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
  logo: {
    width: 121,
    height: 121,
    resizeMode: "contain",
  },
  chatContainer: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent background
    borderWidth: 2,
    borderColor: "#333", // Dark border color
    borderRadius: 10,
    padding: 10,
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
  messageContent: {
    flex: 1,
    marginRight: 10, // Add margin between the avatar and text
  },
  nameContainer: {
    flexDirection: 'row-reverse', // Right to left for Hebrew
    alignItems: 'center',
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
  checkmarks: {
    fontSize: 12,
    marginRight: 5, // Changed from marginLeft for RTL layout
    fontWeight: 'bold',
  },
  read: {
    color: '#3498db', // Blue for read messages
  },
  delivered: {
    color: '#95a5a6', // Gray for delivered but unread messages
  },
});
