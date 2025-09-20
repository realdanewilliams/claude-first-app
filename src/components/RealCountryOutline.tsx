import React, { useState, useEffect } from 'react';
import { Country } from '@/lib/types';

interface RealCountryOutlineProps {
  country: Country | null;
}

// Map country names to their ISO codes for mapsicon PNG lookup
const COUNTRY_NAME_TO_ISO: { [key: string]: string } = {
  // Major countries
  'United States': 'us',
  'Canada': 'ca',
  'Mexico': 'mx',
  'Brazil': 'br',
  'Argentina': 'ar',
  'Chile': 'cl',
  'Peru': 'pe',
  'Colombia': 'co',
  'Venezuela': 've',
  'Ecuador': 'ec',
  'Bolivia': 'bo',
  'Paraguay': 'py',
  'Uruguay': 'uy',
  'Guyana': 'gy',
  'Suriname': 'sr',

  // Europe
  'United Kingdom': 'gb',
  'France': 'fr',
  'Germany': 'de',
  'Italy': 'it',
  'Spain': 'es',
  'Portugal': 'pt',
  'Netherlands': 'nl',
  'Belgium': 'be',
  'Switzerland': 'ch',
  'Austria': 'at',
  'Poland': 'pl',
  'Czech Republic': 'cz',
  'Slovakia': 'sk',
  'Hungary': 'hu',
  'Romania': 'ro',
  'Bulgaria': 'bg',
  'Greece': 'gr',
  'Croatia': 'hr',
  'Serbia': 'rs',
  'Bosnia and Herzegovina': 'ba',
  'Slovenia': 'si',
  'Montenegro': 'me',
  'Albania': 'al',
  'Macedonia [FYROM]': 'mk',
  'Kosovo': 'xk',
  'Moldova': 'md',
  'Ukraine': 'ua',
  'Belarus': 'by',
  'Lithuania': 'lt',
  'Latvia': 'lv',
  'Estonia': 'ee',
  'Finland': 'fi',
  'Sweden': 'se',
  'Norway': 'no',
  'Denmark': 'dk',
  'Iceland': 'is',
  'Ireland': 'ie',
  'Faroe Islands': 'fo',

  // Asia
  'Russia': 'ru',
  'China': 'cn',
  'India': 'in',
  'Japan': 'jp',
  'South Korea': 'kr',
  'North Korea': 'kp',
  'Mongolia': 'mn',
  'Kazakhstan': 'kz',
  'Uzbekistan': 'uz',
  'Turkmenistan': 'tm',
  'Kyrgyzstan': 'kg',
  'Tajikistan': 'tj',
  'Afghanistan': 'af',
  'Pakistan': 'pk',
  'Bangladesh': 'bd',
  'Nepal': 'np',
  'Bhutan': 'bt',
  'Sri Lanka': 'lk',
  'Myanmar [Burma]': 'mm',
  'Thailand': 'th',
  'Laos': 'la',
  'Vietnam': 'vn',
  'Cambodia': 'kh',
  'Malaysia': 'my',
  'Singapore': 'sg',
  'Indonesia': 'id',
  'Philippines': 'ph',
  'Taiwan': 'tw',

  // Middle East
  'Turkey': 'tr',
  'Iran': 'ir',
  'Iraq': 'iq',
  'Syria': 'sy',
  'Lebanon': 'lb',
  'Jordan': 'jo',
  'Israel': 'il',
  'Saudi Arabia': 'sa',
  'Yemen': 'ye',
  'Oman': 'om',
  'United Arab Emirates': 'ae',
  'Qatar': 'qa',
  'Kuwait': 'kw',
  'Bahrain': 'bh',
  'Georgia': 'ge',
  'Armenia': 'am',
  'Azerbaijan': 'az',

  // Africa
  'Egypt': 'eg',
  'Libya': 'ly',
  'Tunisia': 'tn',
  'Algeria': 'dz',
  'Morocco': 'ma',
  'Sudan': 'sd',
  'South Sudan': 'ss',
  'Ethiopia': 'et',
  'Eritrea': 'er',
  'Djibouti': 'dj',
  'Somalia': 'so',
  'Kenya': 'ke',
  'Uganda': 'ug',
  'Tanzania': 'tz',
  'Rwanda': 'rw',
  'Burundi': 'bi',
  'Congo [DRC]': 'cd',
  'Congo [Republic]': 'cg',
  'Central African Republic': 'cf',
  'Chad': 'td',
  'Niger': 'ne',
  'Nigeria': 'ng',
  'Cameroon': 'cm',
  'Equatorial Guinea': 'gq',
  'Gabon': 'ga',
  'São Tomé and Príncipe': 'st',
  'Mali': 'ml',
  'Burkina Faso': 'bf',
  'Senegal': 'sn',
  'Gambia': 'gm',
  'Guinea-Bissau': 'gw',
  'Guinea': 'gn',
  'Sierra Leone': 'sl',
  'Liberia': 'lr',
  'Côte d\'Ivoire': 'ci',
  'Ghana': 'gh',
  'Togo': 'tg',
  'Benin': 'bj',
  'Mauritania': 'mr',
  'Western Sahara': 'eh',
  'South Africa': 'za',
  'Namibia': 'na',
  'Botswana': 'bw',
  'Zimbabwe': 'zw',
  'Zambia': 'zm',
  'Malawi': 'mw',
  'Mozambique': 'mz',
  'Swaziland': 'sz',
  'Lesotho': 'ls',
  'Madagascar': 'mg',
  'Mauritius': 'mu',
  'Seychelles': 'sc',
  'Comoros': 'km',
  'Cape Verde': 'cv',

  // Oceania
  'Australia': 'au',
  'New Zealand': 'nz',
  'Papua New Guinea': 'pg',
  'Fiji': 'fj',
  'Solomon Islands': 'sb',
  'Vanuatu': 'vu',
  'Samoa': 'ws',
  'Tonga': 'to',
  'Kiribati': 'ki',
  'Nauru': 'nr',
  'Palau': 'pw',
  'Micronesia': 'fm',
  'New Caledonia': 'nc',
  'French Polynesia': 'pf'
};

export function RealCountryOutline({ country }: RealCountryOutlineProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasRealImage, setHasRealImage] = useState(false);

  useEffect(() => {
    if (!country) {
      setIsLoading(true);
      return;
    }

    const loadCountryImage = async () => {
      const isoCode = COUNTRY_NAME_TO_ISO[country.name];

      if (isoCode) {
        try {
          // Try to load the PNG image from mapsicon repository
          const testImageUrl = `https://raw.githubusercontent.com/djaiss/mapsicon/master/all/${isoCode}/1024.png`;

          // Test if the image exists by creating an Image object
          const img = new Image();
          img.onload = () => {
            setImageUrl(testImageUrl);
            setHasRealImage(true);
            setIsLoading(false);
          };
          img.onerror = () => {
            // Fallback - use placeholder
            setImageUrl('');
            setHasRealImage(false);
            setIsLoading(false);
          };
          img.src = testImageUrl;
        } catch (error) {
          console.warn(`Failed to load image for ${country.name}:`, error);
          setImageUrl('');
          setHasRealImage(false);
          setIsLoading(false);
        }
      } else {
        // No ISO code mapping available
        setImageUrl('');
        setHasRealImage(false);
        setIsLoading(false);
      }
    };

    loadCountryImage();
  }, [country]);

  if (isLoading || !country) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 rounded-lg shadow-lg">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading country outline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-96 bg-gradient-to-br from-blue-50 via-white to-green-50 rounded-lg shadow-lg overflow-hidden">
      {/* Country outline display */}
      <div className="w-full h-5/6 flex items-center justify-center p-8">
        {hasRealImage && imageUrl ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={imageUrl}
              alt={`Outline of ${country.name}`}
              className="max-w-full max-h-full object-contain filter drop-shadow-lg"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
              }}
            />
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="w-32 h-32 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">🌍</span>
              </div>
              <p className="text-sm">Country outline not available</p>
              <p className="text-xs text-gray-400 mt-1">{country.name}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom instruction section */}
      <div className="h-1/6 bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-lg font-semibold">🌍 Guess the Country</p>
          <p className="text-sm opacity-90">
            What country has this shape?
          </p>
        </div>
      </div>
    </div>
  );
}