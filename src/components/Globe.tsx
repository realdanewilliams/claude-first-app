import React from 'react';
import { Guess } from '@/lib/types';
import { Country } from '@/lib/types';

interface GlobeProps {
  guesses: Guess[];
  currentCountry: Country | null;
  gameState: 'playing' | 'won' | 'lost';
}

export function Globe({ guesses, currentCountry, gameState }: GlobeProps) {
  return (
    <div className="w-full h-96 bg-gradient-to-b from-blue-900 to-blue-600 rounded-lg flex items-center justify-center relative overflow-hidden">
      {/* Simple globe representation */}
      <div className="w-80 h-80 bg-gradient-to-br from-green-400 via-green-500 to-green-600 rounded-full relative shadow-2xl">
        {/* Ocean overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-700 rounded-full opacity-60"></div>
        
        {/* Simple continent shapes */}
        <div className="absolute top-16 left-12 w-16 h-12 bg-green-700 rounded-lg transform -rotate-12"></div>
        <div className="absolute top-24 right-16 w-20 h-8 bg-green-700 rounded-full transform rotate-45"></div>
        <div className="absolute bottom-20 left-20 w-12 h-16 bg-green-700 rounded-lg transform rotate-12"></div>
        <div className="absolute bottom-16 right-12 w-18 h-10 bg-green-700 rounded-full transform -rotate-30"></div>
        
        {/* Guess indicators */}
        {guesses.map((guess, index) => {
          const getColor = (distance: number, isCorrect: boolean) => {
            if (isCorrect) return 'bg-green-400';
            if (distance < 500) return 'bg-red-400';
            if (distance < 1500) return 'bg-orange-400';
            if (distance < 3000) return 'bg-yellow-400';
            return 'bg-blue-400';
          };
          
          // Simple positioning based on guess index
          const positions = [
            { top: '20%', left: '30%' },
            { top: '40%', right: '25%' },
            { bottom: '30%', left: '20%' },
            { bottom: '20%', right: '30%' },
            { top: '60%', left: '50%' }
          ];
          
          const position = positions[index] || positions[0];
          
          return (
            <div
              key={index}
              className={`absolute w-4 h-4 ${getColor(guess.distance, guess.isCorrect)} rounded-full border-2 border-white shadow-md animate-pulse`}
              style={position}
              title={`${guess.country} - ${guess.distance} miles`}
            ></div>
          );
        })}
        
        {/* Globe highlight */}
        <div className="absolute top-4 left-4 w-16 h-16 bg-white opacity-20 rounded-full blur-sm"></div>
        
        {/* Current country indicator (when game is over) */}
        {(gameState === 'won' || gameState === 'lost') && currentCountry && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-green-400 rounded-full border-4 border-white shadow-lg animate-bounce"></div>
          </div>
        )}
      </div>
      
      {/* Stars in background */}
      <div className="absolute inset-0">
        <div className="absolute top-4 left-8 w-1 h-1 bg-white rounded-full opacity-80"></div>
        <div className="absolute top-12 right-12 w-1 h-1 bg-white rounded-full opacity-60"></div>
        <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full opacity-90"></div>
        <div className="absolute bottom-16 right-8 w-1 h-1 bg-white rounded-full opacity-70"></div>
        <div className="absolute bottom-8 left-16 w-1 h-1 bg-white rounded-full opacity-80"></div>
        <div className="absolute top-32 right-24 w-1 h-1 bg-white rounded-full opacity-50"></div>
      </div>
      
      {/* Title */}
      <div className="absolute top-4 left-4 text-white">
        <h3 className="text-lg font-semibold">World Map</h3>
        <p className="text-sm opacity-80">Your guesses appear here</p>
      </div>
    </div>
  );
}