'use client'

import React, { useState, useEffect } from 'react';

interface CommonClientProps {
  name: string;
  retirement: number;
  financial: number;
  tax: number;
  investment: number;
  estate: number;
  other: number;
}

interface Client extends CommonClientProps {}

interface Service {
  name: string;
  icon: string;
}

interface ClientTableProps {
  clients: Client[]; // Ensure clients is always provided as an array
  onSelect: (client: Client) => void;
  selectedParticipant: { name: string } | null; // Use a subset of Participant
}

const ClientTable: React.FC<ClientTableProps> = ({ clients, onSelect, selectedParticipant }) => {
  const [clientData, setClientData] = useState<Client[]>([]);
  const [selectedClientIndex, setSelectedClientIndex] = useState<number | null>(null);
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  useEffect(() => {
    // Load clients data from JSON or mock data
    const mockClients: Client[] = [
      {
        name: 'Client 1',
        retirement: 92,
        financial: 78,
        tax: 82,
        investment: 48,
        estate: 76,
        other: 14,
      },
      {
        name: 'Client 2',
        retirement: 79,
        financial: 52,
        tax: 94,
        investment: 43,
        estate: 32,
        other: 9,
      },
      // Add more clients here...
    ];

    setClientData(mockClients);
  }, []);

  const getColor = (value: number): string => {
    if (value >= 80 && value <= 100) {
      return 'green';
    } else if (value >= 60 && value < 80) {
      return '#F8C83A';
    } else if (value >= 40 && value < 60) {
      return 'grey';
    } else if (value >= 20 && value < 40) {
      return '#F8632A';
    } else {
      return 'red';
    }
  };

  const handleClientClick = (index: number) => {
    const selectedClient = clientData[index];
    setSelectedClientIndex(index);
    onSelect(selectedClient);
  };

  const renderRowStyle = (index: number): React.CSSProperties => {
    const currentClient = clientData[index];
    const isSelected = selectedParticipant && selectedParticipant.name === currentClient.name;

    return {
      backgroundColor: isSelected ? '#144e74' : 'inherit',
      cursor: 'pointer',
      ...(hoveredRowIndex === index && styles.blueRowHover),
    };
  };

  const services: Service[] = [
    { name: 'Retirement', icon: 'retirement-light.svg' },
    { name: 'Financial Plans', icon: 'financial-light.svg' },
    { name: 'Tax Plans', icon: 'money-light.svg' },
    { name: 'Investment', icon: 'investment-light.svg' },
    { name: 'Estate Plans', icon: 'tax-light.svg' },
    { name: 'Other', icon: 'other-light.svg' },
  ];

  return (
    <div style={styles.container}>
      <table style={styles.table}>
        <thead>
          <tr style={styles.blueRow}>
            <th>Name</th>
            {services.map((service, index) => (
              <th key={index} style={styles.serviceHeader}>
                <img src={`/light/${service.icon}`} alt={service.name} style={styles.icon} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {clientData.map((client, index) => (
            <tr
              key={index}
              onClick={() => handleClientClick(index)}
              onMouseEnter={() => setHoveredRowIndex(index)}
              onMouseLeave={() => setHoveredRowIndex(null)}
              style={renderRowStyle(index)}
              className="client-row"
            >
              <td style={styles.cell}>{client.name}</td>
              <td style={{ ...styles.cell, color: getColor(client.retirement) }}>{client.retirement}</td>
              <td style={{ ...styles.cell, color: getColor(client.financial) }}>{client.financial}</td>
              <td style={{ ...styles.cell, color: getColor(client.tax) }}>{client.tax}</td>
              <td style={{ ...styles.cell, color: getColor(client.investment) }}>{client.investment}</td>
              <td style={{ ...styles.cell, color: getColor(client.estate) }}>{client.estate}</td>
              <td style={{ ...styles.cell, color: getColor(client.other) }}>{client.other}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    color: 'black',
    textAlign: 'center',
  } as React.CSSProperties,
  serviceCategoriesContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '20px',
  } as React.CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  } as React.CSSProperties,
  cell: {
    padding: '10px',
    border: '1px solid #ccc',
  } as React.CSSProperties,
  blueRow: {
    backgroundColor: '#144e74',
    color: 'white',
    textAlign: 'center',
  } as React.CSSProperties,
  blueRowHover: {
    backgroundColor: '#144e74',
    color: 'white',
  } as React.CSSProperties,
  serviceHeader: {
    padding: '10px',
    border: '1px solid #ccc',
    verticalAlign: 'middle',
    textAlign: 'center',
  } as React.CSSProperties,
  icon: {
    width: '24px',
    height: '24px',
    display: 'block',
    margin: 'auto',
  } as React.CSSProperties,
};

export default ClientTable;
