import { Link } from 'react-router-dom';


function CountryCard({ country, isFavorite, onAddFavorite, onRemoveFavorite }) {
  const toggleFavorite = (e) => {
    e.preventDefault();
    isFavorite ? onRemoveFavorite(country.cca3) : onAddFavorite(country.cca3);
  };
  return (
    <div className="card relative overflow-hidden group transform transition-transform duration-400 ease-in-out hover:scale-105">
      <Link to={`/country/${country.cca3}`} className="block h-full">
        <img
          src={country.flags?.svg}
          alt={`Flag of ${country.name.common}`}
          className="w-full h-40 sm:h-48 object-cover rounded-t-2xl"
          loading="lazy"
        />
        <div className="p-4 sm:p-5 space-y-2">
          <h2 className="text-lg sm:text-xl font-bold truncate">
            {country.name.common}
          </h2>
          <p className="text-sm">
            <strong>Capital:</strong> {country.capital?.[0] || "N/A"}
          </p>
          <p className="text-sm">
            <strong>Region:</strong> {country.region}
          </p>
          <p className="text-sm">
            <strong>Population:</strong> {country.population.toLocaleString()}
          </p>
        </div>
      </Link>
      <button
        onClick={toggleFavorite}
        aria-label="Toggle Favorite"
        className="absolute top-3 right-3 bg-[var(--secondary-bg)] p-2 rounded-full shadow hover:scale-110 transition-transform duration-400 ease-in-out"
      >
        <span className="text-2xl">{isFavorite ? "❤️" : "🤍"}</span>
      </button>
    </div>
  );
}

export default CountryCard;
