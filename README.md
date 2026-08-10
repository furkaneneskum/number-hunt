# NUMBER HUNT

Modern, mobile-friendly number guessing web game with XP, streaks, achievements, and multiple game modes.

## Features

- **4 Game Modes**: Classic, Time Attack, Streak, Daily Challenge
- **4 Difficulty Levels**: Easy, Medium, Hard, Insane
- **Progression**: XP, levels, streaks, achievements
- **Persistence**: localStorage save system
- **Responsive**: Mobile-first design
- **Accessible**: Keyboard navigation, ARIA labels, reduced motion support

## Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Tech Stack

- React 19 + TypeScript
- Vite
- React Router
- Vanilla CSS (no UI framework)

## Project Structure

```
src/
├── config/       # Game rules & achievements
├── services/     # Game logic, storage, sound
├── context/      # Global game state
├── components/   # UI components
└── pages/        # Route pages
```
