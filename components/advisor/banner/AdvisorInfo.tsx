'use client'

import React from 'react';
import { auth } from '@/utilities/firebaseClient';
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

interface AdvisorInfoProps {
  userEmail: string | null;
  valuePropId: string;
  onClose: () => void;
}

const AdvisorInfo: React.FC<AdvisorInfoProps> = ({ userEmail, valuePropId, onClose }) => {
  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = '/';
    } catch (error: any) {
      console.error('Error logging out:', error.message);
    }
  };

  const handlePlanDataUpload = async (file: File) => {
    try {
      const storageInstance = getStorage();
      const filePath = `plans/${valuePropId}/${file.name}`;
      const fileRef = storageRef(storageInstance, filePath);

      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Handle upload progress if needed
        },
        (error) => {
          console.error('Error uploading file:', error.message);
        },
        async () => {
          const downloadURL = await getDownloadURL(fileRef);
          console.log('File uploaded successfully:', downloadURL);
          // Handle success message or additional logic after upload
        }
      );
    } catch (error: any) {
      console.error('Error uploading plan data:', error.message);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];
      handlePlanDataUpload(file);
    }
  };

  const handleDownloadExampleData = () => {
    // Example data to be downloaded as a JSON or CSV file
    const exampleData = `
      IDPerson | 3426401
      Participant Name |  [{IDV:549:2F05CDFE:5241}]
      Employee ID | [{IDV:549:0B9CB369:68507}]
      Balance | $1,201,564.01 
      Has Balance | Yes
      Glide path | Above glide path
      Pct equity (est) | 96%
      Plan Returns | 30.20%
      Contributors & Non-contributors | Contributors
      Contributed YTD | $3,030.00 
      Contributed to IRS limit | $3,030.00 
      Contributor Types | YTD Pre-Tax
      Can Contribute | Yes
      Employee Status | Active
      Age | 50.2
      Tenure | 24.8
      Savings Rate % | 5.00%
      Advice Status | Manage On Your Own
      Years in Current Advice Status | 3.5
      My Ret Prog. Projected Income % | 99.00%
      My Ret Prog. Income Expected | $8,638.00 
      Investments diversified? | No
      Investor Profile Employer | stock user
      Participant Division Code | 1
      Plan Division Name | [{IDV:549:530B274B:1}]
      State | NE
      Using SDBA | Not using SDBA`;

    // Convert exampleData to Blob and create an anchor element for download
    const blob = new Blob([exampleData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'example_data.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Close the modal only if the click is on the overlay backdrop (outside modal content)
    if (e.target === e.currentTarget) {
      onClose(); // Trigger onClose callback to close the modal
    }
  };

  return (
    <div className="advisor-info-modal" onClick={handleOverlayClick}>
      <div className="modal-content">
        <h1>Settings</h1>
        <p><strong>Email:</strong> {userEmail}</p>
        <p><strong>CommsID:</strong> {valuePropId}</p>
        <div className="settings">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
          <label className="file-upload-btn">
            Upload Plan Data
            <input type="file" onChange={handleFileInputChange} className="file-input" />
          </label>
          <button className="download-example-btn" onClick={handleDownloadExampleData}>Download Example Data</button>
        </div>
      </div>
      <style jsx>{`
        .advisor-info-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(0, 0, 0, 0.5);
          color: #144e74;
          z-index: 1000; /* Ensure the modal is above other elements */
        }
        .modal-content {
          background-color: #fefefe;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          width: 400px;
          max-width: 90%;
          text-align: center;
          position: relative; /* Ensure modal content can position properly */
          z-index: 1010; /* Ensure the modal content is above the overlay */
        }
        .settings {
          margin-top: 20px;
        }
        .logout-btn,
        .file-upload-btn,
        .download-example-btn {
          display: block;
          width: 100%;
          margin-bottom: 10px;
          padding: 12px 0;
          font-size: 16px;
          border: none;
          border-radius: 4px;
          background-color: #ddd;
          color: #fff;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .logout-btn:hover,
        .file-upload-btn:hover,
        .download-example-btn:hover {
          background-color: #144e74;
        }
        .file-input {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default AdvisorInfo;
