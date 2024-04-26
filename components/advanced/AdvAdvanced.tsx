'use client'

import React, { useState, useEffect } from 'react';
import { generateAdvAdvicePrompt } from '@/utilities/promptGenAI';
import { Plan } from '@/types/PlanTypes';
import { Participant } from '@/types/ParticipantTypes'; // Import types/interfaces as needed

const AdvAdvance: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/plans');
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        const plansData: Plan[] = await response.json();
        setPlans(plansData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching plans:', error);
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const handlePlanSelection = async (selectedPlan: Plan) => {
    setLoading(true);
  
    try {
      const userId = 'user123'; // Sample user ID
  
      // Extract relevant properties from the selected plan to create financial details
      const financialDetails = `
        Plan Name: ${selectedPlan.planName}
        Assets: ${selectedPlan.assets}
        Number of Participants: ${selectedPlan.participants.length}
        Health: ${selectedPlan.health}
        // Add more properties as needed
      `;
  
      const generatedPrompt = await generateAdvAdvicePrompt(financialDetails, userId);
  
      setPrompt(generatedPrompt);
      setSelectedParticipants(selectedPlan.participants); // Set selected participants
      setLoading(false);
    } catch (error) {
      console.error('Error generating prompt:', error);
      setLoading(false);
    }
  };
  

  const handleKeywordClick = (keyword: string) => {
    console.log('Clicked keyword:', keyword);
    // Implement custom logic to show pop-up with additional analytics or insights based on the clicked keyword
  };

  return (
    <div className="adv-advance-container">
      <h2>Select a Plan</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="plan-buttons-container">
          {plans.map((plan) => (
            <button key={plan.planName} onClick={() => handlePlanSelection(plan)}>
              {plan.planName}
            </button>
          ))}
        </div>
      )}
      <hr />
      <div className="generated-prompt-container">
        {prompt ? (
          <>
            {/* Render prompt text with highlighted keywords */}
            <p>
              {prompt.split(' ').map((word, index) => {
                // Example: Highlight specific keywords
                const highlightedKeywords = ['advice', 'insights', 'analytics']; // Customize as needed
                const isHighlighted = highlightedKeywords.includes(word.toLowerCase());
                return (
                  <span
                    key={index}
                    className={isHighlighted ? 'highlighted-text' : ''}
                    onClick={() => isHighlighted && handleKeywordClick(word)}
                  >
                    {word}{' '}
                  </span>
                );
              })}
            </p>
            {/* Display selected participants' information */}
            <div className="participants-info-container">
              {selectedParticipants.map((participant) => (
                <div key={participant.id}>
                  <p>
                    Participant ID: <span>{participant.id}</span>
                  </p>
                  <p>
                    Balance: <span>${participant.balance.toFixed(2)}</span>
                  </p>
                  {/* Add more key-highlighted descriptions */}
                  {/* Example of linking to additional content or pop-up */}
                  <p>
                    <button onClick={() => handleKeywordClick('Show Details')}>Show Details</button>
                  </p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Select a plan to generate advanced advice.</p>
        )}
      </div>
    </div>
  );
};

export default AdvAdvance;
