'use client'

// Import React and necessary hooks/components
import React, { useState, useEffect } from 'react';
import { Campaign } from '@/types/CampaignTypes';
import { saveCampaignToDatabase, deleteCampaignFromDatabase } from '@/utilities/firebaseClient';
import { generateCampaignPrompt } from '@/utilities/promptGenAI';
import { useAuth } from '../context/authContext';
import { Participant } from '@/types/ParticipantTypes';

// Define props interface for Campaigns component
interface CampaignsProps {
  selectedClient: Participant | null;
}

// Define Campaigns component
const Campaigns: React.FC<CampaignsProps> = ({ selectedClient }) => {
  // State hooks for managing component state
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignType, setNewCampaignType] = useState<string>('');
  const [newCampaignAgeGroup, setNewCampaignAgeGroup] = useState<string>('');
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [messageContent, setMessageContent] = useState<string>('');

  // Retrieve authenticated user data using useAuth hook
  const [userData, setUser] = useAuth();
  const userUid: string = userData?.uid || ''; // Get user UID or default to empty string if not available

  // State hooks for plans and participants data
  const [plans, setPlans] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);

  // Array of participant scenarios
  const participantScenarios = [
    'Not contributing to their plan, but eligible',
    'Contributing to their plan, but less than IRS limits',
    'Contributing to their plan, but less than "catch-up" limits',
    'Contributing to their plan, but less than previous years',
    'Opted out of auto enroll or other automatic plan options',
    'Not using available retirement plan services',
    'May need help with retirement plan investments',
    'May have low retirement readiness',
    'Opportunity to save more',
  ];

  // Effect hook to load plans and participants data on component mount
  useEffect(() => {
    const loadPlansAndParticipants = async () => {
      try {
        const plansResponse = await fetch('/api/plans');
        if (!plansResponse.ok) {
          throw new Error('Failed to fetch plans');
        }
        const plansData = await plansResponse.json();
        setPlans(plansData);

        const participantsResponse = await fetch('/api/participants');
        if (!participantsResponse.ok) {
          throw new Error('Failed to fetch participants');
        }
        const participantsData = await participantsResponse.json();
        setParticipants(participantsData);
      } catch (error) {
        console.error('Error loading plans or participants:', error);
      }
    };

    loadPlansAndParticipants();
  }, []);

  // Function to handle campaign creation
  const handleCreateCampaign = async () => {
    if (!newCampaignName) {
      console.error('Campaign name is required.');
      return;
    }

    const selectedPlan = plans.find(plan => plan.id === newCampaignType);
    const selectedParticipant = participants.find(participant => participant.id === newCampaignAgeGroup);

    const planName = selectedPlan ? selectedPlan.name : 'Unknown Plan';
    const ageGroup = selectedParticipant ? selectedParticipant.age : 'Unknown Age Group';

    const newCampaign: Campaign = {
      id: String(Math.random()),
      name: newCampaignName,
      type: planName,
      ageGroup: ageGroup,
      prompt: '', // Placeholder for GenAI message
      userId: userUid, // Assign the authenticated user's UID to the campaign
      plan: selectedPlan ? selectedPlan.id || '' : '', // Ensure plan id is defined
      planName: planName,
      participant: selectedParticipant || {}, // Use empty object if participant is undefined
    };

    try {
      const campaignPrompt: string = await generateCampaignPrompt(
        newCampaign.name,
        newCampaign.type,
        participantScenarios,
        newCampaign.ageGroup,
        userUid
      );

      newCampaign.prompt = campaignPrompt;

      await saveCampaignToDatabase(userUid, newCampaign);

      setCampaigns([...campaigns, newCampaign]);

      clearInputFields();
    } catch (error) {
      console.error('Error creating campaign:', error);
      alert('Failed to create campaign. Please try again.');
    }
  };

  // Function to handle editing campaign message
  const handleEditMessage = async (campaignId: string, updatedMessage: string) => {
    const updatedCampaigns = campaigns.map((campaign) => {
      if (campaign.id === campaignId) {
        return { ...campaign, prompt: updatedMessage };
      }
      return campaign;
    });

    setCampaigns(updatedCampaigns);

    // Update campaign message in Firebase Realtime Database
    await saveCampaignToDatabase(userUid, updatedCampaigns.find(campaign => campaign.id === campaignId) || {});
  };

  // Function to handle deleting a campaign
  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await deleteCampaignFromDatabase(userUid, campaignId);

      const updatedCampaigns = campaigns.filter((campaign) => campaign.id !== campaignId);
      setCampaigns(updatedCampaigns);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      alert('Failed to delete campaign. Please try again.');
    }
  };

  // Function to clear input fields after campaign creation
  const clearInputFields = () => {
    setNewCampaignName('');
    setNewCampaignType('');
    setNewCampaignAgeGroup('');
    setSelectedScenario('');
    setMessageContent('');
  };

  // Render the Campaigns component UI
  return (
    <div className="container mx-auto p-4">
      {/* Create New Campaign section */}
      <h2 className="text-3xl font-semibold mb-8 text-navyblue">Create New Campaign</h2>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <div>
          <label htmlFor="campaignName" className="block text-sm font-medium text-gray-600">
            Campaign Name
          </label>
          <input
            id="campaignName"
            type="text"
            value={newCampaignName}
            onChange={(e) => setNewCampaignName(e.target.value)}
            placeholder="Enter campaign name"
            className="input-field shadow-md px-4 py-3 rounded-lg w-full"
          />
        </div>
        <div>
          <label htmlFor="campaignType" className="block text-sm font-medium text-gray-600">
            Plan
          </label>
          <select
            id="campaignType"
            value={newCampaignType}
            onChange={(e) => setNewCampaignType(e.target.value)}
            className="input-field shadow-md px-4 py-3 rounded-lg w-full"
          >
            <option value="">Select a plan</option>
            {plans.map(plan => (
              <option key={plan.id} value={plan.id}>{plan.planName}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-600">
            Participant
          </label>
          <select
            id="ageGroup"
            value={newCampaignAgeGroup}
            onChange={(e) => setNewCampaignAgeGroup(e.target.value)}
            className="input-field shadow-md px-4 py-3 rounded-lg w-full"
          >
            <option value="">Select a participant</option>
            {participants.map(participant => (
              <option key={participant.id} value={participant.id}>{participant.id}</option>
            ))}
          </select>
        </div>
        {/* Select Scenario */}
        <div>
          <label htmlFor="selectedScenario" className="block text-sm font-medium text-gray-600">
            Select Scenario
          </label>
          <select
            id="selectedScenario"
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="input-field shadow-md px-4 py-3 rounded-lg w-full"
          >
            <option value="">Select scenario</option>
            {participantScenarios.map((scenario, index) => (
              <option key={index} value={scenario}>
                {scenario}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="messageContent" className="block text-sm font-medium text-gray-600">
            Message Content
          </label>
          <textarea
            id="messageContent"
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            placeholder="Enter message content"
            rows={4}
            className="input-field shadow-md px-4 py-3 rounded-lg w-full"
          />
        </div>
        <button
          onClick={handleCreateCampaign}
          className="btn-primary bg-navyblue hover:bg-darknavyblue text-white mt-4 w-full rounded-md py-3 px-6 font-medium transition duration-300 ease-in-out"
        >
          Create Campaign
        </button>
      </div>
    
      {/* Existing Campaigns section */}
      <h2 className="text-3xl font-semibold mt-8 mb-4 text-navyblue">Existing Campaigns</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">{campaign.name}</h3>
            <p>Type: {campaign.type}</p>
            <p>Age Group: {campaign.ageGroup}</p>
            <div className="my-4">
              <strong>Prompt:</strong>
              <textarea
                value={campaign.prompt}
                onChange={(e) => handleEditMessage(campaign.id, e.target.value)}
                placeholder="Edit campaign message..."
                rows={4}
                className="input-field shadow-md px-4 py-3 rounded-lg w-full cursor-pointer"
              />
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => handleDeleteCampaign(campaign.id)}
                className="btn-delete bg-red-500 text-white rounded hover:bg-red-600 px-4 py-2"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Export Campaigns component as default
export default Campaigns;
