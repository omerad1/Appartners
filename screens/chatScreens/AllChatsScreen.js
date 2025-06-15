import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  Text as RNText,
  ActivityIndicator,
} from "react-native";
import { Avatar, Text, Badge, IconButton } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Title from "../../components/general/Title";
import BackgroundImage from "../../components/layouts/BackgroundImage";
import {getUserChatRooms} from "../../api/chat";
import { useSelector } from "react-redux";
import { registerSocketMessageHandler, isSocketConnected } from "../../api/socket";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { deleteChatRoom } from "../../api/chat";
import ModalApartmentDisplayer from "../../components/apartmentsComp/ModalApartmentDisplayer";


const AllChatsScreen = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [apartmentModalVisible, setApartmentModalVisible] = useState(false);
  const currentUser = useSelector(state => state.user.currentUser);
  const navigation = useNavigation();

  // Function to fetch chat rooms
  const fetchChatRooms = useCallback(async () => {
    try {
      const chatRooms = await getUserChatRooms();
      console.log(JSON.stringify(chatRooms[0], null, 2))
      setMessages(prevMessages => {
        // Avoid re-setting if nothing changed
        const newJson = JSON.stringify(chatRooms);
        const oldJson = JSON.stringify(prevMessages);
  
        if (newJson !== oldJson) {
          return chatRooms;
        }
        return prevMessages; // No update needed
      });
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
      setIsLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms])
  // Force re-render when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('AllChatsScreen focused - refreshing chat list');
      setIsLoading(true);
      fetchChatRooms();
      
      return () => {
        console.log('AllChatsScreen unfocused');
      };
    }, [fetchChatRooms])
  );
  
  // Handle room updates from WebSocket
  const handleRoomUpdate = useCallback((room) => {
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

  const handleDelete = async (id) => {
    try {
      await deleteChatRoom(id);
      // Fetch updated chat rooms after successful deletion
      fetchChatRooms();
    } catch (error) {
      console.log('Error deleting chat room:', error);
      Alert.alert('Error', 'Failed to delete chat room. Please try again.');
    }
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

  // Navigate to chat screen with the selected room
  const navigateToChat = (room) => {
    // Find the other participant (not the current user)
    const otherParticipant = currentUser ? 
      room.participants.find(p => p.id !== currentUser.id) : room.participants[0];
    // Navigate to chat screen with room data
    navigation.navigate('ChatScreen', { 
      roomId: room.id,
      otherParticipant: otherParticipant,
      match: room.compatibility_score,
    });
    
    // If there are unread messages, they will be marked as read in the ChatScreen
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'אתמול';
    } else {
      return date.toLocaleDateString('he-IL', { day: 'numeric', month: 'numeric' });
    }
  };

  return (
    <BackgroundImage>
        <View style={styles.container}>
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Title style={styles.title}>Chats</Title>
              
            </View>
          </View>

          {/* Chat Container */}
          <View style={styles.chatContainer}>
              <View style={styles.subtitleContainer}>
                <Badge style={styles.chatCountBadge}>{messages.length} {" "}
                  <Text style={styles.subtitleText}>
                  {messages.length === 1 ? 'Active chat' : 'Active chats'}
                </Text>
                </Badge>
              </View>
            {isLoading ? (
              <View style={styles.emptyStateContainer}>
                  <ActivityIndicator 
                    size="large" 
                    color="#8B4513" 
                    style={styles.loadingSpinner}
                  />
                <Text style={styles.emptyTitle}>Loading chats...</Text>
              </View>
            ) : messages.length === 0 ? (
              <View style={styles.emptyStateContainer}>
                <LinearGradient
                  colors={['rgba(255, 223, 110, 0.9)', 'rgba(255, 193, 50, 0.8)']}
                  style={styles.emptyIconContainer}
                >
                  <RNText style={styles.emptyIcon}>💭</RNText>
                </LinearGradient>
                <Text style={styles.emptyTitle}>There are no chats available</Text>
                <Text style={styles.emptySubtitle}>
                  New chats will be displayed here
                </Text>
              </View>
            ) : (
              <ScrollView 
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
              >
                {messages.map((room, index) => {
                  // Defensive: ensure participants is an array
                  if (!room.participants || !Array.isArray(room.participants)) {
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
                  
                  const isLastItem = index === messages.length - 1;
                  
                  return (
                    <TouchableOpacity
                      key={room.id}
                      style={[styles.chatItem, isLastItem && styles.lastChatItem]}
                      onPress={() => navigateToChat(room)}
                      onLongPress={() => onLongPressChat(room.id, participantName)}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={room.unread_count > 0 ? 
                          ['rgba(255, 223, 110, 0.95)', 'rgba(255, 193, 50, 0.85)'] : 
                          ['rgba(255, 255, 255, 0.95)', 'rgba(255, 248, 220, 0.8)']
                        }
                        style={styles.chatItemGradient}
                      >
  
                        {/* Avatar with online indicator */}
                        <View style={styles.avatarContainer}>
                          {otherParticipant?.photo_url ? (
                            <Avatar.Image
                              size={48}
                              source={{ uri: otherParticipant.photo_url }}
                              style={styles.avatar}
                            />
                          ) : (
                            <Avatar.Text
                              size={48}
                              label={`${otherParticipant?.first_name?.[0] ?? ''}${otherParticipant?.last_name?.[0] ?? ''}`.toUpperCase()}
                              style={[styles.avatar, styles.avatarText]}
                              labelStyle={styles.avatarLabel}
                            />
                          )}
                          {/* Online indicator like in ChatScreen */}
                        </View>
                        

                        {/* Chat Content */}
                        <View style={styles.chatContent}>
                          <View style={styles.chatHeader}>
                            <Text style={styles.participantName} numberOfLines={1}>
                              {participantName}
                            </Text>
                            <View style={styles.timeAndStatus}>
                              <Text style={styles.timeText}>
                                {formatTime(room.last_message?.created_at)}
                              </Text>
                            </View>
                          </View>

                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              
                            <Text
                              style={[
                                styles.lastMessage,
                                room.unread_count > 0 && styles.unreadMessage,
                                { flex: 1 } // Let it fill available space and truncate
                              ]}
                              numberOfLines={1}
                            >
                              {lastMessageContent}
                            </Text>
                            {room.was_last_message_sent_by_me && room.last_message && (
                              <View style={{ flexShrink: 0, marginRight: 5 }}>
                                <Ionicons 
                                  name="checkmark-done" 
                                  size={16} 
                                  style={[
                                    styles.checkmarks,
                                    room.last_message_read_at ? styles.read : styles.delivered
                                  ]} 
                                />
                              </View>
                            )}
                          </View>
                        </View>


                        {/* Right side with badge */}
                        <View style={styles.rightSection}>
                          {/* Unread Badge */}
                          {room.unread_count > 0 && (
                            <View style={styles.badgeContainer}>
                              <View style={styles.unreadBadge}>
                                <Text style={styles.badgeText}>
                                  {room.unread_count > 99 ? '99+' : room.unread_count}
                                </Text>
                              </View>
                            </View>
                          )}
                        </View>
                        {/* House Icon to open apartment modal */}
                        {room.connected_apartment && (
                          <IconButton
                            icon="home"
                            size={24}
                            iconColor="#8B4513"
                            style={styles.houseIconButton}
                            onPress={() => {
                              setSelectedApartment(room.connected_apartment);
                              setApartmentModalVisible(true);
                            }}
                          />
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
        
        {/* Apartment Modal */}
        <ModalApartmentDisplayer
          visible={apartmentModalVisible}
          onClose={() => setApartmentModalVisible(false)}
          apartment={selectedApartment}
        />
    </BackgroundImage>
  );
};

export default AllChatsScreen;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    shadowColor: '#F39C12',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  titleContainer: {
    alignItems: 'center',
    marginTop: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#B7860B',
    textShadowColor: 'rgba(255, 223, 110, 0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  subtitleContainer: {
    flexDirection: 'row', // ← changed from 'column'
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginTop: 15,
    marginBottom: 10,
  },
  
  chatCountBadge: {
    backgroundColor: 'rgba(160, 82, 45, 0.15)',
    color: '#8B4513', 
    fontSize: 17,
    fontWeight: 'bold',
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  subtitleText: {
    fontSize: 17,
    color: '#A0522D',
    fontWeight: '500',
    textAlign: 'center',
  },
  chatContainer: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    backgroundColor: 'rgba(255, 248, 220, 0.85)',
    margin: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 12,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: '#F39C12',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  emptyIcon: {
    fontSize: 52,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B7860B',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(255, 223, 110, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  emptySubtitle: {
    fontSize: 17,
    color: '#CD853F',
    textAlign: 'center',
    lineHeight: 26,
    fontWeight: '500',
  },
  chatItem: {
    marginHorizontal: 12,
    marginVertical: 3,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  lastChatItem: {
    marginBottom: 8,
  },
  chatItemGradient: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    shadowColor: '#F39C12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarText: {
    backgroundColor: '#4A90E2',
  },
  avatarLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#32D74B',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineIndicatorInner: {
    display: 'none',
  },
  chatContent: {
    flex: 1,
    marginRight: 12,
  },
  chatHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  participantName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#8B4513',
    flex: 1,
    textAlign: 'right',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
  timeAndStatus: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  checkmarks: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  read: {
    color: 'rgba(56, 69, 248, 0.85)',
  },
  delivered: {
    color: '#BDC3C7',
  },
  timeText: {
    fontSize: 13,
    color: '#A0522D',
    fontWeight: '600',
  },
  lastMessage: {
    fontSize: 14,
    color: '#A0522D',
    textAlign: 'right',
    lineHeight: 18,
    fontWeight: '500',
  },
  unreadMessage: {
    color: '#8B4513',
    fontWeight: '700',
  },
  rightSection: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    position: 'relative',
  },
  badgeContainer: {
    position: 'absolute',
    top: -8,
    right: -8,
    zIndex: 1,
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 7,
    backgroundColor: 'rgba(230, 126, 34, 0.85)',
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
  },
  houseIconButton: {
    margin: 0,
    padding: 0,
    backgroundColor: 'transparent',
  },
  loadingSpinner: {
    transform: [{ scale: 1.5 }],
    marginBottom: 7
  }
});