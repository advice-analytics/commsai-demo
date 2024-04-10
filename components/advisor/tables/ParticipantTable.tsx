// components/ParticipantTable.tsx
import React from 'react';
import { Participant } from '@/types/PlanTypes';

interface ParticipantTableProps {
  participants: Participant[];
  onParticipantSelect: (participant: Participant) => void;
}

const ParticipantTable: React.FC<ParticipantTableProps> = ({ participants, onParticipantSelect }) => {
  const tableContainerStyle: React.CSSProperties = {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '5px',
  };

  const tableTitleStyle: React.CSSProperties = {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#144e74',
  };

  const tableStyle: React.CSSProperties = {
    width: '100%',
    borderCollapse: 'collapse',
  };

  const tableHeaderCellStyle: React.CSSProperties = {
    backgroundColor: '#144e74',
    color: 'white',
    textAlign: 'center',
    padding: '10px',
    border: '1px solid #ccc',
  };

  const tableRowStyle: React.CSSProperties = {
    borderBottom: '1px solid #ccc',
    cursor: 'pointer',
  };

  return (
    <div style={tableContainerStyle} className="table-container">
      <h2 style={tableTitleStyle} className="table-title">
        Participant Table
      </h2>
      <table style={tableStyle} className="table">
        <thead>
          <tr className="table-header">
            <th style={tableHeaderCellStyle}>Name</th>
            <th style={tableHeaderCellStyle}>Age</th>
            <th style={tableHeaderCellStyle}>Balance</th>
            <th style={tableHeaderCellStyle}>Need</th>
            <th style={tableHeaderCellStyle}>Plan</th>
            <th style={tableHeaderCellStyle}>Employer</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((participant) => (
            <tr
              key={participant.id}
              style={tableRowStyle}
              onClick={() => onParticipantSelect(participant)}
            >
              <td style={{ ...tableHeaderCellStyle, textAlign: 'left', paddingLeft: '10px' }}>{participant.name}</td>
              <td style={tableHeaderCellStyle}>{participant.age}</td>
              <td style={tableHeaderCellStyle}>{participant.balance}</td>
              <td style={{ ...tableHeaderCellStyle, color: parseInt(participant.need, 10) >= 80 ? 'red' : 'black' }}>
                {participant.need}
              </td>
              <td style={tableHeaderCellStyle}>{participant.plan}</td>
              <td style={tableHeaderCellStyle}>{participant.employer}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ParticipantTable;
