'use client'

import React, { useState, useEffect } from 'react';
import { Plan } from '@/types/PlanTypes';
import { Participant } from '@/types/ParticipantTypes';

interface PlanTableProps {
  plans: Plan[];
  onPlanSelect: (plan: Plan) => void;
  onHealthClick: (plan: Plan) => void;
}

const PlanTable: React.FC<PlanTableProps> = ({ plans, onPlanSelect, onHealthClick }) => {
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  const calculateParticipantsCount = (participants: Participant[] | undefined): number => {
    return participants ? participants.length : 0;
  };

  const checkScreenWidth = () => {
    setIsMobileView(window.innerWidth < 768); // Adjust breakpoint as needed
  };

  const calculateSummary = (plans: Plan[]) => {
    const totalPlans = plans.length;
    const totalParticipants = plans.reduce((sum, plan) => sum + (plan.participants ? plan.participants.length : 0), 0);
  
    return {
      totalPlans,
      totalParticipants,
    };
  };
  
  const summary = calculateSummary(plans);
  
  useEffect(() => {
    window.addEventListener('resize', checkScreenWidth);
    checkScreenWidth();
  
    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);
  
  return (
    <div
      style={{
        maxWidth: '100%',
        overflowX: 'auto',
        color: 'black',
        padding: '20px',
      }}
    >
      {/* Display summary information */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          marginBottom: '20px',
          fontSize: '16px',
          fontWeight: 'bold',
          color: '#144e74',
        }}
      >
        <h3>Total Plans: {summary.totalPlans}</h3>
        <h3>Participants: {summary.totalParticipants}</h3>
      </div>
  
      {/* Table container with horizontal scrollbar */}
      <div
        style={{
          overflowX: 'auto',
          border: '1px solid #ccc',
          borderRadius: '5px',
        }}
      >
        {/* Plan Table */}
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          {/* Table header */}
          <thead>
            <tr style={{ backgroundColor: '#144e74', color: 'white', textAlign: 'center' }}>
              <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Plan</th>
              {!isMobileView && <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Participants</th>}
              <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Health</th>
              <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Select</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan.planName} style={{ borderBottom: '1px solid #ccc', whiteSpace: 'nowrap' }}>
                <td style={{ padding: '12px', textAlign: 'center' }}>{plan.planName}</td>
                {!isMobileView && (
                  <td style={{ padding: '12px', textAlign: 'center' }}>{plan.participants ? plan.participants.length : 0}</td>
                )}
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span
                    style={{
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      color: '#144e74',
                    }}
                    onClick={() => onHealthClick(plan)}
                  >
                    {plan.health}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button
                    style={{
                      cursor: 'pointer',
                      backgroundColor: plan.planName === '558' ? '#144e74' : '#ccc',
                      color: plan.planName === '558' ? 'white' : 'black',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '8px 12px',
                    }}
                    onClick={() => {
                      if (plan.planName === '558') {
                        onPlanSelect(plan);
                      }
                    }}
                    disabled={plan.planName !== '558'}
                  >
                    Select
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlanTable;
