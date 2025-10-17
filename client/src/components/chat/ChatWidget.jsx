import React, { useState, useEffect, useRef } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';

const ChatWidget = () => {
  const { 
    isConnected, 
    joinChat, 
    leaveChat, 
    sendMessage, 
    setTyping 
  } = useSocket();
  
  const { currentUser } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  
  const roomId = 'support'; // Default support room
  
  // Join chat room when component mounts
  useEffect(() => {
    if (isOpen && isConnected) {
      joinChat(roomId);
    }
    
    return () => {
      if (isConnected) {
        leaveChat(roomId);
      }
    };
  }, [isOpen, isConnected, joinChat, leaveChat, roomId]);
  
  // Listen for new messages
  useEffect(() => {
    if (!isConnected) return;
    
    const handleNewMessage = (data) => {
      if (data.roomId === roomId) {
        setMessages(prev => [...prev, data]);
      }
    };
    
    const handleUserTyping = (data) => {
      if (data.roomId === roomId && data.userId !== currentUser?._id) {
        setTypingUsers(prev => {
          const newTypingUsers = [...prev];
          const existingIndex = newTypingUsers.findIndex(user => user.userId === data.userId);
          
          if (data.isTyping) {
            if (existingIndex === -1) {
              newTypingUsers.push({
                userId: data.userId,
                userName: data.userName,
                timestamp: Date.now()
              });
            }
          } else {
            if (existingIndex !== -1) {
              newTypingUsers.splice(existingIndex, 1);
            }
          }
          
          return newTypingUsers;
        });
        
        // Clear typing indicator after 3 seconds of inactivity
        if (data.isTyping) {
          setTimeout(() => {
            setTypingUsers(prev => 
              prev.filter(user => user.userId !== data.userId)
            );
          }, 3000);
        }
      }
    };
    
    // In a real implementation, we would use the socket context to listen for events
    // For now, we'll simulate with mock data
    const interval = setInterval(() => {
      if (Math.random() > 0.9 && isOpen) { // 10% chance of new message when chat is open
        const mockMessages = [
          { senderName: 'Support Agent', message: 'Hello! How can I help you today?' },
          { senderName: 'Support Agent', message: 'I see you\'re looking at our products. Do you have any questions?' },
          { senderName: 'Support Agent', message: 'Our return policy is very flexible. You can return items within 30 days.' },
          { senderName: 'Support Agent', message: 'Is there anything specific you\'d like to know about our products?' }
        ];
        
        const randomMessage = mockMessages[Math.floor(Math.random() * mockMessages.length)];
        
        setMessages(prev => [...prev, {
          roomId,
          message: randomMessage.message,
          senderName: randomMessage.senderName,
          senderId: 'support-agent',
          timestamp: new Date()
        }]);
      }
    }, 10000);
    
    return () => {
      clearInterval(interval);
    };
  }, [isConnected, isOpen, currentUser?._id, roomId]);
  
  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (newMessage.trim() && isConnected) {
      sendMessage(roomId, newMessage.trim());
      
      // Add message to local state
      setMessages(prev => [...prev, {
        roomId,
        message: newMessage.trim(),
        senderName: currentUser?.name || 'You',
        senderId: currentUser?._id,
        timestamp: new Date()
      }]);
      
      setNewMessage('');
      setIsTyping(false);
      setTyping(roomId, false);
    }
  };
  
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!isTyping && e.target.value.trim()) {
      setIsTyping(true);
      setTyping(roomId, true);
      
      // Clear previous timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Set new timeout to stop typing indicator
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setTyping(roomId, false);
      }, 1000);
    }
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="w-80 h-96 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col">
          {/* Chat header */}
          <div className="bg-indigo-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <h3 className="font-medium">Live Chat Support</h3>
            <button 
              onClick={toggleChat}
              className="text-white hover:text-gray-200 focus:outline-none"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="mt-2">Welcome to Live Chat Support!</p>
                <p className="text-sm mt-1">How can we help you today?</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`flex ${msg.senderId === currentUser?._id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-xs rounded-lg px-3 py-2 ${
                        msg.senderId === currentUser?._id 
                          ? 'bg-indigo-500 text-white' 
                          : 'bg-white border border-gray-200 text-gray-800'
                      }`}
                    >
                      {msg.senderId !== currentUser?._id && (
                        <div className="text-xs font-medium text-gray-500 mb-1">
                          {msg.senderName}
                        </div>
                      )}
                      <div className="text-sm">{msg.message}</div>
                      <div className="text-xs opacity-70 mt-1">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
            
            {/* Typing indicators */}
            {typingUsers.length > 0 && (
              <div className="flex items-center mt-2">
                <div className="text-sm text-gray-500">
                  {typingUsers.map(user => user.userName).join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
                </div>
                <div className="flex space-x-1 ml-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>
          
          {/* Input area */}
          <div className="border-t border-gray-200 p-3 bg-white">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={handleTyping}
                placeholder="Type your message..."
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || !isConnected}
                className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button
          onClick={toggleChat}
          className="bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatWidget;