'use client'

import React, { useState, useEffect } from 'react';
import { Chart, Chart as ChartType, registerables } from 'chart.js/auto';
import { Client, Participant } from '@/types/ParticipantTypes';

interface ClientTableProps {
  clients: Client[];
  onSelect?: (client: Client) => void;
  selectedParticipant: Participant;
}

const ClientTable: React.FC<ClientTableProps> = ({ clients, onSelect, selectedParticipant }) => {
  const [selectedParticipantId, setSelectedParticipantId] = useState<string>('');
  const [showChartModal, setShowChartModal] = useState<boolean>(false);
  const [participantScores, setParticipantScores] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    setSelectedParticipantId(selectedParticipant.id);
    setParticipantScores({
      retirement: selectedParticipant.retirement || 0,
      financial: selectedParticipant.financial || 0,
      tax: selectedParticipant.tax || 0,
      investment: selectedParticipant.investment || 0,
      estate: selectedParticipant.estate || 0,
    });
  }, [selectedParticipant]);

  useEffect(() => {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    let chartInstance: ChartType | null = null;

    if (ctx && Object.keys(participantScores).length > 0) {
      Chart.register(...registerables);
      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: Object.keys(participantScores),
          datasets: [
            {
              label: 'Key Stressor',
              data: Object.values(participantScores),
              backgroundColor: Object.values(participantScores).map(score => getColor(score)),
              borderWidth: 2,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance) chartInstance.destroy();
    };
  }, [participantScores]);

  const getColor = (score: number): string => {
    if (score >= 90) return 'green';
    if (score >= 80) return 'limegreen';
    if (score >= 70) return 'lightgreen';
    if (score >= 60) return 'yellow';
    if (score >= 50) return 'orange';
    if (score >= 40) return 'darkorange';
    if (score >= 30) return 'red';
    return 'darkred';
  };

  const calculateOverallScore = (): number => {
    const { retirement, financial, tax, investment, estate } = participantScores;
    const overallScore = (retirement + financial + tax + investment + estate) / 5;
    return overallScore;
  };

  const handleClientSelect = (client: Client) => {
    if (onSelect) {
      onSelect(client);
      setShowChartModal(true); // Show the chart modal when a client is selected
    }
  };

  return (
    <div className="my-4">
      <h1 className="text-xl font-semibold mb-2 text-navyblue">Advice Scores</h1>
      <p className="text-gray-700">
        {selectedParticipantId ? `Viewing Participant ID: ${selectedParticipantId}` : 'Select a participant to view details.'}
      </p>
      <p className="text-gray-700">
        Overall Advice Score: <span className="font-semibold">{calculateOverallScore().toFixed(2)}</span>
      </p>
      <div className="overflow-x-auto mt-4">
        <canvas id="myChart"></canvas>
      </div>
      <div className="mt-4">
        <table className="w-full table-auto">
          <thead>
            <tr>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr
                key={client.id}
                className={`cursor-pointer ${client.id === selectedParticipantId ? 'bg-gray-200' : ''}`}
                onClick={() => handleClientSelect(client)}
              >
                <td className="px-4 py-2">{client.planName}</td>
                <td className="px-4 py-2">{client.id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal for displaying the chart */}
      {showChartModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Participant Scores Chart</h2>
            <canvas id="myChartModal"></canvas>
            <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" onClick={() => setShowChartModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientTable;
