'use client'

import React, { useState, useEffect } from 'react';
import { useValuePropContext } from '../context/ValuePropContext';

interface ValuePropProps {
  onValuePropChange: (newValueProp: string) => void;
  valuePropId: string; // Accept valuePropId as a prop
}

const ValueProp: React.FC<ValuePropProps> = ({ onValuePropChange, valuePropId }) => {
  const { valueProp, setValueProp, promptRating, setPromptRating } = useValuePropContext();
  const [promptGenerated, setPromptGenerated] = useState(false);
  const [prompt, setPrompt] = useState('');

  // Function to simulate fetching value proposition from database
  async function getValuePropFromDatabase(valuePropId: string): Promise<string> {
    // Simulated asynchronous fetch logic (replace with actual fetch logic)
    return new Promise<string>((resolve, reject) => {
      // Simulate fetching data asynchronously (e.g., using setTimeout)
      setTimeout(() => {
        const valuePropMap: Record<string, string> = {
          '12345678': 'Example value proposition for ID 12345678',
          // Add more mappings as needed
        };
        const fetchedValueProp = valuePropMap[valuePropId] || '';
        resolve(fetchedValueProp);
      }, 1000); // Simulate 1 second delay
    });
  }

  // Effect to fetch valueProp based on valuePropId
  useEffect(() => {
    const fetchValueProp = async () => {
      try {
        const fetchedValueProp = await getValuePropFromDatabase(valuePropId);
        setValueProp(fetchedValueProp);

        // Determine prompt rating based on fetched valueProp length
        if (fetchedValueProp.length < 50) {
          setPromptRating('red');
        } else if (fetchedValueProp.length > 50 && fetchedValueProp.length < 150) {
          setPromptRating('yellow');
        } else {
          setPromptRating('green');
        }
      } catch (error) {
        console.error('Error fetching value proposition:', error);
      }
    };

    fetchValueProp();
  }, [valuePropId]); // Dependency on valuePropId

  const handleGeneratePrompt = () => {
    // Logic to generate prompt from OpenAI
    // Placeholder logic, replace with actual implementation
    const generatedPrompt = 'Generate Value Prop with AI';
    setPrompt(generatedPrompt);
    setPromptGenerated(true);
    // Assign a default yellow rating for the generated prompt
    setPromptRating('yellow');
  };

  const handleValuePropChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValueProp = event.target.value;
    setValueProp(newValueProp);

    // Update prompt rating based on new valueProp length
    if (newValueProp.length < 50) {
      setPromptRating('red');
    } else if (newValueProp.length > 50 && newValueProp.length < 150) {
      setPromptRating('yellow');
    } else {
      setPromptRating('green');
    }

    // Call the prop function passed from the parent component to update the value proposition
    onValuePropChange(newValueProp);
  };

  const handleSave = () => {
    // Placeholder logic for saving the value proposition
    alert('Value proposition saved!');
    // Implement logic to save the value proposition to a database or storage
  };

  const handleEdit = () => {
    // Logic for editing the value proposition
    alert('Edit value proposition');
    // Implement logic for editing the value proposition
  };

  const handleDelete = () => {
    // Placeholder logic for deleting the value proposition
    alert('Value proposition deleted!');
    // Implement logic to delete the value proposition from storage
  };

  return (
    <div className="p-4 border rounded-lg shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-navyblue">Value Proposition</h2>
      <div className="mb-4">
        <label htmlFor="value-prop" className="block mb-2">Enter Value Prop:</label>
        <textarea
          id="value-prop"
          value={valueProp}
          onChange={handleValuePropChange}
          className="border rounded-lg p-2 w-full text-black"
          rows={5}
        ></textarea>
        {promptRating === 'red' && <p className="text-red-500">Value Prop is too short!</p>}
        {promptRating === 'yellow' && <p className="text-yellow-500">Value Prop is ok!</p>}
        {promptRating === 'green' && <p className="text-green-500">Value Prop is great!</p>}
      </div>
      <div>
        <button onClick={handleGeneratePrompt} className="bg-navyblue text-white px-4 py-2 rounded-md mr-2">Use AI</button>
        {promptGenerated && (
          <>
            <h3 className="text-lg font-semibold mt-4">Prompt Generated:</h3>
            <p>{prompt}</p>
            <p className={`mt-2 text-${promptRating}-500`}>Prompt Rating: {promptRating}</p>
          </>
        )}
      </div>
      <div className="flex justify-end mt-4">
        <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded-md mr-2">Save</button>
        <button onClick={handleEdit} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">Edit</button>
        <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
      </div>
    </div>
  );
};

export default ValueProp;
