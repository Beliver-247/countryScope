import React from 'react';

const RegionFilter = ({ region, onFilter }) => {
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  return (
    <select
      value={region}
      onChange={(e) => onFilter(e.target.value)}
      className="w-full p-2.5 text-sm sm:text-base"
      aria-label="Filter by region"
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