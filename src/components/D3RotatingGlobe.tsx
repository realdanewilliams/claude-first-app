'use client';

import React, { useEffect, useRef, useState } from 'react';
import { geoOrthographic, geoPath, geoGraticule, geoDistance } from 'd3-geo';
import { select } from 'd3-selection';
import { drag } from 'd3-drag';
import { zoom } from 'd3-zoom';
import { interval } from 'd3-timer';
import 'd3-transition';
import * as topojson from 'topojson-client';
import { Country, Guess, GameState } from '@/lib/types';

interface D3RotatingGlobeProps {
  guesses: Guess[];
  currentCountry: Country | null;
  gameState: GameState;
}

import { WORLD_COUNTRIES } from '@/lib/worldCountries';

// Create a comprehensive country coordinates map from the world countries data
const COUNTRY_COORDS = new Map(
  WORLD_COUNTRIES.map(country => [
    country.name,
    [country.longitude, country.latitude]
  ])
);

// Color mapping for distance proximity
const getColorByDistance = (distance: number): string => {
  if (distance === 0) return '#10b981';
  if (distance < 500) return '#ef4444';
  if (distance < 1500) return '#f97316';
  if (distance < 3000) return '#eab308';
  return '#3b82f6';
};

export function D3RotatingGlobe({ guesses, currentCountry, gameState }: D3RotatingGlobeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [worldData, setWorldData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load world data
  useEffect(() => {
    const loadData = async () => {
      try {
        const topology = await import('world-atlas/countries-110m.json');
        setWorldData(topology.default || topology);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to load world data:', error);
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !worldData) return;

    const svg = select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const width = 600;
    const height = 600;
    const sensitivity = 75;

    // Set up projection
    const projection = geoOrthographic()
      .scale(250)
      .center([0, 0])
      .rotate([0, -30])
      .translate([width / 2, height / 2]);

    const initialScale = projection.scale();
    const path = geoPath().projection(projection);
    const pathGenerator = path as any;

    // Create sphere (ocean)
    const sphere = { type: 'Sphere' } as any;

    // Convert TopoJSON to GeoJSON
    const land = topojson.feature(worldData, worldData.objects.land);
    const countries = topojson.feature(worldData, worldData.objects.countries);

    // Create globe elements
    const globe = svg.append('g');

    // Ocean
    globe
      .append('path')
      .datum(sphere)
      .attr('class', 'sphere')
      .attr('d', pathGenerator)
      .attr('fill', '#4f90e3')
      .attr('stroke', 'none');

    // Graticule (grid lines)
    const graticule = geoGraticule();
    globe
      .append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 0.5)
      .attr('stroke-opacity', 0.3);

    // Land
    globe
      .append('path')
      .datum(land)
      .attr('class', 'land')
      .attr('d', pathGenerator)
      .attr('fill', '#2d5015')
      .attr('stroke', '#1a3009')
      .attr('stroke-width', 0.5);

    // Country borders
    const countryBorders = topojson.mesh(
      worldData,
      worldData.objects.countries,
      (a: any, b: any) => a !== b
    );

    globe
      .append('path')
      .datum(countryBorders)
      .attr('class', 'country-borders')
      .attr('d', pathGenerator)
      .attr('fill', 'none')
      .attr('stroke', '#3a5f1f')
      .attr('stroke-width', 0.5)
      .attr('stroke-opacity', 0.8);

    // Add guess markers
    const markersGroup = globe.append('g').attr('class', 'markers');

    function updateMarkers() {
      const markers = markersGroup.selectAll('.marker').data(guesses, (d: any, i: number) => i);

      markers.exit().remove();

      const markerEnter = markers
        .enter()
        .append('g')
        .attr('class', 'marker');

      // Add circles for guess markers
      markerEnter
        .append('circle')
        .attr('r', 8)
        .attr('fill', (d: Guess) => getColorByDistance(d.distance))
        .attr('stroke', '#ffffff')
        .attr('stroke-width', 2)
        .attr('opacity', 0.9);

      // Add text labels (numbers for incorrect, star for correct)
      markerEnter
        .append('text')
        .attr('dy', -12)
        .attr('text-anchor', 'middle')
        .attr('fill', '#ffffff')
        .attr('font-size', (d: Guess) => d.isCorrect ? '16px' : '12px')
        .attr('font-weight', 'bold')
        .attr('stroke', '#000000')
        .attr('stroke-width', 0.5)
        .text((d: Guess, i: number) => d.isCorrect ? '★' : (i + 1).toString())
        .attr('opacity', 1);

      // Update all markers
      const allMarkers = markerEnter.merge(markers as any);

      allMarkers.each(function(d: Guess) {
        const coords = COUNTRY_COORDS.get(d.country);
        if (coords) {
          const [x, y] = projection(coords as [number, number]) || [0, 0];
          select(this).attr('transform', `translate(${x},${y})`);

          // Hide markers on the back of the globe
          const centerPoint = projection.invert!([width / 2, height / 2]) || [0, 0];
          const distance = geoDistance(coords as [number, number], centerPoint as [number, number]);
          const visible = distance < Math.PI / 2;
          select(this).style('display', visible ? 'block' : 'none');
        }
      });
    }


    updateMarkers();

    // Auto-rotation
    let rotating = true;
    const rotationSpeed = 0.3;

    function autoRotate() {
      if (rotating) {
        const currentRotation = projection.rotate();
        projection.rotate([currentRotation[0] + rotationSpeed, currentRotation[1], currentRotation[2]]);

        // Update all paths and markers
        globe.selectAll('path').attr('d', pathGenerator);
        updateMarkers();
      }
    }

    const rotationTimer = interval(autoRotate, 50);

    // Mouse interaction for rotation
    let mouseDown = false;

    const dragBehavior = drag()
      .on('start', function() {
        mouseDown = true;
        rotating = false; // Stop auto-rotation when user interacts
      })
      .on('drag', function(event) {
        if (mouseDown) {
          const rotation = projection.rotate();
          const k = sensitivity / projection.scale();
          projection.rotate([
            rotation[0] + event.dx * k,
            rotation[1] - event.dy * k
          ]);

          // Update all paths and markers
          globe.selectAll('path').attr('d', pathGenerator);
          updateMarkers();
        }
      })
      .on('end', function() {
        mouseDown = false;
        // Resume auto-rotation after 3 seconds
        setTimeout(() => {
          rotating = true;
        }, 3000);
      });

    svg.call(dragBehavior as any);

    // Zoom functionality
    const zoomBehavior = zoom()
      .scaleExtent([0.5, 3])
      .on('zoom', function(event) {
        const newScale = initialScale * event.transform.k;
        projection.scale(newScale);

        // Update all paths and markers
        globe.selectAll('path').attr('d', pathGenerator);
        updateMarkers();
      });

    svg.call(zoomBehavior as any);

    // Cleanup
    return () => {
      rotationTimer.stop();
    };
  }, [worldData, guesses, currentCountry, gameState]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-blue-900 to-black rounded-lg">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading globe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg overflow-hidden relative">
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 600 600"
        className="cursor-grab active:cursor-grabbing"
      />

      {/* Controls info */}
      <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white rounded-lg p-3 text-sm">
        <div className="space-y-1">
          <p className="font-semibold">🌍 Interactive Globe</p>
          <p>🖱️ Drag to rotate</p>
          <p>🔍 Scroll to zoom</p>
          <p>⏱️ Auto-rotates when idle</p>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-70 text-white rounded-lg p-3 text-xs">
        <p className="font-semibold mb-2">Distance Colors:</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Correct</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>&lt;500 mi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span>&lt;1500 mi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>&lt;3000 mi</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>3000+ mi</span>
          </div>
        </div>
      </div>

      {/* Game status */}
      {gameState !== 'playing' && currentCountry && (
        <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white rounded-lg p-3">
          <p className="font-semibold">
            {gameState === 'won' ? '🎉 Correct!' : '😔 Game Over'}
          </p>
          <p className="text-sm">
            Answer: {currentCountry.name} ★
          </p>
        </div>
      )}
    </div>
  );
}