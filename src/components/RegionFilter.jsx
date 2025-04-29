import React from 'react';

const RegionFilter = ({ region, onFilter }) => {
  const regions = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  return (
    <select
      value={region}
      onChange={(e) => onFilter(e.target.value)}
      className="w-full md:w-1/4 p-3"
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