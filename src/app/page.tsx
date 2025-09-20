'use client';

import React from 'react';
import { useGame } from '@/lib/hooks/useGame';
import { RealCountryOutline } from '@/components/RealCountryOutline';
import { CountrySearch } from '@/components/CountrySearch';
import { GuessHistory } from '@/components/GuessHistory';
import { D3RotatingGlobe } from '@/components/D3RotatingGlobe';

export default function HomePage() {
  const {
    currentCountry,
    guesses,
    gameState,
    guessesRemaining,
    makeGuess,
    resetGame,
  } = useGame();

  const isGameActive = gameState === 'playing';

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Geography Guessing Game
          </h1>
          <p className="text-lg text-gray-600">
            Can you guess the country from its outline?
          </p>
        </header>

        {/* Game Status */}
        <div className="text-center mb-6">
          {gameState === 'playing' && (
            <p className="text-xl text-gray-700">
              Guesses remaining: <span className="font-bold text-blue-600">{guessesRemaining}</span>
            </p>
          )}
          {gameState === 'won' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg inline-block">
              <p className="text-xl font-bold">🎉 Congratulations!</p>
              <p>You guessed {currentCountry?.name} correctly!</p>
            </div>
          )}
          {gameState === 'lost' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg inline-block">
              <p className="text-xl font-bold">Game Over!</p>
              <p>The correct answer was: <strong>{currentCountry?.name}</strong></p>
            </div>
          )}
        </div>

        {/* Main Game Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Country Outline and Input */}
          <div className="flex flex-col items-center space-y-6">
            <RealCountryOutline country={currentCountry} />

            <div className="w-full max-w-md">
              <CountrySearch
                onGuess={makeGuess}
                disabled={!isGameActive}
              />
            </div>

            <GuessHistory guesses={guesses} />

            {/* Play Again Button */}
            {gameState !== 'playing' && (
              <button
                onClick={resetGame}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Play Again
              </button>
            )}
          </div>

          {/* Right Panel - D3.js Rotating Globe */}
          <div className="flex flex-col h-96 lg:h-full">
            <D3RotatingGlobe
              guesses={guesses}
              currentCountry={currentCountry}
              gameState={gameState}
            />
          </div>
        </div>
      </div>
    </div>
  );
}