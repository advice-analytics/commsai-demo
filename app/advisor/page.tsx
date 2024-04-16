'use client'

import React, { useState, useEffect } from 'react';
import AdvisorBanner from '@/components/advisor/banner/AdvisorBanner';
import PlanTable from '@/components/advisor/tables/PlanTable';
import ParticipantTable from '@/components/advisor/tables/ParticipantTable';
import ClientTable from '@/components/advisor/tables/ClientTable';
import ValueProp from '@/components/advisor/ValueProp';
import Campaigns from '@/components/campaigns/Campaigns';
import { ValuePropProvider } from '@/components/context/ValuePropContext';
import { Plan, Participant, Client } from '@/types/PlanTypes';
import { useAuth } from '@/components/context/authContext';

interface NavigationItem {
  id: number;
  label: string;
}

const Page: React.FC = () => {
  const [navigationItems] = useState<NavigationItem[]>([
    { id: 1, label: 'Plan Table' },
    { id: 2, label: 'Value Proposition' },
    { id: 3, label: 'Campaigns' },
  ]);

  const [selectedNavItem, setSelectedNavItem] = useState<NavigationItem>(navigationItems[0]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [valuePropId, setValuePropId] = useState<string>(''); // Define valuePropId state

  const [userData, setUser] = useAuth(); // Retrieve user data from authentication context
  const userUid: string = userData?.uid || ''; // Obtain user UID from user data

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        // Simulated plans data
        const mockPlans: Plan[] = [
          {
            id: 1,
            planName: 'Plan A',
            assets: 'High',
            participants: [
              {
                id: 1,
                name: 'John Doe',
                age: 45,
                balance: 150000,
                need: 'High',
                plan: 'Plan A',
                employer: 'ABC Inc.',
                retirement: 92,
                financial: 78,
                tax: 82,
                investment: 48,
                estate: 76,
                other: 14,
                clients: [
                  {
                    name: 'Client 1',
                    retirement: 92,
                    financial: 78,
                    tax: 82,
                    investment: 48,
                    estate: 76,
                    other: 14,
                  },
                  // Add more clients...
                ],
              },
              // Add more participants...
            ],
            health: 'Good',
          },
          // Add more plans...
        ];
        setPlans(mockPlans);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, []);

  const handleNavigationItemClick = (item: NavigationItem) => {
    setSelectedNavItem(item);
    setSelectedPlan(null);
    setSelectedParticipant(null);
  };

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setSelectedParticipant(null);
  };

  const handleParticipantSelect = (participant: Participant) => {
    setSelectedParticipant(participant);
  };

  const handleValuePropChange = (newValueProp: string) => {
    console.log('ValueProp changed:', newValueProp);
    // Implement logic to handle value prop change here
  };

  const renderContent = () => {
    switch (selectedNavItem.label) {
      case 'Plan Table':
        return (
          <>
            <PlanTable plans={plans} onPlanSelect={handlePlanSelect} />
            {selectedPlan && (
              <ParticipantTable
                participants={selectedPlan.participants}
                onParticipantSelect={handleParticipantSelect}
              />
            )}
            {selectedParticipant && (
              <ClientTable
                clients={selectedParticipant.clients || []}
                onSelect={(client: Client) => {
                  console.log('Client selected:', client);
                }}
                selectedParticipant={selectedParticipant}
              />
            )}
          </>
        );
      case 'Value Proposition':
        return (
          <ValuePropProvider>
            <ValueProp
              valuePropId="12345678" // Example value proposition ID (replace with actual value)
              userId={userUid} // User ID associated with the value proposition
              ageGroup="30-45" // Example age group (replace with actual age group)
              role="Advisor" // Example role (replace with actual role)
              description="Financial advisor specializing in retirement planning" // Example description
              interests={['Retirement', 'Investments', 'Estate Plans']} // Example interests
              onValuePropChange={handleValuePropChange} // Function to handle value proposition change
            />
          </ValuePropProvider>
        );
      case 'Campaigns':
        return (
          <Campaigns selectedClient={selectedParticipant} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="main-container">
      <div className="nav-container">
        <AdvisorBanner />
        <ul>
          {navigationItems.map((item) => (
            <li
              key={item.id}
              onClick={() => handleNavigationItemClick(item)}
              className={`${selectedNavItem.id === item.id ? 'active' : ''}`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="content-container">
        {renderContent()}
      </div>
    </div>
  );
};

export default Page;
