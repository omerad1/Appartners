import { getTokens } from './client';
import api from './client';

// Global socket for user-level events
let socket = null;
let messageHandlers = {};

// Store for chat room-specific sockets
let chatSockets = {};

// Function to register message handlers that can be used from any component
export const registerSocketMessageHandler = (type, handler) => {
  if (!messageHandlers[type]) {
    messageHandlers[type] = [];
  }
  messageHandlers[type].push(handler);
  
  // If socket is already connected, also register directly on the socket
  if (socket && socket.registerMessageHandler) {
    socket.registerMessageHandler(type, handler);
  }
  
  // Return a function to unregister this handler
  return () => {
    if (messageHandlers[type]) {
      messageHandlers[type] = messageHandlers[type].filter(h => h !== handler);
    }
  };
};

export const initializeSocket = async (userId) => {
  try {
    // Get auth token for authentication
    const token = await getTokens();
    
    if (!token) {
      console.error('No auth token available for socket connection');
      return null;
    }
    
    // Extract host from API URL
    let apiHost = api.defaults.baseURL;
    // Remove any trailing slash
    apiHost = apiHost.endsWith('/') ? apiHost.slice(0, -1) : apiHost;
    
    // Check if userId is provided
    if (!userId) {
      console.error('No user ID provided for socket connection');
      return null;
    }
    
    
    // Convert HTTP/HTTPS URL to WebSocket URL (ws/wss)
    const wsProtocol = apiHost.startsWith('https') ? 'wss://' : 'ws://';
    const hostWithoutProtocol = apiHost.replace(/^https?:\/\//, '');
    
    // Create WebSocket URL with token
    // Make sure this path matches your backend WebSocket endpoint
    const wsUrl = `${wsProtocol}${hostWithoutProtocol}/ws/user/${userId}/?token=${token.accessToken}`;
    
    
    console.log('Connecting to WebSocket URL:', wsUrl);
    
    // Create WebSocket connection
    socket = new WebSocket(wsUrl);
    
    // Set up event listeners
    socket.onopen = (event) => {
      console.log('WebSocket connection opened');
    };
    
    socket.onclose = (event) => {
      console.log('WebSocket connection closed. Code:', event.code, 'Reason:', event.reason);
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    // Set up message handlers
    const messageHandlers = {};
    
    // Function to register message handlers
    const registerMessageHandler = (type, handler) => {
      if (!messageHandlers[type]) {
        messageHandlers[type] = [];
      }
      messageHandlers[type].push(handler);
    };
    
    // Main message handler
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('WebSocket message received:', data.type, data);
        
        // Process different message types
        switch (data.type) {
          case 'room_update':
            console.log('Room update received:', data.room);
            if (messageHandlers.room_update) {
              messageHandlers.room_update.forEach(handler => handler(data.room));
            }
            break;
            
          case 'read_receipt':
            console.log('Read receipt received:', data.message_ids, 'from user:', data.reader_id, 'in room:', data.room_id);
            if (messageHandlers.read_receipt) {
              messageHandlers.read_receipt.forEach(handler => 
                handler(data.message_ids, data.reader_id, data.room_id));
            }
            break;
            
          case 'chat.message.notification':
            console.log(`New message notification received in room ${data.chat_id} from user ${data.sender_id}`);
            if (messageHandlers.chat_message_notification) {
              messageHandlers.chat_message_notification.forEach(handler => 
                handler(data.chat_id, data.sender_id, data.message));
            }
            break;
            
          case 'chat.user.entered':
            console.log(`User ${data.user_id} entered room ${data.room_id}`);
            if (messageHandlers.chat_user_entered) {
              messageHandlers.chat_user_entered.forEach(handler => 
                handler(data.user_id, data.room_id));
            }
            break;
            
          case 'user_presence':
            console.log(`User ${data.user_id} is ${data.is_online ? 'online' : 'offline'} in room ${data.room_id || 'all rooms'}`);
            if (messageHandlers.user_presence) {
              messageHandlers.user_presence.forEach(handler => 
                handler(data.user_id, data.is_online, data.room_id));
            }
            break;
            
          case 'new_message':
            console.log('New chat message received:', data.message);
            if (messageHandlers.new_message) {
              messageHandlers.new_message.forEach(handler => handler(data.message));
            }
            break;
            
          default:
            console.log('Unhandled message type:', data.type, data);
            if (messageHandlers.default) {
              messageHandlers.default.forEach(handler => handler(data));
            }
        }
      } catch (e) {
        console.error('Error processing WebSocket message:', e, 'Raw message:', event.data);
      }
    };
    
    // Expose the message handler registration function
    socket.registerMessageHandler = registerMessageHandler;
    
    return socket;
  } catch (error) {
    console.error('Error initializing socket:', error);
    return null;
  }
};

export const getSocket = () => {
  return socket;
};

// Helper function to check if socket is connected
export const isSocketConnected = () => {
  // WebSocket.OPEN has a value of 1
  return socket && socket.readyState === 1; // 1 = OPEN
};

export const disconnectSocket = () => {
  if (socket) {
    // WebSocket.OPEN = 1, WebSocket.CONNECTING = 0
    if (socket.readyState === 1 || socket.readyState === 0) {
      socket.close(1000, 'User logged out');
    }
    socket = null;
    console.log('Socket disconnected.');
  }
  
  // Also close any chat room sockets
  Object.keys(chatSockets).forEach(roomId => {
    disconnectChatSocket(roomId);
  });
};

// Initialize a socket connection for a specific chat room
export const initializeChatSocket = async (roomId) => {
  if (!roomId) {
    console.error('No room ID provided for chat socket connection');
    return null;
  }
  
  // Return existing socket if already connected
  if (chatSockets[roomId] && (chatSockets[roomId].readyState === 0 || chatSockets[roomId].readyState === 1)) {
    return chatSockets[roomId];
  }
  
  try {
    // Get auth token for authentication
    const token = await getTokens();
    
    if (!token) {
      console.error('No auth token available for chat socket connection');
      return null;
    }
    
    // Extract host from API URL
    let apiHost = api.defaults.baseURL;
    // Remove any trailing slash
    apiHost = apiHost.endsWith('/') ? apiHost.slice(0, -1) : apiHost;
    
    // Convert HTTP/HTTPS URL to WebSocket URL (ws/wss)
    const wsProtocol = apiHost.startsWith('https') ? 'wss://' : 'ws://';
    const hostWithoutProtocol = apiHost.replace(/^https?:\/\//, '');
    
    // Create WebSocket URL with token
    const wsUrl = `${wsProtocol}${hostWithoutProtocol}/ws/chat/${roomId}/?token=${token.accessToken}`;
    
    console.log('Connecting to chat WebSocket URL:', wsUrl);
    
    // Create WebSocket connection
    const socket = new WebSocket(wsUrl);
    chatSockets[roomId] = socket;
    
    // Set up event listeners
    socket.onopen = (event) => {
      console.log('WebSocket connected to chat room:', roomId);
    };
    
    socket.onclose = (event) => {
      console.log(`Chat WebSocket to room ${roomId} closed. Code:`, event.code, 'Reason:', event.reason);
      delete chatSockets[roomId];
    };
    
    socket.onerror = (error) => {
      console.error('Chat WebSocket error:', error);
    };
    
    // Set up message handlers for this specific chat room
    const roomMessageHandlers = {};
    
    // Function to register message handlers for this room
    socket.registerMessageHandler = (type, handler) => {
      if (!roomMessageHandlers[type]) {
        roomMessageHandlers[type] = [];
      }
      roomMessageHandlers[type].push(handler);
      
      // Return a function to unregister this handler
      return () => {
        if (roomMessageHandlers[type]) {
          roomMessageHandlers[type] = roomMessageHandlers[type].filter(h => h !== handler);
        }
      };
    };
    
    // Main message handler
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log('Chat WebSocket message received:', data);
        
        // Process different message types
        if (data.type) {
          if (roomMessageHandlers[data.type]) {
            roomMessageHandlers[data.type].forEach(handler => handler(data));
          }
        } else {
          // Default handler for messages without a type
          if (roomMessageHandlers.default) {
            roomMessageHandlers.default.forEach(handler => handler(data));
          }
        }
      } catch (e) {
        console.error('Error processing chat WebSocket message:', e, 'Raw message:', event.data);
      }
    };
    
    return socket;
  } catch (error) {
    console.error('Error initializing chat socket:', error);
    return null;
  }
};

// Get a chat socket by room ID
export const getChatSocket = (roomId) => {
  return chatSockets[roomId] || null;
};

// Check if a chat socket is connected
export const isChatSocketConnected = (roomId) => {
  return chatSockets[roomId] && chatSockets[roomId].readyState === 1; // 1 = OPEN
};

// Disconnect a specific chat socket
export const disconnectChatSocket = (roomId) => {
  if (chatSockets[roomId]) {
    if (chatSockets[roomId].readyState === 1 || chatSockets[roomId].readyState === 0) {
      chatSockets[roomId].close(1000, 'Leaving chat room');
    }
    delete chatSockets[roomId];
    console.log(`Chat socket for room ${roomId} disconnected.`);
  }
};