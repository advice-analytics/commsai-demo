// types/PlanTypes.ts

export interface Plan {
    id: number;
    planName: string;
    assets: string;
    participants: Participant[];
    health: string;
  }
  
  export interface Participant {
    id: number;
    name: string;
    age: number;
    balance: number;
    need: string;
    plan: string;
    employer: string;
    retirement: number;
    financial: number;
    tax: number;
    investment: number;
    estate: number;
    other: number;
    incomeFrom?: number; // Add incomeFrom property
    incomeTo?: number; // Add incomeTo property
    balanceFrom?: number; // Add balanceFrom property
    balanceTo?: number; // 
    clients?: Client[];
  }
  
  export interface Client {
    name: string;
    retirement: number;
    financial: number;
    tax: number;
    investment: number;
    estate: number;
    other: number;
  }
  