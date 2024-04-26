// SharedStyles.tsx
import { CSSProperties } from 'react';

export const sharedTableStyles = {
  container: {
    maxWidth: '100%',
    overflowX: 'auto',
    color: 'black',
    padding: '20px',
  } as CSSProperties,
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  } as CSSProperties,
  tableHeader: {
    backgroundColor: '#144e74',
    color: 'white',
    textAlign: 'center',
    padding: '10px',
    border: '1px solid #ccc',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
  } as CSSProperties,
  tableRow: {
    borderBottom: '1px solid #ccc',
    whiteSpace: 'nowrap',
  } as CSSProperties,
  cell: {
    padding: '12px',
    borderBottom: '1px solid #ccc',
    whiteSpace: 'nowrap',
  } as CSSProperties,
  selectButton: {
    padding: '8px 16px',
    borderRadius: '5px',
    background: '#144e74',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    transition: 'background 0.3s, color 0.3s',
  } as CSSProperties,
  icon: {
    width: '24px',
    height: '24px',
    display: 'block',
    margin: 'auto',
  } as CSSProperties,
  blueRow: {
    backgroundColor: '#144e74',
    color: 'white',
    textAlign: 'center',
    whiteSpace: 'nowrap',
  } as CSSProperties,
  blueRowHover: {
    backgroundColor: '#144e74',
    color: 'white',
  } as CSSProperties,
  clientTableHeader: {
    padding: '12px',
    borderBottom: '1px solid #ccc',
    textAlign: 'center',
    verticalAlign: 'middle',
    whiteSpace: 'nowrap',
  } as CSSProperties,
  summaryContainer: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: '20px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#144e74',
  } as CSSProperties,
  mobileContainer: {
    overflowX: 'auto',
    maxWidth: '100%',
    padding: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    marginBottom: '20px',
  } as CSSProperties,
};
