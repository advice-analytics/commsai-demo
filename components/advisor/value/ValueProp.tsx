'use client'

import React, { useState, useEffect } from 'react';
import { saveValuePropToDatabase, getValuePropFromDatabase } from '@/utilities/firebaseClient';
import { useAuth } from '@/components/context/authContext'; // Import useAuth hook and UserData type

interface ValuePropProps {
  userId: string;
  onValuePropChange: (newValueProp: string) => void;
}

const ValueProp: React.FC<ValuePropProps> = ({ onValuePropChange }) => {
  const [valueProp, setValueProp] = useState('');
  const [currentChars, setCurrentChars] = useState(0);
  const [maxChars] = useState(250);
  const [loading, setLoading] = useState(true);

  const [userData] = useAuth(); // Retrieve userData from AuthContext
  const userId = userData.uid || ''; // Extract userId from userData or default to empty string

  useEffect(() => {
    const fetchValueProp = async () => {
      try {
        const fetchedValueProp = await getValuePropFromDatabase(userId);

        if (fetchedValueProp !== undefined) {
          setValueProp(fetchedValueProp); // Set valueProp to fetched value
          setCurrentChars(fetchedValueProp.length);
        } else {
          setValueProp(''); // Set valueProp to empty string if fetchedValueProp is undefined
          setCurrentChars(0);
        }

        setLoading(false); // Update loading state to indicate data has been fetched
      } catch (error) {
        console.error('Error fetching value proposition:', error);
        setLoading(false); // Update loading state even on error
      }
    };

    fetchValueProp(); // Invoke fetchValueProp on component mount
  }, [userId]); // Re-run effect when userId changes

  const handleSave = async () => {
    try {
      await saveValuePropToDatabase(userId, valueProp);
      alert('Value proposition saved successfully!');
    } catch (error) {
      console.error('Error saving value proposition:', error);
      alert('Failed to save value proposition. Please try again.');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValueProp = event.target.value;
    setValueProp(newValueProp);
    onValuePropChange(newValueProp);
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

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-2xl font-semibold mb-4 text-navyblue">Value Proposition</h2>
      <div className="mb-4">
        <label htmlFor="value-prop" className="block mb-2 text-navyblue">
          Enter Value Prop:
        </label>
        <textarea
          id="value-prop"
          value={valueProp}
          onChange={handleChange}
          className="border rounded-lg p-2 w-full h-40 text-navyblue resize-none"
          style={{ backgroundColor: 'white', minHeight: '120px' }}
          placeholder="Describe your value proposition here..."
        ></textarea>
        <p className={getColorForRating(currentChars)}>
          {currentChars}/{maxChars} characters entered
        </p>
      </div>
      <div className="flex items-center justify-between">
        <button
          onClick={handleSave}
          disabled={loading}
          className="bg-green-400 text-white px-4 py-2 rounded-md"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ValueProp;
