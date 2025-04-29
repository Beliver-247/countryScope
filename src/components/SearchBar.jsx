import React from 'react';

const SearchBar = ({ searchTerm, onSearch }) => {
  return (
    <input
      type="text"
      placeholder="Search for a country..."
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      className="w-full md:w-1/3 p-3"
    />
  );
};

export default SearchBar;