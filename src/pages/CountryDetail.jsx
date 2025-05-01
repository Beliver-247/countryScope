import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCountryByCode } from '../services/restCountries';
import { onAuthStateChanged } from 'firebase/auth';
import { addFavorite, getFavorites, removeFavorite } from '../firebase/favoriteHelpers';
import { toast } from 'react-toastify';
import { auth } from '../firebase';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '100%',
  minHeight: '400px',
  borderRadius: '1rem',
};

const CountryDetail = () => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [country, setCountry] = useState(null);
  const { code } = useParams();
  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const data = await getCountryByCode(code);
        setCountry(data);
      } catch (error) {
        toast.error('Failed to fetch country details.');
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
    if (!user) return toast.warning('Please log in to add favorites');
    try {
      await addFavorite(user.uid, country.cca3);
      setFavorites((prev) => [...prev, country.cca3]);
      toast.success('Added to favorites!');
    } catch {
      toast.error('Failed to add to favorites.');
    }
  };

  const handleRemoveFavorite = async () => {
    if (!user) return toast.warning('Please log in to remove favorites');
    try {
      await removeFavorite(user.uid, country.cca3);
      setFavorites((prev) => prev.filter((code) => code !== country.cca3));
      toast.info('Removed from favorites!');
    } catch {
      toast.error('Failed to remove from favorites.');
    }
  };

  const isFavorite = country ? favorites.includes(country.cca3) : false;

  if (!country) return <p className="container py-6">Loading...</p>;

  return (
    <div className="py-6">
      <div className="container">
        <button
          onClick={() => navigate(-1)}
          className="button mb-6 bg-[var(--secondary-bg)] border border-[var(--border-color)] hover:bg-[var(--accent-color)] hover:text-white"
        >
          ← Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-no-hover relative overflow-hidden">

            <div className="w-full h-64 sm:h-80 bg-[var(--primary-bg)] rounded-t-2xl flex items-center justify-center">
              <img
                src={country.flags.svg}
                alt={`Flag of ${country.name.common}`}
                className="w-full h-full object-contain rounded-t-2xl"
                loading="lazy"
              />
            </div>
            <div className="p-4 sm:p-5 space-y-2">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg sm:text-xl font-bold">
                  {country.name.common}
                </h1>
              </div>
              <div className="space-y-2 text-sm">
                <p><strong>Official Name:</strong> {country.name.official}</p>
                <p><strong>Capital:</strong> {country.capital?.[0] || 'N/A'}</p>
                <p><strong>Region:</strong> {country.region}</p>
                <p><strong>Subregion:</strong> {country.subregion || 'N/A'}</p>
                <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
                <p><strong>Area:</strong> {country.area.toLocaleString()} km²</p>
                <p><strong>UN Member:</strong> {country.unMember ? 'Yes' : 'No'}</p>
                <p>
                  <strong>Languages:</strong>{' '}
                  {country.languages ? Object.values(country.languages).join(', ') : 'N/A'}
                </p>
                <p><strong>Top Level Domain(s):</strong> {country.tld?.join(', ') || 'N/A'}</p>
                <p>
                  <strong>Currencies:</strong>{' '}
                  {country.currencies
                    ? Object.values(country.currencies)
                        .map((curr) => `${curr.name} (${curr.symbol})`)
                        .join(', ')
                    : 'N/A'}
                </p>
                <p><strong>Timezones:</strong> {country.timezones?.join(', ') || 'N/A'}</p>
                <p><strong>Borders:</strong> {country.borders?.join(', ') || 'None'}</p>
                <p>
                  <strong>Google Maps:</strong>{' '}
                  <a
                    href={country.maps.googleMaps}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--accent-color)]"
                  >
                    View
                  </a>
                </p>
              </div>
            </div>
            <button
              onClick={isFavorite ? handleRemoveFavorite : handleAddFavorite}
              aria-label="Toggle Favorite"
              className="absolute top-3 right-3 bg-[var(--secondary-bg)] p-2 rounded-full shadow hover:scale-110 transition-transform"
            >
              <span className="text-2xl">{isFavorite ? '❤️' : '🤍'}</span>
            </button>
          </div>

          {country.latlng && isLoaded && (
            <div className="card p-4 sm:p-5 flex flex-col">
              <h2 className="text-lg sm:text-xl font-bold mb-4">Map Location</h2>
              <div className="flex-grow">
                <GoogleMap
                  mapContainerStyle={containerStyle}
                  center={{ lat: country.latlng[0], lng: country.latlng[1] }}
                  zoom={5}
                >
                  <Marker position={{ lat: country.latlng[0], lng: country.latlng[1] }} />
                </GoogleMap>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;