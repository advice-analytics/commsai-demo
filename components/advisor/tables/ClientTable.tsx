'use client'

import React, { useState } from 'react';
import { Client } from '@/types/ClientTypes';
import Image from 'next/image';
import { sharedTableStyles } from './SharedStyles';

interface ClientTableProps {
  clients: Client[];
  onSelect: (client: Client) => void;
  selectedParticipant: { name: string } | null;
}

const ClientTable: React.FC<ClientTableProps> = ({ clients, onSelect, selectedParticipant }) => {
  const [selectedClientIndex, setSelectedClientIndex] = useState<number | null>(null);
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);

  const getColor = (value: number | string): string => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numericValue)) {
      return 'red';
    } else if (numericValue >= 80) {
      return 'green';
    } else if (numericValue >= 60) {
      return '#F8C83A';
    } else if (numericValue >= 40) {
      return 'grey';
    } else if (numericValue >= 20) {
      return '#F8632A';
    } else {
      return 'red';
    }
  };

  const handleClientClick = (index: number) => {
    const selectedClient = clients[index];
    setSelectedClientIndex(index);
    onSelect(selectedClient);
  };

  const renderRowStyle = (index: number): React.CSSProperties => {
    const isSelected = selectedParticipant && selectedParticipant.name === clients[index].name;
    return {
      backgroundColor: isSelected ? '#144e74' : 'inherit',
      cursor: 'pointer',
      ...(hoveredRowIndex === index && sharedTableStyles.blueRowHover),
    };
  };

  const getIconPath = (iconName: string): string => {
    return `/light/${iconName}-light.svg`; // Assuming all white icons are named similarly
  };

  return (
    <div style={sharedTableStyles.container}>
      <table style={sharedTableStyles.table}>
        <thead>
          <tr style={sharedTableStyles.blueRow}>
            <th>Name</th>
            <th>
              <Image src={getIconPath('retirement')} alt="Retirement Icon" style={sharedTableStyles.icon} width={24} height={24} />
            </th>
            <th>
              <Image src={getIconPath('financial')} alt="Financial Icon" style={sharedTableStyles.icon} width={24} height={24} />
            </th>
            <th>
              <Image src={getIconPath('money')} alt="Estate Icon" style={sharedTableStyles.icon} width={24} height={24} />
            </th>
            <th>
              <Image src={getIconPath('investement')} alt="Investment Icon" style={sharedTableStyles.icon} width={24} height={24} />
            </th>
            <th>
              <Image src={getIconPath('estate')} alt="Estate Icon" style={sharedTableStyles.icon} width={24} height={24} />
            </th>
            <th>
              <Image src={getIconPath('other')} alt="Other Icon" style={sharedTableStyles.icon} width={24} height={24} />
            </th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client, index) => (
            <tr
              key={index}
              onClick={() => handleClientClick(index)}
              onMouseEnter={() => setHoveredRowIndex(index)}
              onMouseLeave={() => setHoveredRowIndex(null)}
              style={{ ...sharedTableStyles.tableRow, ...renderRowStyle(index) }}
              className="client-row"
            >
              <td style={sharedTableStyles.cell}>{client.name}</td>
              <td style={{ ...sharedTableStyles.cell, color: getColor(client.retirement) }}>{client.retirement}</td>
              <td style={{ ...sharedTableStyles.cell, color: getColor(client.financial) }}>{client.financial}</td>
              <td style={{ ...sharedTableStyles.cell, color: getColor(client.tax) }}>{client.tax}</td>
              <td style={{ ...sharedTableStyles.cell, color: getColor(client.investment) }}>{client.investment}</td>
              <td style={{ ...sharedTableStyles.cell, color: getColor(client.estate) }}>{client.estate}</td>
              <td style={{ ...sharedTableStyles.cell, color: getColor(client.other) }}>{client.other}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClientTable;
