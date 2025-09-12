# Geography Guessing Game

A browser-based geography game where players guess countries based on their outlines. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Authentic WorldAtlas Outline Images**: Displays real country outline maps sourced directly from WorldAtlas.com
- **Auto-complete Search**: Type-ahead search with country name suggestions from comprehensive country database
- **Distance & Direction Feedback**: Shows distance in miles and direction arrows for incorrect guesses using Haversine formula
- **Google Earth Style Globe**: Low-poly 3D Earth visualization featuring:
  - Real country boundaries rendered with D3.js geographic projections
  - Interactive orthographic projection with drag-to-rotate controls
  - Individual country highlighting with proximity color coding
  - Realistic ocean and landmass representation
  - Country borders clearly defined like Google Earth satellite view
  - Auto-rotation with manual override capabilities
  - Space background with animated stars
- **Professional Grade Images**: 
  - Primary outline images from WorldAtlas educational resources
  - Secondary image fallback system for reliability
  - SVG fallback using real GeoJSON boundary data
  - Proper attribution and links to source materials
- **Educational Value**: Learn actual country shapes using the same resources as geography textbooks
- **Game Mechanics**: 5 guesses maximum, success/failure states, and play again functionality
- **Responsive Design**: Works on desktop and mobile devices with touch support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
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

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## How to Play

1. Look at the country outline shown on the left side
2. Type a country name in the search box (auto-complete will help)
3. Submit your guess by pressing Enter or clicking a suggestion
4. If incorrect, you'll see:
   - Distance in miles to the correct country
   - Direction arrow pointing toward the correct country
   - Your guess added to the history with a color indicating proximity
5. The world map on the right shows all your guesses with color coding:
   - 🟢 Green: Correct answer
   - 🔴 Red: Very close (<500 miles)
   - 🟠 Orange: Close (<1,500 miles)
   - 🟡 Yellow: Medium distance (<3,000 miles)
   - 🔵 Blue: Far (3,000+ miles)
6. You have 5 guesses to find the correct country
7. Click "Play Again" to start a new round with a different country

## Game Features

### Country Data
- 50 countries with accurate latitude/longitude coordinates
- Simplified SVG outlines for major countries
- Distance calculations using the Haversine formula

### Feedback System
- Real-time distance calculations
- 8-directional arrows (N, NE, E, SE, S, SW, W, NW)
- Color-coded proximity indicators
- Guess history tracking

### UI/UX
- Clean, intuitive interface
- Keyboard navigation support
- Responsive design
- Accessibility considerations

## Development

### Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── CountryOutline.tsx
│   ├── CountrySearch.tsx
│   ├── GuessHistory.tsx
│   └── Globe.tsx
├── data/              # Static data
│   └── countries.ts   # Country data
└── lib/               # Utilities and hooks
    ├── hooks/
    │   └── useGame.ts # Game state management
    ├── types.ts       # TypeScript types
    └── utils.ts       # Utility functions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Future Enhancements

- Real GeoJSON/TopoJSON integration for accurate country shapes
- 3D globe with three.js/react-globe.gl
- Daily challenge mode
- Multiplayer capabilities
- Statistics tracking
- More country data and difficulty levels
- Better mobile experience

## License

This project is open source and available under the MIT License.