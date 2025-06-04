import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('projectSahurUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('projectSahurRegisteredUsers')) || [];
        const foundUser = users.find(u => u.email === email && u.password === password); // Insecure, for demo only!
        
        if (foundUser) {
          const userData = { id: foundUser.id, email: foundUser.email };
          localStorage.setItem('projectSahurUser', JSON.stringify(userData));
          setUser(userData);
          setIsAuthenticated(true);
          setLoading(false);
          resolve(userData);
        } else {
          setLoading(false);
          reject(new Error("Invalid email or password."));
        }
      }, 500);
    });
  };

  const signup = async (email, password) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let users = JSON.parse(localStorage.getItem('projectSahurRegisteredUsers')) || [];
        if (users.find(u => u.email === email)) {
          setLoading(false);
          reject(new Error("User with this email already exists."));
          return;
        }
        const newUser = { id: uuidv4(), email, password }; // Insecure, for demo only!
        users.push(newUser);
        localStorage.setItem('projectSahurRegisteredUsers', JSON.stringify(users));
        setLoading(false);
        resolve(newUser);
      }, 500);
    });
  };

  const logout = () => {
    localStorage.removeItem('projectSahurUser');
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};