import React, { useState } from 'react';
import { getAllCountries } from '@/lib/worldCountries';

interface CountrySearchProps {
  onGuess: (countryName: string) => void;
  disabled?: boolean;
}

export function CountrySearch({ onGuess, disabled = false }: CountrySearchProps) {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleInputChange = (value: string) => {
    setInput(value);

    if (value.length > 0) {
      const allCountries = getAllCountries();
      const filtered = allCountries
        .filter(country =>
          country.name.toLowerCase().includes(value.toLowerCase())
        )
        .map(country => country.name)
        .slice(0, 8); // Show more suggestions since we have more countries
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = (countryName: string) => {
    if (disabled) return;
    onGuess(countryName);
    setInput('');
    setSuggestions([]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      // Find exact match or first suggestion
      const allCountries = getAllCountries();
      const exactMatch = allCountries.find(
        country => country.name.toLowerCase() === input.toLowerCase()
      );
      const countryToGuess = exactMatch?.name || suggestions[0];
      if (countryToGuess) {
        handleSubmit(countryToGuess);
      }
    }
  };

  return (
    <div className="w-full max-w-md relative">
      <div className="mb-2">
        <label htmlFor="country-input" className="block text-sm font-medium text-gray-700 mb-1">
          Enter your guess:
        </label>
        <input
          id="country-input"
          type="text"
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a country name..."
          disabled={disabled}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      </div>

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
          {suggestions.map((country, index) => (
            <button
              key={country}
              onClick={() => handleSubmit(country)}
              disabled={disabled}
              className="w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none disabled:cursor-not-allowed first:rounded-t-lg last:rounded-b-lg"
            >
              {country}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}