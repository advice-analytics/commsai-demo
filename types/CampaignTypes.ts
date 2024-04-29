// Define the Participant interface
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
  hasBalance?: number; // Optional property
  glidePath?: string; // Optional property
  planReturns?: string; // Optional property
  savingsRatePercent?: number; // Optional property
  gender?: string; // Optional property
  salary?: number; // Optional property
}

// Define the Campaign interface
export interface Campaign {
  id: string;
  name: string;
  type: string;
  ageGroup: string;
  prompt?: string;
  userId?: string;
  plan: string;
  planName: string;
  selectedPlan?: string;
  participant?: Participant | null; // participant can be Participant object or null
}

