'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Guess } from '@/lib/types';
import { CountryGeoData } from '@/lib/geoUtils';
import { findCountryByNameSync, getCountries } from '@/data/countries';
import { geoPath, geoOrthographic } from 'd3-geo';

interface GoogleEarthGlobeProps {
  guesses: Guess[];
  currentCountry: CountryGeoData | null;
  gameState: 'playing' | 'won' | 'lost';
}

interface Country3D {
  name: string;
  geometry: any;
  centroid: [number, number];
}

export function GoogleEarthGlobe({ guesses, currentCountry, gameState }: GoogleEarthGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState({ lambda: 0, phi: -10 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMouse, setLastMouse] = useState({ x: 0, y: 0 });
  const [worldData, setWorldData] = useState<Country3D[]>([]);
  const animationRef = useRef<number>();

  // Create projection for the globe
  const projection = geoOrthographic()
    .scale(180)
    .translate([300, 192])
    .rotate([rotation.lambda, rotation.phi]);

  const pathGenerator = geoPath()
    .projection(projection)
    .context(null);

  // Load world countries data
  useEffect(() => {
    const loadWorldData = async () => {
      try {
        const countries = await getCountries();
        const world3D: Country3D[] = countries
          .filter(country => country.geometry)
          .map(country => ({
            name: country.name,
            geometry: country.geometry,
            centroid: [country.longitude, country.latitude]
          }));
        setWorldData(world3D);
        console.log(`Loaded ${world3D.length} countries for globe`);
      } catch (error) {
        console.error('Failed to load world data for globe:', error);
      }
    };

    loadWorldData();
  }, []);

  const drawGlobe = (ctx: CanvasRenderingContext2D) => {
    const width = 600;
    const height = 384;
    const radius = 180;
    const centerX = 300;
    const centerY = 192;

    // Clear canvas with space background
    const spaceGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, Math.max(width, height) / 2);
    spaceGradient.addColorStop(0, '#0a0a23');
    spaceGradient.addColorStop(0.8, '#1a1a3a');
    spaceGradient.addColorStop(1, '#000000');
    ctx.fillStyle = spaceGradient;
    ctx.fillRect(0, 0, width, height);

    // Draw stars
    ctx.fillStyle = 'white';
    for (let i = 0; i < 150; i++) {
      const x = (i * 127) % width;
      const y = (i * 233) % height;
      const size = (i % 3) * 0.3 + 0.2;
      const opacity = Math.sin(i + Date.now() * 0.001) * 0.3 + 0.7;
      ctx.globalAlpha = opacity;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Draw globe sphere (ocean)
    const oceanGradient = ctx.createRadialGradient(
      centerX - radius * 0.4,
      centerY - radius * 0.4,
      0,
      centerX,
      centerY,
      radius
    );
    oceanGradient.addColorStop(0, '#4A90E2');
    oceanGradient.addColorStop(0.6, '#2E5A87');
    oceanGradient.addColorStop(1, '#1A365D');

    ctx.fillStyle = oceanGradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Update projection for current rotation
    projection.rotate([rotation.lambda, rotation.phi]);

    // Draw countries
    worldData.forEach((country) => {
      try {
        pathGenerator.context(ctx);
        const path = pathGenerator(country.geometry);
        
        if (path) {
          // Check if country should be highlighted
          let isGuessed = false;
          let isCorrect = false;
          let proximityColor = '#2D5A27'; // default land color

          guesses.forEach(guess => {
            if (guess.country === country.name) {
              isGuessed = true;
              if (guess.distance === 0) {
                isCorrect = true;
                proximityColor = '#10b981'; // green
              } else if (guess.distance < 500) {
                proximityColor = '#ef4444'; // red
              } else if (guess.distance < 1500) {
                proximityColor = '#f97316'; // orange  
              } else if (guess.distance < 3000) {
                proximityColor = '#eab308'; // yellow
              } else {
                proximityColor = '#3b82f6'; // blue
              }
            }
          });

          // Highlight current correct country if game is over
          if ((gameState === 'won' || gameState === 'lost') && 
              currentCountry && country.name === currentCountry.name && !isCorrect) {
            proximityColor = '#10b981';
          }

          // Fill country
          ctx.fillStyle = proximityColor;
          ctx.globalAlpha = isGuessed ? 0.9 : 0.7;
          ctx.fill();

          // Draw country borders
          ctx.strokeStyle = isGuessed ? '#ffffff' : '#1a365d';
          ctx.lineWidth = isGuessed ? 1.5 : 0.5;
          ctx.globalAlpha = 1;
          ctx.stroke();
        }
      } catch (error) {
        // Skip problematic geometries
      }
    });

    // Draw globe highlight
    const highlight = ctx.createRadialGradient(
      centerX - radius * 0.3,
      centerY - radius * 0.3,
      0,
      centerX,
      centerY,
      radius
    );
    highlight.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    highlight.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    highlight.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = highlight;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fill();

    // Draw globe outline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawGlobe(ctx);
  };

  useEffect(() => {
    const animate = () => {
      if (!isDragging) {
        setRotation(prev => ({ ...prev, lambda: prev.lambda + 0.5 }));
      }
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [rotation, isDragging, guesses, currentCountry, gameState, worldData]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMouse.x;
    const deltaY = e.clientY - lastMouse.y;
    
    setRotation(prev => ({
      lambda: prev.lambda + deltaX * 0.5,
      phi: Math.max(-90, Math.min(90, prev.phi - deltaY * 0.5))
    }));
    
    setLastMouse({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full h-96 bg-black rounded-lg overflow-hidden relative">
      <canvas
        ref={canvasRef}
        width={600}
        height={384}
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      />
      
      {/* Controls overlay */}
      <div className="absolute top-4 right-4 text-white text-sm bg-black bg-opacity-50 px-3 py-2 rounded">
        <p>🌍 Drag to explore Earth</p>
        <p className="text-xs text-gray-300">Countries: {worldData.length}</p>
      </div>
      
      {/* Legend */}
      <div className="absolute bottom-4 left-4 text-white text-xs space-y-1 bg-black bg-opacity-70 px-3 py-2 rounded">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-sm"></div>
          <span>Correct</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
          <span>&lt;500mi</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-orange-500 rounded-sm"></div>
          <span>&lt;1.5K mi</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div>
          <span>&lt;3K mi</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-sm"></div>
          <span>3K+ mi</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-700 rounded-sm"></div>
          <span>Land</span>
        </div>
      </div>
    </div>
  );
}