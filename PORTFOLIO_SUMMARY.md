# Mike Villamarin Portfolio — Build Summary

**Site:** mike.devhousetech.io  
**Repo:** github.com/devhousetech/portfolio  
**Local:** D:\portfolio  
**Stack:** React + Vite, Vercel

---

## Overview

Personal portfolio for Dan Michael Villamarin (Mike), founder of DevHouse Technologies. Premium dark aesthetic — near-black `#0c0d0f` background, silver `#C4C6CC` primary, Biennale Bold headlines, DM Sans body.

---

## File Structure

```
src/
  App.jsx              — main layout, all sections
  HeroFluid.jsx        — WebGL water shader hero
  LoadingScreen.jsx    — auto-drive cinematic loading screen
  PixelGame.jsx        — full mini-game section
  GameFAB.jsx          — floating game button (bottom-right)
  index.css            — global CSS vars

public/
  hero.png             — Mike's headshot (used in hero section)
  assets/game/
    main-char.png           — idle car sprite (342x259)
    main-char-moving.png    — 8-frame spritesheet (4700x259, 587/frame)
    realtor-1.png           — realtor sprite female blonde (119x289)
    realtor-2.png           — realtor sprite female brunette (114x288)
    realtor-3.png           — realtor sprite female dark hair (113x289)
    banana.png              — banana peel obstacle (272x209)
    sea-gull.png            — 3-frame seagull spritesheet (1700x475, 566/frame)
    house-1.png to house-6.png  — pixel art houses (various ~280x200)
    tree-1.png to tree-4.png    — pixel art trees (various sizes)
    cloud-1.png, cloud-2.png    — pixel art clouds
    california-bg.png       — background (1774x887, 2:1 ratio)
    road.png                — road + sidewalk + grass (2048x520)
    game-icon.png           — joystick icon for FAB (344x419)
    city-music.mp3          — background music (loops, 25% vol)
    jump.mp3                — jump sound effect (35% vol)
    game-over.mp3           — hit sound effect (40% vol)
```

---

## Sections (App.jsx order)

1. **Nav** — fixed, scrolled blur, links to all sections, "Book a call" CTA
2. **Hero** — WebGL water shader bg (`HeroFluid.jsx`), headshot, stats, 3D dh logo
3. **FeaturedProjects** — 5 project cards with CSS hover overlay
4. **SkillsTable** — 15 skills in a table layout
5. **About** — bio + facts grid
6. **PixelGame** — mini-game (after About, before SaaS)
7. **Saas** — Email Sequence Generator product section
8. **Contact** — links + Calendly CTA
9. **Footer**
10. **GameFAB** — floating button, fixed bottom-right

---

## LoadingScreen.jsx

- Auto-drive cinematic sequence, no user input
- Preloads game sprites before starting
- Car drives automatically → hits banana → red flash → fades out → site loads
- Canvas: `640x320` (2:1 ratio matching california-bg)
- Centered on `#0c0d0f` background with dark vignette on all 4 edges
- "Loading..." label underneath
- Runs ~4-5 seconds, exits on banana hit

---

## PixelGame.jsx — Mike's Subdivision Run

### Game Concept

Infinite one-way side-scrolling game. Mike drives his red convertible through a California suburb, bumps realtors to close deals (score++), avoids obstacles. Left wall creeps forward — no going back.

### Constants

```js
;((CW = 480), (CH = 200)) // canvas size
GROUND_Y = CH - 50 // road surface Y
CAR_H = 52 // rendered car height
CAR_W_IDLE = ~69 // 342 * 52/259
CAR_W_MOV = ~118 // 587 * 52/259
REA_H = 52 // realtor height
GRAVITY = 0.5
JUMP_VEL = -9 // hang time at peak: effectiveGravity * 0.15
MOVE_SPD = 1.8
```

### Sprite System

- `loadImages()` — loads all sprites once into `IMGS` cache on mount
- `drawImg(key, x, groundY, targetH)` — bottom-aligned image draw
- `drawFrame(key, fi, total, x, groundY, targetH)` — spritesheet frame draw
- Car idle: `main-char.png`, frame 0 when still
- Car moving: `main-char-moving.png`, 8 frames, 9 ticks/frame
- `isMoving` — true when arrow key held + 10-frame decay after release

### World Generation

- `createWorld()` — infinite world, features generated in chunks
- Features: houses (6 variants), trees (4 variants, stored at spawn), gaps
- Fences removed
- House spacing: `120-300px` gap between properties
- Realtors: one per house, positioned at `GROUND_Y - 11`
- Houses/trees drawn at `GROUND_Y - 17`
- Clouds: 8 clouds, parallax at `0.3x` cam speed
- Background: `california-bg.png` at `0.3x` parallax
- Road: `road.png` tiled at `1x` cam speed (matches features exactly)

### Obstacles

- `createObstacles()` — separate infinite generator
- **Level 1 (0-49 pts):** bananas + seagulls mixed, gaps 280-480px
- **Level 2 (50-99 pts):** same mix, gaps 220-340px
- **Level 3 (100+ pts):** same mix, gaps 160-260px
- Banana: `banana.png`, 14px tall, sits on `GROUND_Y - 14`, only kills if `onGround`
- Seagull: `sea-gull.png`, 3-frame animation, bobs up/down with sine wave, 40px tall

### Hitboxes

- Car: `cp=28` left pad, `cp` right pad, `+10` top, `-4` bottom
- Banana: `8x5px`, only triggers when `s.onGround === true`
- Seagull: `12x8px`

### Hang Time

```js
const atPeak = s.velY > -2 && s.velY < 3 && !s.onGround
const effectiveGravity = atPeak ? GRAVITY * 0.15 : GRAVITY
```

### Collision & Scoring

- Realtor bump → `score++`, speech bubble, 🙌 emoji, "+1 Deal!" popup
- Obstacle hit → `hitFlash=30`, red screen overlay, `gameOver=true`, 600ms delay → game over panel

### Game Over Panel

- Shows Score + Best side by side
- Mode indicator: 🍌 Level 1 / ⚡ Level 2 / 🔥 Level 3
- RETRY button + Spacebar both restart
- `restartKey` state triggers useEffect re-run for clean loop restart

### Audio

- All 3 Audio objects created once in mount-only `useEffect([], [])`
- `city-music.mp3` — starts on first Space press, loops, stops on hit, restarts on retry
- `jump.mp3` — plays on every jump, `currentTime=0` reset
- `game-over.mp3` — plays on obstacle hit
- Mute button toggles `audio.muted` on all 3 simultaneously

### Mobile Controls

- ◀ ▶ hold buttons for drive left/right
- JUMP tap button (also starts game + retries)
- ⛶ fullscreen button
- 🔊/🔇 mute toggle button
- All touch events use `preventDefault()`

### Start Screen

- Space only to start (not any key)
- Two-column controls grid with teal keys + silver descriptions
- Pulsing "PRESS SPACE TO START" prompt

---

## GameFAB.jsx

- Fixed bottom-right `(28px, 28px)`, `60x60px` circle
- Hidden until scrolled 50% past hero
- Teal pulsing ring animation every 2.5s
- Hover: icon bobs, "Take a break 🕹️" tooltip slides in from right
- Click: smooth scrolls to `#minigame` section
- Icon: `game-icon.png` (pixel art joystick), `34x34px` rendered

---

## HeroFluid.jsx

- Raw WebGL shader (no Three.js)
- Dark water base `#0c0d0f`, silver caustic highlights
- Surface normals + specular lighting
- Click anywhere = fluid disturbance (push outward)
- `centerFade = smoothstep(0, 0.06, d)`

---

## Key CSS Variables (index.css)

```css
--bg: #0c0d0f --offwhite: #edeae4 --silver: #c4c6cc --muted: #6b6e75
  --border: rgba(255, 255, 255, 0.08) --teal: #4adede --max: 1200px;
```

Horizontal padding: `clamp(20px, 5vw, 60px)` across all sections.

---

## Deployment

- Vercel, auto-deploys on `git push` to main
- Custom domain via Hostinger CNAME
- No `vercel --prod` needed — connected repo handles it
