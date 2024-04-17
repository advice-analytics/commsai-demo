'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { auth } from '@/utilities/firebaseClient'; // Import Firebase auth service

// Define a type for user data
export interface UserData {
  uid: string | null;
}

// Create AuthContext with default values
const AuthContext = createContext<[UserData, React.Dispatch<React.SetStateAction<UserData>>]>([
  { uid: null },
  () => {}
]);

// AuthProvider component to wrap around your application
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userData, setUserData] = useState<UserData>({ uid: null });

  // Listen to authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserData({ uid: user.uid });
      } else {
        setUserData({ uid: null });
      }
    });

    return () => unsubscribe(); // Unsubscribe on component unmount
  }, []);

  // Provide userData and setUserData through context provider
  return <AuthContext.Provider value={[userData, setUserData]}>{children}</AuthContext.Provider>;
};

// Custom hook to access userData and setUserData
export const useAuth = (): [UserData, React.Dispatch<React.SetStateAction<UserData>>] => useContext(AuthContext);
