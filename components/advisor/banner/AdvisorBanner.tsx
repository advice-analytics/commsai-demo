
'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { auth } from '@/utilities/firebaseClient';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import ValuePropPopup from '../value/ValuePropPopup';
import ValueProp from '../value/ValueProp';

const serviceCategories = [
  { name: 'Retirement', icon: 'retirement-light.svg' },
  { name: 'Financial Plans', icon: 'financial-light.svg' },
  { name: 'Tax Plans', icon: 'money-light.svg' },
  { name: 'Investment', icon: 'investement-light.svg' },
  { name: 'Estate Plans', icon: 'estate-light.svg' },
];

const storage = getStorage(); // Initialize Firebase Storage

const AdvisorBanner: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [valuePropId, setValuePropId] = useState<string>('');
  const [showValuePropPopup, setShowValuePropPopup] = useState<boolean>(false);
  const [loadingProfile, setLoadingProfile] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
        const uidString = user.uid.toString();
        const lastFiveDigits = uidString.slice(-5);
        const commsId = lastFiveDigits.toUpperCase().padStart(5, '0');
        setValuePropId(commsId); // Set the value proposition ID based on the last five digits of UID
        loadProfilePicture(uidString); // Load profile picture based on user's UID
      } else {
        setUserEmail(null);
        setValuePropId('');
        setProfilePictureUrl(null); // Clear profile picture URL when user logs out
        setLoadingProfile(false); // Set loading to false when user is not authenticated
      }
    });
    return () => unsubscribe();
  }, []);

  const loadProfilePicture = async (uid: string) => {
    try {
      const storageRefPath = `profilePictures/${uid}.png`; // Construct storage reference path
      const storageReference = storageRef(storage, storageRefPath);
      const downloadUrl = await getDownloadURL(storageReference);
      setProfilePictureUrl(downloadUrl);
      setLoadingProfile(false); // Profile picture loaded, set loading to false
    } catch (error) {
      console.error('Error loading profile picture:', error);
      setProfilePictureUrl(null);
      setLoadingProfile(false); // Profile picture failed to load, set loading to false
    }
  };

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) {
          console.error('User not authenticated');
          return;
        }

        const storageRefPath = `profilePictures/${uid}.png`; // Use UID in storage path
        const storageReference = storageRef(storage, storageRefPath);
        const uploadTask = uploadBytesResumable(storageReference, file);

        uploadTask.on(
          'state_changed',
          null,
          (error: any) => {
            console.error('Error uploading profile picture:', error);
          },
          async () => {
            try {
              const downloadUrl = await getDownloadURL(storageReference);
              setProfilePictureUrl(downloadUrl);
              console.log('Profile picture uploaded successfully!');
            } catch (error) {
              console.error('Error getting download URL:', error);
            }
          }
        );
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
  };

  const handleValuePropClick = () => {
    setShowValuePropPopup(true);
  };

  const handleCloseValuePropPopup = () => {
    setShowValuePropPopup(false);
  };

  if (loadingProfile) {
    return <div>Loading...</div>; // Render a loading message while profile data is loading
  }

  return (
    <div className="advisor-banner">
      <div className="profile-section">
        <div className="profile-picture" onClick={() => document.getElementById('profile-picture-input')?.click()}>
          {profilePictureUrl ? (
            <Image src={profilePictureUrl} alt="Profile" width={100} height={100} />
          ) : (
            <Image src="/addphoto.png" alt="Profile Picture" width={150} height={150} priority />
          )}
          <input
            type="file"
            id="profile-picture-input"
            accept="image/jpeg, image/png"
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />
        </div>
        <div className="advisor-info">
          <div className="username">{userEmail}</div>
          <div className="commsid">
            Your CommsID: <span className="valuePropId">{valuePropId}</span>
          </div>
          <div className="value-prop-link" onClick={handleValuePropClick}>
            <u>Value Proposition</u>
          </div>
        </div>
        <div className="gear-icon" onClick={() => console.log('Settings clicked')}>
          <Image src="/gear.png" alt="Settings" width={30} height={30} />
        </div>
      </div>
      <div className="service-section-container">
        <div className="service-section">
          {serviceCategories.map((category, index) => (
            <div key={index} className="service-category">
              {category.name}
            </div>
          ))}
        </div>
      </div>
      {showValuePropPopup && (
        <ValuePropPopup onClose={handleCloseValuePropPopup}>
          <ValueProp
            valuePropId={valuePropId}
            userId={auth.currentUser?.uid || ''}
            ageGroup="30-45"
            role="Financial Advisor"
            description="I help clients plan and manage their finances."
            interests={['Investing', 'Retirement Planning']}
            onValuePropChange={(newValueProp) => {
              // Handle changes to the value proposition here if needed
            }}
          />
        </ValuePropPopup>
      )}
      <style jsx>{`
        .advisor-banner {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
          background-color: #144e74;
          border-radius: 5px;
          color: #fff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .profile-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          margin-bottom: 20px;
        }
        .profile-picture {
          position: relative;
          cursor: pointer;
        }
        .advisor-info {
          font-size: 12px;
        }
        .username {
          font-size: 10px;
          color: #f8c239;
        }
        .commsid {
          font-size: 10px;
          color: #fff;
        }
        .gear-icon {
          cursor: pointer;
          align-self: flex-start;
          margin-top: -5px; /* Adjust the margin as needed */
        }
        .value-prop-link {
          font-size: 10px;
          margin-top: 8px;
        }
        .service-section-container {
          display: flex;
          justify-content: center;
          width: 100%;
        }
        .service-section {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 4px;
        }
        .service-category {
          font-size: 10px;
          color: #fff;
          background-color: #144e74;
          padding: 4px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

export default AdvisorBanner;
