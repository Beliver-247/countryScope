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
  height: '400px',
  borderRadius: '1rem',
};

const CountryDetail = () => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [country, setCountry] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
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
    <div className="py-6 min-h-screen">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 mb-6 px-4 py-2 rounded-lg bg-[var(--secondary-bg)] border border-[var(--border-color)] hover:bg-[var(--accent-color)] hover:text-white transition-colors"
        >
          ← Back
        </button>

        <div className="detail-card overflow-hidden">
          {/* Header with flag and basic info */}
          <div className="relative">
            <div className="w-full h-48 sm:h-56 bg-[var(--secondary-bg)] flex items-center justify-center p-4">
              <img
                src={country.flags.svg}
                alt={`Flag of ${country.name.common}`}
                className="max-h-full max-w-full object-contain rounded-lg border border-[var(--border-color)]"
                loading="lazy"
              />
            </div>
            <button
              onClick={isFavorite ? handleRemoveFavorite : handleAddFavorite}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              className={`absolute top-4 right-4 p-3 rounded-full shadow-lg transition-all ${
                isFavorite
                  ? 'bg-red-100 text-red-500 hover:bg-red-200'
                  : 'bg-[var(--secondary-bg)] text-gray-400 hover:bg-gray-100 hover:text-gray-600'
              }`}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          </div>

          {/* Country name and quick facts */}
          <div className="p-6">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-[var(--primary-text)]">
  {country.name.common}
  {country.name.official !== country.name.common && (
    <span className="text-lg font-normal ml-2 text-[var(--secondary-text)]">
      ({country.name.official})
    </span>
  )}
</h1>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6">
              <FactCard
                value={country.population.toLocaleString()}
                label="Population"
              />
              <FactCard
                value={`${country.area.toLocaleString()} km²`}
                label="Area"
              />
              <FactCard
                value={country.capital?.[0] || 'N/A'}
                label="Capital"
              />
              <FactCard
                value={country.region}
                label="Region"
              />
            </div>

            {/* Tabs */}
            <div className="mt-6">
              <div className="flex border-b border-[var(--border-color)]">
                {['overview', 'map', 'statistics'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 font-medium ${
                      activeTab === tab
                        ? 'border-b-2 border-[var(--accent-color)] text-[var(--accent-color)]'
                        : 'text-[var(--primary-text)] hover:text-[var(--accent-color)]'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <div className="py-4">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <div className="bg-[var(--secondary-bg)] p-4 rounded-lg">
                      <h2 className="font-semibold text-lg mb-3 border-b border-[var(--border-color)] pb-2 text-[var(--primary-text)]">
                        Basic Information
                      </h2>
                      <div className="space-y-3">
                        <InfoItem
                          label="Official Name"
                          value={country.name.official}
                        />
                        <InfoItem
                          label="Region"
                          value={`${country.region}${
                            country.subregion ? ` (${country.subregion})` : ''
                          }`}
                        />
                        <InfoItem
                          label="UN Member"
                          value={country.unMember ? 'Yes' : 'No'}
                        />
                        <InfoItem
                          label="Timezones"
                          value={country.timezones?.join(', ') || 'N/A'}
                        />
                      </div>
                    </div>

                    {/* Culture */}
                    <div className="bg-[var(--secondary-bg)] p-4 rounded-lg">
                      <h2 className="font-semibold text-lg mb-3 border-b border-[var(--border-color)] pb-2 text-[var(--primary-text)]">
                        Culture
                      </h2>
                      <div className="space-y-3">
                        <InfoItem
                          label="Languages"
                          value={
                            country.languages
                              ? Object.values(country.languages).join(', ')
                              : 'N/A'
                          }
                        />
                        <InfoItem
                          label="Currencies"
                          value={
                            country.currencies
                              ? Object.values(country.currencies)
                                  .map(
                                    (curr) =>
                                      `${curr.name} (${curr.symbol || 'No symbol'})`
                                  )
                                  .join(', ')
                              : 'N/A'
                          }
                        />
                      </div>
                    </div>

                    {/* Geography */}
                    <div className="bg-[var(--secondary-bg)] p-4 rounded-lg">
                      <h2 className="font-semibold text-lg mb-3 border-b border-[var(--border-color)] pb-2 text-[var(--primary-text)]">
                        Geography
                      </h2>
                      <div className="space-y-3">
                        <InfoItem
                          label="Top Level Domain"
                          value={country.tld?.join(', ') || 'N/A'}
                        />
                        <InfoItem
                          label="Bordering Countries"
                          value={
                            country.borders?.length ? (
                              <div className="flex flex-wrap gap-2">
                                {country.borders.map((code) => (
                                  <button
                                    key={code}
                                    onClick={() => navigate(`/country/${code}`)}
                                    className="px-2 py-1 text-sm bg-[var(--secondary-bg)] hover:bg-[var(--accent-color)] hover:text-white rounded transition-colors border border-[var(--border-color)]"
                                  >
                                    {code}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              'None'
                            )
                          }
                        />
                      </div>
                    </div>

                    {/* Links */}
                    <div className="bg-[var(--secondary-bg)] p-4 rounded-lg">
                      <h2 className="font-semibold text-lg mb-3 border-b border-[var(--border-color)] pb-2 text-[var(--primary-text)]">
                        External Links
                      </h2>
                      <div className="space-y-3">
                        <LinkItem
                          href={country.maps.googleMaps}
                          label="Google Maps"
                        />
                        {country.cca2 && (
                          <LinkItem
                            href={`https://www.openstreetmap.org/search?query=${country.name.common}`}
                            label="OpenStreetMap"
                          />
                        )}
                        {country.cca2 && (
                          <LinkItem
                            href={`https://en.wikipedia.org/wiki/${country.name.common.replace(
                              /\s+/g,
                              '_'
                            )}`}
                            label="Wikipedia"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'map' && country.latlng && isLoaded && (
                  <div className="bg-[var(--secondary-bg)] p-4 rounded-lg">
                    <h2 className="font-semibold text-lg mb-4 text-[var(--primary-text)]">Map Location</h2>
                    <GoogleMap
                      mapContainerStyle={containerStyle}
                      center={{
                        lat: country.latlng[0],
                        lng: country.latlng[1],
                      }}
                      zoom={5}
                      options={{
                        styles: [
                          {
                            featureType: "all",
                            elementType: "labels.text.fill",
                            stylers: [
                              {
                                color: "var(--primary-text)",
                              },
                            ],
                          },
                          {
                            featureType: "all",
                            elementType: "labels.text.stroke",
                            stylers: [
                              {
                                visibility: "on",
                              },
                              {
                                color: "var(--secondary-bg)",
                              },
                            ],
                          },
                        ],
                      }}
                    >
                      <Marker
                        position={{
                          lat: country.latlng[0],
                          lng: country.latlng[1],
                        }}
                      />
                    </GoogleMap>
                  </div>
                )}

                {activeTab === 'statistics' && (
                  <div className="bg-[var(--secondary-bg)] p-4 rounded-lg">
                    <h2 className="font-semibold text-lg mb-4 text-[var(--primary-text)]">Statistics</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <InfoItem
                        label="Population Density"
                        value={`${(country.population / country.area).toFixed(
                          2
                        )} people/km²`}
                      />
                      <InfoItem
                        label="Landlocked"
                        value={country.landlocked ? 'Yes' : 'No'}
                      />
                      <InfoItem
                        label="Independent"
                        value={country.independent ? 'Yes' : 'No'}
                      />
                      <InfoItem
                        label="Driving Side"
                        value={
                          country.car?.side
                            ? country.car.side.charAt(0).toUpperCase() +
                              country.car.side.slice(1)
                            : 'N/A'
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components
const InfoItem = ({ label, value }) => (
  <div className="flex">
    <span className="font-medium w-1/3 text-[var(--primary-text)]">{label}:</span>
    <span className="w-2/3 text-[var(--primary-text)]">{value}</span>
  </div>
);

const LinkItem = ({ href, label }) => (
  <div className="flex items-center">
    <span className="font-medium w-1/3 text-[var(--primary-text)]">{label}:</span>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-[var(--accent-color)] hover:underline w-2/3 flex items-center gap-1"
    >
      {label} ↗
    </a>
  </div>
);

const FactCard = ({ value, label }) => (
  <div className="bg-[var(--secondary-bg)] p-3 rounded-lg border border-[var(--border-color)]">
    <p className="text-sm text-[var(--secondary-text)] font-medium">{label}</p>
    <p className="font-bold text-lg text-[var(--primary-text)]">{value}</p>
  </div>
);

export default CountryDetail;