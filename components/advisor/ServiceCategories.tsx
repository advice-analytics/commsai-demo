'use client'

import React, { useState } from 'react';
import Image from 'next/image';

interface ServiceCategory {
  name: string;
  icon: string;
}

interface ServiceCategoriesProps {
  categories: ServiceCategory[];
}

const ServiceCategories: React.FC<ServiceCategoriesProps> = ({ categories }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const handleServiceSelection = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(item => item !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  return (
    <div className="service-categories-container">
      <h3 className="text-lg font-semibold mb-2 text-navyblue">Your Selected Plans</h3>
      <div className="service-categories-grid">
        {categories.map(category => (
          <div key={category.name} className="service-category" onClick={() => handleServiceSelection(category.name)}>
            <Image src={`/dark/${category.icon}`} alt={category.name} className="category-icon" />
            <span>{category.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCategories;
