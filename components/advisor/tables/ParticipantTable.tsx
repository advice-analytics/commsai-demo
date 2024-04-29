import React, { useState, useEffect } from 'react';
import { Participant } from '@/types/ParticipantTypes';
import { Plan } from '@/types/PlanTypes';

interface ParticipantTableProps {
  participants: Participant[];
  onParticipantSelect: (participant: Participant) => void;
  selectedPlan?: Plan | null;
}

const ParticipantTable = ({ participants, onParticipantSelect, selectedPlan }: ParticipantTableProps) => {
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string>('');

  const filteredParticipants = selectedPlan
    ? participants.filter((participant) => participant.planId === selectedPlan.id)
    : participants.filter((participant) =>
        Object.values(participant).some((value) =>
          String(value).toLowerCase().includes(filterValue.toLowerCase())
        )
      );

  const calculateSummary = (participants: Participant[]) => {
    const totalParticipants = participants.length;
    const totalBalance = participants.reduce((sum, participant) => sum + (participant.balance || 0), 0);
    const averageAge =
      totalParticipants > 0
        ? participants.reduce((sum, participant) => sum + participant.age, 0) / totalParticipants
        : 0;
    const averageSavingsRate =
      totalParticipants > 0
        ? participants.reduce((sum, participant) => sum + (participant.savingsRatePercent || 0), 0) /
          totalParticipants
        : 0;

    return {
      totalParticipants,
      totalBalance,
      averageAge,
      averageSavingsRate,
    };
  };

  const summary = calculateSummary(filteredParticipants);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  const checkScreenWidth = () => {
    setIsMobileView(window.innerWidth < 640);
  };

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
        <p>Total Participants: {summary.totalParticipants}</p>
        <p>Total Balance: ${summary.totalBalance.toFixed(2)}</p>
        <p>Average Age: {summary.averageAge.toFixed(1)}</p>
      </div>

      <div
        style={{
          overflow: 'auto',
          border: '1px solid #ccc',
          borderRadius: '5px',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
          }}
        >
          <thead>
            <tr style={{ backgroundColor: '#144e74', color: 'white', textAlign: 'center' }}>
              <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Participant</th>
              <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Age</th>
              <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Balance</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipants.map((participant) => (
              <tr
                key={participant.id}
                onClick={() => onParticipantSelect(participant)}
                style={{ borderBottom: '1px solid #ccc', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                <td style={{ padding: '12px', textAlign: 'center' }}>{participant.id}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{participant.age.toFixed(0)}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  {participant.balance !== undefined && !isNaN(participant.balance)
                    ? `$${participant.balance.toFixed(2)}`
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticipantTable;
