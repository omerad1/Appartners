import { getTokens } from './client';
import api from './client';

let socket = null;
let messageHandlers = {};

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
    
    console.log('User ID for socket connection:', userId);
    
    // Create WebSocket URL with token
    const wsUrl = `${apiHost}/ws/user/${userId}/?token=${token.accessToken}`;
    
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
};