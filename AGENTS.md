# AGENTS.md

Guidelines for AI coding agents working in this repository.

## Project Overview

Answer Sound is a simple Progressive Web App (PWA) that plays audio feedback sounds for correct and incorrect answers. Built with vanilla JavaScript, HTML, and CSS - no build tools or frameworks.

## Build/Development Commands

This project has no build system. To run locally:

```bash
# Start a local development server
npx serve .

# Or use any static file server
python3 -m http.server 8000
```

## Testing

No automated tests exist. Manual testing:
1. Start local server
2. Open http://localhost:3000 (or configured port)
3. Click CORRECT button - should hear pleasant chime (C5)
4. Click INCORRECT button - should hear lower buzz (G3)

## Linting/Type Checking

No linter or type checker configured. Consider using:
```bash
# ESLint (if adding later)
npx eslint app.js service-worker.js

# Or use browser's developer tools
```

## Code Style Guidelines

### JavaScript

**Formatting:**
- 4-space indentation
- Single quotes for strings
- No semicolons at statement ends
- Max line length: ~80 characters

**Naming Conventions:**
- camelCase for variables and functions: `playCorrectSound`, `audioContext`
- UPPER_SNAKE_CASE for constants: `CACHE_NAME`
- Descriptive names preferred over abbreviations

**Functions:**
- Use function declarations for top-level functions:
  ```javascript
  function playCorrectSound() {
      // ...
  }
  ```
- Arrow functions for callbacks and inline handlers:
  ```javascript
  element.addEventListener('click', () => {
      playCorrectSound()
  })
  ```

**Variable Declarations:**
- Use `const` for values that don't change
- Use `let` for values that will be reassigned
- Never use `var`

**Comments:**
- Section headers with dashed comments:
  ```javascript
  // Audio context for generating sounds
  ```
- Inline comments for non-obvious logic (e.g., frequency values with note names)

**Error Handling:**
- Use `.catch()` for Promise chains
- Log errors with `console.error()`
- Provide fallback behavior where possible:
  ```javascript
  .catch(err => {
      console.error('Cache failed:', err)
  })
  ```

### HTML/CSS

**HTML:**
- Use semantic elements where appropriate
- Include necessary meta tags for PWA
- Inline critical CSS in `<style>` tag
- Load scripts at end of body

**CSS:**
- Use kebab-case for class names: `.container`, `#correctBtn`
- Mobile-first approach
- Include vendor prefixes for cross-browser support: `-webkit-tap-highlight-color`
- Use flexbox for layout

### File Organization

```
/
├── index.html        # Main HTML with inline styles
├── app.js            # Main application logic
├── service-worker.js # PWA caching logic
├── manifest.json     # PWA manifest
├── readme.md         # Project setup
└── LICENSE           # MIT License
```

## Web Audio API Notes

The app uses the Web Audio API for sound generation:

- `AudioContext` must be initialized after user interaction (browser policy)
- Use `oscillator.type` for waveform: 'sine', 'sawtooth', 'square', 'triangle'
- Envelope shaping with `gainNode.gain` methods:
  - `setValueAtTime()` - immediate value
  - `linearRampToValueAtTime()` - linear transition
  - `exponentialRampToValueAtTime()` - natural decay

## Service Worker

Caching strategy:
- Cache-first for static assets
- Cache version in `CACHE_NAME` constant
- Increment version when updating files: `answer-sound-v1` -> `answer-sound-v2`

## PWA Requirements

For PWA functionality:
1. `manifest.json` with app metadata and icons
2. Service worker registered on page load
3. HTTPS required (localhost exception for development)
4. Icons defined (currently inline SVG data URIs)

## Adding New Features

When adding new functionality:
1. Keep it simple - no build tools needed
2. Add new functions to `app.js`
3. Update cache list in `service-worker.js` if adding new files
4. Increment `CACHE_NAME` version
5. Test on mobile devices (touch events differ from click)

## Browser Compatibility

Target browsers:
- Modern Chrome, Firefox, Safari, Edge
- Mobile browsers (iOS Safari, Chrome for Android)

Known considerations:
- `webkitAudioContext` for older Safari
- `touch-action: manipulation` to prevent double-tap zoom
- `user-select: none` to prevent text selection on buttons

## Common Tasks

**Adding a new sound:**
1. Create new function in `app.js`
2. Define oscillator frequency and type
3. Add gain envelope for natural sound
4. Connect to `audioContext.destination`
5. Add button in `index.html` if needed

**Modifying existing sounds:**
- Adjust frequency values for pitch changes
- Modify oscillator type for timbre
- Change envelope timing for duration/attack

**Updating the app:**
1. Make changes to files
2. Update `CACHE_NAME` in `service-worker.js`
3. Test locally with `npx serve .`
4. Clear browser cache to test fresh install
