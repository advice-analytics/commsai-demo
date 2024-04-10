// Import React and necessary hooks
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { auth } from '@/utilities/firebaseClient'; // Import the auth object from Firebase client module

// Define the service categories
const serviceCategories = [
  { name: 'Retirement', icon: 'retirement-light.svg' },
  { name: 'Financial Plans', icon: 'financial-light.svg' },
  { name: 'Tax Plans', icon: 'money-light.svg' },
  { name: 'Investment', icon: 'investement-light.svg' },
  { name: 'Estate Plans', icon: 'estate-light.svg' },
  { name: 'Other', icon: 'other-light.svg' },
];

// Define the AdvisorBanner component
const AdvisorBanner: React.FC = () => {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState<string | null>(null);
  const [valuePropId, setValuePropId] = useState<string>(''); // State to store value proposition ID

  // Effect to subscribe to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email);
        // Simulate fetching value prop ID from database based on user (replace with actual logic)
        setValuePropId('12345678'); // Example value proposition ID
      } else {
        setUserEmail(null);
        setValuePropId('');
      }
    });

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, []);

  // Handler for file input change (profile picture upload)
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

  // Handler for clicking on the value proposition ID
  const handleValuePropClick = () => {
    console.log('Navigate to value proposition:', valuePropId); // Navigate to value prop section (replace with actual navigation logic)
    // Implement navigation logic to the value proposition section
  };

  return (
    <div className='advisor-banner'>
      <div className='profile-section'>
        <div className='profile-picture' onClick={() => document.getElementById('profile-picture-input')?.click()}>
          {profilePictureUrl ? (
            <img src={profilePictureUrl} alt="Profile" width={100} height={100} />
          ) : (
            <Image src="/profilephoto.png" alt="Profile Picture" width={100} height={100} priority />
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
          <div className='commsid' onClick={handleValuePropClick}>
            Your CommsID: <span className='valuePropId' onClick={handleValuePropClick}>{valuePropId}</span>
          </div>
          <div className='username'>{userEmail}</div>
        </div>
      </div>
      <div className='service-section'>
        {serviceCategories.map((category, index) => (
          <div key={index} className='service-category'>
            <img src={`/light/${category.icon}`} alt={category.name} className='category-icon' />
            <span>{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdvisorBanner;
