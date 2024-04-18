import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, // Import signInWithEmailAndPassword method
  UserCredential,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  Auth,
} from 'firebase/auth';
import { getDatabase, ref, push, Database, set } from 'firebase/database';

// Firebase configuration object
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'commsai-pwa.firebaseapp.com',
  databaseURL: 'https://commsai-pwa-default-rtdb.firebaseio.com',
  projectId: 'commsai-pwa',
  storageBucket: 'commsai-pwa.appspot.com',
  messagingSenderId: '858592121515',
  appId: '1:858592121515:web:71f08774628cd00e62ddee',
  measurementId: 'G-BEGZGF3ERP',
};

// Initialize Firebase app with the provided configuration
const app = initializeApp(firebaseConfig);

// Initialize Firebase authentication service
const auth: Auth = getAuth(app);

// Initialize Firebase database
const database: Database = getDatabase(app);

// Function to create user account with email and password
const createAccountWithEmail = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    console.error('Error creating user account:', error.message);
    throw error;
  }
};

// Function to sign in user with email and password
const signInUserWithEmailAndPassword = async (email: string, password: string): Promise<UserCredential> => {
  try {
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error: any) {
    console.error('Error signing in with email and password:', error.message);
    throw error;
  }
};

// Function to send sign-in link via email
const sendSignInEmailLink = (email: string) => {
  const actionCodeSettings = {
    url: `${window.location.origin}/advisor?email=${encodeURIComponent(email)}`, // Include email parameter in URL
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
    } catch (error: any) {
      console.error('Error signing in with email link:', error.message);
      throw error;
    }
  } else {
    throw new Error('Invalid sign-in link');
  }
};

// Function to save value proposition to Firebase Realtime Database
const saveValuePropToDatabase = async (uid: string, valueProp: string): Promise<void> => {
  try {
    const valuePropRef = ref(database, `users/${uid}/valueProps`);
    const newPropRef = push(valuePropRef); // Create a new child node
    await set(newPropRef, { value: valueProp }); // Save value proposition under the new child node
  } catch (error: any) {
    console.error('Error saving value proposition to database:', error.message);
    throw error;
  }
};

// Function to save campaign data to Firebase Realtime Database
const saveCampaignToDatabase = async (uid: string, campaignData: any): Promise<void> => {
  try {
    const campaignsRef = ref(database, `users/${uid}/campaigns`);
    const newCampaignRef = push(campaignsRef); // Create a new child node
    await set(newCampaignRef, campaignData); // Save campaign data under the new child node
  } catch (error: any) {
    console.error('Error saving campaign data to database:', error.message);
    throw error;
  }
};

// Export Firebase services and functions for use in other modules
export {
  auth,
  createAccountWithEmail,
  signInUserWithEmailAndPassword, // Export signInUserWithEmailAndPassword method
  sendSignInEmailLink,
  completeSignInWithEmailLink,
  saveValuePropToDatabase,
  saveCampaignToDatabase,
};
