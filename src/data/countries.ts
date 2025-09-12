export interface Country {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  svgPath: string;
}

export const countries: Country[] = [
  { 
    id: 'us', 
    name: 'United States', 
    latitude: 39.8283, 
    longitude: -98.5795,
    svgPath: 'M 50 100 L 100 80 L 180 85 L 220 90 L 280 95 L 320 110 L 350 130 L 380 140 L 390 180 L 380 220 L 350 240 L 300 250 L 250 245 L 200 240 L 150 235 L 100 220 L 70 200 L 50 180 Z M 20 240 L 60 230 L 80 250 L 60 270 L 20 260 Z M 320 50 L 370 40 L 390 60 L 380 80 L 350 70 L 320 50 Z'
  },
  { 
    id: 'ca', 
    name: 'Canada', 
    latitude: 56.1304, 
    longitude: -106.3468,
    svgPath: 'M 50 50 L 150 40 L 250 45 L 350 50 L 380 70 L 390 100 L 380 130 L 350 140 L 300 135 L 250 130 L 200 125 L 150 120 L 100 115 L 70 100 L 50 80 Z M 20 80 L 40 70 L 60 90 L 40 110 L 20 100 Z M 300 20 L 340 15 L 360 35 L 340 50 L 300 45 Z'
  },
  { 
    id: 'br', 
    name: 'Brazil', 
    latitude: -14.2350, 
    longitude: -51.9253,
    svgPath: 'M 150 150 L 200 140 L 250 145 L 300 155 L 320 180 L 330 220 L 325 260 L 310 300 L 280 320 L 240 325 L 200 320 L 160 310 L 130 290 L 120 250 L 125 210 L 135 180 Z'
  },
  { 
    id: 'uk', 
    name: 'United Kingdom', 
    latitude: 55.3781, 
    longitude: -3.4360,
    svgPath: 'M 180 80 L 200 75 L 220 85 L 225 110 L 220 135 L 210 155 L 195 165 L 175 160 L 160 145 L 155 120 L 160 95 L 175 85 Z M 170 60 L 185 55 L 195 70 L 185 80 L 170 75 Z'
  },
  { 
    id: 'fr', 
    name: 'France', 
    latitude: 46.2276, 
    longitude: 2.2137,
    svgPath: 'M 180 120 L 220 115 L 240 130 L 245 155 L 235 180 L 220 190 L 195 185 L 175 175 L 170 150 L 175 130 Z'
  },
  { 
    id: 'de', 
    name: 'Germany', 
    latitude: 51.1657, 
    longitude: 10.4515,
    svgPath: 'M 200 100 L 235 95 L 250 115 L 245 140 L 235 160 L 220 170 L 200 165 L 185 150 L 180 125 L 190 110 Z'
  },
  { 
    id: 'it', 
    name: 'Italy', 
    latitude: 41.8719, 
    longitude: 12.5674,
    svgPath: 'M 210 140 L 230 135 L 235 160 L 240 185 L 235 210 L 230 235 L 225 260 L 220 280 L 210 285 L 200 280 L 195 260 L 190 235 L 185 210 L 190 185 L 195 160 L 205 145 Z M 235 270 L 250 265 L 260 280 L 250 295 L 235 290 Z M 220 295 L 235 290 L 245 305 L 235 320 L 220 315 Z'
  },
  { 
    id: 'es', 
    name: 'Spain', 
    latitude: 40.4637, 
    longitude: -3.7492,
    svgPath: 'M 150 160 L 220 155 L 240 170 L 235 190 L 225 205 L 200 210 L 175 205 L 150 200 L 135 185 L 140 170 Z'
  },
  { 
    id: 'ru', 
    name: 'Russia', 
    latitude: 61.5240, 
    longitude: 105.3188,
    svgPath: 'M 250 70 L 380 65 L 390 90 L 385 115 L 375 135 L 360 145 L 320 150 L 280 145 L 240 140 L 220 125 L 225 105 L 235 85 Z'
  },
  { 
    id: 'cn', 
    name: 'China', 
    latitude: 35.8617, 
    longitude: 104.1954,
    svgPath: 'M 290 120 L 360 115 L 380 140 L 375 170 L 360 190 L 330 195 L 300 190 L 280 175 L 275 150 L 285 135 Z'
  },
  { 
    id: 'jp', 
    name: 'Japan', 
    latitude: 36.2048, 
    longitude: 138.2529,
    svgPath: 'M 340 130 L 355 125 L 365 140 L 370 160 L 365 180 L 355 195 L 345 190 L 335 175 L 330 155 L 335 140 Z M 345 110 L 360 105 L 370 120 L 360 135 L 345 130 Z M 320 180 L 335 175 L 345 190 L 335 205 L 320 200 Z'
  },
  { 
    id: 'in', 
    name: 'India', 
    latitude: 20.5937, 
    longitude: 78.9629,
    svgPath: 'M 280 180 L 320 175 L 340 195 L 350 220 L 345 245 L 330 270 L 310 285 L 285 290 L 265 285 L 250 270 L 245 245 L 250 220 L 260 195 Z'
  },
  { 
    id: 'au', 
    name: 'Australia', 
    latitude: -25.2744, 
    longitude: 133.7751,
    svgPath: 'M 300 280 L 380 275 L 390 300 L 385 325 L 370 340 L 340 345 L 310 340 L 285 330 L 270 315 L 275 295 Z'
  },
  { 
    id: 'mx', 
    name: 'Mexico', 
    latitude: 23.6345, 
    longitude: -102.5528,
    svgPath: 'M 120 180 L 180 175 L 210 195 L 205 215 L 190 230 L 160 235 L 130 230 L 110 215 L 105 195 Z'
  },
  { 
    id: 'ar', 
    name: 'Argentina', 
    latitude: -38.4161, 
    longitude: -63.6167,
    svgPath: 'M 180 320 L 210 315 L 220 340 L 225 370 L 220 400 L 210 430 L 200 445 L 185 450 L 170 445 L 160 420 L 155 390 L 160 360 L 170 335 Z'
  }
];

export const getRandomCountry = (): Country => {
  return countries[Math.floor(Math.random() * countries.length)];
};

export const findCountryByName = (name: string): Country | null => {
  return countries.find(country => 
    country.name.toLowerCase() === name.toLowerCase()
  ) || null;
};