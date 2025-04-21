
import React from 'react';

const RegionFilter = ({ region, onFilter }) => {
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  return (
    <select
      value={region}
      onChange={(e) => onFilter(e.target.value)}
      className="p-2 border border-gray-300 rounded mb-4"
    >
      <option value="">Filter by Region</option>
      {regions.map((reg) => (
        <option key={reg} value={reg}>
          {reg}
        </option>
      ))}
    </select>
  );
};

export default RegionFilter;
