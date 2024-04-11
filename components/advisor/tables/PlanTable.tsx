// components/PlanTable.tsx
import React from 'react';
import { Plan } from '@/types/PlanTypes';

interface PlanTableProps {
  plans: Plan[];
  onPlanSelect: (plan: Plan) => void;
}

const PlanTable: React.FC<PlanTableProps> = ({ plans, onPlanSelect }) => {
  const containerStyle: React.CSSProperties = {
    maxWidth: '1200px',
    margin: '0 auto',
    color: 'black',
    textAlign: 'center',
    padding: '20px',
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

  const tableHeaderStyle: React.CSSProperties = {
    backgroundColor: '#144e74',
    color: 'white',
    textAlign: 'center',
    padding: '10px',
    border: '1px solid #ccc',
    verticalAlign: 'middle',
  };

  const tableRowStyle: React.CSSProperties = {
    borderBottom: '1px solid #ccc',
  };

  const cellStyle: React.CSSProperties = {
    padding: '12px',
    borderBottom: '1px solid #ccc',
  };

  const selectButtonStyle: React.CSSProperties = {
    padding: '8px 16px',
    borderRadius: '5px',
    background: '#144e74',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.3s, color 0.3s',
  };

  return (
    <div style={containerStyle}>
      <h2 style={tableTitleStyle}>Data Table</h2>
      <table style={tableStyle}>
        <thead>
          <tr style={tableHeaderStyle}>
            <th>Plan</th>
            <th>Assets</th>
            <th>Participants</th>
            <th>Health</th>
            <th>Select</th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.id} style={tableRowStyle}>
              <td style={cellStyle}>{plan.planName}</td>
              <td style={cellStyle}>{plan.assets}</td>
              <td style={cellStyle}>{plan.participants.length}</td>
              <td style={cellStyle}>{plan.health}</td>
              <td style={cellStyle}>
                <button style={selectButtonStyle} onClick={() => onPlanSelect(plan)}>
                  Select
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlanTable;
