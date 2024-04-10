import { initializeApp } from 'firebase/app';
import {
  getAuth,
  Auth,
  createUserWithEmailAndPassword,
  UserCredential,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from 'firebase/auth';

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBLiO8cc9hgGHIdYuSMhoPSGA9NOIFgvP4",
  authDomain: "commsai-pwa.firebaseapp.com",
  databaseURL: "https://commsai-pwa-default-rtdb.firebaseio.com",
  projectId: "commsai-pwa",
  storageBucket: "commsai-pwa.appspot.com",
  messagingSenderId: "858592121515",
  appId: "1:858592121515:web:71f08774628cd00e62ddee",
  measurementId: "G-BEGZGF3ERP"
};

// Initialize Firebase app with the provided configuration
const app = initializeApp(firebaseConfig);

// Initialize Firebase authentication service
const auth: Auth = getAuth(app);

// Function to create user account with email and password
const createAccountWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('Error creating user account:', error);
    throw error;
  }
};

// Function to send sign-in link via email
const sendSignInEmailLink = (email: string) => {
  const actionCodeSettings = {
    url: `${window.location.origin}/verify?email=${encodeURIComponent(email)}`, // Include email parameter in URL
    handleCodeInApp: true,
  };

  return sendSignInLinkToEmail(auth, email, actionCodeSettings);
};

// Function to complete sign-in with email link
const completeSignInWithEmailLink = async (email: string, url: string) => {
  if (isSignInWithEmailLink(auth, url)) {
    try {
      const result = await signInWithEmailLink(auth, email, url);
      return result;
    } catch (error) {
      console.error('Error signing in with email link:', error);
      throw error;
    }
  } else {
    throw new Error('Invalid sign-in link');
  }
};

// Export Firebase services and functions for use in other modules
export {
  auth,
  createAccountWithEmail,
  sendSignInEmailLink,
  completeSignInWithEmailLink,
};

