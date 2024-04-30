'use client'

import React, { useEffect, useState, useMemo } from 'react';
import { Chart, Chart as ChartType, registerables } from 'chart.js/auto';
import { Participant } from '@/types/ParticipantTypes';

interface ClientTablePopupProps {
  showChartModal: boolean;
  setShowChartModal: React.Dispatch<React.SetStateAction<boolean>>;
  participant: Participant;
  onClose: () => void;
}

const ClientTablePopup: React.FC<ClientTablePopupProps> = ({
  showChartModal,
  setShowChartModal,
  participant,
  onClose,
}) => {
  const { retirement, financial, tax, investment, estate, planReturns, balance, age, state, gender, adviceScore } = participant;

  const stressors = useMemo(() => [
    { name: 'Retirement', value: retirement, color: 'orange' },
    { name: 'Financial', value: financial, color: 'green' },
    { name: 'Tax', value: tax, color: 'blue' },
    { name: 'Investment', value: investment, color: 'red' },
    { name: 'Estate', value: estate, color: 'purple' },
  ], [retirement, financial, tax, investment, estate]);

  const calculateTopStressor = (stressors: { name: string; value: number; color: string }[]) => {
    const sortedStressors = [...stressors].sort((a, b) => b.value - a.value); // Sort stressors by value descending
    return sortedStressors[0];
  };

  const topStressor = calculateTopStressor(stressors);

  useEffect(() => {
    let chartInstance: ChartType | null = null;

    const showChart = () => {
      const ctx = document.getElementById('myChartModal') as HTMLCanvasElement;
      if (ctx) {
        Chart.register(...registerables);
        chartInstance = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: stressors.map((stressor) => stressor.name),
            datasets: [
              {
                label: 'Key Stressor',
                data: stressors.map((stressor) => stressor.value),
                backgroundColor: stressors.map((stressor) => (stressor.name === topStressor.name ? topStressor.color : '#3f51b5')),
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
            plugins: {
              legend: {
                labels: {
                  generateLabels: (chart: ChartType) => {
                    const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                    labels.forEach((label) => {
                      if (label.text === 'Key Stressor') {
                        label.fillStyle = topStressor.color; // Set label color to match top stressor color
                      }
                    });
                    return labels;
                  },
                },
              },
            },
          },
        });
      }
    };

    const destroyChart = () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };

    if (showChartModal) {
      showChart();
    } else {
      destroyChart();
    }

    return destroyChart;
  }, [showChartModal, stressors, topStressor]);

  const handleClose = () => {
    setShowChartModal(false);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <>
      {showChartModal && (
        <div className="popup-overlay" onClick={handleOverlayClick}>
          <div className="popup-content">
            <div className="popup-header">
              <h2 className="popup-title">Participant Advice Scores</h2>
              <button className="close-button" onClick={handleClose}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="popup-body">
              <canvas id="myChartModal"></canvas>
              <p>Overall Advice Score: {adviceScore}</p>
              <p>Top Stressor: {topStressor.name}</p>
              <p>Plan Returns: {planReturns}</p>
              <p>Balance: {balance}</p>
              <p>Age: {age}</p>
              <p>State: {state}</p>
              <p>Gender: {gender}</p>
            </div>
          </div>
          <style jsx>{`
            .popup-overlay {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.5);
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 1000;
            }
            .popup-content {
              background-color: #fff;
              width: 80%;
              max-width: 600px;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
              display: flex;
              flex-direction: column;
              gap: 20px;
            }
            .popup-header {
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .popup-title {
              font-size: 24px;
              color: #144e74;
              margin: 0;
              font-weight: bold;
            }
            .close-button {
              background: none;
              color: black;
              border: none;
              cursor: pointer;
              padding: 0;
              outline: none;
            }
            .popup-body {
              display: flex;
              flex-direction: column;
              gap: 10px;
            }
          `}</style>
        </div>
      )}
    </>
  );
};

export default ClientTablePopup;
