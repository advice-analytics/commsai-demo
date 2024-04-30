// PlanTypes.ts

import { Participant } from "./ParticipantTypes";

export interface Plan {
  id: string; 
  planName: string;
  balance: string;
  participants: Participant[];
  health: string;
}


export interface Client {
  name: string;
  retirement: number;
  financial: number;
  tax: number;
  investment: number;
  estate: number;
}
