'use client'

// ValuePropContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ValuePropContextData {
  targetClient: string;
  valueProp: string;
  score: string;
  promptRating: string; // Add promptRating to the context data
  setTargetClient: (client: string) => void;
  setValueProp: (prop: string) => void;
  setScore: (score: string) => void;
  setPromptRating: (rating: string) => void; // Add setPromptRating to update promptRating
}

const ValuePropContext = createContext<ValuePropContextData>({
  targetClient: '',
  valueProp: '',
  score: '',
  promptRating: '', // Initialize promptRating
  setTargetClient: () => {},
  setValueProp: () => {},
  setScore: () => {},
  setPromptRating: () => {}, // Initialize setPromptRating
});

export const useValuePropContext = () => useContext(ValuePropContext);

interface ValuePropProviderProps {
  children: ReactNode;
}

export const ValuePropProvider: React.FC<ValuePropProviderProps> = ({ children }) => {
  const [targetClient, setTargetClient] = useState('');
  const [valueProp, setValueProp] = useState('');
  const [score, setScore] = useState('');
  const [promptRating, setPromptRating] = useState(''); // Initialize promptRating

  return (
    <ValuePropContext.Provider
      value={{
        targetClient,
        valueProp,
        score,
        promptRating, // Pass promptRating to the context value
        setTargetClient,
        setValueProp,
        setScore,
        setPromptRating, // Pass setPromptRating to the context value
      }}
    >
      {children}
    </ValuePropContext.Provider>
  );
};
