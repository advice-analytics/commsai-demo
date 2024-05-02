import { initializeApp } from 'firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  Auth,
} from 'firebase/auth';
import {
  getDatabase,
  ref as dbRef,
  push,
  set,
  remove,
  Database,
  DataSnapshot,
  get,
} from 'firebase/database';
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
  StorageReference,
  UploadTask,
  getMetadata,
} from 'firebase/storage';

import { Campaign } from '@/types/CampaignTypes';

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

// Initialize Firebase storage
const storage = getStorage(app);

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
const sendSignInEmailLink = async (email: string) => {
  const actionCodeSettings = {
    url: `${window.location.origin}/advisor?email=${encodeURIComponent(email)}`, // Include email parameter in URL
    handleCodeInApp: true,
  };

  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    console.log('Passwordless sign-in link sent to email:', email);
  } catch (error: any) {
    console.error('Error sending passwordless sign-in link:', error.message);
    throw error;
  }
};

// Function to complete sign-in with email link
const completeSignInWithEmailLink = async (email: string, url: string) => {
  if (isSignInWithEmailLink(auth, url)) {
    try {
      const result = await signInWithEmailLink(auth, email, url);
      return result;
    } catch (error: any) {
      console.error('Error completing sign-in with email link:', error.message);
      throw error;
    }
  } else {
    throw new Error('Invalid sign-in link');
  }
};

// Function to save value proposition to Firebase Realtime Database
const saveValuePropToDatabase = async (uid: string, valueProp: string): Promise<void> => {
  try {
    const valuePropRef = dbRef(database, `users/${uid}/valueProp`);
    await set(valuePropRef, { value: valueProp });
    console.log('Value proposition saved successfully.');
  } catch (error: any) {
    console.error('Error saving value proposition to database:', error.message);
    throw error;
  }
};

// Function to get value proposition from Firebase Realtime Database
const getValuePropFromDatabase = async (uid: string): Promise<string> => {
  try {
    const valuePropRef = dbRef(database, `users/${uid}/valueProp`);
    const dataSnapshot: DataSnapshot = await get(valuePropRef);
    const valuePropData = dataSnapshot.val();

    // If value proposition exists, return it, otherwise return an empty string
    return valuePropData ? valuePropData.value : '';
  } catch (error: any) {
    console.error('Error getting value proposition from database:', error.message);
    throw error;
  }
};

const deleteCampaignFromDatabase = async (campaignId: string): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User is not authenticated.');
    }

    const uid = user.uid;
    const campaignRef = dbRef(database, `users/${uid}/campaigns/${campaignId}`);
    await remove(campaignRef);

    console.log(`Campaign data with ID ${campaignId} deleted successfully for uid ${uid}.`);
  } catch (error: any) {
    console.error('Error deleting campaign data from database:', error.message);
    throw error;
  }
};

// Function to save campaign data to Firebase Realtime Database
const saveCampaignToDatabase = async (uid: string, campaign: Campaign): Promise<void> => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User is not authenticated.');
    }

    const uid = user.uid;
    const campaignsRef = dbRef(database, `users/${uid}/campaigns`);

    // Save campaign data under a new push ID (Firebase generates unique ID)
    const newCampaignRef = push(campaignsRef);
    await set(newCampaignRef, campaign);

    console.log(`Campaign data saved successfully for uid ${uid}.`);
  } catch (error: any) {
    console.error('Error saving campaign data to database:', error.message);
    throw error;
  }
};

// Function to retrieve campaigns for a specific user from Firebase Realtime Database
const getCampaignsForUser = async (uid: string): Promise<Campaign[]> => {
  try {
    const campaignsRef = dbRef(database, `users/${uid}/campaigns`);
    const dataSnapshot: DataSnapshot = await get(campaignsRef);

    const campaigns: Campaign[] = [];
    dataSnapshot.forEach((childSnapshot) => {
      const campaignData = childSnapshot.val();
      const campaign: Campaign = {
        id: childSnapshot.key || '', // Use Firebase-generated key as campaign ID
        name: campaignData.name || '',
        type: campaignData.type || '',
        ageGroup: campaignData.ageGroup || '',
        plan: campaignData.plan || '',
        planName: campaignData.planName || '',
        prompt: campaignData.prompt || '',
        participant: campaignData.participant || null,
      };
      campaigns.push(campaign);
    });

    return campaigns;
  } catch (error) {
    console.error('Error retrieving campaigns from database:', error);
    throw error;
  }
};

// Function to upload user profile picture with dynamic file extension
const uploadProfilePicture = async (uid: string, file: File): Promise<string> => {
  try {
    const fileExtension = file.name.split('.').pop(); // Get file extension
    if (!fileExtension) {
      throw new Error('Invalid file format');
    }

    const storageRefPath = `profilePictures/${uid}/${uid}.${fileExtension}`;
    const storageReference: StorageReference = storageRef(storage, storageRefPath);
    const uploadTask: UploadTask = uploadBytesResumable(storageReference, file);

    const snapshot = await uploadTask;
    const downloadURL: string = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error: any) {
    console.error('Error uploading profile picture:', error.message);
    throw error;
  }
};

// Function to get user profile picture download URL with dynamic file extension
const getProfilePictureURL = async (uid: string): Promise<string | null> => {
  try {
    // Assuming the profile picture's file extension is unknown, we retrieve it from the storage reference
    const storageRefPath = `profilePictures/${uid}/${uid}`; // Storage path without extension
    const storageReference: StorageReference = storageRef(storage, storageRefPath);

    // Get metadata to extract the file extension
    const metadata = await getMetadata(storageReference);
    const fileExtension = metadata.contentType?.split('/')[1]; // Extract file extension from content type

    if (!fileExtension) {
      throw new Error('Invalid file format');
    }

    const fullPath = `${storageRefPath}.${fileExtension}`;
    const updatedStorageReference: StorageReference = storageRef(storage, fullPath);
    const downloadURL: string = await getDownloadURL(updatedStorageReference);

    return downloadURL;
  } catch (error: any) {
    console.error('Error getting profile picture URL:', error.message);
    return null;
  }
};

// Export Firebase services and functions for use in other modules
export {
  getCampaignsForUser,
  auth,
  createAccountWithEmail,
  signInUserWithEmailAndPassword,
  sendSignInEmailLink,
  completeSignInWithEmailLink,
  saveValuePropToDatabase,
  getValuePropFromDatabase,
  deleteCampaignFromDatabase,
  saveCampaignToDatabase,
  uploadProfilePicture,
  getProfilePictureURL,
  storage,
};
