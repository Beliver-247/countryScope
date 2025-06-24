import React from 'react';

const SearchBar = ({ searchTerm, onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search for a country..."
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      className="w-full p-2.5 text-sm sm:text-base"
      aria-label="Search countries"
    />
  );
};

export default SearchBar;