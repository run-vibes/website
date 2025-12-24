# Daybreak Hybrid Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a hybrid dark theme combining 2D/3D objects with layered visual effects, then generate 5 color variants.

**Architecture:** Dark-mode theme layering noise, scanlines, particles, and geometric patterns with mixed flat shapes and 3D objects. CSS-only effects for performance.

**Tech Stack:** HTML, CSS (custom properties for theming), JavaScript (3D transforms, mouse parallax)

---

## Core Architecture

**Name:** `daybreak-hybrid`

### Effect Layering (back to front)
1. **Base:** Dark gradient background (#0a0a0b → #111113)
2. **Layer 1:** Geometric grid pattern (subtle lines at 3% opacity)
3. **Layer 2:** Noise texture (SVG filter, 5% opacity)
4. **Layer 3:** 3D objects (cubes, pyramids) + flat shapes
5. **Layer 4:** Floating particles (CSS pseudo-elements)
6. **Layer 5:** Scanlines overlay (repeating gradient, 8% opacity)

### Object Composition
- **3D Objects:** 2 cubes (left/right), 1 pyramid (center-back)
- **Flat 2D Shapes:** Circle (pulsing), diamond (rotating outline), rectangle (floating), triangle (outline)

### Visual Effects

**Noise/Grain:**
```css
.noise-overlay::before {
  background-image: url("data:image/svg+xml,...");
  opacity: 0.05;
  mix-blend-mode: overlay;
}
```

**Scanlines:**
```css
.scanlines::after {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.15) 2px,
    rgba(0, 0, 0, 0.15) 4px
  );
  opacity: 0.08;
}
```

**Particles:** 20-30 small dots (2-4px), floating upward, coral/indigo at 30-50% opacity

**Geometric Grid:**
```css
.geo-grid {
  background-image:
    linear-gradient(rgba(255,87,87,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,87,87,0.03) 1px, transparent 1px);
  background-size: 60px 60px;
}
```

---

## Typography

**Flagship: Mono/Terminal**
```css
--font-display: 'JetBrains Mono', 'Fira Code', monospace;
--font-body: 'Inter', system-ui, sans-serif;
```

---

## Color Variants

| Variant | Primary | Secondary | Vibe |
|---------|---------|-----------|------|
| **current** | Coral #ff5757 | Indigo #818cf8 | Warm tech |
| **cyberpunk** | Neon Pink #ff2d92 | Electric Cyan #00f0ff | High contrast |
| **vapor** | Soft Pink #ff71ce | Lavender #b967ff | Dreamy retro |
| **mono** | White #ffffff | Gray #666666 | Minimal power |
| **earth** | Amber #f59e0b | Teal #14b8a6 | Organic tech |

---

## Tasks

### Task 1: Create flagship daybreak-hybrid theme

**Files:**
- Create: `prototypes/daybreak-hybrid/index.html`
- Create: `prototypes/daybreak-hybrid/styles.css`
- Create: `prototypes/daybreak-hybrid/objects3d.js`
- Create: `prototypes/daybreak-hybrid/shapes2d.js`
- Create: `prototypes/daybreak-hybrid/README.md`

**Steps:**
1. Create directory structure
2. Build index.html with all effect layers and particle elements
3. Build styles.css with CSS variables, all 4 visual effects, animations
4. Copy and adapt objects3d.js from daybreak-dark-3d
5. Create shapes2d.js for flat shape animations
6. Add README.md with design documentation
7. Test in browser
8. Commit

### Task 2: Create cyberpunk variant

**Files:**
- Create: `prototypes/daybreak-hybrid-cyberpunk/` (copy from flagship)
- Modify: CSS variables for neon pink/cyan palette
- Modify: README.md for variant documentation

### Task 3: Create vapor variant

**Files:**
- Create: `prototypes/daybreak-hybrid-vapor/` (copy from flagship)
- Modify: CSS variables for soft pink/lavender palette
- Modify: README.md for variant documentation

### Task 4: Create mono variant

**Files:**
- Create: `prototypes/daybreak-hybrid-mono/` (copy from flagship)
- Modify: CSS variables for white/gray palette
- Modify: README.md for variant documentation

### Task 5: Create earth variant

**Files:**
- Create: `prototypes/daybreak-hybrid-earth/` (copy from flagship)
- Modify: CSS variables for amber/teal palette
- Modify: README.md for variant documentation

### Task 6: Final verification and commit

**Steps:**
1. Open all 5 variants in browser
2. Verify all effects render correctly
3. Commit all variants
4. Push to remote
