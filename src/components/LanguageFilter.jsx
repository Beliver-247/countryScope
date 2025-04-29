import { useState } from 'react';

const LanguageFilter = ({ selectedLanguages, onChange, languages }) => {
  const [search, setSearch] = useState('');
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
        className="button w-full p-2 border border-[var(--border-color)] text-left bg-[var(--secondary-bg)] text-[var(--input-text)] shadow-sm"
      >
        {selectedLanguages.length > 0
          ? selectedLanguages.join(', ')
          : 'Filter by Language'}
      </button>

      {showDropdown && (
        <div className="absolute z-10 w-full mt-1 bg-[var(--secondary-bg)] border border-[var(--border-color)] rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <input
            type="text"
            placeholder="Search language..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border-b border-[var(--border-color)] bg-[var(--secondary-bg)] text-[var(--input-text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] shadow-sm"
          />
          <div className="max-h-48 overflow-y-auto">
            {filteredLanguages.map((lang) => (
              <label
                key={lang}
                className="flex items-center px-4 py-2 hover:bg-[var(--accent-color)]/10 cursor-pointer text-[var(--input-text)] transition-colors duration-400 ease-in-out"
              >
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes(lang)}
                  onChange={() => toggleLanguage(lang)}
                  className="mr-2 accent-[var(--accent-color)]"
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