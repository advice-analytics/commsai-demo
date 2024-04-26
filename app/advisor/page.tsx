'use client'

import React, { useState, useEffect } from 'react';
import AdvisorBanner from '@/components/advisor/banner/AdvisorBanner';
import PlanTable from '@/components/advisor/tables/PlanTable';
import ParticipantTable from '@/components/advisor/tables/ParticipantTable';
import ClientTable from '@/components/advisor/tables/ClientTable';
import ValueProp from '@/components/advisor/value/ValueProp';
import Campaigns from '@/components/campaigns/Campaigns';
import PlanHealth from '@/components/health/PlanHealth'; // Import PlanHealth component
import { Plan, Client } from '@/types/PlanTypes';
import { Participant } from '@/types/ParticipantTypes';
import { useAuth } from '@/components/context/authContext';

interface NavigationItem {
  id: number;
  label: string;
  disabled?: boolean;
}

const Page: React.FC = () => {
  const [navigationItems] = useState<NavigationItem[]>([
    { id: 1, label: 'All Plans' },
    { id: 2, label: 'Plan Campaigns' },
    { id: 3, label: 'Coming Soon...', disabled: true },
    { id: 4, label: 'Coming Soon...', disabled: true },
  ]);

  const [selectedNavItem, setSelectedNavItem] = useState<NavigationItem>(navigationItems[0]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isHealthModalOpen, setHealthModalOpen] = useState(false); // State for health modal

  const [userData, setUser] = useAuth(); // Retrieve user data from authentication context
  const userUid: string = userData?.uid || ''; // Obtain user UID from user data

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch('/api/participants'); // Fetch all participants
        if (!response.ok) {
          throw new Error('Failed to fetch participants');
        }
        const participantsData: Participant[] = await response.json();
        setParticipants(participantsData);
      } catch (error) {
        console.error('Error fetching participants:', error);
      }
    };

    const fetchPlans = async () => {
      try {
        const response = await fetch('/api/plans'); // Fetch plans endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        const plansData: Plan[] = await response.json();
        setPlans(plansData);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchParticipants();
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
    // Participants for the selected plan are already fetched on page load
  };

  const handleParticipantSelect = (participant: Participant) => {
    setSelectedParticipant(participant);
    // Handle participant selection logic here
  };

  const handleHealthClick = (plan: Plan) => {
    setSelectedPlan(plan); // Set the selected plan
    setHealthModalOpen(true); // Open the PlanHealth modal
  };

  const renderContent = () => {
    switch (selectedNavItem.label) {
      case 'All Plans':
        return (
          <>
            <PlanTable plans={plans} onPlanSelect={handlePlanSelect} onHealthClick={handleHealthClick} />
            {selectedPlan && (
              <ParticipantTable participants={participants} onParticipantSelect={handleParticipantSelect} />
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
            <ValueProp
              userId={userUid}
              onValuePropChange={(newValueProp: string) => console.log('ValueProp changed:', newValueProp)}
            />
        );
      case 'Plan Campaigns':
        return <Campaigns selectedClient={selectedParticipant} />;
      case 'Coming Soon...':
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
              className={`${selectedNavItem.id === item.id ? 'active' : 'navyblue'}`}
              style={{ color: item.disabled ? 'gray' : 'navyblue', cursor: item.disabled ? 'not-allowed' : 'pointer' }}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>
      <div className="content-container">
        {renderContent()}
        {selectedPlan && (
          <PlanHealth
            isOpen={isHealthModalOpen}
            onClose={() => {
              setSelectedPlan(null);
              setHealthModalOpen(false);
            }}
            plan={selectedPlan}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
