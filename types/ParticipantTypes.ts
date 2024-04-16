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
  balanceTo?: number; // Remove this if not needed, or use balance instead
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
