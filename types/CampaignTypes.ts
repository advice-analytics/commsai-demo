// types/CampaignTypes.ts

// Define an interface for a Campaign
export interface Campaign {
    id: string;
    name: string;
    type: string;
    ageGroup: string;
    incomeFrom: number;
    incomeTo: number;
    balanceFrom: number;
    balanceTo: number;
    prompt?: string;
    userId?: string; // Add userId as an optional property
    // Optional field for generated prompt
  }
  
  // Define an interface for a Participant (assuming it's used within campaigns)
  export interface Participant {
    age: number;
    incomeFrom: number;
    incomeTo: number;
    balanceFrom: number;
    balanceTo: number;
    // Add more fields as needed
  }
  