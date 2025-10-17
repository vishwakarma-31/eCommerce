import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from './AuthContext';
import { initializeSocket, getSocket, disconnectSocket, listenForEvent, stopListeningForEvent } from '../services/socket';

// Create the context
const SocketContext = createContext();

// Custom hook to use the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

// SocketProvider component
export const SocketProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [onlineUsersCount, setOnlineUsersCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Initialize socket connection
      const socket = initializeSocket();
      socketRef.current = socket;
      
      if (socket) {
        // Handle connection events
        socket.on('connect', () => {
          console.log('Socket connected');
          setIsConnected(true);
        });
        
        socket.on('disconnect', () => {
          console.log('Socket disconnected');
          setIsConnected(false);
        });
        
        // Handle notifications
        socket.on('notification', (data) => {
          const newNotification = {
            id: Date.now(),
            title: data.title,
            message: data.message,
            type: data.type,
            timestamp: new Date(),
            read: false
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadNotifications(prev => prev + 1);
        });
        
        // Handle online users count
        socket.on('onlineUsersCount', (count) => {
          setOnlineUsersCount(count);
        });
        
        // Handle order status changes
        socket.on('orderStatusChanged', (data) => {
          console.log('Order status changed:', data);
          // You can add specific logic here to update order status in your app
        });
        
        // Handle new orders (for admins)
        socket.on('newOrder', (data) => {
          console.log('New order received:', data);
          // You can add specific logic here to show new order alerts for admins
        });
        
        // Handle stock updates
        socket.on('stockUpdated', (data) => {
          console.log('Stock updated:', data);
          // You can add specific logic here to update product stock in your app
        });
        
        // Handle low stock alerts
        socket.on('lowStockAlert', (data) => {
          const newNotification = {
            id: Date.now(),
            title: 'Low Stock Alert',
            message: data.message,
            type: 'warning',
            timestamp: new Date(),
            read: false
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadNotifications(prev => prev + 1);
        });
      }
    } else {
      // Disconnect socket if user is not authenticated
      disconnectSocket();
      socketRef.current = null;
      setIsConnected(false);
    }
    
    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [isAuthenticated, user]);

  // Mark notification as read
  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
    
    setUnreadNotifications(prev => Math.max(0, prev - 1));
  };
  
  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    
    setUnreadNotifications(0);
  };
  
  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
    setUnreadNotifications(0);
  };
  
  // Emit event to server
  const emitEvent = (event, data) => {
    if (socketRef.current) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('Socket not initialized, cannot emit event:', event);
    }
  };
  
  // Join a chat room
  const joinChat = (roomId) => {
    emitEvent('joinChat', { roomId });
  };
  
  // Leave a chat room
  const leaveChat = (roomId) => {
    emitEvent('leaveChat', { roomId });
  };
  
  // Send a chat message
  const sendMessage = (roomId, message) => {
    emitEvent('sendMessage', { 
      roomId, 
      message, 
      senderName: user?.name || 'Anonymous' 
    });
  };
  
  // Set typing status
  const setTyping = (roomId, isTyping) => {
    emitEvent('typing', { roomId, isTyping });
  };

  const value = {
    // Socket state
    isConnected,
    onlineUsersCount,
    
    // Notifications
    notifications,
    unreadNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    
    // Socket methods
    emitEvent,
    joinChat,
    leaveChat,
    sendMessage,
    setTyping
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;