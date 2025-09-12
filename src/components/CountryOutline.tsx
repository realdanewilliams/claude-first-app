import React from 'react';
import { Country } from '@/lib/types';

interface CountryOutlineProps {
  country: Country | null;
}

export function CountryOutline({ country }: CountryOutlineProps) {
  if (!country) {
    return (
      <div className="w-96 h-80 border-2 border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading country...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-96 h-80 border-2 border-gray-300 rounded-lg bg-white overflow-hidden shadow-xl">
      <div className="w-full h-full relative bg-gradient-to-br from-slate-50 via-blue-50 to-green-50">
        {/* Main country shape display */}
        <div className="w-full h-5/6 flex items-center justify-center p-6">
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 400 300"
            className="max-w-full max-h-full drop-shadow-lg"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* Background circle for better visibility */}
            <circle
              cx="200"
              cy="150"
              r="140"
              fill="rgba(255, 255, 255, 0.8)"
              stroke="rgba(0, 0, 0, 0.1)"
              strokeWidth="1"
            />
            
            {/* The actual country shape */}
            <path
              d={country.svgPath}
              fill="#1e40af"
              stroke="#1e3a8a"
              strokeWidth="2"
              className="hover:fill-blue-700 transition-colors duration-300"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))'
              }}
            />
            
            {/* Highlight effect */}
            <path
              d={country.svgPath}
              fill="url(#countryGradient)"
              stroke="none"
              opacity="0.3"
            />
            
            <defs>
              <linearGradient id="countryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        {/* Bottom instruction section */}
        <div className="h-1/6 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
          <div className="text-center text-white">
            <p className="text-lg font-semibold">Guess the Country</p>
          </div>
        </div>
      </div>
    </div>
  );
}