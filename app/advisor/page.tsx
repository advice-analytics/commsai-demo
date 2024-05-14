'use client'

import React, { useState, useEffect } from 'react';
import { signInUserWithEmailAndPassword } from '@/utilities/firebaseClient';
import { useAuth } from '@/components/context/authContext';
import AdvisorBanner from '@/components/advisor/banner/AdvisorBanner';
import PlanTable from '@/components/advisor/tables/PlanTable';
import ParticipantTable from '@/components/advisor/tables/ParticipantTable';
import ClientTable from '@/components/advisor/tables/ClientTable';
import ValueProp from '@/components/advisor/value/ValueProp';
import Campaigns from '@/components/campaigns/Campaigns';
import PlanHealth from '@/components/health/PlanHealth';
import { Plan, Client } from '@/types/PlanTypes';
import { Participant } from '@/types/ParticipantTypes';
import { saveValuePropToDatabase } from '@/utilities/firebaseClient';

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
  const [initialValue, setInitialValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const [userData, loadingAuth] = useAuth();
  const userUid: string = userData?.uid || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansResponse, participantsResponse] = await Promise.all([
          fetch('/api/plans'),
          fetch('/api/participants')
        ]);

        if (!plansResponse.ok || !participantsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const plansData: Plan[] = await plansResponse.json();
        const participantsData: Participant[] = await participantsResponse.json();

        setPlans(plansData);
        setParticipants(participantsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const signInAndFetchData = async () => {
      try {
        // Sign in the predefined user with provided credentials
        await signInUserWithEmailAndPassword('askme@adviceanalytics.com', '');
        console.log('User signed in successfully.');

        // Fetch data after successful sign-in
        fetchData();
      } catch (error) {
        console.error('Error signing in:', error);
        setLoading(false); // Update loading state to false in case of error
      }
    };

    if (!userData) {
      signInAndFetchData(); // Sign in user and fetch data if not already authenticated
    } else {
      fetchData(); // Fetch data if user is already authenticated
    }
  }, [userData]); // Include userData in the dependency array to trigger effect when auth state changes

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
    if (loading) {
      return <p>Loading Plan Data...</p>;
    }

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
