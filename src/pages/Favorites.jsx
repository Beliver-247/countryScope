import React, { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { getFavorites, addFavorite, removeFavorite } from '../firebase/favoriteHelpers';
import { getCountryByCode } from '../services/restCountries';
import CountryCard from '../components/CountryCard';
import { toast } from 'react-toastify';

const Favorites = () => {
  const [user, setUser] = useState(null);
  const [favoriteCodes, setFavoriteCodes] = useState([]);
  const [favoriteCountries, setFavoriteCountries] = useState([]);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const favCodes = await getFavorites(currentUser.uid);
          setFavoriteCodes(favCodes);

          const data = await Promise.all(favCodes.map(code => getCountryByCode(code)));
          setFavoriteCountries(data);
        } catch (error) {
          toast.error("Failed to load favorites.");
        }
      }
    });

    return () => unsub();
  }, []);

  const handleAddFavorite = async (code) => {
    if (!user) return toast.warning("Please log in to add favorites");
    await addFavorite(user.uid, code);
    setFavoriteCodes(prev => [...prev, code]);

    const country = await getCountryByCode(code);
    setFavoriteCountries(prev => [...prev, country]);

    toast.success("Added to favorites!");
  };

  const handleRemoveFavorite = async (code) => {
    if (!user) return toast.warning("Please log in to remove favorites");
    await removeFavorite(user.uid, code);
    setFavoriteCodes(prev => prev.filter(c => c !== code));
    setFavoriteCountries(prev => prev.filter(c => c.cca3 !== code));

    toast.info("Removed from favorites.");
  };

  if (!user) return <div className="p-6 text-xl">Please log in to view your favorites.</div>;

  if (favoriteCountries.length === 0) return <div className="p-6 text-xl">No favorite countries yet.</div>;

  return (
    <div className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {favoriteCountries.map((country) => (
        <CountryCard
          key={country.cca3}
          country={country}
          isFavorite={favoriteCodes.includes(country.cca3)}
          onAddFavorite={handleAddFavorite}
          onRemoveFavorite={handleRemoveFavorite}
        />
      ))}
    </div>
  );
};

export default Favorites;
