import { generateCountryDatabase, GAME_COUNTRIES } from '@/lib/topoJsonUtils';
import { Country } from '@/lib/types';

// Fallback countries for development/testing
const fallbackCountries: Country[] = [
  {
    id: 'US',
    name: 'United States',
    latitude: 39.8283,
    longitude: -98.5795,
    svgPath: 'M 158.1 78.5 L 158.1 78.5 L 158.5 78.9 L 159.0 79.2 L 159.5 79.5 L 160.0 79.7 L 160.5 79.8 L 161.0 79.9 L 161.5 80.0 L 162.0 80.0 L 162.5 80.0 L 163.0 79.9 L 163.5 79.8 L 164.0 79.7 L 164.5 79.5 L 165.0 79.2 L 165.5 78.9 L 166.0 78.5 L 166.5 78.1 L 167.0 77.6 L 167.5 77.1 L 168.0 76.5 L 168.5 75.9 L 169.0 75.2 L 169.5 74.5 L 170.0 73.7 L 170.5 72.9 L 171.0 72.0 L 171.5 71.1 Z'
  }
];

// Cache for loaded countries
let cachedCountries: Country[] | null = null;

export async function getCountries(): Promise<Country[]> {
  if (cachedCountries) {
    return cachedCountries;
  }

  try {
    // Generate real countries from TopoJSON World Atlas
    const allCountries = await generateCountryDatabase();

    // Filter to only include game-appropriate countries
    const gameCountries = allCountries.filter(country =>
      GAME_COUNTRIES.includes(country.id.toUpperCase()) ||
      GAME_COUNTRIES.includes(country.id)
    );

    // If we have game countries, use them, otherwise fall back
    cachedCountries = gameCountries.length > 10 ? gameCountries : fallbackCountries;
    return cachedCountries;
  } catch (error) {
    console.error('Failed to load countries from TopoJSON:', error);
    cachedCountries = fallbackCountries;
    return fallbackCountries;
  }
}

// Initialize countries array (will be populated asynchronously)
export let countries: Country[] = [];

// Load countries when module is imported
getCountries().then(loadedCountries => {
  countries.length = 0; // Clear array
  countries.push(...loadedCountries); // Add new countries
}).catch(error => {
  console.error('Failed to initialize countries:', error);
  countries.push(...fallbackCountries);
});

export const getRandomCountry = (): Country => {
  return countries[Math.floor(Math.random() * countries.length)];
};

export const findCountryByName = (name: string): Country | null => {
  return countries.find(country => 
    country.name.toLowerCase() === name.toLowerCase()
  ) || null;
};