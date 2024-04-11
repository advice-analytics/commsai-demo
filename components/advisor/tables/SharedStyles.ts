// SharedTableStyles.ts

import { CSSProperties } from 'react';

export const sharedTableStyles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    color: 'black',
    textAlign: 'center',
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
    width: '100%',
  } as CSSProperties,
  tableRow: {
    borderBottom: '1px solid #ccc',
  } as CSSProperties,
  cell: {
    padding: '12px',
    borderBottom: '1px solid #ccc',
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
    /* Add specific styles for header cells in ClientTable */
  } as CSSProperties,
};
