import { geoPath, geoNaturalEarth1, geoCentroid } from 'd3-geo';
import { feature } from 'topojson-client';

export interface CountryGeoData {
  name: string;
  code: string;
  latitude: number;
  longitude: number;
  geometry: any;
  svgPath?: string;
}

// Create a projection for SVG path generation
const projection = geoNaturalEarth1()
  .scale(200)
  .translate([400, 300]);

const pathGenerator = geoPath().projection(projection);

export async function fetchCountryData(): Promise<CountryGeoData[]> {
  try {
    console.log('Fetching country boundary data...');
    
    // Use Natural Earth data for accurate country boundaries
    const response = await fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson');
    const worldData = await response.json();
    
    const countries: CountryGeoData[] = worldData.features
      .filter((feature: any) => feature.properties?.NAME && feature.geometry)
      .map((feature: any) => {
        // Calculate centroid for the country
        const centroid = geoCentroid(feature);
        
        // Generate SVG path from geometry
        const svgPath = pathGenerator(feature) || '';
        
        return {
          name: feature.properties.NAME,
          code: feature.properties.ISO_A2 || feature.properties.NAME.slice(0, 2).toUpperCase(),
          latitude: centroid[1],
          longitude: centroid[0],
          geometry: feature.geometry,
          svgPath: svgPath
        };
      })
      .filter((country: CountryGeoData) => country.svgPath && country.svgPath.length > 0);
    
    console.log(`Successfully loaded ${countries.length} countries with real boundaries`);
    return countries.slice(0, 50); // Limit for performance
    
  } catch (error) {
    console.error('Failed to fetch real country data:', error);
    console.log('Falling back to simplified country data');
    return getFallbackCountries();
  }
}

function getFallbackCountries(): CountryGeoData[] {
  return [
    {
      name: 'United States',
      code: 'US',
      latitude: 39.8283,
      longitude: -98.5795,
      geometry: null,
      svgPath: 'M 50 100 L 100 80 L 180 85 L 220 90 L 280 95 L 320 110 L 350 130 L 380 140 L 390 180 L 380 220 L 350 240 L 300 250 L 250 245 L 200 240 L 150 235 L 100 220 L 70 200 L 50 180 Z M 20 240 L 60 230 L 80 250 L 60 270 L 20 260 Z M 320 50 L 370 40 L 390 60 L 380 80 L 350 70 L 320 50 Z'
    },
    {
      name: 'Canada',
      code: 'CA', 
      latitude: 56.1304,
      longitude: -106.3468,
      geometry: null,
      svgPath: 'M 50 50 L 150 40 L 250 45 L 350 50 L 380 70 L 390 100 L 380 130 L 350 140 L 300 135 L 250 130 L 200 125 L 150 120 L 100 115 L 70 100 L 50 80 Z M 20 80 L 40 70 L 60 90 L 40 110 L 20 100 Z M 300 20 L 340 15 L 360 35 L 340 50 L 300 45 Z'
    },
    {
      name: 'Brazil',
      code: 'BR',
      latitude: -14.2350,
      longitude: -51.9253,
      geometry: null,
      svgPath: 'M 150 150 L 200 140 L 250 145 L 300 155 L 320 180 L 330 220 L 325 260 L 310 300 L 280 320 L 240 325 L 200 320 L 160 310 L 130 290 L 120 250 L 125 210 L 135 180 Z'
    },
    {
      name: 'Russia',
      code: 'RU',
      latitude: 61.5240,
      longitude: 105.3188,
      geometry: null,
      svgPath: 'M 200 80 L 380 70 L 390 100 L 385 130 L 375 150 L 360 160 L 320 165 L 280 160 L 240 155 L 200 150 L 180 130 L 185 110 L 195 90 Z'
    },
    {
      name: 'China',
      code: 'CN',
      latitude: 35.8617,
      longitude: 104.1954,
      geometry: null,
      svgPath: 'M 280 120 L 350 115 L 370 140 L 365 170 L 350 190 L 320 195 L 290 190 L 270 175 L 265 150 L 275 135 Z'
    }
  ];
}