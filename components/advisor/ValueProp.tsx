'use client'

import React, { useState, useEffect } from 'react';
import { useValuePropContext } from '../context/ValuePropContext';
import { generateValuePropPrompt } from '@/utilities/promptGenAI';
import { saveValuePropToDatabase } from '@/utilities/firebaseClient';
import { openaiApiKey } from '@/constants/env';

interface ValuePropProps {
  onValuePropChange: (newValueProp: string) => void;
  valuePropId: string;
  userId: string;
  ageGroup: string;
  role: string;
  description: string;
  interests: string[];
}

const getColorForRating = (rating: 'poor' | 'ok' | 'good') => {
  switch (rating) {
    case 'poor':
      return 'text-red-500'; // Use Tailwind CSS class for red color
    case 'ok':
      return 'text-yellow-500'; // Use Tailwind CSS class for yellow color
    case 'good':
      return 'text-green-500'; // Use Tailwind CSS class for green color
    default:
      return 'text-gray-500'; // Fallback color (shouldn't hit this)
  }
};

const ValueProp: React.FC<ValuePropProps> = ({
  onValuePropChange,
  valuePropId,
  userId,
  ageGroup,
  role,
  description,
  interests,
}) => {
  const { setValueProp } = useValuePropContext();
  const [promptGenerated, setPromptGenerated] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [valueProp, setValuePropState] = useState('');
  const [currentChars, setCurrentChars] = useState(0); // Initialize character count
  const [promptRating, setPromptRating] = useState<'poor' | 'ok' | 'good'>('good');

  useEffect(() => {
    const fetchValueProp = async () => {
      const fetchedValueProp = await getValuePropFromDatabase(valuePropId);
      setValuePropState(fetchedValueProp);
      setValueProp(fetchedValueProp); // Update context with fetched value proposition
      setCurrentChars(fetchedValueProp.length); // Set current character count
      updatePromptRating(fetchedValueProp.length); // Update prompt rating based on fetched value proposition length
    };

    fetchValueProp();
  }, [valuePropId]);

  const getValuePropFromDatabase = async (valuePropId: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        const valuePropMap: Record<string, string> = {
          '12345678': 'Experienced financial advisor dedicated to guiding individuals and families with confidence. Specialized in wealth management, retirement planning, investments, and risk management.',
          // Add more mappings as needed
        };
        const fetchedValueProp = valuePropMap[valuePropId] || '';
        resolve(fetchedValueProp);
      }, 1000); // Simulate 1 second delay
    });
  };

  const handleValuePropChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValueProp = event.target.value;
    setValuePropState(newValueProp);
    onValuePropChange(newValueProp);

    setCurrentChars(newValueProp.length); // Update current character count
    updatePromptRating(newValueProp.length); // Update prompt rating based on new value proposition length
  };

  const updatePromptRating = (length: number) => {
    if (length === 0) {
      setPromptRating('poor');
    } else if (length < 50) {
      setPromptRating('poor');
    } else if (length >= 50 && length < 150) {
      setPromptRating('ok');
    } else {
      setPromptRating('good');
    }
  };

  const handleSave = async () => {
    try {
      await saveValuePropToDatabase(userId, valueProp);
      alert('Value proposition saved!');
    } catch (error) {
      console.error('Error saving value proposition:', error);
    }
  };

  const generatePromptWithAI = async () => {
    if (!valueProp) return;

    try {
      const valuePropPrompt: string = await generateValuePropPrompt(
        ageGroup,
        role,
        description,
        interests,
        userId // Pass userId as part of the prompt generation
      );

      const response = await fetchOpenAIResponse(valuePropPrompt);
      const generatedAssistantMessage = response?.choices?.[0]?.message?.content || '';

      setPrompt(generatedAssistantMessage);
      setPromptGenerated(true);
    } catch (error) {
      console.error('Error generating prompt with AI:', error);
    }
  };

  const fetchOpenAIResponse = async (prompt: string) => {
    const payload = {
      model: 'gpt-3.5-turbo-0125',
      messages: [{ role: 'assistant', content: prompt }],
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    return await response.json();
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg bg-white">
      <h2 className="text-3xl font-semibold mb-4 text-navyblue">Value Proposition</h2>
      <div className="mb-4">
        <label htmlFor="value-prop" className="block mb-2 text-navyblue">
          Enter Value Prop:
        </label>
        <textarea
          id="value-prop"
          value={valueProp}
          onChange={handleValuePropChange}
          className="border rounded-lg p-2 w-full text-navyblue" // Text color navyblue
          rows={5}
          maxLength={200} // Set the maximum character limit
          style={{ backgroundColor: 'white' }}
        ></textarea>
        <p className={getColorForRating(promptRating)}>
          {promptRating === 'poor' ? 'Value Prop is too short!' : promptRating === 'ok' ? 'Value Prop is ok!' : 'Value Prop is great!'}
        </p>
        <p className={getColorForRating(promptRating)}>
          {currentChars}/200 characters entered
        </p>
      </div>
      <div>
        <button onClick={generatePromptWithAI} className="bg-navyblue text-white px-4 py-2 rounded-md mr-2">
          Create
        </button>
        {promptGenerated && (
          <>
            <h3 className="text-lg font-semibold mt-4 text-navyblue">Your Value Proposition</h3>
            <p className="text-black">{prompt}</p>
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">
              Save
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ValueProp;
