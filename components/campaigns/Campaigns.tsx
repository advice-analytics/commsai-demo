'use client'

import React, { useState } from 'react';
import { Campaign } from '@/types/CampaignTypes';
import { generateCampaignPrompt } from '@/utilities/promptGenAI';
import { saveCampaignToDatabase } from '@/utilities/firebaseClient';
import { useAuth } from '../context/authContext';
import { Participant } from '@/types/ParticipantTypes';

interface CampaignsProps {
  selectedClient: Participant | null;
}

const Campaigns: React.FC<CampaignsProps> = ({ selectedClient }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignType, setNewCampaignType] = useState('');
  const [newCampaignAgeGroup, setNewCampaignAgeGroup] = useState('');
  const [newCampaignIncomeFrom, setNewCampaignIncomeFrom] = useState<number>(0);
  const [newCampaignIncomeTo, setNewCampaignIncomeTo] = useState<number>(0);
  const [newCampaignBalanceFrom, setNewCampaignBalanceFrom] = useState<number>(0);
  const [newCampaignBalanceTo, setNewCampaignBalanceTo] = useState<number>(0);

  const [userData, setUser] = useAuth(); // Destructure user data and update function
  const userUid: string = userData?.uid || ''; // Use optional chaining to access uid safely

  const handleCreateCampaign = async () => {
    const newCampaign: Campaign = {
      id: String(Math.random()),
      name: newCampaignName,
      type: newCampaignType,
      ageGroup: newCampaignAgeGroup,
      incomeFrom: newCampaignIncomeFrom,
      incomeTo: newCampaignIncomeTo,
      balanceFrom: newCampaignBalanceFrom,
      balanceTo: newCampaignBalanceTo,
    };

    try {
      await generateAndSavePrompt(newCampaign); // Generate prompt and save campaign
      clearInputFields(); // Clear input fields after creating campaign
    } catch (error) {
      console.error('Error creating campaign:', error);
    }
  };

  const generateAndSavePrompt = async (campaign: Campaign) => {
    try {
      const campaignPrompt: string = await generateCampaignPrompt(
        campaign.name,
        campaign.type,
        [],
        campaign.ageGroup,
        campaign.incomeFrom,
        campaign.incomeTo,
        campaign.balanceFrom,
        campaign.balanceTo,
        userUid as string // Assert userUid as string
      );

      const campaignWithPrompt: Campaign = { ...campaign, prompt: campaignPrompt, userId: userUid };
      await saveCampaignToDatabase(userUid, campaignWithPrompt); // Provide both uid and campaignData
      setCampaigns([...campaigns, campaignWithPrompt]); // Update campaigns state with new campaign
    } catch (error) {
      console.error('Error generating campaign prompt:', error);
      throw error;
    }
  };

  const handleDeleteCampaign = (campaignId: string) => {
    const updatedCampaigns = campaigns.filter((campaign) => campaign.id !== campaignId);
    setCampaigns(updatedCampaigns);
  };

  const clearInputFields = () => {
    setNewCampaignName('');
    setNewCampaignType('');
    setNewCampaignAgeGroup('');
    setNewCampaignIncomeFrom(0);
    setNewCampaignIncomeTo(0);
    setNewCampaignBalanceFrom(0);
    setNewCampaignBalanceTo(0);
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-8 text-navyblue">Create New Campaign</h2>

      {/* Input fields for creating a new campaign */}
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
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="campaignType" className="block text-sm font-medium text-gray-600">
            Campaign Type
          </label>
          <input
            id="campaignType"
            type="text"
            value={newCampaignType}
            onChange={(e) => setNewCampaignType(e.target.value)}
            placeholder="Enter campaign type"
            className="input-field"
          />
        </div>
        <div>
          <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-600">
            Age Group
          </label>
          <input
            id="ageGroup"
            type="text"
            value={newCampaignAgeGroup}
            onChange={(e) => setNewCampaignAgeGroup(e.target.value)}
            placeholder="Enter age group"
            className="input-field"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="incomeRange" className="block text-sm font-medium text-gray-600 mr-2">
            Income Range
          </label>
          <input
            id="incomeFrom"
            type="number"
            value={newCampaignIncomeFrom}
            onChange={(e) => setNewCampaignIncomeFrom(Number(e.target.value))}
            placeholder="From"
            className="input-field"
          />
          <span className="text-gray-500 mx-2">-</span>
          <input
            id="incomeTo"
            type="number"
            value={newCampaignIncomeTo}
            onChange={(e) => setNewCampaignIncomeTo(Number(e.target.value))}
            placeholder="To"
            className="input-field"
          />
        </div>
        <div className="flex items-center">
          <label htmlFor="balanceRange" className="block text-sm font-medium text-gray-600 mr-2">
            Balance Range
          </label>
          <input
            id="balanceFrom"
            type="number"
            value={newCampaignBalanceFrom}
            onChange={(e) => setNewCampaignBalanceFrom(Number(e.target.value))}
            placeholder="From"
            className="input-field"
          />
          <span className="text-gray-500 mx-2">-</span>
          <input
            id="balanceTo"
            type="number"
            value={newCampaignBalanceTo}
            onChange={(e) => setNewCampaignBalanceTo(Number(e.target.value))}
            placeholder="To"
            className="input-field"
          />
        </div>
        <button onClick={handleCreateCampaign} className="btn-primary mt-4">
          Create Campaign
        </button>
      </div>

      {/* Display existing campaigns as cards */}
      <h2 className="text-3xl font-semibold mt-8 mb-4 text-navyblue">Existing Campaigns</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-2">{campaign.name}</h3>
            <p>Type: {campaign.type}</p>
            <p>Age Group: {campaign.ageGroup}</p>
            <p>Income: {campaign.incomeFrom} - {campaign.incomeTo}</p>
            <p>Balance: {campaign.balanceFrom} - {campaign.balanceTo}</p>

            {/* Action buttons */}
            <div className="mt-4 flex justify-end space-x-4">
              <button className="btn-secondary">Edit</button>
              <button className="btn-primary">Save</button>
              <button onClick={() => handleDeleteCampaign(campaign.id)} className="btn-danger">
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
