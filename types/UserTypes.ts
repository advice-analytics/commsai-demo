// types/UserTypes.ts

export interface User {
    id: number;
    username: string;
    email: string;
    states: string[];
    crdNumber: string;
  }
  
  export interface NavigationItem {
    id: number;
    label: string;
  }
  