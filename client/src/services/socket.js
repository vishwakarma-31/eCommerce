import { io } from 'socket.io-client';
import { getToken } from './api';

// Create socket connection
let socket;

/**
 * Initialize socket connection
 */
export const initializeSocket = () => {
  if (socket) return socket;
  
  // Get token from localStorage
  const token = getToken();
  
  if (!token) {
    console.warn('No token found, cannot initialize socket');
    return null;
  }
  
  // Create socket connection
  socket = io(process.env.VITE_SOCKET_URL || 'http://localhost:5000', {
    auth: {
      token: token
    },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    timeout: 20000
  });
  
  // Handle connection events
  socket.on('connect', () => {
    console.log('Socket connected:', socket.id);
  });
  
  socket.on('disconnect', (reason) => {
    console.log('Socket disconnected:', reason);
  });
  
  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });
  
  return socket;
};

/**
 * Get socket instance
 * @returns {Object} Socket instance
 */
export const getSocket = () => {
  return socket;
};

/**
 * Disconnect socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

/**
 * Emit event to server
 * @param {String} event - Event name
 * @param {Object} data - Event data
 */
export const emitEvent = (event, data) => {
  if (socket) {
    socket.emit(event, data);
  } else {
    console.warn('Socket not initialized, cannot emit event:', event);
  }
};

/**
 * Listen for event from server
 * @param {String} event - Event name
 * @param {Function} callback - Callback function
 */
export const listenForEvent = (event, callback) => {
  if (socket) {
    socket.on(event, callback);
  } else {
    console.warn('Socket not initialized, cannot listen for event:', event);
  }
};

/**
 * Stop listening for event
 * @param {String} event - Event name
 * @param {Function} callback - Callback function
 */
export const stopListeningForEvent = (event, callback) => {
  if (socket) {
    socket.off(event, callback);
  }
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  emitEvent,
  listenForEvent,
  stopListeningForEvent
};