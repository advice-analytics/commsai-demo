'use client';

import React, { useState, useEffect } from 'react';
import { useValuePropContext } from '../../context/ValuePropContext';
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
      return 'text-red-500';
    case 'ok':
      return 'text-yellow-500';
    case 'good':
      return 'text-green-500';
    default:
      return 'text-gray-500';
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
  const [currentChars, setCurrentChars] = useState(0);
  const maxChars = 250;

  useEffect(() => {
    const fetchValueProp = async () => {
      const fetchedValueProp = await getValuePropFromDatabase(valuePropId);
      setValuePropState(fetchedValueProp);
      setValueProp(fetchedValueProp);
      setCurrentChars(fetchedValueProp.length);
      updatePromptRating(fetchedValueProp.length);
    };

    fetchValueProp();
  }, [valuePropId]);

  const getValuePropFromDatabase = async (valuePropId: string): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      setTimeout(() => {
        const valuePropMap: Record<string, string> = {
          '123': 'Your saved value proposition goes here...',
        };
        const fetchedValueProp = valuePropMap[valuePropId] || '';
        resolve(fetchedValueProp);
      }, 1000);
    });
  };

  const handleValuePropChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValueProp = event.target.value;
    setValuePropState(newValueProp);
    onValuePropChange(newValueProp);

    setCurrentChars(newValueProp.length);
    updatePromptRating(newValueProp.length);
  };

  const updatePromptRating = (length: number) => {
    if (length === 0) {
      setPromptGenerated(false);
    }

    if (length < 50) {
      setPromptGenerated(false);
    } else if (length >= 50 && length < 150) {
      setPromptGenerated(true);
    } else {
      setPromptGenerated(true);
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
        userId
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
          className="border rounded-lg p-2 w-full h-40 text-navyblue resize-none"
          style={{ backgroundColor: 'white', minHeight: '120px' }}
          placeholder="Describe your value proposition here..."
        ></textarea>
        <p className={getColorForRating(currentChars < maxChars ? 'poor' : currentChars < 150 ? 'ok' : 'good')}>
          {currentChars}/{maxChars} characters entered
        </p>
      </div>
      <div className="flex items-center justify-between">
        <button onClick={generatePromptWithAI} className="bg-navyblue text-white px-4 py-2 rounded-md">
          Generate Prompt
        </button>
        <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-md">
          Save
        </button>
      </div>
      {promptGenerated && (
        <div>
          <h3 className="text-lg font-semibold mt-4 text-navyblue">Generated Prompt</h3>
          <p className="text-black">{prompt}</p>
        </div>
      )}
    </div>
  );
};

export default ValueProp;
