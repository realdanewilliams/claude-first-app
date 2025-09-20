'use client';

import React, { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { feature } from 'topojson-client';
import { Country, Guess, GameState } from '@/lib/types';

// Dynamically import react-globe.gl to avoid SSR issues
const Globe = dynamic(() => import('react-globe.gl'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-blue-900 to-black rounded-lg">
      <div className="text-center text-white">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>Loading Earth...</p>
      </div>
    </div>
  )
});

interface RealisticGlobeProps {
  guesses: Guess[];
  currentCountry: Country | null;
  gameState: GameState;
}

// Color mapping for distance proximity
const getColorByDistance = (distance: number): string => {
  if (distance === 0) return '#10b981'; // Green for correct
  if (distance < 500) return '#ef4444'; // Red for very close
  if (distance < 1500) return '#f97316'; // Orange for close
  if (distance < 3000) return '#eab308'; // Yellow for medium
  return '#3b82f6'; // Blue for far
};

export function RealisticGlobe({ guesses, currentCountry, gameState }: RealisticGlobeProps) {
  const [worldData, setWorldData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load world geography data
  useEffect(() => {
    const loadWorldData = async () => {
      try {
        // Load the TopoJSON world atlas
        const topology = await import('world-atlas/countries-110m.json');
        const countries = feature(topology.default || topology, (topology.default || topology).objects.countries);
        setWorldData(countries);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load world data:', error);
        setIsLoading(false);
      }
    };

    loadWorldData();
  }, []);

  // Convert guesses to globe-compatible data
  const globeData = useMemo(() => {
    if (!worldData || !guesses.length) return [];

    return guesses.map((guess, index) => {
      // Find the country in world data
      const countryFeature = worldData.features.find((feature: any) =>
        feature.properties.NAME === guess.country ||
        feature.properties.NAME_EN === guess.country ||
        feature.properties.NAME_LONG === guess.country
      );

      if (!countryFeature) return null;

      return {
        ...countryFeature,
        properties: {
          ...countryFeature.properties,
          guessIndex: index,
          distance: guess.distance,
          isCorrect: guess.isCorrect,
          color: getColorByDistance(guess.distance)
        }
      };
    }).filter(Boolean);
  }, [worldData, guesses]);

  // Highlight current country if game is over
  const currentCountryData = useMemo(() => {
    if (!worldData || !currentCountry || gameState === 'playing') return [];

    const countryFeature = worldData.features.find((feature: any) =>
      feature.properties.NAME === currentCountry.name ||
      feature.properties.NAME_EN === currentCountry.name ||
      feature.properties.NAME_LONG === currentCountry.name
    );

    if (!countryFeature) return [];

    return [{
      ...countryFeature,
      properties: {
        ...countryFeature.properties,
        isAnswer: true,
        color: gameState === 'won' ? '#10b981' : '#f59e0b'
      }
    }];
  }, [worldData, currentCountry, gameState]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-blue-900 to-black rounded-lg">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading Earth...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden">
      <div className="relative w-full h-full">
        <Globe
          // Globe appearance
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

          // Guessed countries layer
          polygonsData={[...globeData, ...currentCountryData]}
          polygonAltitude={(d: any) => d.properties.isAnswer ? 0.02 : 0.01}
          polygonCapColor={(d: any) => d.properties.color}
          polygonSideColor={(d: any) => d.properties.color}
          polygonStrokeColor={() => '#ffffff'}
          polygonLabel={(d: any) => {
            if (d.properties.isAnswer) {
              return `<div style="color: white; background: rgba(0,0,0,0.7); padding: 8px; border-radius: 4px;">
                <b>Correct Answer: ${d.properties.NAME}</b>
              </div>`;
            }

            const guess = guesses[d.properties.guessIndex];
            return `<div style="color: white; background: rgba(0,0,0,0.7); padding: 8px; border-radius: 4px;">
              <b>${d.properties.NAME}</b><br/>
              Distance: ${Math.round(guess.distance)} miles<br/>
              Direction: ${guess.direction}
            </div>`;
          }}

          // Countries base layer
          hexPolygonsData={worldData?.features || []}
          hexPolygonResolution={3}
          hexPolygonMargin={0.3}
          hexPolygonColor={() => 'rgba(255,255,255,0.1)'}

          // Controls and animation
          enablePointerInteraction={true}
          animateIn={true}
          waitForGlobeReady={true}

          // Lighting
          atmosphereColor="rgba(0,100,200,0.3)"
          atmosphereAltitude={0.25}

          // Auto rotation
          controls={{
            autoRotate: true,
            autoRotateSpeed: 0.5,
            enableZoom: true,
            enablePan: true,
            minDistance: 200,
            maxDistance: 800
          }}

          // Initial view
          pointOfView={{
            lat: 0,
            lng: 0,
            altitude: 2.5
          }}
        />

        {/* Info overlay */}
        <div className="absolute top-4 left-4 bg-white bg-opacity-90 rounded-lg p-4 max-w-xs">
          <h3 className="text-lg font-bold text-gray-800 mb-2">World Map</h3>
          <p className="text-sm text-gray-600 mb-2">Your guesses appear here</p>

          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Correct / Very Close (&lt;500 mi)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Very Close (&lt;500 mi)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded"></div>
              <span>Close (&lt;1,500 mi)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Medium (&lt;3,000 mi)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span>Far (3,000+ mi)</span>
            </div>
          </div>
        </div>

        {/* Game status overlay */}
        {gameState !== 'playing' && (
          <div className="absolute bottom-4 right-4 bg-white bg-opacity-90 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-800">
              {gameState === 'won' ? '🎉 Congratulations!' : '😔 Game Over'}
            </p>
            <p className="text-xs text-gray-600">
              {currentCountry?.name} is highlighted in {gameState === 'won' ? 'green' : 'yellow'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}