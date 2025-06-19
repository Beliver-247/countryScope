import { useEffect, useState } from 'react';
import axios from 'axios';
import CountryCard from '../components/CountryCard';
import LanguageFilter from '../components/LanguageFilter';
import { toast } from 'react-toastify';
import { auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getFavorites, addFavorite, removeFavorite } from '../firebase/favoriteHelpers';
import SearchBar from '../components/SearchBar';
import RegionFilter from '../components/RegionFilter';

function Home() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [region, setRegion] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchCountries();

    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const favs = await getFavorites(currentUser.uid);
        setFavorites(favs);
      }
    });

    return () => unsub();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get('https://restcountries.com/v3.1/all?fields=name,capital,region,flags,population,languages,cca3');

      setCountries(response.data);

      const langsSet = new Set();
      response.data.forEach((country) => {
        if (country.languages) {
          Object.values(country.languages).forEach((lang) => langsSet.add(lang));
        }
      });
      setLanguages(Array.from(langsSet).sort());
    } catch (error) {
      console.error('Error fetching countries:', error);
      toast.error('Failed to fetch countries.');
    }
  };

  const handleAddFavorite = (countryCode) => {
    if (user) {
      addFavorite(user.uid, countryCode);
      setFavorites((prev) => [...prev, countryCode]);
      toast.success('Added to favorites!');
    } else {
      toast.warning('Please log in to add favorites');
    }
  };

  const handleRemoveFavorite = (countryCode) => {
    if (user) {
      removeFavorite(user.uid, countryCode);
      setFavorites((prev) => prev.filter((code) => code !== countryCode));
      toast.info('Removed from favorites!');
    }
  };

  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.name.common
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesRegion = region ? country.region === region : true;
    const countryLanguages = country.languages
      ? Object.values(country.languages)
      : [];
    const matchesLanguages =
      selectedLanguages.length === 0 ||
      selectedLanguages.every((lang) => countryLanguages.includes(lang));

    return matchesSearch && matchesRegion && matchesLanguages;
  });

  return (
    <div className="py-6">
      <div className="container">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
          Explore Countries
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-4 mb-8">
          <SearchBar
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            className="w-full sm:w-1/3"
          />
          <RegionFilter
            region={region}
            onFilter={setRegion}
            className="w-full sm:w-1/4"
          />
          <LanguageFilter
            selectedLanguages={selectedLanguages}
            onChange={setSelectedLanguages}
            languages={languages}
            className="w-full sm:w-1/2"
          />
        </div>

        {filteredCountries.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredCountries.map((country) => (
              <CountryCard
                key={country.cca3}
                country={country}
                isFavorite={favorites.includes(country.cca3)}
                onAddFavorite={handleAddFavorite}
                onRemoveFavorite={handleRemoveFavorite}
              />
            ))}
          </div>
        ) : (
          <p className="text-center mt-12">No countries match your filters.</p>
        )}
      </div>
    </div>
  );
}

export default Home;