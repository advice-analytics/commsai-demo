'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { auth } from '@/utilities/firebaseClient';

const serviceCategories = [
  { name: 'Retirement', icon: 'retirement-light.svg' },
  { name: 'Financial Plans', icon: 'financial-light.svg' },
  { name: 'Tax Plans', icon: 'money-light.svg' },
  { name: 'Investment', icon: 'investement-light.svg' },
  { name: 'Estate Plans', icon: 'estate-light.svg' },
];

const AdvisorBanner: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [valuePropId, setValuePropId] = useState<string>('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
        const uidString = user.uid.toString();
        const lastFiveDigits = uidString.slice(-5);
        const commsId = lastFiveDigits.toUpperCase().padStart(5, '0');
        setValuePropId(commsId);
      } else {
        setUserEmail(null);
        setValuePropId('');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      try {
        const userIdentifier = userEmail?.replace(/[^\w\s]/gi, '');
        const fileExtension = file.name.split('.').pop();
        if (!fileExtension) {
          console.error('Invalid file format');
          return;
        }
        const downloadUrl = `/profilePictures/${userIdentifier}.${fileExtension}`;
        setProfilePictureUrl(downloadUrl);
        console.log('Profile picture uploaded successfully!');
      } catch (error) {
        console.error('Error uploading profile picture:', error);
      }
    }
  };

  const handleValuePropClick = () => {
    console.log('Navigate to value proposition:', valuePropId);
  };

  return (
    <div className='advisor-banner'>
      <div className='profile-section'>
        <div className='profile-picture' onClick={() => document.getElementById('profile-picture-input')?.click()}>
          {profilePictureUrl ? (
            <Image src={profilePictureUrl} alt="Profile" width={100} height={100} />
          ) : (
            <Image src="/profilephoto.png" alt="Profile Picture" width={150} height={150} priority />
          )}
          <input
            type="file"
            id="profile-picture-input"
            accept="image/jpeg, image/png"
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />
        </div>
        <div className='advisor-info'>
          <div className='username'>{userEmail}</div>
          <div className='commsid'>
            Your CommsID: <span className='valuePropId'>{valuePropId}</span>
          </div>
          <div className='value-prop-link' onClick={handleValuePropClick}>
            <u>Value Proposition</u>
          </div>
        </div>
      </div>
      <div className='service-section-container'>
        <div className='service-section'>
          {serviceCategories.map((category, index) => (
            <div key={index} className='service-category'>
              {category.name}
            </div>
          ))}
        </div>
      </div>
      <style jsx>{`
        .advisor-banner {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 20px;
        }
        .service-section-container {
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        .service-section {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        .service-category {
          font-size: 10px;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default AdvisorBanner;
