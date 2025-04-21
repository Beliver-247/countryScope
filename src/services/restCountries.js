const BASE_URL = 'https://restcountries.com/v3.1';

export const getAllCountries = async () => {
  const res = await fetch(`${BASE_URL}/all`);
  return await res.json();
};

export const getCountryByName = async (name) => {
  const res = await fetch(`${BASE_URL}/name/${name}`);
  return await res.json();
};

export const getCountriesByRegion = async (region) => {
  const res = await fetch(`${BASE_URL}/region/${region}`);
  return await res.json();
};

export const getCountryByCode = async (code) => {
  const res = await fetch(`${BASE_URL}/alpha/${code}`);
  const data = await res.json();
  return data[0]; 
};
