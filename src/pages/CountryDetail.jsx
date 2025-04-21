import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCountryByCode } from '../services/restCountries';
import { onAuthStateChanged } from 'firebase/auth';
import { addFavorite, getFavorites, removeFavorite } from '../firebase/favoriteHelpers';
import { toast } from 'react-toastify';
import { auth } from '../firebase';

const CountryDetail = () => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const { code } = useParams();
  const [country, setCountry] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const data = await getCountryByCode(code);
        setCountry(data);
      } catch (error) {
        toast.error("Failed to fetch country details.");
      }
    };

    fetchCountry();
  }, [code]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userFavorites = await getFavorites(currentUser.uid);
        setFavorites(userFavorites);
      }
    });

    return () => unsub();
  }, []);

  const handleAddFavorite = async () => {
    if (!user) {
      toast.warning("Please log in to add favorites");
      return;
    }

    try {
      await addFavorite(user.uid, country.cca3);
      setFavorites((prev) => [...prev, country.cca3]);
      toast.success("Added to favorites!");
    } catch (error) {
      toast.error("Failed to add to favorites.");
    }
  };

  const handleRemoveFavorite = async () => {
    if (!user) {
      toast.warning("Please log in to remove favorites");
      return;
    }

    try {
      await removeFavorite(user.uid, country.cca3);
      setFavorites((prev) => prev.filter((code) => code !== country.cca3));
      toast.info("Removed from favorites!");
    } catch (error) {
      toast.error("Failed to remove from favorites.");
    }
  };

  const isFavorite = country ? favorites.includes(country.cca3) : false;

  if (!country) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">{country.name.common}</h1>
        <button
          onClick={isFavorite ? handleRemoveFavorite : handleAddFavorite}
          className="text-2xl hover:scale-110 transition"
          aria-label="Favorite"
        >
          {isFavorite ? "❤️" : "🤍"}
        </button>
      </div>

      <button onClick={() => navigate(-1)} className="mb-4 px-4 py-2 bg-gray-200 rounded">
        ← Back
      </button>

      <div className="grid md:grid-cols-2 gap-6">
        <img
          src={country.flags.svg}
          alt={country.name.common}
          className="w-full h-64 object-cover rounded"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{country.name.common}</h1>
          <p><strong>Capital:</strong> {country.capital?.[0]}</p>
          <p><strong>Region:</strong> {country.region}</p>
          <p><strong>Subregion:</strong> {country.subregion}</p>
          <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
          <p><strong>Languages:</strong> {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
