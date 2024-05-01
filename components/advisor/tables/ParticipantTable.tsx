'use client'

import React, { useState, useEffect } from 'react';
import { Participant } from '@/types/ParticipantTypes';
import { Plan } from '@/types/PlanTypes';
import ClientTablePopup from './ClientTablePopup';

interface ParticipantTableProps {
  participants: Participant[];
  onParticipantSelect: (participant: Participant) => void;
  selectedPlan?: Plan | null;
}

const ParticipantTable: React.FC<ParticipantTableProps> = ({
  participants,
  onParticipantSelect,
  selectedPlan,
}: ParticipantTableProps) => {
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [filterValue, setFilterValue] = useState<string>('');
  const [displayCount, setDisplayCount] = useState<number>(10);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showClientTablePopup, setShowClientTablePopup] = useState<boolean>(false);

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

    return {
      totalParticipants,
      totalBalance,
      averageAge,
    };
  };

  const summary = calculateSummary(filteredParticipants);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterValue(e.target.value);
  };

  const handleLoadMore = () => {
    setDisplayCount((prevCount) => prevCount + 10);
  };

  const handleParticipantSelect = (participant: Participant) => {
    setSelectedParticipant(participant);
    setShowClientTablePopup(true);
  };

  const getTopStressor = (participant: Participant): string => {
    const { retirement, financial, tax, investment, estate } = participant;

    const stressors = [
      { name: 'Retirement', score: retirement.toString() },
      { name: 'Financial', score: financial.toString() },
      { name: 'Tax', score: tax.toString() },
      { name: 'Investment', score: investment.toString() },
      { name: 'Estate', score: estate.toString() },
    ];

    let topStressor = '';
    let highestScore = -1;

    stressors.forEach((stressor) => {
      const { name, score } = stressor;

      const numericScore = parseFloat(score);

      if (!isNaN(numericScore) && numericScore > highestScore) {
        highestScore = numericScore;
        topStressor = name;
      }
    });

    return topStressor;
  };

  const checkScreenWidth = () => {
    setIsMobileView(window.innerWidth < 640); // Adjust breakpoint as needed
  };

  useEffect(() => {
    window.addEventListener('resize', checkScreenWidth);
    checkScreenWidth();

    return () => {
      window.removeEventListener('resize', checkScreenWidth);
    };
  }, []);

  return (
    <div style={{ maxWidth: '100%', overflowX: 'auto', color: 'black', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginBottom: '20px', fontSize: '16px', fontWeight: 'bold', color: '#144e74' }}>
        <h3>Plan: {selectedPlan?.planName ?? '558'}</h3>
        <h3>Assets: ${summary.totalBalance.toFixed(2)}</h3>
      </div>

      <div style={{ overflow: 'auto', border: '1px solid #ccc', borderRadius: '5px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#144e74', color: 'white', textAlign: 'center' }}>
              <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Participant</th>
              {!isMobileView && <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Advice Score</th>}
              <th style={{ padding: '10px', border: '1px solid #ccc', whiteSpace: 'nowrap' }}>Stressor</th>
            </tr>
          </thead>
          <tbody>
            {filteredParticipants.slice(0, displayCount).map((participant) => (
              <tr
                key={participant.id}
                onClick={() => handleParticipantSelect(participant)}
                style={{ borderBottom: '1px solid #ccc', cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                <td style={{ padding: '12px', textAlign: 'center' }}>{participant.id}</td>
                {!isMobileView && <td style={{ padding: '12px', textAlign: 'center' }}>{participant.adviceScore}</td>}
                <td style={{ padding: '12px', textAlign: 'center', fontSize: isMobileView ? '14px' : 'inherit' }}>
                  {getTopStressor(participant)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {displayCount < filteredParticipants.length && (
          <div style={{ textAlign: 'center', marginTop: '10px', marginBottom: '10px' }}>
            <button
              onClick={handleLoadMore}
              style={{
                padding: '10px 20px',
                fontSize: '16px',
                backgroundColor: '#144e74',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {showClientTablePopup && selectedParticipant && (
        <ClientTablePopup
          showChartModal={showClientTablePopup}
          setShowChartModal={setShowClientTablePopup}
          participant={selectedParticipant}
          onClose={() => {
            setShowClientTablePopup(false);
            setSelectedParticipant(null);
          }}
        />
      )}
    </div>
  );
};

export default ParticipantTable;
