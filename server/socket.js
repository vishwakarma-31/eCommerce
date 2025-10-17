const socketIO = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Order = require('./models/Order');
const ProductConcept = require('./models/ProductConcept');
const Notification = require('./models/Notification');

// Store connected users
const connectedUsers = new Map();
let onlineUsersCount = 0;

/**
 * Initialize Socket.io server
 * @param {Object} server - HTTP server instance
 * @returns {Object} Socket.io instance
 */
const initializeSocket = (server) => {
  // Create Socket.io instance
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }
      
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Find user in database
      const user = await User.findById(decoded.id);
      
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }
      
      // Attach user to socket
      socket.user = user;
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Handle socket connections
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user.role})`);
    
    // Add user to connected users map
    connectedUsers.set(socket.user._id.toString(), {
      socketId: socket.id,
      userId: socket.user._id.toString(),
      name: socket.user.name,
      role: socket.user.role,
      connectedAt: new Date()
    });
    
    // Update online users count
    onlineUsersCount = connectedUsers.size;
    io.emit('onlineUsersCount', onlineUsersCount);
    
    // Join user-specific room
    socket.join(`user_${socket.user._id}`);
    
    // Join role-specific rooms
    if (socket.user.role === 'Admin') {
      socket.join('admins');
    } else if (socket.user.role === 'Creator') {
      socket.join('creators');
    } else {
      socket.join('customers');
    }
    
    // Handle order status changes
    socket.on('orderStatusChanged', async (data) => {
      try {
        const { orderId, newStatus } = data;
        
        // Update order in database
        const order = await Order.findByIdAndUpdate(
          orderId,
          { orderStatus: newStatus },
          { new: true }
        ).populate('buyer', 'name email');
        
        if (order) {
          // Notify the buyer
          const buyerSocket = connectedUsers.get(order.buyer._id.toString());
          if (buyerSocket) {
            io.to(buyerSocket.socketId).emit('orderStatusChanged', {
              orderId,
              newStatus,
              message: `Your order status has been updated to: ${newStatus}`
            });
          }
          
          // Create notification
          const notification = new Notification({
            user: order.buyer._id,
            title: 'Order Status Updated',
            message: `Your order #${orderId} status has been updated to: ${newStatus}`,
            type: 'order'
          });
          await notification.save();
          
          // Emit notification event
          io.to(`user_${order.buyer._id}`).emit('notification', {
            title: 'Order Status Updated',
            message: `Your order #${orderId} status has been updated to: ${newStatus}`,
            type: 'order'
          });
        }
      } catch (error) {
        console.error('Error handling order status change:', error);
      }
    });
    
    // Handle new orders
    socket.on('newOrder', async (data) => {
      try {
        const { orderId, orderDetails } = data;
        
        // Notify all admins
        io.to('admins').emit('newOrder', {
          orderId,
          orderDetails,
          message: `New order #${orderId} has been placed`
        });
        
        // Create notifications for admins
        const adminUsers = await User.find({ role: 'Admin' });
        for (const admin of adminUsers) {
          const notification = new Notification({
            user: admin._id,
            title: 'New Order Placed',
            message: `New order #${orderId} has been placed by ${orderDetails.buyerName}`,
            type: 'order'
          });
          await notification.save();
          
          // Emit notification to admin if online
          const adminSocket = connectedUsers.get(admin._id.toString());
          if (adminSocket) {
            io.to(adminSocket.socketId).emit('notification', {
              title: 'New Order Placed',
              message: `New order #${orderId} has been placed by ${orderDetails.buyerName}`,
              type: 'order'
            });
          }
        }
      } catch (error) {
        console.error('Error handling new order:', error);
      }
    });
    
    // Handle stock updates
    socket.on('stockUpdated', async (data) => {
      try {
        const { productId, newStock } = data;
        
        // Update product stock in database
        const product = await ProductConcept.findByIdAndUpdate(
          productId,
          { stockQuantity: newStock },
          { new: true }
        );
        
        if (product) {
          // Emit stock update to all connected users
          io.emit('stockUpdated', {
            productId,
            newStock,
            message: `Stock for ${product.title} has been updated`
          });
          
          // If stock is low, notify creator
          if (newStock < 10) {
            const creatorSocket = connectedUsers.get(product.creator.toString());
            if (creatorSocket) {
              io.to(creatorSocket.socketId).emit('lowStockAlert', {
                productId,
                productName: product.title,
                currentStock: newStock,
                message: `Low stock alert: ${product.title} has only ${newStock} items left`
              });
            }
          }
        }
      } catch (error) {
        console.error('Error handling stock update:', error);
      }
    });
    
    // Handle chat messages
    socket.on('joinChat', (data) => {
      const { roomId } = data;
      socket.join(roomId);
      console.log(`User ${socket.user.name} joined chat room ${roomId}`);
    });
    
    socket.on('leaveChat', (data) => {
      const { roomId } = data;
      socket.leave(roomId);
      console.log(`User ${socket.user.name} left chat room ${roomId}`);
    });
    
    socket.on('sendMessage', (data) => {
      const { roomId, message, senderName } = data;
      
      // Emit message to room
      io.to(roomId).emit('newMessage', {
        roomId,
        message,
        senderName,
        senderId: socket.user._id,
        timestamp: new Date()
      });
    });
    
    socket.on('typing', (data) => {
      const { roomId, isTyping } = data;
      
      // Notify others in the room that user is typing
      socket.to(roomId).emit('userTyping', {
        userId: socket.user._id,
        userName: socket.user.name,
        isTyping
      });
    });
    
    // Handle disconnections
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.name}`);
      
      // Remove user from connected users map
      connectedUsers.delete(socket.user._id.toString());
      
      // Update online users count
      onlineUsersCount = connectedUsers.size;
      io.emit('onlineUsersCount', onlineUsersCount);
    });
  });
  
  return io;
};

/**
 * Emit event to specific user
 * @param {String} userId - User ID
 * @param {String} event - Event name
 * @param {Object} data - Event data
 */
const emitToUser = (userId, event, data) => {
  const userSocket = connectedUsers.get(userId.toString());
  if (userSocket) {
    // This would need access to the io instance
    // In a real implementation, we'd pass the io instance to this function
    console.log(`Would emit ${event} to user ${userId}`);
  }
};

/**
 * Emit event to all admins
 * @param {String} event - Event name
 * @param {Object} data - Event data
 */
const emitToAdmins = (event, data) => {
  // This would need access to the io instance
  console.log(`Would emit ${event} to all admins`);
};

module.exports = {
  initializeSocket,
  emitToUser,
  emitToAdmins,
  getOnlineUsersCount: () => onlineUsersCount
};