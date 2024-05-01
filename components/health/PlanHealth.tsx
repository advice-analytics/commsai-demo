'use client'

import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import Image from 'next/image';
import { Plan } from '@/types/PlanTypes';
import { Participant, Score } from '@/types/ParticipantTypes';

interface PlanHealthProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
}

const PlanHealth: React.FC<PlanHealthProps> = ({ isOpen, onClose, plan }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let newChart: Chart<'doughnut', number[], unknown> | null = null;

    if (isOpen && plan && chartRef.current) {
      const categoryLabels = ['Participation', 'Contributions', 'Investments', 'Loans & Withdrawals', 'Administrative'];
      const categoryData: number[] = [10, 20, 30, 40, 50, 60];

      plan.participants.forEach((participant: Participant) => {
        if (participant.scores && Array.isArray(participant.scores)) {
          participant.scores.forEach((score: Score) => {
            switch (score.category) {
              case 'Participation':
                categoryData[0] += score.score;
                break;
              case 'Contributions':
                categoryData[1] += score.score;
                break;
              case 'Investments':
                categoryData[2] += score.score;
                break;
              case 'Loans & Withdrawals':
                categoryData[3] += score.score;
                break;
              case 'Administrative':
                categoryData[4] += score.score;
                break;
              default:
                categoryData[5] += score.score; // Other category
                break;
            }
          });
        }
      });

      // Ensure proper registration of Chart.js components
      Chart.register(...registerables);

      const ctx = chartRef.current.getContext('2d');
      if (ctx) {
        newChart = new Chart<'doughnut', number[], unknown>(ctx, {
          type: 'doughnut',
          data: {
            labels: categoryLabels,
            datasets: [
              {
                data: categoryData,
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      }
    }

    return () => {
      if (newChart) {
        newChart.destroy(); // Cleanup chart on component unmount
      }
      Chart.unregister(...registerables);
    };
  }, [isOpen, plan]);

  return (
    <>
      {isOpen && plan && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999,
          }}
          onClick={onClose} // Close the popup on background click
        >
          <div
            style={{
              padding: '20px',
              backgroundColor: '#fff',
              width: '90%', // Adjusted width for smaller screens
              maxWidth: '400px', // Max width to maintain readability
              maxHeight: '90%', // Max height to fit within viewport
              overflow: 'auto',
              borderRadius: '8px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>Plan Insights</h3>
              <Image src="/dailyvest.png" alt="DailyVest Logo" width={100} height={100} />
            </div>
            <p style={{ textAlign: 'center', marginBottom: '30px', marginTop:'40px' }}>
              Clicking `View Insights` will direct you to dailyVest.com for Plan Health and Participant details.
            </p>
            <h3 style={{ textAlign: 'center', marginBottom: '10px' }}>{plan.planName}</h3>
            <p style={{ textAlign: 'center', marginBottom: '40px' }}>Plan Health Score: {plan.health}%</p>
            <div style={{ margin: '0 auto', width: '100%', maxWidth: '300px', textAlign: 'center' }}>
              <canvas ref={chartRef} id='healthChart' style={{ width: '100%', height: 'auto' }}></canvas>
            </div>
          </div>
        </div>
      )}
    </>
  );  
};

export default PlanHealth;
