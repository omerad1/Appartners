import React, { useState, useEffect, useCallback, useRef, useLayoutEffect, useMemo } from 'react';
import {
  initializeChatSocket,
  disconnectChatSocket,
  getChatSocket,
  isChatSocketConnected,
} from '../../api/socket';import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  SafeAreaView,
  Image,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Animated } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { getRoomMessages, markMessagesAsRead, sendMessage as sendApiMessage, deleteChatRoom } from '../../api/chat'; // Renamed sendMessage to avoid conflict
import UserDisplayerModal from '../../components/userProfileComp/UserDisplayerModal';

// Store WebSocket connections by roomId
const isHebrew = (text) => /[\u0590-\u05FF]/.test(text);

const ChatScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { roomId, otherParticipant: initialOtherParticipant, roomDetails: initialRoomDetails, match: compatibility_score  } = route.params || {};
  // Debug log to check what's being passed in route params
  const currentUser = useSelector((state) => state.user.currentUser);
  // State for UserDisplayerModal
  const [userModalVisible, setUserModalVisible] = useState(false);

  // Use the otherParticipant from route params or extract from roomDetails if needed
  const [otherParticipant, setOtherParticipant] = useState(initialOtherParticipant || null);
  
  // If otherParticipant wasn't passed directly, try to extract it from roomDetails
  useEffect(() => {
    if (!otherParticipant && initialRoomDetails?.participants && currentUser) {
      // Find the participant that is not the current user
      const other = initialRoomDetails.participants.find(
        p => p.user_id !== currentUser.id || p.id !== currentUser.id
      );
      if (other) {
        setOtherParticipant(other);
      }
    }
  }, [initialRoomDetails, currentUser, otherParticipant]);

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showPopover, setShowPopover] = useState(false);

  const flatListRef = useRef(null);
  const typingDots = useRef(new Animated.Value(0)).current;

  const userDisplayerModalData = useMemo(() => {
    if (!otherParticipant || !currentUser) return null;
  
    return {
      name: `${otherParticipant.first_name} ${otherParticipant.last_name}`,
      profile_image: otherParticipant.photo_url,
      bio: otherParticipant.bio,
      age: otherParticipant.age || null, 
      occupation: otherParticipant.occupation || null,
      compatibility_score: compatibility_score || null,
      questionnaire_responses: otherParticipant.questionnaire_responses || [],
      liked_apartment: {
        user_details: {
          questionnaire_responses: currentUser.questionnaire_responses || [],
        },
      },
    };
  }, [otherParticipant, currentUser]);
  
  useEffect(() => {
    
  })

  // --- Header Customization ---
  useLayoutEffect(() => {
    
    navigation.setOptions({
      headerShown: true,
      headerTitle: () => (
        <View style={styles.headerTitleContainer}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerName}>{otherParticipant?.first_name || 'Chat'}</Text>
          </View>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => setUserModalVisible(true)}
          >
            {otherParticipant?.photo_url ? (
              <Image source={{ uri: otherParticipant.photo_url }} style={styles.headerAvatar} />
            ) : (
              <View style={styles.defaultAvatarContainer}>
                <Text style={styles.defaultAvatarText}>
                  {(otherParticipant?.first_name || 'U').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
          <View style={styles.headerButtonContainer}>
            <Ionicons name="chevron-back" size={26} color="rgba(78, 56, 0, 0.91)" />
          </View>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => setShowPopover(true)} 
          style={styles.headerButton}
        >
          <View style={styles.headerButtonContainer}>
            <Ionicons name="ellipsis-horizontal" size={24} color="rgba(78, 56, 0, 0.91)" />
          </View>
        </TouchableOpacity>
      ),
      headerTitleAlign: 'center',
      headerStyle: {
        backgroundColor: '#FFFFFF',
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0.5,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        height: 100,
      },
    });
  }, [navigation, otherParticipant]);

  /**
   * Marks messages as read via WebSocket
   * @param {Array} messageIds - IDs of messages to mark as read
   */
  const markMessagesAsReadViaSocket = useCallback((messageIds) => {
    if (!roomId || !messageIds.length) {
      return;
    }

    const chatSocket = getChatSocket(roomId);
    if (!chatSocket || chatSocket.readyState !== WebSocket.OPEN) {
      console.log('Cannot mark messages as read: socket not connected');
      return;
    }

    // Send read receipt via WebSocket
    chatSocket.send(JSON.stringify({
      type: 'mark_read',
      message_ids: messageIds
    }));
  }, [roomId]);

  // Direct WebSocket connection for this chat room
  useEffect(() => {
    let socket;
    
    const connectSocket = async () => {
      if (!roomId || !currentUser?.id) return;
    
      socket = await initializeChatSocket(roomId);
    
      if (socket) {
        // Handle incoming messages
        socket.registerMessageHandler('chat_message', (data) => {
          const messagePayload = data.message || data;
          const messageId = messagePayload.id;
          setMessages((prevMessages) => {
            // Find any temporary message that matches this confirmed message
            const tempMessage = prevMessages.find(
              (m) => m.isLocalSending && m.content === messagePayload.content
            );

            if (tempMessage) {
              console.log('Updating temp message with confirmed message');
              return prevMessages.map((m) =>
                m.id === tempMessage.id
                  ? {
                      ...m, // Keep existing message properties
                      ...messagePayload, // Add server properties
                      id: messagePayload.id, // Use server ID
                      isLocalSending: false,
                      error: undefined,
                      sender: messagePayload.sender || m.sender,
                    }
                  : m
              );
            }

            if (!prevMessages.find((m) => m.id === messageId)) {
              console.log('Adding new message from socket');
              return [...prevMessages, messagePayload];
            }

            return prevMessages;
          });
        });

        // Handle user entered notification
        socket.registerMessageHandler('chat.user.entered', (data) => {
          console.log('User entered chat:', data);
          // If the other participant entered the chat, mark our messages as read
          if (data.user_id && data.user_id !== currentUser?.id) {
            // Find unread messages sent by current user
            const unreadMessageIds = messages
              .filter(msg => 
                msg.sender?.id === currentUser?.id && // Message sent by current user
                !msg.read_at // Message not read yet
              )
              .map(msg => msg.id);
            
            if (unreadMessageIds.length > 0) {
              markMessagesAsReadViaSocket(unreadMessageIds);
            }
          }
        });

        // Handle read receipts
        socket.registerMessageHandler('read_receipt', (data) => {
          console.log('Read receipt received:', data);
          if (data.message_ids && data.reader_id !== currentUser?.id) {
            // Update messages with read status
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                data.message_ids.includes(msg.id) 
                  ? { ...msg, read_at: new Date().toISOString() }
                  : msg
              )
            );
          }
        });
      }
    };
    
    connectSocket();
    
    return () => {
      if (roomId) {
        disconnectChatSocket(roomId);
      }
    };
  }, [roomId, currentUser?.id, messages, markMessagesAsReadViaSocket]);
  

  // --- Fetching and Socket Logic ---
  const fetchMessages = useCallback(async () => {
    if (!roomId) return;
  
    try {
      const fetchedData = await getRoomMessages(roomId);
      const fetchedMessages = (fetchedData.results || fetchedData || [])
      
      // Preserve any pending messages that are still sending
      setMessages(prevMessages => {
        // Find any messages that are still in sending state
        const pendingMessages = prevMessages.filter(msg => msg.isLocalSending);
        
        // If we have pending messages, merge them with fetched messages
        if (pendingMessages.length > 0) {
          // Get all fetched message IDs to avoid duplicates
          const fetchedIds = new Set(fetchedMessages.map(msg => msg.id));
          
          // Only keep pending messages that haven't been confirmed by server yet
          const stillPendingMessages = pendingMessages.filter(msg => !fetchedIds.has(msg.id));
          
          // Return merged messages with pending ones at the end
          return [...fetchedMessages, ...stillPendingMessages];
        }
        
        return fetchedMessages;
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setIsLoading(false);
    }
  }, [roomId]);
  
  useEffect(() => {
    const loadInitial = async () => {
      if (!messages.length) { // Only show loading on initial load
        setIsLoading(true);
      }
      await fetchMessages();
      setIsLoading(false);
    };
    loadInitial();
  }, [fetchMessages, messages.length]);
  

  // Scroll to bottom when messages change or when loading completes
  useEffect(() => {
    if (flatListRef.current) {
      // Always scroll to bottom without animation when messages change
      flatListRef.current.scrollToEnd({ animated: false });
    }
  }, [messages]);
  
  // Also scroll to bottom when loading completes
  useEffect(() => {
    if (!isLoading && messages.length > 0 && flatListRef.current) {
      // Add a small delay to ensure rendering is complete
      setTimeout(() => {
        flatListRef.current.scrollToEnd({ animated: false });
      }, 0);
    }
  }, [isLoading]);

  useFocusEffect(
    useCallback(() => {
      // Only fetch if we don't have messages or if it's been a while since last fetch
      if (messages.length === 0) {
        fetchMessages();
      }
      
      // When the current user enters the chat, mark unread messages from the other user as read
      const markUnreadMessagesAsRead = async () => {
        if (!roomId || !currentUser?.id) return;
        
        // Find unread messages from the other participant
        const unreadMessageIds = messages
          .filter(msg => 
            msg.sender?.id !== currentUser?.id && // Not sent by current user
            !msg.read_at // Not read yet
          )
          .map(msg => msg.id);
        
        if (unreadMessageIds.length > 0) {
          try {
            // First try the API method
            await markMessagesAsRead(roomId, unreadMessageIds);
            
            // Update local state to reflect read status
            setMessages(prevMessages => 
              prevMessages.map(msg => 
                unreadMessageIds.includes(msg.id) 
                  ? { ...msg, read_at: new Date().toISOString() }
                  : msg
              )
            );
            
            // Also notify via WebSocket if available
            markMessagesAsReadViaSocket(unreadMessageIds);
          } catch (error) {
            console.error('Error marking messages as read:', error);
            // Fallback to WebSocket only if API fails
            markMessagesAsReadViaSocket(unreadMessageIds);
          }
        }
      };
      
      markUnreadMessagesAsRead();
      
      // Send user.entered notification via WebSocket
      const notifyUserEntered = () => {
        const chatSocket = getChatSocket(roomId);
        if (chatSocket && chatSocket.readyState === WebSocket.OPEN) {
          chatSocket.send(JSON.stringify({
            type: 'chat.user.entered',
            user_id: currentUser?.id,
            room_id: roomId
          }));
          console.log('Sent user.entered notification');
        }
      };
      
      // Small delay to ensure socket is connected
      setTimeout(notifyUserEntered, 500);
      
      // Scroll to bottom when screen is focused
      if (flatListRef.current && messages.length > 0) {
        setTimeout(() => {
          flatListRef.current.scrollToEnd({ animated: false });
        }, 100);
      }
      
      return () => {};
    }, [fetchMessages, roomId, currentUser?.id, messages, markMessagesAsReadViaSocket])
  );

  const handleSendMessage = async () => {
    if (inputText.trim() === '' || !currentUser?.id) return;

    const tempId = `temp-${Date.now()}`;
    const messageToSend = inputText;
    
    const optimisticMessage = {
      id: tempId,
      content: messageToSend,
      sender: {
        id: currentUser.id,
        user_id: currentUser.id, 
        first_name: currentUser.first_name,
        last_name: currentUser.last_name,
        photo_url: currentUser.photo_url,
        email: currentUser.email,
        phone_number: currentUser.phone_number
      },
      is_sender: true, // Add is_sender flag to match server format
      room: roomId,
      timestamp: new Date().toISOString(),
      isLocalSending: true, // Changed from is_sending to avoid collision with server properties
      _clientMessageId: tempId, // Add a client-side ID to help with matching later
    };

    // Add new message to the end of the array (for chronological order)
    setMessages(prevMessages => [...prevMessages, optimisticMessage]);
    setInputText('');

    // Try to send via WebSocket first
    const socket = getChatSocket(roomId);
    let messageSentSuccessfully = false;
    if (socket && socket.readyState === WebSocket.OPEN) {
      try {
        socket.send(JSON.stringify({
          type: 'chat_message',
          content: messageToSend,
        }));
        console.log('Message sent via WebSocket');
        messageSentSuccessfully = true;
      
        // Set a timeout to check if we received a WebSocket confirmation
        setTimeout(async () => {
          setMessages(prevMessages => {
            const messageStillSending = prevMessages.some(m => m.id === tempId && m.isLocalSending);
            
            if (messageStillSending) {
              console.log('No WebSocket confirmation received, using API fallback');
              (async () => {
                try {
                  const sentMessageFromServer = await sendApiMessage(otherParticipant?.id, messageToSend);
                  
                  // Update the message without causing a flicker
                  setMessages(prev => {
                    return prev.map(m =>
                      m.id === tempId ? { 
                        ...m, // Keep existing message properties
                        ...sentMessageFromServer, // Add server properties
                        id: sentMessageFromServer.id, // Use server ID
                        isLocalSending: false, 
                        error: undefined,
                        _clientMessageId: tempId // Keep the client ID for reference
                      } : m
                    );
                  });
                } catch (fallbackError) {
                  console.error('Error sending message via API fallback:', fallbackError);
                  setMessages(prev =>
                    prev.map(m =>
                      m.id === tempId ? { ...m, isLocalSending: false, error: true } : m
                    )
                  );
                }
              })();
            }
            
            return prevMessages;
          });
        }, 5000); // Reduced timeout for faster fallback
      } catch (socketError) {
        console.error('Error sending via WebSocket:', socketError);
        messageSentSuccessfully = false;
      
        // Attempt to reconnect the socket
        try {
          console.log('Attempting to reconnect socket...');
          await disconnectChatSocket(roomId); // ensure clean reconnect
          const newSocket = await initializeChatSocket(roomId);
      
          if (newSocket && newSocket.readyState === WebSocket.OPEN) {
            console.log('Socket reconnected successfully');
          } else {
            console.warn('Socket reconnect failed or is not open');
          }
        } catch (reconnectError) {
          console.error('Failed to reconnect socket:', reconnectError);
        }
      }

    }

    // If WebSocket failed or isn't available, use API immediately
    if (!messageSentSuccessfully) {
      try {
        const sentMessageFromServer = await sendApiMessage(otherParticipant?.id, messageToSend);
        
        setMessages(prev => {
          const messageExists = prev.some(m => m.id === tempId);
          
          if (messageExists) {
            return prev.map(m =>
              m.id === tempId ? { 
                ...m, // Keep existing message properties
                ...sentMessageFromServer, // Add server properties
                id: sentMessageFromServer.id, // Use server ID
                isLocalSending: false, 
                error: undefined,
                _clientMessageId: tempId // Keep the client ID for reference
              } : m
            );
          }
          
          return prev;
        });
      } catch (error) {
        console.error('Error sending message via API:', error);
        setMessages(prev =>
          prev.map(m =>
            m.id === tempId ? { ...m, isLocalSending: false, error: true } : m
          )
        );
      }
    }
  };
  const handleUnmatch = async () => {
    try {
      await deleteChatRoom(roomId);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting chat room:', error);
    }
  }
  const renderMessageItem = ({ item }) => {
    // Check both is_sender property and sender.id to determine if message is from current user
    const isCurrentUser = item.is_sender || item.sender?.id === currentUser?.id || item.sender?.user_id === currentUser?.id;
    
    return (
      <View style={[
        styles.messageBubbleContainer,
        isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble
      ]}>
        <View style={[
          styles.messageBubble, 
          isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage,
          item.isLocalSending && styles.sendingMessage
        ]}>
          <Text
            style={[
              styles.messageText,
              isCurrentUser && styles.currentUserMessageText,
              isHebrew(item.content) && { textAlign: 'right' }
            ]}
          >
            {item.content}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[styles.messageTimestamp, isCurrentUser && styles.currentUserMessageTimestamp]}>
              {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </Text>
            {item.isLocalSending && (
              <View style={styles.sendingIndicator}>
                <ActivityIndicator size="small" color={isCurrentUser ? "#FFFFFF" : "#007AFF"} />
              </View>
            )}
            {item.error && (
              <View style={styles.errorIndicator}>
                <Ionicons name="alert-circle" size={16} color="#FF3B30" />
              </View>
            )}
            {!item.isLocalSending && !item.error && isCurrentUser && (
              <View style={styles.deliveredIndicator}>
                <Ionicons
                  name="checkmark-done"
                  size={16}
                  color={item.is_read ? 'blue' : 'white'} // blue if read, white-ish if not
                />
                </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  if (isLoading && messages.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Enhanced Dropdown Menu Modal */}
      <Modal
        visible={showPopover}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPopover(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowPopover(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownContainer}>
              <TouchableOpacity 
                style={styles.dropdownItem} 
                onPress={() => {handleUnmatch();
                  console.log("Unmatch pressed for", otherParticipant?.first_name);
                  setShowPopover(false);
                }}
              >
                <Ionicons name="heart-dislike" size={20} color="#FF3B30" style={styles.dropdownIcon} />
                <Text style={styles.dropdownItemText}>Unmatch</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMessageItem}
          contentContainerStyle={[styles.flatlistContentContainer, { flexGrow: 1, justifyContent: 'flex-end' }]}
          ListEmptyComponent={
            isLoading ? null : (
              <View style={styles.emptyChatContainer}>
                <View style={styles.emptyChatIcon}>
                  <Ionicons name="chatbubbles-outline" size={64} color="#E0E0E0" />
                </View>
                <Text style={styles.emptyChatTitle}>Start the conversation!</Text>
                <Text style={styles.emptyChatSubtitle}>Say hello to {otherParticipant?.first_name || 'your match'}</Text>
              </View>
            )
          }
          onContentSizeChange={() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToEnd({ animated: false });
            }
          }}
          onLayout={() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToEnd({ animated: false });
            }
          }}
          style={styles.messageList}
          removeClippedSubviews={false}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
        />
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#999"
              multiline
            />
            <TouchableOpacity 
              onPress={handleSendMessage} 
              style={[
                styles.sendButton,
                inputText.trim() !== '' && styles.sendButtonActive
              ]} 
              disabled={inputText.trim() === ''}
            >
              <Ionicons 
                name="send" 
                size={20} 
                color={inputText.trim() !== '' ? "#FFFFFF" : "#CCCCCC"} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
      
      {/* User Modal */}
      <UserDisplayerModal
        visible={userModalVisible}
        onClose={() => setUserModalVisible(false)}
        user={userDisplayerModalData}
        showQuestion={true}
        showActions={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFBF0',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFBF0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFBF0',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarContainer: {
    position: 'relative',
  },
  headerAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  defaultAvatarContainer: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#FFB800',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  defaultAvatarText: {
    color: '#1D1D1F',
    fontWeight: 'bold',
    fontSize: 18,
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
  headerTextContainer: {
    alignItems: 'center',
    marginRight: 10,
  },
  headerName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  headerStatus: {
    fontSize: 13,
    color: '#32D74B',
    fontWeight: '500',
  },
  headerButton: {
    padding: 8,
  },
  headerButtonContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 184, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  dropdownContainer: {
    marginTop: 100,
    marginRight: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    elevation: 8,
    shadowColor: 'rgba(255, 184, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    minWidth: 140,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  dropdownIcon: {
    marginRight: 10,
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#FF3B30',
    fontWeight: '600',
  },
  messageList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  flatlistContentContainer: {
    paddingTop: 16,
    paddingBottom: 16,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  messageBubbleContainer: {
    marginVertical: 3,
    maxWidth: '85%',
  },
  currentUserBubble: {
    alignSelf: 'flex-end',
    marginLeft: 'auto',
  },
  otherUserBubble: {
    alignSelf: 'flex-start',
    marginRight: 'auto',
  },
  messageBubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    maxWidth: '100%',
    shadowColor: 'rgba(255, 184, 0, 0.3)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  currentUserMessage: {
    backgroundColor: '#FFB800',
    borderBottomRightRadius: 6,
  },
  otherUserMessage: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  sendingMessage: {
    opacity: 0.7,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
    color: '#1D1D1F',
  },
  currentUserMessageText: {
    color: '#1D1D1F',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 6,
  },
  messageTimestamp: {
    fontSize: 11,
    color: '#999999',
    fontWeight: '500',
  },
  currentUserMessageTimestamp: {
    color: 'rgba(29, 29, 31, 0.7)',
  },
  sendingIndicator: {
    marginLeft: 6,
  },
  errorIndicator: {
    marginLeft: 6,
  },
  deliveredIndicator: {
    marginLeft: 6,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#FFF8E1',
    borderRadius: 24,
    paddingHorizontal: 4,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: '#1D1D1F',
    lineHeight: 20,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#FFB800',
    shadowColor: 'rgba(255, 184, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyChatContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyChatIcon: {
    marginBottom: 24,
    opacity: 0.5,
  },
  emptyChatTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyChatSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});


export default ChatScreen;