import { Link } from "react-router-dom";

function CountryCard({ country, isFavorite, onAddFavorite, onRemoveFavorite }) {
  const toggleFavorite = () => {
    if (isFavorite) {
      onRemoveFavorite(country.cca3);
    } else {
      onAddFavorite(country.cca3);
    }
  };

  return (
    <div className="border rounded-lg shadow hover:shadow-lg transition overflow-hidden relative">
      <Link to={`/country/${country.cca3}`}>
        <img
          src={country.flags.svg}
          alt={country.name.common}
          className="h-40 w-full object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold">{country.name.common}</h2>
          <p><strong>Capital:</strong> {country.capital?.[0] || "N/A"}</p>
          <p><strong>Region:</strong> {country.region}</p>
          <p><strong>Population:</strong> {country.population.toLocaleString()}</p>
        </div>
      </Link>

      {/* Favorite Button */}
      <button
        onClick={toggleFavorite}
        className="absolute top-2 right-2 text-xl"
        aria-label="Favorite"
      >
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </div>
  );
}


export default CountryCard;
