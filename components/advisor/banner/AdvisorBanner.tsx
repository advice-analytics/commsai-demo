'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { auth } from '@/utilities/firebaseClient';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import AdvisorInfo from './AdvisorInfo';
import ValuePropPopup from '../value/ValuePropPopup';
import ValueProp from '../value/ValueProp';
import { saveValuePropToDatabase, getValuePropFromDatabase } from '@/utilities/firebaseClient'; // Import Firebase functions

const serviceCategories = [
  { name: 'Retirement', icon: 'retirement-light.svg' },
  { name: 'Financial Plans', icon: 'financial-light.svg' },
  { name: 'Tax Plans', icon: 'money-light.svg' },
  { name: 'Investment', icon: 'investement-light.svg' },
  { name: 'Estate Plans', icon: 'estate-light.svg' },
];

const storage = getStorage();

const AdvisorBanner: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [valuePropId, setValuePropId] = useState<string>('');
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
  const [showValuePropPopup, setShowValuePropPopup] = useState<boolean>(false);
  const [showAdvisorInfo, setShowAdvisorInfo] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
        const uidString = user.uid.toString();
        const lastFiveDigits = uidString.slice(-5);
        const commsId = lastFiveDigits.toUpperCase().padStart(5, '0');
        setValuePropId(commsId);
        loadProfilePicture(uidString);
      } else {
        setUserEmail(null);
        setValuePropId('');
        setProfilePictureUrl(null);
        setLoadingProfile(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadProfilePicture = async (uid: string) => {
    try {
      const storageRefPath = `profilePictures/${uid}.png`;
      const storageReference = storageRef(storage, storageRefPath);
      const downloadUrl = await getDownloadURL(storageReference);
      setProfilePictureUrl(downloadUrl);
      setLoadingProfile(false);
    } catch (error) {
      console.error('Error loading profile picture:', error);
      setLoadingProfile(false);
    }
  };

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      try {
        setLoadingProfile(true);
        const uid = auth.currentUser?.uid;
        if (!uid) {
          throw new Error('User not authenticated');
        }

        const storageRefPath = `profilePictures/${uid}.png`;
        const storageReference = storageRef(storage, storageRefPath);
        const uploadTask = uploadBytesResumable(storageReference, file);

        uploadTask.on(
          'state_changed',
          null,
          (error: any) => {
            console.error('Error uploading profile picture:', error);
            setLoadingProfile(false);
          },
          async () => {
            try {
              const downloadUrl = await getDownloadURL(storageReference);
              setProfilePictureUrl(downloadUrl);
              setLoadingProfile(false);
              console.log('Profile picture uploaded successfully!');
            } catch (error) {
              console.error('Error getting download URL:', error);
              setLoadingProfile(false);
            }
          }
        );
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        setLoadingProfile(false);
      }
    }
  };

  const handleValuePropClick = () => {
    setShowValuePropPopup(true);
  };

  const handleCloseValuePropPopup = () => {
    setShowValuePropPopup(false);
  };

  const handleGearIconClick = () => {
    setShowAdvisorInfo(true);
  };

  return (
    <div className="advisor-banner bg-blue-900 text-white p-4 rounded-md shadow-md relative">
      <div className="profile-section flex justify-between items-center w-full mb-4">
        <div className="profile-picture relative cursor-pointer" onClick={() => document.getElementById('profile-picture-input')?.click()}>
          {loadingProfile ? (
            <div className="loading-spinner absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-sm font-bold bg-black bg-opacity-75 px-2 py-1 rounded">
              Loading Profile...
            </div>
          ) : (
            <>
              {profilePictureUrl ? (
                <Image src={profilePictureUrl} alt="Profile" width={100} height={100} layout="fixed" />
              ) : (
                <Image src="/addphoto.png" alt="Profile Picture" width={100} height={100} layout="fixed" priority />
              )}
            </>
          )}
          <input
            type="file"
            id="profile-picture-input"
            accept="image/jpeg, image/png"
            className="hidden"
            onChange={handleFileInputChange}
          />
        </div>
        <div className="advisor-info text-right">
          <div className="username text-yellow-300 text-sm">{userEmail}</div>
          <div className="commsid text-sm text-white">Your CommsID: <span className="valuePropId text-green-400">{valuePropId}</span></div>
          <div className="value-prop-link text-sm cursor-pointer underline" onClick={handleValuePropClick}>Value Proposition</div>
        </div>
        <div className="gear-icon cursor-pointer" onClick={handleGearIconClick}>
          <Image src="/gear.png" alt="Settings" width={30} height={30} />
        </div>
      </div>
      <div className="service-section-container">
        <div className="service-section flex flex-wrap justify-center">
          {serviceCategories.map((category, index) => (
            <div key={index} className="service-category text-white rounded-md mr-2 mb-2">
              {category.name}
            </div>
          ))}
        </div>
      </div>
      {showValuePropPopup && (
        <ValuePropPopup onClose={handleCloseValuePropPopup} valueProp="Load value">
          <ValueProp
            uid={auth.currentUser?.uid || ''} // Use 'uid' instead of 'userId'
            initialValue="Default Value"
            onValuePropChange={(newValueProp) => {
              // Handle changes to the value proposition here if needed
              saveValuePropToDatabase(auth.currentUser?.uid || '', newValueProp); // Save value proposition to database
            }}
          />
        </ValuePropPopup>
      )}
      {showAdvisorInfo && (
        <AdvisorInfo
          userEmail={userEmail}
          valuePropId={valuePropId}
          onClose={() => setShowAdvisorInfo(false)}
        />
      )}
    </div>
  );
};

export default AdvisorBanner;