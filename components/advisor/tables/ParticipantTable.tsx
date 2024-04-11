// components/ParticipantTable.tsx

import React from 'react';
import { Participant } from '@/types/ParticipantTypes'; // Import Participant from ParticipantTypes.ts
import { sharedTableStyles } from './SharedStyles'; // Import shared table styles

interface ParticipantTableProps {
  participants: Participant[];
  onParticipantSelect: (participant: Participant) => void;
}

const ParticipantTable: React.FC<ParticipantTableProps> = ({ participants, onParticipantSelect }) => {
  const getColor = (value: number): string => {
    if (value >= 80) return 'green';
    else if (value >= 60) return '#F8C83A';
    else if (value >= 40) return 'grey';
    else if (value >= 20) return '#F8632A';
    else return 'red';
  };

  const renderRowStyle = (participant: Participant): React.CSSProperties => {
    return {
      ...(parseInt(participant.need, 10) >= 80 && sharedTableStyles.blueRow), // Example logic for high-need participants
    };
  };

  return (
    <div style={sharedTableStyles.container}>
      <table style={sharedTableStyles.table}>
        <thead>
          <tr style={sharedTableStyles.blueRow}>
            <th>Name</th>
            <th>Age</th>
            <th>Balance</th>
            <th>Need</th>
            <th>Plan</th>
            <th>Employer</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr
              key={participant.id}
              onClick={() => onParticipantSelect(participant)}
              style={{ ...sharedTableStyles.tableRow, ...renderRowStyle(participant) }}
              className="table-row"
            >
              <td style={sharedTableStyles.cell}>{participant.name}</td>
              <td style={sharedTableStyles.cell}>{participant.age}</td>
              <td style={sharedTableStyles.cell}>{participant.balance}</td>
              <td style={{ ...sharedTableStyles.cell, color: getColor(parseInt(participant.need, 10)) }}>
                {participant.need}
              </td>
              <td style={sharedTableStyles.cell}>{participant.plan}</td>
              <td style={sharedTableStyles.cell}>{participant.employer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantTable;
