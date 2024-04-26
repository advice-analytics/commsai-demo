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
        .file-upload-btn {
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
        .file-upload-btn:hover {
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
