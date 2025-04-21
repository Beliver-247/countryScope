import { useEffect, useState } from "react";
import axios from "axios";
import CountryCard from "../components/CountryCard";
import LanguageFilter from "../components/LanguageFilter";
import { toast } from "react-toastify";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { getFavorites, addFavorite, removeFavorite } from "../firebase/favoriteHelpers";

function Home() {
  const [countries, setCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [region, setRegion] = useState("");
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
      const response = await axios.get("https://restcountries.com/v3.1/all");
      setCountries(response.data);

      const langsSet = new Set();
      response.data.forEach((country) => {
        if (country.languages) {
          Object.values(country.languages).forEach((lang) => langsSet.add(lang));
        }
      });
      setLanguages(Array.from(langsSet).sort());
    } catch (error) {
      console.error("Error fetching countries:", error);
    }
  };

  const handleAddFavorite = (countryCode) => {
    if (user) {
      addFavorite(user.uid, countryCode);
      setFavorites((prev) => [...prev, countryCode]);
      toast.success("Added to favorites!");
    } else {
      toast.warning("Please log in to add favorites");
    }
  };
  
  const handleRemoveFavorite = (countryCode) => {
    if (user) {
      removeFavorite(user.uid, countryCode);
      setFavorites((prev) => prev.filter((code) => code !== countryCode));
      toast.info("Removed from favorites!");
    }
  };

  const filteredCountries = countries.filter((country) => {
    const matchesSearch = country.name.common.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = region ? country.region === region : true;

    const countryLanguages = country.languages ? Object.values(country.languages) : [];
    const matchesLanguages =
      selectedLanguages.length === 0 ||
      selectedLanguages.every((lang) => countryLanguages.includes(lang));

    return matchesSearch && matchesRegion && matchesLanguages;
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">🌍 Explore Countries</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          className="p-2 border rounded w-full md:w-1/2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="p-2 border rounded w-full md:w-1/4"
        >
          <option value="">All Regions</option>
          <option value="Africa">Africa</option>
          <option value="Americas">Americas</option>
          <option value="Asia">Asia</option>
          <option value="Europe">Europe</option>
          <option value="Oceania">Oceania</option>
        </select>

        <LanguageFilter
          selectedLanguages={selectedLanguages}
          onChange={setSelectedLanguages}
          languages={languages}
        />
      </div>

      {/* Country Cards */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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
    </div>
  );
}

export default Home;
