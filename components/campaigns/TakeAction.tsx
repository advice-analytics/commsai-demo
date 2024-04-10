
'use client'

import React, { useState } from 'react';
import { useValuePropContext } from '../context/ValuePropContext';

interface Client {
  name: string;
  retirement: number;
  financial: number;
  tax: number;
  investment: number;
  estate: number;
  other: number;
}

interface ServiceCategory {
  name: string;
  subCategories: string[];
}

interface TakeActionProps {
  selectedClient: Client | null;
  valueProp: string;
}

const TakeAction: React.FC<TakeActionProps> = ({ selectedClient, valueProp }) => {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const { targetClient } = useValuePropContext(); // Accessing targetClient from context

  const serviceCategories: ServiceCategory[] = [
    {
      name: 'Retirement',
      subCategories: ['Tax Strategy', 'Tax Preparation', 'Tax Consulting'],
    },
    {
      name: 'Financial',
      subCategories: ['Portfolios', 'Stock Market Analysis', 'Financial Planning'],
    },
    {
      name: 'Tax',
      subCategories: ['Life Insurance', 'Property Insurance', 'Health Insurance'],
    },
    {
      name: 'Investment',
      subCategories: ['Wills and Trusts', 'Estate Administration', 'Asset Protection'],
    },
    {
      name: 'Estate',
      subCategories: ['Donations', 'Volunteering', 'Fundraising'],
    },
    {
      name: 'Other',
      subCategories: ['Business Strategy', 'Financial Analysis', 'Market Research'],
    },
  ];

  const handleActionSelect = (action: string) => {
    setSelectedAction(action);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleSubCategorySelect = (subCategory: string) => {
    setSelectedSubCategory(subCategory);
  };

  const generatePrompt = (): string => {
    if (!selectedAction || !selectedSubCategory || !selectedClient || !selectedCategory) {
      return '';
    }

    let prompt = `Compose an ${selectedAction} to ${selectedClient.name} discussing ${selectedSubCategory} within the ${selectedCategory} service category. `;
    prompt += `Value proposition for ${targetClient}: ${valueProp}. `;
    prompt += `Selected main category: ${selectedCategory}. `;
    prompt += `Selected subcategory: ${selectedSubCategory}`;

    return prompt;
  };

  const handlePromptGenerate = () => {
    const prompt = generatePrompt();
    console.log(prompt);
  };

  return (
    <div style={styles.container}>
      <h2 className="text-lg font-semibold mb-4 text-navyblue">Selected Client</h2>
      {selectedClient ? (
        <div style={styles.section}>
          <div style={styles.clientProfile}>
            <h3 style={styles.clientProfileHeader}>{selectedClient.name}</h3>
            <div style={styles.clientProfileItem}>
              <span style={styles.clientProfileLabel}>Portfolio Planning:</span>
              <span style={styles.clientProfileValue}>{selectedClient.retirement}</span>
            </div>
            <div style={styles.clientProfileItem}>
              <span style={styles.clientProfileLabel}>Tax Strategies:</span>
              <span style={styles.clientProfileValue}>{selectedClient.financial}</span>
            </div>
            <div style={styles.clientProfileItem}>
              <span style={styles.clientProfileLabel}>Estate Planning:</span>
              <span style={styles.clientProfileValue}>{selectedClient.tax}</span>
            </div>
            <div style={styles.clientProfileItem}>
              <span style={styles.clientProfileLabel}>Insurance / Annuities:</span>
              <span style={styles.clientProfileValue}>{selectedClient.investment}</span>
            </div>
            <div style={styles.clientProfileItem}>
              <span style={styles.clientProfileLabel}>Charitable Trust:</span>
              <span style={styles.clientProfileValue}>{selectedClient.estate}</span>
            </div>
            <div style={styles.clientProfileItem}>
              <span style={styles.clientProfileLabel}>Business Ownership:</span>
              <span style={styles.clientProfileValue}>{selectedClient.other}</span>
            </div>
            <div style={styles.clientProfileItem}>
              <span style={styles.clientProfileLabel}>Completeness Score:</span>
            </div>
          </div>
        </div>
      ) : (
        <p>No client selected.</p>
      )}

      <div style={styles.section}>
        <h2 className="text-lg font-semibold mb-4 text-navyblue">Select Action:</h2>
        <div style={styles.buttonGroup}>
          <button
            style={selectedAction === 'email' ? { ...styles.actionButton, ...styles.selectedAction } : styles.actionButton}
            onClick={() => handleActionSelect('email')}
          >
            Email
          </button>
          <button
            style={selectedAction === 'text' ? { ...styles.actionButton, ...styles.selectedAction } : styles.actionButton}
            onClick={() => handleActionSelect('text')}
          >
            Text
          </button>
          <button
            style={selectedAction === 'call' ? { ...styles.actionButton, ...styles.selectedAction } : styles.actionButton}
            onClick={() => handleActionSelect('call')}
          >
            Call
          </button>
        </div>
      </div>

      <div style={styles.section}>
        <h2 className="text-lg font-semibold mb-4 text-navyblue">Select Service Category:</h2>
        <select value={selectedCategory || ''} onChange={(e) => handleCategorySelect(e.target.value)} style={styles.serviceDropdown}>
          <option value="">Select a category</option>
          {serviceCategories.map((category) => (
            <option key={category.name} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <div style={styles.section}>
          <h3>Select Subcategory:</h3>
          <select value={selectedSubCategory || ''} onChange={(e) => handleSubCategorySelect(e.target.value)} style={styles.subCategoryDropdown}>
            <option value="">Select a subcategory</option>
            {serviceCategories.find((category) => category.name === selectedCategory)?.subCategories.map((subCategory) => (
              <option key={subCategory} value={subCategory}>
                {subCategory}
              </option>
            ))}
          </select>
        </div>
      )}

      <div style={styles.section}>
        <h2 className="text-lg font-semibold mb-4 text-navyblue">Your Prompt:</h2>
        <p style={styles.prompt}>{generatePrompt()}</p>
        <button style={styles.generateButton} onClick={handlePromptGenerate}>
          Create
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    color: 'black',
    textAlign: 'center',
    padding: '20px',
  } as React.CSSProperties,
  section: {
    marginBottom: '20px',
  } as React.CSSProperties,
  clientProfile: {
    backgroundColor: '#144e74',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
  } as React.CSSProperties,
  clientProfileHeader: {
    color: 'white',
    marginBottom: '10px',
  } as React.CSSProperties,
  clientProfileItem: {
    marginBottom: '8px',
  } as React.CSSProperties,
  clientProfileLabel: {
    marginRight: '10px',
    fontWeight: 'bold',
    color: 'white',
  } as React.CSSProperties,
  clientProfileValue: {
    color: 'white',
  } as React.CSSProperties,
  buttonGroup: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '10px',
  } as React.CSSProperties,
  actionButton: {
    margin: '0 5px',
    padding: '8px 16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    background: '#f0f0f0',
    cursor: 'pointer',
    transition: 'background 0.3s, color 0.3s',
  } as React.CSSProperties,
  selectedAction: {
    background: '#144e74',
    color: 'white',
  } as React.CSSProperties,
  serviceDropdown: {
    marginBottom: '20px',
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
    width: '300px',
  } as React.CSSProperties,
  subCategoryDropdown: {
    marginBottom: '20px',
    maxHeight: '200px',
    overflowY: 'auto',
    border: '1px solid #ccc',
    borderRadius: '5px',
    padding: '10px',
    fontSize: '16px',
    width: '300px',
  } as React.CSSProperties,
  prompt: {
    marginBottom: '20px',
  } as React.CSSProperties,
  generateButton: {
    margin: '0 5px',
    padding: '8px 16px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    background: '#f0f0f0',
    cursor: 'pointer',
    transition: 'background 0.3s, color 0.3s',
  } as React.CSSProperties,
};

export default TakeAction;
