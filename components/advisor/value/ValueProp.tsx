'use client'

import React, { useState, useEffect } from 'react';
import { saveValuePropToDatabase, getValuePropFromDatabase } from '@/utilities/firebaseClient';
import { generateValuePropPrompt  } from '@/utilities/valuePrompt';
import { useAuth } from '@/components/context/authContext'; // Import useAuth hook

interface ValuePropProps {
  uid: string;
  initialValue: string;
  onValuePropChange: (newValueProp: string) => void; // Change to void

}

const ValueProp: React.FC<ValuePropProps> = ({ uid, initialValue }) => {
  const [valueProp, setValueProp] = useState(initialValue);
  const [currentChars, setCurrentChars] = useState(initialValue ? initialValue.length : 0);
  const [maxChars] = useState(1000);
  const [loading, setLoading] = useState(false);
  const [idealClient, setIdealClient] = useState<string[]>([]);
  const [role, setRole] = useState<string>('');
  const [uniqueDescription, setUniqueDescription] = useState<string>('');
  const [created, setCreated] = useState(false); // Track creation status
  const [userData, loadingAuth] = useAuth(); // Use useAuth hook

  useEffect(() => {
    const fetchValueProp = async () => {
      if (uid) {
        setLoading(true);
        try {
          const fetchedValueProp = await getValuePropFromDatabase(uid);
          if (fetchedValueProp !== undefined) {
            setValueProp(fetchedValueProp);
            setCurrentChars(fetchedValueProp.length);
            setCreated(true); // Mark as created since value prop exists
          } else {
            setValueProp('');
            setCurrentChars(0);
            setCreated(false);
          }
        } catch (error) {
          console.error('Error fetching value proposition:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchValueProp();
  }, [uid]);

  const handleSave = async () => {
    if (uid && valueProp.trim() !== '') {
      setLoading(true);
      try {
        await saveValuePropToDatabase(uid, valueProp);
        alert('Value proposition saved successfully!');
      } catch (error) {
        console.error('Error saving value proposition:', error);
        alert('Failed to save value proposition. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValueProp = event.target.value;
    setValueProp(newValueProp);
    setCurrentChars(newValueProp.length);
  };

  const getColorForRating = (chars: number): string => {
    if (chars < maxChars * 0.5) {
      return 'text-red-500';
    } else if (chars < maxChars * 0.8) {
      return 'text-yellow-500';
    } else {
      return 'text-green-500';
    }
  };

  const handleGenerateValueProp = async () => {
    if (idealClient.length === 0 || !role || !uniqueDescription) {
      alert('Please provide all required information (ideal client, role, uniqueness) before generating.');
      return;
    }
  
    setLoading(true);
    try {
      const generatedValueProp = await generateValuePropPrompt(
        idealClient.join(', '),
        role,
        uniqueDescription,
        uid
      );
      setValueProp(generatedValueProp);
      setCreated(true); // Mark as created after generating
      alert('Value proposition generated successfully!');
    } catch (error) {
      console.error('Error generating value proposition:', error);
      alert('Failed to generate value proposition. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const handleDelete = async () => {
    // Reset value prop and update database if uid is available
    setValueProp('');
    setCurrentChars(0);
    setCreated(false); // Reset creation status
    if (uid) {
      try {
        await saveValuePropToDatabase(uid, ''); // Update database with empty value
        alert('Value proposition deleted successfully!');
      } catch (error) {
        console.error('Error deleting value proposition:', error);
        alert('Failed to delete value proposition. Please try again.');
      }
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-navyblue">Value Proposition</h2>
      <div className="mb-4">
        <label htmlFor="ideal-client" className="block mb-2 text-navyblue">
          Describe your ideal client (Check all that apply):
        </label>
        <div>
            <label className="mr-4 text-black">
              <input
                type="radio"
                name="age"
                value="< 25"
                onChange={(e) => setIdealClient([e.target.value])}
              />{' '}
              &lt; 25
            </label>
            <label className="mr-4 text-black">
              <input
                type="radio"
                name="age"
                value="25 - 35"
                onChange={(e) => setIdealClient([e.target.value])}
              />{' '}
              25 - 35 
            </label>
            <label className="mr-4 text-black">
              <input
                type="radio"
                name="age"
                value="35 - 45"
                onChange={(e) => setIdealClient([e.target.value])}
              />{' '}
              35 - 45 
            </label>
            <label className="mr-4 text-black">
              <input
                type="radio"
                name="age"
                value="45 - 55"
                onChange={(e) => setIdealClient([e.target.value])}
              />{' '}
              45 - 55 
            </label>
            <label className="mr-4 text-black">
              <input
                type="radio"
                name="age"
                value="55 - 65"
                onChange={(e) => setIdealClient([e.target.value])}
              />{' '}
              55 - 65 
            </label>
            <label className="mr-4 text-black">
              <input
                type="radio"
                name="age"
                value="65+"
                onChange={(e) => setIdealClient([e.target.value])}
              />{' '}
              65+
            </label>
          </div>
          <label htmlFor="role" className="block mt-4 mb-2 text-navyblue">
            Role:
          </label>
          <div>
            <label className="mr-4 text-black">
              <input
                type="radio"
                name="role"
                value="Executives"
                onChange={(e) => setRole(e.target.value)}
              />{' '}
              Executives
            </label>
            <label className="mr-4 text-black">
              <input
                type="radio"
                name="role"
                value="Business owners"
                onChange={(e) => setRole(e.target.value)}
              />{' '}
              Business owners
            </label>
            <label className="mr-4 text-black">
              <input
                type="radio"
                name="role"
                value="Family"
                onChange={(e) => setRole(e.target.value)}
              />{' '}
              Family
            </label>
            <label className="mr-4 text-black">
              <input
                type="radio"
                name="role"
                value="Retirees"
                onChange={(e) => setRole(e.target.value)}
              />{' '}
              Retirees
            </label>
            <label className="mr-4 text-black">
              <input
                type="radio"
                name="role"
                value="Other"
                onChange={(e) => setRole(e.target.value)}
              />{' '}
              Other
            </label>
          </div>
        {/* Add similar radio inputs for 'Role' selection */}
        <label htmlFor="unique-description" className="block mt-4 mb-2 text-navyblue">
          Briefly describe why you are unique:
        </label>
        <input
          type="text"
          id="unique-description"
          value={uniqueDescription}
          onChange={(e) => setUniqueDescription(e.target.value)}
          className="border rounded-lg p-2 w-full text-black"
          placeholder="e.g., focused on complex family and business situations"
        />
        <button
          onClick={handleGenerateValueProp}
          className="bg-blue-400 text-white px-4 py-2 rounded-md mt-4"
        >
          Generate Value Prop
        </button>
      </div>
      {/* Display generated value prop and controls if 'created' is true */}
      {created && (
        <div className="mb-4">
          <p className="text-navyblue mb-2">Generated Value Proposition:</p>
          <textarea
            value={valueProp}
            onChange={handleChange}
            className="border rounded-lg p-2 w-full h-40 text-navyblue resize-none"
            style={{ backgroundColor: 'white', minHeight: '120px' }}
          />
          <p className={getColorForRating(currentChars)}>
            {currentChars}/{maxChars} characters entered
          </p>
          <div className="flex items-center justify-between mt-4">
            <button
              onClick={handleSave}
              disabled={loading || !uid}
              className="bg-green-400 text-white px-4 py-2 rounded-md"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-400 text-white px-4 py-2 rounded-md"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ValueProp;
