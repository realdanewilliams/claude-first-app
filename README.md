# Geography Guessing Game

A modern geography game where players identify countries from authentic outlines. Features real country shapes from mapsicon repository and an interactive 3D Earth globe powered by D3.js.

🌍 **[Live Demo](your-vercel-url-here)** - Try the game now!

## Features

### 🗺️ Authentic Country Outlines
- **Real PNG Country Shapes**: Authentic country outlines sourced from [mapsicon repository](https://github.com/djaiss/mapsicon)
- **High-Quality Images**: 1024px resolution country outline images
- **Comprehensive Coverage**: Supports 249 countries with ISO code mapping
- **Intelligent Fallback**: Graceful handling when country images aren't available

### 🌐 Interactive 3D Globe
- **D3.js Rotating Earth**: Realistic orthographic projection with authentic geography
- **Interactive Controls**: Drag to rotate, scroll to zoom, auto-rotation when idle
- **Real-time Markers**: Distance-based color coding for guess proximity
- **Smart Visibility**: Markers hide when on the back side of the globe
- **Authentic Geography**: Built with TopoJSON world atlas data

### 🎮 Advanced Game Mechanics
- **Intelligent Search**: Auto-complete with 8 suggestions from comprehensive world database
- **Distance Calculations**: Precise Haversine formula distance measurements
- **Visual Feedback**: Color-coded proximity system:
  - 🟢 **Green**: Correct answer (0 miles)
  - 🔴 **Red**: Very close (<500 miles)
  - 🟠 **Orange**: Close (<1,500 miles)
  - 🟡 **Yellow**: Medium distance (<3,000 miles)
  - 🔵 **Blue**: Far (3,000+ miles)
- **Star Markers**: Stars appear on correct guesses on the globe
- **5 Guess Limit**: Strategic gameplay with limited attempts

### 📱 Modern User Experience
- **Responsive Design**: Works perfectly on desktop and mobile
- **Clean Interface**: Intuitive layout with clear visual hierarchy
- **Keyboard Support**: Full keyboard navigation and Enter to submit
- **Accessibility**: Proper semantic HTML and ARIA labels

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS for responsive design
- **Visualization**: D3.js for geographic projections and globe rendering
- **Data Sources**:
  - [mapsicon](https://github.com/djaiss/mapsicon) for country outline images
  - [TopoJSON World Atlas](https://github.com/topojson/world-atlas) for geographic data
  - [Google Public Data](https://developers.google.com/public-data/docs/canonical/countries_csv) for country coordinates
- **Deployment**: Vercel with optimized build configuration

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/realdanewilliams/claude-first-app.git
   cd claude-first-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3001](http://localhost:3001) in your browser

### Build for Production

```bash
npm run build
npm start
```

## How to Play

1. **Study the Country**: Look at the authentic country outline displayed on the left
2. **Make Your Guess**: Type a country name using the auto-complete search
3. **Submit**: Press Enter or click a suggestion to submit your guess
4. **Get Feedback**: See your guess appear on the interactive globe with distance-based coloring
5. **Track Progress**: Watch your guess history and remaining attempts
6. **Win or Learn**: Find the correct country within 5 guesses or see the answer revealed
7. **Play Again**: Click "Play Again" to try a new country

## Project Structure

```
src/
├── app/                          # Next.js app router
│   ├── api/health/              # Health check endpoint
│   ├── debug/                   # Debug page for troubleshooting
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with metadata
│   └── page.tsx                 # Main game page
├── components/                   # React components
│   ├── D3RotatingGlobe.tsx      # Interactive 3D Earth globe
│   ├── RealCountryOutline.tsx   # Authentic country outline display
│   ├── CountrySearch.tsx        # Auto-complete search component
│   └── GuessHistory.tsx         # Guess tracking component
├── lib/                         # Core game logic
│   ├── hooks/
│   │   └── useGame.ts           # Game state management
│   ├── worldCountries.ts        # Comprehensive country database
│   ├── utils.ts                 # Distance and direction calculations
│   ├── types.ts                 # TypeScript type definitions
│   └── topoJsonUtils.ts         # Geographic data utilities
└── data/                        # Legacy country data
    └── countries.ts             # Original simplified country list
```

### Key Components

#### D3RotatingGlobe
- Interactive 3D Earth visualization using D3.js orthographic projection
- Real-time marker updates with distance-based color coding
- Auto-rotation with manual drag controls and zoom functionality
- Proper handling of marker visibility on globe back-face

#### RealCountryOutline
- Fetches authentic country PNG images from mapsicon repository
- Intelligent ISO code mapping for 200+ countries
- Fallback system for countries without available images
- Responsive image scaling and proper aspect ratio handling

#### Game Logic (useGame)
- State management for current country, guesses, and game status
- Integration with comprehensive world countries database
- Distance calculations using Haversine formula
- Win/loss detection and game reset functionality

### Available Scripts

- `npm run dev` - Start development server on port 3001
- `npm run build` - Build optimized production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint code quality checks

## Data Sources & Attribution

- **Country Outlines**: [mapsicon by djaiss](https://github.com/djaiss/mapsicon) - High-quality country outline images
- **Geographic Data**: [TopoJSON World Atlas](https://github.com/topojson/world-atlas) - Accurate world geographic boundaries
- **Country Database**: [Google Public Data](https://developers.google.com/public-data/docs/canonical/countries_csv) - Comprehensive country coordinates

## Deployment

This project is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the Next.js framework
3. Deploy with zero configuration required
4. The `vercel.json` file ensures proper build settings

## Browser Support

- Modern browsers with ES2020+ support
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers on iOS and Android
- Requires JavaScript enabled for full functionality

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes with proper TypeScript types
4. Test locally: `npm run build` and `npm run dev`
5. Submit a pull request with clear description

## License

This project is open source and available under the MIT License.

---

Built with ❤️ using Next.js, TypeScript, D3.js, and authentic geographic data sources.