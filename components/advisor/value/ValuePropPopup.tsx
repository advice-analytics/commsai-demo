import React from 'react';

interface ValuePropPopupProps {
  children: React.ReactNode;
  onClose: () => void;
  valueProp: string; // Define a prop to receive the value proposition
}

const ValuePropPopup: React.FC<ValuePropPopupProps> = ({ children, onClose, valueProp }) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Check if the click occurred on the overlay (outside the popup content)
    if (e.target === e.currentTarget) {
      onClose(); // Close the popup when overlay is clicked
    }
  };

  return (
    <div className="value-prop-popup" onClick={handleOverlayClick}>
      <div className="popup-content">
        <div className="popup-header">
          <h2 className="popup-title">Edit Value Proposition</h2>
          <button className="close-button" onClick={onClose}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="popup-body">
          {/* Display the value proposition inside the popup */}
          <p>{valueProp}</p>
          {children}
        </div>
      </div>
      <style jsx>{`
        .value-prop-popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .popup-content {
          background-color: #fff;
          width: 90%;
          max-width: 1000px;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
          overflow-y: auto;
          max-height: 70vh; 
        }
        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        .popup-title {
          font-size: 20px;
          color: #333;
          margin: 0;
        }
        .close-button {
          background: none;
          color: black;
          border: none;
          cursor: pointer;
          padding: 0;
          outline: none;
        }
        .popup-body {
          margin-bottom: 20px;
          overflow: auto; /* Enable scrolling */
        }
      `}</style>
    </div>
  );
};

export default ValuePropPopup;