'use client'

import React, { useState, useEffect } from 'react';
import { Campaign } from '@/types/CampaignTypes';
import { saveCampaignToDatabase, deleteCampaignFromDatabase, getCampaignsForUser } from '@/utilities/firebaseClient';
import { generateCampaignPrompt } from '@/utilities/promptGenAI';
import { useAuth } from '../context/authContext';
import { Participant } from '@/types/ParticipantTypes';

interface CampaignsProps {
  selectedClient: Participant | null;
}

const Campaigns: React.FC<CampaignsProps> = ({ selectedClient }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignType, setNewCampaignType] = useState<string>('558'); // Initialize with '558' as the only selectable option
  const [newCampaignAgeGroup, setNewCampaignAgeGroup] = useState<string>('');
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [messageContent, setMessageContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const [userData, setUser] = useAuth();
  const userUid: string = userData?.uid || '';

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantOffset, setParticipantOffset] = useState<number>(0); // Offset for batch loading
  const batchSize = 10; // Number of participants to load per batch

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

  useEffect(() => {
    const loadUserCampaigns = async () => {
      try {
        setLoading(true);

        const userCampaigns = await getCampaignsForUser(userUid);
        setCampaigns(userCampaigns);

        setLoading(false);
      } catch (error) {
        console.error('Error loading campaigns:', error);
        setError('Failed to load campaigns. Please try again.');
        setLoading(false);
      }
    };

    loadUserCampaigns();
  }, [userUid]);

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        setLoading(true);

        // Fetch participants with batch loading
        const response = await fetch(`/api/participants?offset=${participantOffset}&limit=${batchSize}`);
        if (!response.ok) {
          throw new Error('Failed to fetch participants');
        }
        const participantsData = await response.json();
        setParticipants((prevParticipants) => [...prevParticipants, ...participantsData]);

        setLoading(false);
      } catch (error) {
        console.error('Error loading participants:', error);
        setError('Failed to load participants. Please try again.');
        setLoading(false);
      }
    };

    if (newCampaignType === '558' && participants.length === 0) {
      // Load participants if '558' plan is selected and participants are not yet loaded
      loadParticipants();
    }
  }, [newCampaignType, participantOffset]); // Trigger when newCampaignType changes or participantOffset changes

  const handleCreateCampaign = async () => {
    if (!newCampaignName || !newCampaignAgeGroup || !selectedScenario || !messageContent) {
      setError('Please fill out all fields.');
      return;
    }

    setLoading(true);

    try {
      const planName = '558'; // Set plan name to '558' since it's fixed
      const ageGroup = newCampaignAgeGroup;

      const newCampaign: Campaign = {
        id: String(Math.random()),
        name: newCampaignName,
        type: planName,
        ageGroup: ageGroup,
        prompt: '',
        userId: userUid,
        plan: '', // Set plan data as needed
        planName: planName,
        participant: null, // Set participant data as needed
      };

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
      setLoading(false);
    } catch (error) {
      console.error('Error creating campaign:', error);
      setError('Failed to create campaign. Please try again.');
      setLoading(false);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await deleteCampaignFromDatabase(userUid, campaignId);

      const updatedCampaigns = campaigns.filter((campaign) => campaign.id !== campaignId);
      setCampaigns(updatedCampaigns);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      setError('Failed to delete campaign. Please try again.');
    }
  };

  const handleEditPrompt = (campaignId: string, updatedPrompt: string) => {
    const updatedCampaigns = campaigns.map((campaign) =>
      campaign.id === campaignId ? { ...campaign, prompt: updatedPrompt } : campaign
    );
    setCampaigns(updatedCampaigns);
  };

  const handleSavePrompt = async (campaignId: string) => {
    try {
      setLoading(true);

      const campaignToUpdate = campaigns.find((campaign) => campaign.id === campaignId);
      if (campaignToUpdate) {
        await saveCampaignToDatabase(userUid, campaignToUpdate);
        setLoading(false);
        alert('Campaign message updated successfully!');
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
      setError('Failed to update campaign. Please try again.');
      setLoading(false);
    }
  };

  const clearInputFields = () => {
    setNewCampaignName('');
    setNewCampaignAgeGroup('');
    setSelectedScenario('');
    setMessageContent('');
    setError('');
  };


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-8 text-navyblue">New Campaign</h2>
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
            disabled={true} // Disable the dropdown after selecting the '558' plan
          >
            <option value="558">Plan 558</option>
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
            {participants.map((participant) => (
              <option key={participant.id} value={participant.id}>
                ID {participant.id}, Balance {participant.balance}, Advice Score {participant.adviceScore}, Plan 558
              </option>
            ))}
          </select>
        </div>
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
          {loading ? 'Creating Campaign...' : 'Create Campaign'}
        </button>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      <h2 className="text-3xl font-semibold mt-8 mb-4 text-navyblue">Existing Campaigns</h2>
      {/* Render existing campaigns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white p-6 rounded-lg shadow-md">
            {/* Display campaign details */}
            <h3 className="text-lg font-semibold mb-2">{campaign.name}</h3>
            <p>Plan: {campaign.type}</p>
            <p>Participant: {campaign.ageGroup}</p>
            {/* Editable prompt */}
            <div className="my-4">
              <strong>Prompt:</strong>
              <textarea
                value={campaign.prompt}
                onChange={(e) => handleEditPrompt(campaign.id, e.target.value)}
                placeholder="Edit campaign message..."
                rows={4}
                className="input-field shadow-md px-4 py-3 rounded-lg w-full cursor-pointer"
              />

              <div className="flex justify-center mt-4">
              <button
                onClick={() => handleSavePrompt(campaign.id)}
                className="btn-primary bg-green-500 text-white mt-2 rounded-md py-2 px-4"
              >
                Save
              </button>
              </div>
            </div>
            {/* Delete button */}
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

export default Campaigns;
