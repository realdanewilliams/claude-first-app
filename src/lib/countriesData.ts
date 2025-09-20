import { Country } from './types';

// Well-known countries with accurate coordinates and proper names
// This is a reliable dataset that will work immediately
export const COUNTRIES_DATA: Country[] = [
  {
    id: 'US',
    name: 'United States',
    latitude: 39.8283,
    longitude: -98.5795,
    svgPath: '' // Will be loaded from TopoJSON
  },
  {
    id: 'CA',
    name: 'Canada',
    latitude: 56.1304,
    longitude: -106.3468,
    svgPath: ''
  },
  {
    id: 'MX',
    name: 'Mexico',
    latitude: 23.6345,
    longitude: -102.5528,
    svgPath: ''
  },
  {
    id: 'BR',
    name: 'Brazil',
    latitude: -14.2350,
    longitude: -51.9253,
    svgPath: ''
  },
  {
    id: 'AR',
    name: 'Argentina',
    latitude: -38.4161,
    longitude: -63.6167,
    svgPath: ''
  },
  {
    id: 'GB',
    name: 'United Kingdom',
    latitude: 55.3781,
    longitude: -3.4360,
    svgPath: ''
  },
  {
    id: 'FR',
    name: 'France',
    latitude: 46.2276,
    longitude: 2.2137,
    svgPath: ''
  },
  {
    id: 'DE',
    name: 'Germany',
    latitude: 51.1657,
    longitude: 10.4515,
    svgPath: ''
  },
  {
    id: 'IT',
    name: 'Italy',
    latitude: 41.8719,
    longitude: 12.5674,
    svgPath: ''
  },
  {
    id: 'ES',
    name: 'Spain',
    latitude: 40.4637,
    longitude: -3.7492,
    svgPath: ''
  },
  {
    id: 'RU',
    name: 'Russia',
    latitude: 61.5240,
    longitude: 105.3188,
    svgPath: ''
  },
  {
    id: 'CN',
    name: 'China',
    latitude: 35.8617,
    longitude: 104.1954,
    svgPath: ''
  },
  {
    id: 'IN',
    name: 'India',
    latitude: 20.5937,
    longitude: 78.9629,
    svgPath: ''
  },
  {
    id: 'JP',
    name: 'Japan',
    latitude: 36.2048,
    longitude: 138.2529,
    svgPath: ''
  },
  {
    id: 'AU',
    name: 'Australia',
    latitude: -25.2744,
    longitude: 133.7751,
    svgPath: ''
  },
  {
    id: 'ZA',
    name: 'South Africa',
    latitude: -30.5595,
    longitude: 22.9375,
    svgPath: ''
  },
  {
    id: 'EG',
    name: 'Egypt',
    latitude: 26.0975,
    longitude: 31.1333,
    svgPath: ''
  },
  {
    id: 'NG',
    name: 'Nigeria',
    latitude: 9.0820,
    longitude: 8.6753,
    svgPath: ''
  },
  {
    id: 'KE',
    name: 'Kenya',
    latitude: -0.0236,
    longitude: 37.9062,
    svgPath: ''
  },
  {
    id: 'TR',
    name: 'Turkey',
    latitude: 38.9637,
    longitude: 35.2433,
    svgPath: ''
  },
  {
    id: 'SA',
    name: 'Saudi Arabia',
    latitude: 23.8859,
    longitude: 45.0792,
    svgPath: ''
  },
  {
    id: 'IR',
    name: 'Iran',
    latitude: 32.4279,
    longitude: 53.6880,
    svgPath: ''
  },
  {
    id: 'IQ',
    name: 'Iraq',
    latitude: 33.2232,
    longitude: 43.6793,
    svgPath: ''
  },
  {
    id: 'PK',
    name: 'Pakistan',
    latitude: 30.3753,
    longitude: 69.3451,
    svgPath: ''
  },
  {
    id: 'TH',
    name: 'Thailand',
    latitude: 15.8700,
    longitude: 100.9925,
    svgPath: ''
  },
  {
    id: 'VN',
    name: 'Vietnam',
    latitude: 14.0583,
    longitude: 108.2772,
    svgPath: ''
  },
  {
    id: 'ID',
    name: 'Indonesia',
    latitude: -0.7893,
    longitude: 113.9213,
    svgPath: ''
  },
  {
    id: 'MY',
    name: 'Malaysia',
    latitude: 4.2105,
    longitude: 101.9758,
    svgPath: ''
  },
  {
    id: 'KR',
    name: 'South Korea',
    latitude: 35.9078,
    longitude: 127.7669,
    svgPath: ''
  },
  {
    id: 'PH',
    name: 'Philippines',
    latitude: 12.8797,
    longitude: 121.7740,
    svgPath: ''
  }
];

// Simple method to get a country by name for now
export function findCountryByName(name: string): Country | null {
  return COUNTRIES_DATA.find(country =>
    country.name.toLowerCase() === name.toLowerCase()
  ) || null;
}

export function getRandomCountry(): Country {
  return COUNTRIES_DATA[Math.floor(Math.random() * COUNTRIES_DATA.length)];
}