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

  const clearFilters = () => {
    onChange([]);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="button w-full p-2.5 text-left text-sm sm:text-base bg-[var(--secondary-bg)] border border-[var(--border-color)]"
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
            className="w-full p-2.5 text-sm sm:text-base border-b border-[var(--border-color)]"
            aria-label="Search language"
          />

          {selectedLanguages.length > 0 && (
            <button
              onClick={clearFilters}
              className="w-full text-left text-xs sm:text-sm text-[var(--accent-color)] px-3 py-2 hover:underline"
            >
              Clear Filter
            </button>
          )}

          <div className="max-h-36 sm:max-h-48 overflow-y-auto">
            {filteredLanguages.map((lang) => (
              <label
                key={lang}
                className="flex items-center px-3 py-2 hover:bg-[var(--accent-color)]/10 cursor-pointer text-sm sm:text-base text-[var(--input-text)] transition-colors duration-400"
              >
                <input
                  type="checkbox"
                  checked={selectedLanguages.includes(lang)}
                  onChange={() => toggleLanguage(lang)}
                  className="mr-2 h-4 w-4 sm:h-5 sm:w-5 accent-[var(--accent-color)]"
                  aria-label={`Toggle ${lang}`}
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
