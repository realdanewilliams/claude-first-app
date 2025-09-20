import { feature } from 'topojson-client';
import { geoPath, geoMercator } from 'd3-geo';
import { Country } from './types';

// Import the TopoJSON world atlas data
// In Next.js, we'll load this data dynamically
export async function loadWorldAtlas() {
  try {
    // Use the 50m resolution for good detail without huge file size
    const topology = await import('world-atlas/countries-50m.json');
    return topology.default || topology;
  } catch (error) {
    console.error('Failed to load world atlas data:', error);
    throw new Error('Could not load world geography data');
  }
}

// Convert TopoJSON to GeoJSON and generate SVG paths
export function generateCountryPaths(topology: any): Map<string, { path: string; name: string; id: string }> {
  const countries = feature(topology, topology.objects.countries);
  const countryPaths = new Map();

  // Create a Mercator projection for converting coordinates to SVG paths
  const projection = geoMercator()
    .scale(150)
    .translate([200, 150]); // Center in a 400x300 viewBox

  const pathGenerator = geoPath().projection(projection);

  (countries as any).features.forEach((country: any) => {
    const path = pathGenerator(country);
    if (path) {
      const properties = country.properties;
      const countryName = properties.NAME || properties.name || 'Unknown';
      const countryId = properties.ISO_A2 || properties.id || properties.NAME_EN || countryName.toLowerCase().replace(/\s+/g, '_');

      countryPaths.set(countryId, {
        path,
        name: countryName,
        id: countryId
      });
    }
  });

  return countryPaths;
}

// Get latitude and longitude for country centroid
export function getCountryCenter(topology: any, countryId: string): { latitude: number; longitude: number } | null {
  const countries = feature(topology, topology.objects.countries);

  const country = (countries as any).features.find((f: any) => {
    const props = f.properties;
    return props.ISO_A2 === countryId ||
           props.id === countryId ||
           props.NAME_EN === countryId ||
           props.NAME === countryId;
  });

  if (!country || !country.geometry) {
    return null;
  }

  // Calculate centroid from geometry
  // This is a simplified centroid calculation
  const coords = getCoordinatesFromGeometry(country.geometry);
  if (coords.length === 0) return null;

  const avgLat = coords.reduce((sum, coord) => sum + coord[1], 0) / coords.length;
  const avgLng = coords.reduce((sum, coord) => sum + coord[0], 0) / coords.length;

  return {
    latitude: avgLat,
    longitude: avgLng
  };
}

// Helper to extract all coordinates from any geometry type
function getCoordinatesFromGeometry(geometry: any): number[][] {
  const coords: number[][] = [];

  function extractCoords(coordArray: any) {
    if (typeof coordArray[0] === 'number') {
      // This is a coordinate pair
      coords.push(coordArray);
    } else {
      // This is an array of coordinates
      coordArray.forEach((item: any) => extractCoords(item));
    }
  }

  if (geometry.coordinates) {
    extractCoords(geometry.coordinates);
  }

  return coords;
}

// Generate comprehensive country database from TopoJSON
export async function generateCountryDatabase(): Promise<Country[]> {
  const topology = await loadWorldAtlas();
  const countryPaths = generateCountryPaths(topology);
  const countries: Country[] = [];

  countryPaths.forEach((data, id) => {
    const center = getCountryCenter(topology, id);
    if (center && data.path) {
      countries.push({
        id,
        name: data.name,
        latitude: center.latitude,
        longitude: center.longitude,
        svgPath: data.path
      });
    }
  });

  // Sort by name for consistency
  return countries.sort((a, b) => a.name.localeCompare(b.name));
}

// Well-known countries for the game (popular/recognizable countries)
export const GAME_COUNTRIES = [
  'US', 'CA', 'MX', 'BR', 'AR', 'GB', 'FR', 'DE', 'IT', 'ES',
  'RU', 'CN', 'IN', 'JP', 'AU', 'ZA', 'EG', 'NG', 'KE', 'MA',
  'TR', 'SA', 'IR', 'IQ', 'AF', 'PK', 'TH', 'VN', 'ID', 'MY',
  'KR', 'PH', 'BD', 'MM', 'LK', 'NP', 'KZ', 'UZ', 'UA', 'BY',
  'PL', 'CZ', 'HU', 'RO', 'BG', 'GR', 'PT', 'NL', 'BE', 'CH',
  'AT', 'SE', 'NO', 'FI', 'DK', 'IE', 'IS', 'LV', 'LT', 'EE',
  'HR', 'RS', 'BA', 'MK', 'AL', 'ME', 'SI', 'SK', 'MD', 'LU',
  'MT', 'CY', 'AD', 'MC', 'SM', 'VA', 'LI', 'IL', 'JO', 'LB',
  'SY', 'YE', 'OM', 'AE', 'QA', 'KW', 'BH', 'GE', 'AM', 'AZ',
  'CL', 'PE', 'BO', 'PY', 'UY', 'VE', 'CO', 'EC', 'GY', 'SR',
  'GF', 'FK', 'GS', 'BV', 'HM', 'AQ', 'TF', 'IO', 'CC', 'CX',
  'NF', 'PN', 'CK', 'NU', 'TK', 'TO', 'TV', 'FJ', 'VU', 'NC',
  'PF', 'WF', 'AS', 'GU', 'MP', 'PW', 'FM', 'MH', 'KI', 'NR',
  'SB', 'WS', 'NZ', 'GL', 'PM', 'MQ', 'GP', 'BL', 'MF', 'SX'
];