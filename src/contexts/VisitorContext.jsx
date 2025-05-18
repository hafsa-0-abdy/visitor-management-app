import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext.jsx';
import { useActivityLog } from './ActivityLogContext.jsx';
import { useNotifications } from './NotificationContext.jsx';

const VisitorContext = createContext({
  visitors: [],
  addVisitor: () => {},
  updateVisitorStatus: () => {},
  getVisitorsByResident: () => [],
  getTodayVisitors: () => [],
  getVisitorsByStatus: () => [],
  getVisitorById: () => null,
  visitorCounts: { expected: 0, arrived: 0, total: 0 },
});

export const useVisitors = () => useContext(VisitorContext);

export const VisitorProvider = ({ children }) => {
  const [visitors, setVisitors] = useState([]);
  const { user } = useAuth();
  const { addLog } = useActivityLog();
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Load visitors from localStorage if available
    const storedVisitors = localStorage.getItem('estate_visitors');
    if (storedVisitors) {
      try {
        setVisitors(JSON.parse(storedVisitors));
      } catch (error) {
        console.error('Failed to parse visitors from localStorage:', error);
      }
    } else {
      // Initialize with mock data for demo
      const mockVisitors = [
        {
          id: '1',
          name: 'Alice Johnson',
          purpose: 'Social Visit',
          expectedArrival: new Date(Date.now() + 3600000).toISOString(), // 1 hour later
          notes: 'Coming for dinner',
          status: 'expected',
          residentId: '2', // John Resident
          residentName: 'John Resident',
          apartmentNumber: 'A101',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Bob Smith',
          purpose: 'Package Delivery',
          expectedArrival: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
          notes: 'Amazon delivery',
          status: 'arrived',
          residentId: '2', // John Resident
          residentName: 'John Resident',
          apartmentNumber: 'A101',
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
          arrivedAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        },
        {
          id: '3',
          name: 'Carol White',
          purpose: 'Maintenance',
          expectedArrival: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          notes: 'Fixing the AC',
          status: 'left',
          residentId: '2', // John Resident
          residentName: 'John Resident',
          apartmentNumber: 'A101',
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          arrivedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
          leftAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
      ];
      
      setVisitors(mockVisitors);
      localStorage.setItem('estate_visitors', JSON.stringify(mockVisitors));
    }
  }, []);

  const addVisitor = (visitorData) => {
    if (!user) return null;

    const newVisitor = {
      id: Date.now().toString(),
      ...visitorData,
      status: 'expected',
      residentId: user.id,
      residentName: user.name,
      createdAt: new Date().toISOString(),
    };

    const updatedVisitors = [...visitors, newVisitor];
    setVisitors(updatedVisitors);
    localStorage.setItem('estate_visitors', JSON.stringify(updatedVisitors));

    // Log the activity
    addLog(
      'Visitor Registered',
      `New visitor "${visitorData.name}" registered by ${user.name} for apartment ${visitorData.apartmentNumber}`,
      user.name,
      user.role
    );

    // Notify watchmen
    const watchmanNotification = `New visitor "${visitorData.name}" expected at ${visitorData.apartmentNumber}`;
    addNotification(watchmanNotification, '3'); // Assuming '3' is the watchman's ID

    return newVisitor;
  };

  const updateVisitorStatus = (visitorId, newStatus) => {
    if (!user) return false;

    const visitorIndex = visitors.findIndex(v => v.id === visitorId);
    if (visitorIndex === -1) return false;

    const visitor = visitors[visitorIndex];
    const updatedVisitor = { ...visitor, status: newStatus };

    // Add timestamp based on the new status
    if (newStatus === 'arrived') {
      updatedVisitor.arrivedAt = new Date().toISOString();
    } else if (newStatus === 'left') {
      updatedVisitor.leftAt = new Date().toISOString();
    }

    const updatedVisitors = [...visitors];
    updatedVisitors[visitorIndex] = updatedVisitor;

    setVisitors(updatedVisitors);
    localStorage.setItem('estate_visitors', JSON.stringify(updatedVisitors));

    // Log the activity
    addLog(
      'Visitor Status Update',
      `Visitor "${visitor.name}" marked as ${newStatus} by ${user.name}`,
      user.name,
      user.role
    );

    // Notify the resident if watchman updates the status
    if (user.role === 'watchman') {
      const residentNotification = `Your visitor "${visitor.name}" has ${
        newStatus === 'arrived' ? 'arrived' : 
        newStatus === 'left' ? 'left' : 
        newStatus === 'denied' ? 'been denied entry' : 'been updated'
      }`;
      addNotification(residentNotification, visitor.residentId, visitor.id);
    }

    return true;
  };

  const getVisitorsByResident = (residentId) => {
    return visitors.filter(visitor => visitor.residentId === residentId);
  };

  const getTodayVisitors = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return visitors.filter(visitor => {
      const visitorDate = new Date(visitor.expectedArrival);
      return visitorDate >= today && visitorDate < new Date(today.getTime() + 24 * 60 * 60 * 1000);
    });
  };

  const getVisitorsByStatus = (status) => {
    return visitors.filter(visitor => visitor.status === status);
  };

  const getVisitorById = (visitorId) => {
    return visitors.find(visitor => visitor.id === visitorId) || null;
  };

  // Calculate visitor counts
  const visitorCounts = {
    expected: visitors.filter(v => v.status === 'expected').length,
    arrived: visitors.filter(v => v.status === 'arrived').length,
    total: visitors.length,
  };

  return (
    <VisitorContext.Provider
      value={{
        visitors,
        addVisitor,
        updateVisitorStatus,
        getVisitorsByResident,
        getTodayVisitors,
        getVisitorsByStatus,
        getVisitorById,
        visitorCounts,
      }}
    >
      {children}
    </VisitorContext.Provider>
  );
};