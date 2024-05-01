'use client'

import React, { useState, useEffect } from 'react';
import { saveValuePropToDatabase, getValuePropFromDatabase } from '@/utilities/firebaseClient';
import { useAuth } from '@/components/context/authContext';

interface ValuePropProps {
  uid: string; // Change userId to uid
  onValuePropChange: (newValueProp: string) => void;
  initialValue: string;
}

const ValueProp: React.FC<ValuePropProps> = ({ uid, onValuePropChange, initialValue }) => {
  const [valueProp, setValueProp] = useState(initialValue);
  const [currentChars, setCurrentChars] = useState(initialValue ? initialValue.length : 0);
  const [maxChars] = useState(250);
  const [loading, setLoading] = useState(false);

  const [userData, loadingAuth] = useAuth();
  // Extract uid from userData instead of userId
  const userId = userData?.uid || '';

  useEffect(() => {
    const fetchValueProp = async () => {
      if (uid) { // Use uid instead of userId
        setLoading(true);
        try {
          const fetchedValueProp = await getValuePropFromDatabase(uid); // Use uid instead of userId
          if (fetchedValueProp !== undefined) {
            setValueProp(fetchedValueProp);
            setCurrentChars(fetchedValueProp.length);
          } else {
            setValueProp('');
            setCurrentChars(0);
          }
        } catch (error) {
          console.error('Error fetching value proposition:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchValueProp();
  }, [uid]); // Re-run effect when uid changes

  const handleSave = async () => {
    if (uid && valueProp.trim() !== '') {
      setLoading(true);
      try {
        await saveValuePropToDatabase(uid, valueProp); // Use uid instead of userId
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
          disabled={loading || !uid} // Use uid instead of userId
          className="bg-green-400 text-white px-4 py-2 rounded-md"
        >
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default ValueProp;
