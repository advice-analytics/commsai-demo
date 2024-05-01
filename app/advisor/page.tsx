'use client'

import React, { useState, useEffect } from 'react';
import AdvisorBanner from '@/components/advisor/banner/AdvisorBanner';
import PlanTable from '@/components/advisor/tables/PlanTable';
import ParticipantTable from '@/components/advisor/tables/ParticipantTable';
import ClientTable from '@/components/advisor/tables/ClientTable';
import ValueProp from '@/components/advisor/value/ValueProp';
import Campaigns from '@/components/campaigns/Campaigns';
import PlanHealth from '@/components/health/PlanHealth';
import { Plan, Client } from '@/types/PlanTypes';
import { Participant } from '@/types/ParticipantTypes';
import { useAuth } from '@/components/context/authContext';
import { getValuePropFromDatabase, saveValuePropToDatabase } from '@/utilities/firebaseClient'; // Import Firebase functions

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
  const [isHealthModalOpen, setHealthModalOpen] = useState(false);
  const [initialValue, setInitialValue] = useState<string>(''); // State for initial value

  const [userData, loadingAuth] = useAuth();
  const userUid: string = userData?.uid || '';

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await fetch('/api/participants');
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
        const response = await fetch('/api/plans');
        if (!response.ok) {
          throw new Error('Failed to fetch plans');
        }
        const plansData: Plan[] = await response.json();
        setPlans(plansData);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    const fetchInitialValue = async () => {
      try {
        const valueFromDatabase = await getValuePropFromDatabase(userUid);
        setInitialValue(valueFromDatabase || ''); // Set initial value or default to empty string
      } catch (error) {
        console.error('Error fetching initial value:', error);
      }
    };

    fetchParticipants();
    fetchPlans();
    fetchInitialValue(); // Fetch initial value for ValueProp component
  }, [userUid]);

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

  const handleHealthClick = (plan: Plan) => {
    setSelectedPlan(plan);
    setHealthModalOpen(true);
  };

  const handleValuePropChange = async (newValueProp: string) => {
    try {
      await saveValuePropToDatabase(userUid, newValueProp);
      console.log('ValueProp saved successfully:', newValueProp);
    } catch (error) {
      console.error('Error saving ValueProp:', error);
    }
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
            uid={userUid} // Pass userUid directly as uid
            onValuePropChange={handleValuePropChange}
            initialValue={initialValue} // Pass the fetched initial value to ValueProp
          />
        );
      case 'Plan Campaigns':
        return (
          <Campaigns selectedClient={selectedParticipant} uid={userUid} />
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
