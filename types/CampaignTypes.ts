// types/CampaignTypes.ts

// Define an interface for a Campaign
export interface Campaign {
  id: string;
  name: string;
  type: string;
  ageGroup: string;
  prompt?: string;
  userId?: string; // Add userId as an optional property
  // Optional field for generated prompt
}

// Define an interface for a Participant (assuming it's used within campaigns)
export interface Participant {
  age: number;
  // Adjusted participant fields based on usage
}
