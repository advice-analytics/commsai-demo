'use client';

import React, { useState, useEffect } from 'react';
import { Campaign } from '@/types/CampaignTypes';
import { saveCampaignToDatabase, deleteCampaignFromDatabase, getCampaignsForUser } from '@/utilities/firebaseClient';
import { generateCampaignPrompt } from '@/utilities/promptGenAI';
import { useAuth } from '../context/authContext';
import { Participant, ParticipantWithScores } from '@/types/ParticipantTypes';

interface CampaignsProps {
  uid: string; // Change userId to uid
  selectedClient: Participant | null;
}

const Campaigns: React.FC<CampaignsProps> = ({ selectedClient, uid }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [newCampaignName, setNewCampaignName] = useState<string>('');
  const [selectedPlan, setSelectedPlan] = useState<string>('558'); // Initialize with '558' as the preselected plan
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>(''); // State for selected age group
  const [selectedParticipant, setSelectedParticipant] = useState<string>(''); // State for selected participant
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [messageContent, setMessageContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');


  const [userData, loadingAuth] = useAuth();
  // Extract uid from userData instead of userId
  const userId = userData?.uid || '';

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [participantOffset, setParticipantOffset] = useState<number>(0);

  const participantScenarios: string[] = [
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

  // Age group options
  const ageGroupOptions: { value: string; label: string }[] = [
    { value: '25under', label: '25 and under' },
    { value: '25-35', label: '25 - 35' },
    { value: '35-45', label: '35 - 45' },
    { value: '45-55', label: '45 - 55' },
    { value: '55-65', label: '55 - 65' },
    { value: '65plus', label: '65 and above' },
  ];

  const clearInputFields = () => {
    setNewCampaignName('');
    setSelectedAgeGroup('');
    setSelectedParticipant('');
    setSelectedScenario('');
    setMessageContent('');
    setError('');
  };

  type Scores = {
    [key: string]: number;
  };

  // Function to calculate the highest score from a participant's scores
  const getHighestScore = (participant: ParticipantWithScores): number => {
    const scores: Scores = {
      retirement: participant.retirement,
      financial: participant.financial,
      tax: participant.tax,
      investment: participant.investment,
      estate: participant.estate,
      adviceScore: Number(participant.adviceScore) || 0,
    };

    let highestScore = 0;
    for (const key in scores) {
      if (scores.hasOwnProperty(key) && typeof scores[key] === 'number') {
        if (scores[key] > highestScore) {
          highestScore = scores[key];
        }
      }
    }
    return highestScore;
  };

  useEffect(() => {
    const loadUserCampaigns = async (): Promise<void> => {
      try {
        setLoading(true);
        const userCampaigns: Campaign[] = await getCampaignsForUser(uid);
        setCampaigns(userCampaigns);
      } catch (error) {
        console.error('Error loading campaigns:', error);
        setError('Failed to load campaigns. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (uid) {
      loadUserCampaigns();
    }
  }, [uid]);

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        const response = await fetch(`/api/participants?plan=${selectedPlan}&offset=${participantOffset}`);
        if (response.ok) {
          const loadedParticipants: Participant[] = await response.json();
          setParticipants((prevParticipants) => [...prevParticipants, ...loadedParticipants]);
        } else {
          throw new Error('Failed to load participants');
        }
      } catch (error) {
        console.error('Error loading participants:', error);
      }
    };

    if (selectedPlan) {
      setParticipants([]);
      setParticipantOffset(0);
      loadParticipants();
    }
  }, [selectedPlan, participantOffset]);

  const createCampaign = async (uid: string, campaignData: any): Promise<Campaign[]> => {
    try {
      const campaignDataWithPrompt = { ...campaignData };
      const campaignPrompt = await generateCampaignPrompt(
        campaignData.name,
        campaignData.type,
        participantScenarios,
        campaignData.ageGroup,
        uid
      );
  
      campaignDataWithPrompt.prompt = campaignPrompt;
  
      await saveCampaignToDatabase(uid, campaignDataWithPrompt);
  
      const updatedCampaigns = await getCampaignsForUser(uid);
      return updatedCampaigns;
    } catch (error) {
      console.error('Error creating campaign:', error);
      throw error;
    }
  };


  const handleCreateCampaign = async (): Promise<void> => {
    try {
      if (!newCampaignName || !selectedAgeGroup || !selectedScenario || !messageContent) {
        setError('Please fill out all fields.');
        return;
      }
  
      setLoading(true);
  
      const campaignData = {
        name: newCampaignName,
        type: selectedPlan,
        ageGroup: selectedAgeGroup,
        prompt: '',
        participant: selectedClient || null,
      };
  
      const updatedCampaigns = await createCampaign(uid, campaignData);
  
      setCampaigns(updatedCampaigns);
      clearInputFields();
      alert('Campaign created successfully!');
    } catch (error) {
      console.error('Error creating campaign:', error);
      setError('Failed to create campaign. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await deleteCampaignFromDatabase(uid, campaignId);
      const updatedCampaigns: Campaign[] = campaigns.filter((campaign) => campaign.id !== campaignId);
      setCampaigns(updatedCampaigns);
    } catch (error) {
      console.error('Error deleting campaign:', error);
      setError('Failed to delete campaign. Please try again.');
    }
  };


  const handleEditPrompt = (campaignId: string, updatedPrompt: string) => {
    const updatedCampaigns: Campaign[] = campaigns.map((campaign) =>
      campaign.id === campaignId ? { ...campaign, prompt: updatedPrompt } : campaign
    );
    setCampaigns(updatedCampaigns);
  };

  const handleSavePrompt = async (campaignId: string) => {
    try {
      setLoading(true);

      const campaignToUpdate: Campaign | undefined = campaigns.find((campaign) => campaign.id === campaignId);
      if (campaignToUpdate) {
        await saveCampaignToDatabase(uid || '', campaignToUpdate);
        setLoading(false);
        alert('Campaign message updated successfully!');
      }
    } catch (error) {
      console.error('Error updating campaign:', error);
      setError('Failed to update campaign. Please try again.');
      setLoading(false);
    }
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
          <label htmlFor="selectedPlan" className="block text-sm font-medium text-gray-600">
            Plan
          </label>
          <select
            id="selectedPlan"
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value)}
            className="input-field shadow-md px-4 py-3 rounded-lg w-full"
            disabled={true} // Disable the dropdown after selecting the '558' plan
          >
            <option value="558">Plan 558</option>
          </select>
        </div>
        <div>
          <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-600">
            Age Group
          </label>
          <select
            id="ageGroup"
            value={selectedAgeGroup}
            onChange={(e) => setSelectedAgeGroup(e.target.value)}
            className="input-field shadow-md px-4 py-3 rounded-lg w-full"
          >
            <option value="">Select an age group</option>
            {ageGroupOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
          <div>
          <label htmlFor="participants" className="block text-sm font-medium text-gray-600">Select a participant</label>
          <select
            id="participants"
            value={selectedParticipant}
            onChange={(e) => setSelectedParticipant(e.target.value)}
            className="input-field shadow-md px-4 py-3 rounded-lg w-full"
          >
            <option value="">Select a participant</option>
            {participants.map((participant) => {
              const highestScore = getHighestScore(participant);
              return (
                <option key={participant.id} value={participant.id}>
                  ID: {participant.id}, Age: {participant.age} - Highest Score: {highestScore} - Plan 558
                </option>
              );
            })}
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
            <p>Age Group: {campaign.ageGroup}</p>
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
