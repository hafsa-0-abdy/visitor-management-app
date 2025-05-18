import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '../components/ui/toast.jsx';


const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => false,
  logout: () => {},
  register: async () => false,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('estate_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // In a real app, this would make an API call to authenticate
    // For demo purposes, we'll use mock users
    setLoading(true);

    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockUsers = [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          createdAt: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'John Resident',
          email: 'resident@example.com',
          role: 'resident',
          apartmentNumber: 'A101',
          phoneNumber: '555-123-4567',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Security Guard',
          email: 'watchman@example.com',
          role: 'watchman',
          phoneNumber: '555-987-6543',
          createdAt: new Date().toISOString(),
        },
      ];

      const foundUser = mockUsers.find((u) => u.email === email);

      if (foundUser && password === 'password') {
        // In a real app, you'd validate the password properly
        setUser(foundUser);
        localStorage.setItem('estate_user', JSON.stringify(foundUser));
        
        toast({
          title: 'Login Successful',
          description: `Welcome back, ${foundUser.name}!`,
        });
        
        return true;
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid email or password',
          variant: 'destructive',
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Failed',
        description: 'An error occurred during login',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('estate_user');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out',
    });
  };

  const register = async (userData) => {
    setLoading(true);

    try {
      // Simulating API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would make an API call to register the user
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: 'resident',
        apartmentNumber: userData.apartmentNumber,
        phoneNumber: userData.phoneNumber,
        createdAt: new Date().toISOString(),
      };

      setUser(newUser);
      localStorage.setItem('estate_user', JSON.stringify(newUser));
      
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created',
      });
      
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration Failed',
        description: 'An error occurred during registration',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};