import React, { useEffect, useState } from 'react';
import { Country } from '@/lib/types';

interface CountryOutlineProps {
  country: Country | null;
}

import { getAllCountries } from '@/lib/worldCountries';

// Generate a simple generic country shape for any country not in our predefined paths
function generateGenericCountryPath(countryName: string): string {
  // Use the country name to create a consistent but varied shape
  const hash = countryName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);

  const baseWidth = 300 + (Math.abs(hash) % 200);
  const baseHeight = 200 + (Math.abs(hash >> 8) % 150);
  const centerX = 500;
  const centerY = 300;

  // Create an irregular polygon based on the country name hash
  const points = [];
  const numPoints = 8 + (Math.abs(hash >> 16) % 4);

  for (let i = 0; i < numPoints; i++) {
    const angle = (i / numPoints) * 2 * Math.PI;
    const radiusVariation = 0.7 + (Math.abs(hash >> (i * 4)) % 100) / 300;
    const x = centerX + Math.cos(angle) * baseWidth * radiusVariation;
    const y = centerY + Math.sin(angle) * baseHeight * radiusVariation;
    points.push(`${x} ${y}`);
  }

  return `M ${points.join(' L ')} Z`;
}

// Predefined paths for recognizable countries
const PREDEFINED_PATHS = new Map([
  ['United States', 'M 200 100 L 780 100 L 780 140 L 820 140 L 820 180 L 840 180 L 840 220 L 820 220 L 820 260 L 800 260 L 800 320 L 780 320 L 780 380 L 740 380 L 740 420 L 680 420 L 680 440 L 620 440 L 620 460 L 560 460 L 560 480 L 480 480 L 480 460 L 420 460 L 420 440 L 360 440 L 360 420 L 320 420 L 320 400 L 280 400 L 280 380 L 240 380 L 240 360 L 200 360 L 200 340 L 160 340 L 160 320 L 140 320 L 140 280 L 120 280 L 120 240 L 140 240 L 140 200 L 160 200 L 160 160 L 180 160 L 180 120 L 200 120 Z M 50 400 L 150 400 L 150 450 L 120 480 L 80 480 L 50 450 Z'],
  ['United Kingdom', 'M 380 120 L 420 110 L 450 120 L 470 140 L 480 160 L 490 180 L 485 200 L 475 220 L 460 240 L 440 250 L 420 255 L 400 250 L 380 240 L 365 220 L 355 200 L 350 180 L 355 160 L 365 140 L 380 120 Z M 360 90 L 390 85 L 410 95 L 420 110 L 410 125 L 390 130 L 370 125 L 360 110 L 360 90 Z'],
  ['France', 'M 400 200 L 480 190 L 520 210 L 540 240 L 545 270 L 540 300 L 520 330 L 490 350 L 460 360 L 430 355 L 400 340 L 380 320 L 370 300 L 365 270 L 370 240 L 385 210 L 400 200 Z'],
  ['Germany', 'M 480 160 L 540 150 L 570 170 L 580 200 L 575 230 L 565 260 L 545 280 L 520 290 L 490 285 L 470 270 L 455 245 L 450 215 L 460 185 L 480 160 Z'],
  ['Italy', 'M 480 240 L 520 230 L 540 250 L 545 280 L 550 310 L 545 340 L 540 370 L 535 400 L 530 430 L 520 450 L 505 465 L 485 470 L 470 465 L 460 450 L 455 430 L 450 400 L 455 370 L 460 340 L 465 310 L 470 280 L 475 250 L 480 240 Z M 540 380 L 570 375 L 590 395 L 580 415 L 550 420 L 540 400 Z M 520 460 L 545 455 L 560 475 L 545 495 L 520 490 Z'],
  ['Brazil', 'M 400 400 L 520 390 L 580 410 L 620 440 L 640 480 L 650 520 L 645 560 L 635 600 L 620 640 L 600 675 L 575 700 L 545 715 L 510 720 L 475 715 L 445 700 L 420 675 L 400 640 L 390 600 L 385 560 L 390 520 L 400 480 L 410 440 L 400 400 Z'],
  ['Australia', 'M 780 520 L 900 510 L 940 530 L 960 560 L 965 590 L 960 620 L 945 650 L 920 670 L 890 680 L 850 675 L 810 665 L 780 650 L 755 630 L 740 600 L 745 570 L 760 540 L 780 520 Z'],
  ['Canada', 'M 200 40 L 380 30 L 560 35 L 740 40 L 800 60 L 820 80 L 830 100 L 825 120 L 815 140 L 800 160 L 780 175 L 740 180 L 700 175 L 660 170 L 620 165 L 580 160 L 540 155 L 500 150 L 460 145 L 420 140 L 380 135 L 340 130 L 300 125 L 260 120 L 220 115 L 180 110 L 160 100 L 150 80 L 160 60 L 180 45 L 200 40 Z M 100 120 L 140 115 L 160 130 L 155 150 L 140 165 L 120 170 L 100 165 L 85 150 L 80 130 L 85 115 L 100 120 Z'],
  ['Russia', 'M 520 80 L 880 70 L 900 90 L 920 110 L 940 130 L 950 150 L 945 170 L 935 190 L 920 210 L 900 220 L 860 225 L 820 220 L 780 215 L 740 210 L 700 205 L 660 200 L 620 195 L 580 190 L 540 185 L 520 170 L 510 150 L 515 130 L 520 110 L 525 90 L 520 80 Z'],
  ['China', 'M 700 200 L 820 190 L 860 210 L 880 240 L 890 270 L 885 300 L 875 330 L 860 350 L 840 365 L 810 375 L 780 370 L 750 360 L 720 345 L 700 325 L 690 300 L 685 270 L 690 240 L 700 215 L 700 200 Z'],
  ['India', 'M 680 300 L 740 290 L 780 310 L 800 340 L 810 370 L 805 400 L 795 430 L 780 460 L 760 485 L 735 500 L 705 505 L 680 500 L 655 485 L 635 460 L 620 430 L 615 400 L 620 370 L 635 340 L 655 315 L 680 300 Z'],
  ['Japan', 'M 840 240 L 870 230 L 890 245 L 900 265 L 905 285 L 900 305 L 890 325 L 875 340 L 855 345 L 835 340 L 820 325 L 810 305 L 815 285 L 825 265 L 840 245 L 840 240 Z M 860 200 L 885 195 L 900 210 L 895 230 L 880 235 L 865 230 L 855 215 L 860 200 Z M 800 350 L 825 345 L 840 360 L 835 380 L 820 385 L 805 380 L 795 365 L 800 350 Z']
]);

// Get country path - use predefined if available, otherwise generate
function getCountryPath(countryName: string): string {
  const predefined = PREDEFINED_PATHS.get(countryName);
  if (predefined) {
    return predefined;
  }
  return generateGenericCountryPath(countryName);
}

export function CountryOutlineClean({ country }: CountryOutlineProps) {
  const [svgPath, setSvgPath] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!country) {
      setIsLoading(true);
      return;
    }

    // Get the country path - predefined or generated
    const path = getCountryPath(country.name);
    setSvgPath(path);
    setIsLoading(false);
  }, [country]);

  if (isLoading || !country) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading country...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-lg shadow-lg overflow-hidden">
      {/* Clean country silhouette display */}
      <div className="w-full h-5/6 flex items-center justify-center p-8">
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1000 600"
          className="max-w-full max-h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Country silhouette */}
          <path
            d={svgPath}
            fill="#1e40af"
            stroke="#1e3a8a"
            strokeWidth="3"
            className="hover:fill-blue-700 transition-all duration-300"
            style={{
              filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.2))'
            }}
          />

          {/* Subtle highlight effect */}
          <path
            d={svgPath}
            fill="url(#countryGradient)"
            stroke="none"
            opacity="0.3"
          />

          <defs>
            <linearGradient id="countryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8"/>
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Bottom instruction section */}
      <div className="h-1/6 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-lg font-semibold">🌍 Guess the Country</p>
          <p className="text-sm opacity-90">What country has this shape?</p>
        </div>
      </div>
    </div>
  );
}