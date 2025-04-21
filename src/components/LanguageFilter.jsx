import { useState } from 'react';

const LanguageFilter = ({ selectedLanguages, onChange, languages }) => {
    const [search, setSearch] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
  
    const filteredLanguages = languages.filter((lang) =>
      lang.toLowerCase().includes(search.toLowerCase())
    );
  
    const toggleLanguage = (lang) => {
      if (selectedLanguages.includes(lang)) {
        onChange(selectedLanguages.filter((l) => l !== lang));
      } else {
        onChange([...selectedLanguages, lang]);
      }
    };
  
    return (
      <div className="relative w-full md:w-1/2">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="w-full p-2 border border-gray-300 rounded text-left"
        >
          {selectedLanguages.length > 0
            ? selectedLanguages.join(", ")
            : "Filter by Language"}
        </button>
  
        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded shadow max-h-60 overflow-y-auto">
            <input
              type="text"
              placeholder="Search language..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2 border-b border-gray-200"
            />
            <div className="max-h-48 overflow-y-auto">
              {filteredLanguages.map((lang) => (
                <label
                  key={lang}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(lang)}
                    onChange={() => toggleLanguage(lang)}
                    className="mr-2"
                  />
                  {lang}
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default LanguageFilter;
  