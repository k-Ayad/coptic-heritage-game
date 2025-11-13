# Coptic Heritage Game

A mobile-first 2D adventure game built with Angular 19, exploring the rich history of the Coptic Church through interactive gameplay.

## Features

- 🎮 Mobile-first responsive design
- 🕹️ Virtual joystick for mobile + WASD/Arrow keys for desktop
- 🏛️ Interactive locations: Churches, Monasteries, Schools
- 📊 Progress tracking and scoring system
- 💾 LocalStorage persistence
- 🎨 Pure CSS-drawn map and animations

## Installation

```bash
npm install
```

## Development Server

```bash
npm start
```

Navigate to `http://localhost:4200/`

## Build

```bash
npm run build
```

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── game/          # Main game component
│   │   ├── joystick/      # Virtual joystick for mobile
│   │   ├── popup/         # Mini-game interaction popup
│   │   ├── hud/           # Heads-up display (score, progress)
│   │   └── menu/          # Start menu
│   ├── models/            # TypeScript interfaces
│   ├── services/          # Game logic and state management
│   ├── app.component.ts
│   └── app.config.ts
└── main.ts
```

## Game Controls

### Desktop
- **W / ↑**: Move up
- **A / ←**: Move left
- **S / ↓**: Move down
- **D / →**: Move right

### Mobile
- Use the virtual joystick in the bottom-left corner

## Gameplay

1. Start at the Entrance Gate
2. Move along the roads to reach different locations
3. Interact with Churches, Monasteries, and Schools
4. Complete mini-games to earn points and track progress
5. Visit all 6 locations to complete your journey

## Technologies

- Angular 19
- TypeScript
- SCSS
- Standalone Components
- Signals API
- LocalStorage API

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Best experienced on mobile devices (iOS/Android) or desktop browsers.

## License

Educational project for Coptic Heritage Education
