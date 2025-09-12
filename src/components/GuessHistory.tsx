import React from 'react';
import { Guess } from '@/lib/types';

interface GuessHistoryProps {
  guesses: Guess[];
}

export function GuessHistory({ guesses }: GuessHistoryProps) {
  if (guesses.length === 0) {
    return (
      <div className="w-full max-w-md bg-gray-50 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Your Guesses</h3>
        <p className="text-gray-500 text-sm">No guesses yet. Start typing a country name!</p>
      </div>
    );
  }

  const getDirectionArrow = (direction: string) => {
    const arrows: Record<string, string> = {
      'N': '↑', 'NE': '↗', 'E': '→', 'SE': '↘',
      'S': '↓', 'SW': '↙', 'W': '←', 'NW': '↖'
    };
    return arrows[direction] || '•';
  };

  const getProximityColor = (distance: number, isCorrect: boolean) => {
    if (isCorrect) return 'bg-green-500';
    if (distance < 500) return 'bg-red-500';
    if (distance < 1500) return 'bg-orange-500';
    if (distance < 3000) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Guesses</h3>
      <div className="space-y-2">
        {guesses.map((guess, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-4 h-4 rounded-full ${getProximityColor(guess.distance, guess.isCorrect)}`}
              ></div>
              <span className="font-medium text-gray-800">
                {guess.country}
              </span>
            </div>
            
            {!guess.isCorrect && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>{guess.distance} mi</span>
                <span className="text-lg">{getDirectionArrow(guess.direction)}</span>
              </div>
            )}
            
            {guess.isCorrect && (
              <div className="text-sm font-semibold text-green-600">
                ✓ Correct!
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Distance legend */}
      <div className="mt-4 pt-3 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-700 mb-2">Distance Guide:</p>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Correct</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>&lt;500 mi</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>&lt;1,500 mi</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>&lt;3,000 mi</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>3,000+ mi</span>
          </div>
        </div>
      </div>
    </div>
  );
}