'use client'

import React, { useState } from 'react';
import ClientTablePopup from './ClientTablePopup';
import { Client, Participant } from '@/types/ParticipantTypes';

interface ClientTableProps {
  clients: Client[];
  onSelect?: (client: Client) => void;
  selectedParticipant: Participant | null;
}

const ClientTable: React.FC<ClientTableProps> = ({ clients, onSelect, selectedParticipant }) => {
  const [showChartModal, setShowChartModal] = useState<boolean>(false);

  const handleCloseModal = () => {
    setShowChartModal(false);
  };

  const handleClientSelect = (client: Client) => {
    if (onSelect) {
      onSelect(client);
      setShowChartModal(true);
    }
  };

  return (
    <div className="my-4">
      <h1 className="text-xl font-semibold mb-2 text-navyblue">Advice Scores</h1>
      <p className="text-gray-700">
        {selectedParticipant ? `Viewing Participant ID: ${selectedParticipant.id}` : 'Select a participant to view details.'}
      </p>
      <div className="overflow-x-auto mt-4">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Participant Name</th>
              <th className="px-4 py-2">ID</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className={`cursor-pointer ${client.id === selectedParticipant?.id ? 'bg-gray-200' : ''}`}
                onClick={() => handleClientSelect(client)}
              >
                <td className="px-4 py-2">{client.name}</td>
                <td className="px-4 py-2">{client.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showChartModal && selectedParticipant && (
        <ClientTablePopup
          showChartModal={showChartModal}
          setShowChartModal={setShowChartModal}
          participant={selectedParticipant}
          onClose={handleCloseModal} // Pass handleCloseModal as onClose prop
        />
      )}
    </div>
  );
};

export default ClientTable;
