import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { toast } from '../components/ui/toast.jsx';


const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
});

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load notifications from localStorage if available
    const storedNotifications = localStorage.getItem('estate_notifications');
    if (storedNotifications) {
      try {
        setNotifications(JSON.parse(storedNotifications));
      } catch (error) {
        console.error('Failed to parse notifications from localStorage:', error);
      }
    } else {
      // Initialize with mock data for demo
      const mockNotifications = [
        {
          id: '1',
          message: 'New visitor registered for apartment A101',
          read: false,
          createdAt: new Date().toISOString(),
          userId: '3', // Watchman
          visitorId: '1',
        },
        {
          id: '2',
          message: 'System maintenance scheduled for tomorrow',
          read: true,
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          userId: '1', // Admin
        },
      ];
      
      setNotifications(mockNotifications);
      localStorage.setItem('estate_notifications', JSON.stringify(mockNotifications));
    }
  }, []);

  const userNotifications = user 
    ? notifications.filter(notification => notification.userId === user.id)
    : [];

  const unreadCount = userNotifications.filter(notification => !notification.read).length;

  const addNotification = (message, userId, visitorId) => {
    const newNotification = {
      id: Date.now().toString(),
      message,
      read: false,
      createdAt: new Date().toISOString(),
      userId,
      visitorId,
    };

    const updatedNotifications = [...notifications, newNotification];
    setNotifications(updatedNotifications);
    localStorage.setItem('estate_notifications', JSON.stringify(updatedNotifications));

    // If this notification is for the current user, show a toast
    if (user && userId === user.id) {
      toast({
        title: 'New Notification',
        description: message,
      });
    }
  };

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true } 
        : notification
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem('estate_notifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    if (!user) return;
    
    const updatedNotifications = notifications.map(notification => 
      notification.userId === user.id 
        ? { ...notification, read: true } 
        : notification
    );
    
    setNotifications(updatedNotifications);
    localStorage.setItem('estate_notifications', JSON.stringify(updatedNotifications));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: userNotifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
