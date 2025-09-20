import { useState, useCallback } from 'react';
import { Country, Guess, GameState } from '../types';
import { getPopularCountries, findWorldCountryByName, getRandomPopularCountry } from '../worldCountries';
import { calculateDistance, calculateDirection } from '../utils';

interface UseGameReturn {
  currentCountry: Country | null;
  guesses: Guess[];
  gameState: GameState;
  guessesRemaining: number;
  makeGuess: (countryName: string) => void;
  resetGame: () => void;
}

const MAX_GUESSES = 5;

export function useGame(): UseGameReturn {
  const [currentCountry, setCurrentCountry] = useState<Country | null>(() => getRandomPopularCountry());
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [gameState, setGameState] = useState<GameState>('playing');

  const makeGuess = useCallback((countryName: string) => {
    if (gameState !== 'playing' || !currentCountry) return;

    const guessedCountry = findWorldCountryByName(countryName);
    if (!guessedCountry) return;

    const isCorrect = guessedCountry.name === currentCountry.name;
    const distance = isCorrect ? 0 : calculateDistance(
      guessedCountry.latitude,
      guessedCountry.longitude,
      currentCountry.latitude,
      currentCountry.longitude
    );
    const direction = isCorrect ? '' : calculateDirection(
      guessedCountry.latitude,
      guessedCountry.longitude,
      currentCountry.latitude,
      currentCountry.longitude
    );

    const newGuess: Guess = {
      country: guessedCountry.name,
      distance,
      direction,
      isCorrect
    };

    const newGuesses = [...guesses, newGuess];
    setGuesses(newGuesses);

    if (isCorrect) {
      setGameState('won');
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameState('lost');
    }
  }, [currentCountry, guesses, gameState]);

  const resetGame = useCallback(() => {
    const newCountry = getRandomPopularCountry();
    setCurrentCountry(newCountry);
    setGuesses([]);
    setGameState('playing');
  }, []);

  return {
    currentCountry,
    guesses,
    gameState,
    guessesRemaining: MAX_GUESSES - guesses.length,
    makeGuess,
    resetGame
  };
}