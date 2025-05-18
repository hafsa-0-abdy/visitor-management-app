import React, { createContext, useState, useContext, useEffect } from 'react';

const ActivityLogContext = createContext({
  logs: [],
  addLog: () => {},
});

export const useActivityLog = () => useContext(ActivityLogContext);

export const ActivityLogProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Load logs from localStorage if available
    const storedLogs = localStorage.getItem('estate_activity_logs');
    if (storedLogs) {
      try {
        setLogs(JSON.parse(storedLogs));
      } catch (error) {
        console.error('Failed to parse activity logs from localStorage:', error);
      }
    } else {
      // Initialize with mock data for demo
      const mockLogs = [
        {
          id: '1',
          action: 'User Login',
          details: 'Admin logged into the system',
          performedBy: 'Admin User',
          performedByRole: 'admin',
          createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        },
        {
          id: '2',
          action: 'Visitor Registered',
          details: 'New visitor "Alice Johnson" registered for apartment A101',
          performedBy: 'John Resident',
          performedByRole: 'resident',
          createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        },
        {
          id: '3',
          action: 'Visitor Status Update',
          details: 'Visitor "Carol White" marked as arrived',
          performedBy: 'Security Guard',
          performedByRole: 'watchman',
          createdAt: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
        },
      ];
      
      setLogs(mockLogs);
      localStorage.setItem('estate_activity_logs', JSON.stringify(mockLogs));
    }
  }, []);

  const addLog = (action, details, performedBy, performedByRole) => {
    const newLog = {
      id: Date.now().toString(),
      action,
      details,
      performedBy,
      performedByRole,
      createdAt: new Date().toISOString(),
    };

    const updatedLogs = [newLog, ...logs];
    setLogs(updatedLogs);
    localStorage.setItem('estate_activity_logs', JSON.stringify(updatedLogs));
  };

  return (
    <ActivityLogContext.Provider value={{ logs, addLog }}>
      {children}
    </ActivityLogContext.Provider>
  );
};
