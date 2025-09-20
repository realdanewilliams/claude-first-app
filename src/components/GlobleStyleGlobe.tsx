'use client';

import React, { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
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

interface GlobeProps {
  guesses: Guess[];
  currentCountry: Country | null;
  gameState: GameState;
}

// Country coordinates for highlighting on globe
const COUNTRY_COORDS = new Map([
  ['United States', { lat: 39.8283, lng: -98.5795 }],
  ['Canada', { lat: 56.1304, lng: -106.3468 }],
  ['Mexico', { lat: 23.6345, lng: -102.5528 }],
  ['Brazil', { lat: -14.2350, lng: -51.9253 }],
  ['Argentina', { lat: -38.4161, lng: -63.6167 }],
  ['United Kingdom', { lat: 55.3781, lng: -3.4360 }],
  ['France', { lat: 46.2276, lng: 2.2137 }],
  ['Germany', { lat: 51.1657, lng: 10.4515 }],
  ['Italy', { lat: 41.8719, lng: 12.5674 }],
  ['Spain', { lat: 40.4637, lng: -3.7492 }],
  ['Russia', { lat: 61.5240, lng: 105.3188 }],
  ['China', { lat: 35.8617, lng: 104.1954 }],
  ['India', { lat: 20.5937, lng: 78.9629 }],
  ['Japan', { lat: 36.2048, lng: 138.2529 }],
  ['Australia', { lat: -25.2744, lng: 133.7751 }],
  ['South Africa', { lat: -30.5595, lng: 22.9375 }],
  ['Egypt', { lat: 26.0975, lng: 31.1333 }],
  ['Nigeria', { lat: 9.0820, lng: 8.6753 }],
  ['Kenya', { lat: -0.0236, lng: 37.9062 }],
  ['Turkey', { lat: 38.9637, lng: 35.2433 }],
  ['Saudi Arabia', { lat: 23.8859, lng: 45.0792 }],
  ['Iran', { lat: 32.4279, lng: 53.6880 }],
  ['Iraq', { lat: 33.2232, lng: 43.6793 }],
  ['Pakistan', { lat: 30.3753, lng: 69.3451 }],
  ['Thailand', { lat: 15.8700, lng: 100.9925 }],
  ['Vietnam', { lat: 14.0583, lng: 108.2772 }],
  ['Indonesia', { lat: -0.7893, lng: 113.9213 }],
  ['Malaysia', { lat: 4.2105, lng: 101.9758 }],
  ['South Korea', { lat: 35.9078, lng: 127.7669 }],
  ['Philippines', { lat: 12.8797, lng: 121.7740 }]
]);

// Color mapping for distance proximity
const getColorByDistance = (distance: number): string => {
  if (distance === 0) return '#10b981'; // Green for correct
  if (distance < 500) return '#ef4444'; // Red for very close
  if (distance < 1500) return '#f97316'; // Orange for close
  if (distance < 3000) return '#eab308'; // Yellow for medium
  return '#3b82f6'; // Blue for far
};

export function GlobleStyleGlobe({ guesses, currentCountry, gameState }: GlobeProps) {
  const globeRef = useRef<any>();
  const [isReady, setIsReady] = useState(false);

  // Convert guesses to point data for the globe
  const pointsData = React.useMemo(() => {
    const points: any[] = [];

    // Add guessed countries
    guesses.forEach((guess, index) => {
      const coords = COUNTRY_COORDS.get(guess.country);
      if (coords) {
        points.push({
          lat: coords.lat,
          lng: coords.lng,
          size: 0.5,
          color: getColorByDistance(guess.distance),
          country: guess.country,
          distance: guess.distance,
          direction: guess.direction,
          isCorrect: guess.isCorrect,
          order: index + 1
        });
      }
    });

    // Add correct answer if game is over
    if (gameState !== 'playing' && currentCountry) {
      const coords = COUNTRY_COORDS.get(currentCountry.name);
      if (coords) {
        points.push({
          lat: coords.lat,
          lng: coords.lng,
          size: 0.8,
          color: gameState === 'won' ? '#10b981' : '#f59e0b',
          country: currentCountry.name,
          distance: 0,
          direction: '',
          isCorrect: true,
          isAnswer: true
        });
      }
    }

    return points;
  }, [guesses, currentCountry, gameState]);

  useEffect(() => {
    if (globeRef.current && isReady) {
      // Auto rotate when no interaction
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = 0.5;
    }
  }, [isReady]);

  return (
    <div className="w-full h-full bg-black rounded-lg overflow-hidden relative">
      <Globe
        ref={globeRef}
        // Globe appearance - use realistic Earth textures
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

        // Points for guessed countries
        pointsData={pointsData}
        pointAltitude={0.02}
        pointColor="color"
        pointRadius="size"
        pointLabel={(d: any) => {
          if (d.isAnswer) {
            return `<div style="color: white; background: rgba(0,0,0,0.8); padding: 8px; border-radius: 4px; font-size: 14px;">
              <b>🎯 ${d.country}</b><br/>
              <span style="color: #10b981;">Correct Answer!</span>
            </div>`;
          }

          return `<div style="color: white; background: rgba(0,0,0,0.8); padding: 8px; border-radius: 4px; font-size: 14px;">
            <b>#${d.order} ${d.country}</b><br/>
            <span style="color: ${d.color};">${Math.round(d.distance)} miles away</span><br/>
            Direction: ${d.direction}
          </div>`;
        }}

        // Controls and interaction
        enablePointerInteraction={true}
        animateIn={true}
        waitForGlobeReady={true}
        onGlobeReady={() => setIsReady(true)}

        // Lighting and atmosphere
        atmosphereColor="rgba(100,150,255,0.3)"
        atmosphereAltitude={0.15}

        // Initial view
        pointOfView={{
          lat: 0,
          lng: 0,
          altitude: 2.5
        }}

        // Control settings
        controls={{
          enableZoom: true,
          enablePan: true,
          enableRotate: true,
          autoRotate: true,
          autoRotateSpeed: 0.5,
          minDistance: 200,
          maxDistance: 1000
        }}

        // Performance
        rendererConfig={{
          antialias: true,
          alpha: true
        }}
      />

      {/* Info overlay - similar to Globle */}
      <div className="absolute top-4 left-4 bg-white bg-opacity-95 rounded-lg p-4 max-w-xs shadow-lg">
        <h3 className="text-lg font-bold text-gray-800 mb-2">🌍 World Map</h3>
        <p className="text-sm text-gray-600 mb-3">Your guesses appear as colored dots</p>

        <div className="space-y-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Correct answer</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Very close (&lt;500 mi)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>Close (&lt;1,500 mi)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Medium (&lt;3,000 mi)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Far (3,000+ mi)</span>
          </div>
        </div>

        <div className="mt-3 pt-2 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            🖱️ Drag to rotate • 🔍 Scroll to zoom
          </p>
        </div>
      </div>

      {/* Game status overlay */}
      {gameState !== 'playing' && currentCountry && (
        <div className="absolute bottom-4 right-4 bg-white bg-opacity-95 rounded-lg p-4 shadow-lg">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-800 mb-1">
              {gameState === 'won' ? '🎉 Congratulations!' : '😔 Game Over'}
            </p>
            <p className="text-sm text-gray-600">
              The answer was <span className="font-semibold">{currentCountry.name}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Look for the {gameState === 'won' ? 'green' : 'yellow'} dot!
            </p>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {!isReady && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm">Preparing Earth...</p>
          </div>
        </div>
      )}
    </div>
  );
}