// Define the Participant interface
// Define the Participant interface with optional properties
export interface Participant {
  id: string;
  name: string;
  balance: number;
  age: number;
  state: string;
  maritalStatus: string;
  scores: {
    [key: string]: number;
  };
  hasBalance?: number;
  glidePath?: string;
  planReturns?: string;
  savingsRatePercent?: number;
  gender?: string;
  salary?: number;
}


// Define the Campaign interface
export interface Campaign {
  plan: string;
  id: string;
  name: string;
  type: string;
  ageGroup: string;
  prompt?: string;
  userId?: string;
  selectedPlan?: string;
  participant: Participant;
  planName: string; // Participant data within the campaign
}
