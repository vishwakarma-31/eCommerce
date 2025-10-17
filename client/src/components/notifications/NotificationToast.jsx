import React, { useEffect } from 'react';
import { useSocket } from '../../context/SocketContext';
import { useToast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NotificationToast = () => {
  const { notifications, markNotificationAsRead } = useSocket();
  const toast = useToast();

  useEffect(() => {
    // Show toast notifications for new unread notifications
    notifications
      .filter(notification => !notification.read)
      .forEach(notification => {
        // Show toast notification
        toast.info(
          <div>
            <h4 className="font-bold">{notification.title}</h4>
            <p>{notification.message}</p>
          </div>,
          {
            toastId: notification.id,
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            onClose: () => markNotificationAsRead(notification.id)
          }
        );
        
        // Mark as read after showing
        markNotificationAsRead(notification.id);
      });
  }, [notifications, markNotificationAsRead, toast]);

  return null; // This component doesn't render anything directly
};

export default NotificationToast;