# Daybreak Hybrid Design

**Date:** 2025-12-23
**Status:** Complete
**Goal:** Create a hybrid dark theme combining 2D/3D objects with layered visual effects, then generate 5 color variants.

---

## Summary

The Daybreak Hybrid theme combines flat 2D shapes with CSS 3D-transformed objects on a dark background, enhanced by multiple visual effect layers (noise, scanlines, particles, geometric grid). Five color variants provide different aesthetic directions while sharing the same architecture.

| Variant | Primary | Secondary | Vibe |
|---------|---------|-----------|------|
| **current** | Coral #ff5757 | Indigo #818cf8 | Warm tech |
| **cyberpunk** | Neon Pink #ff2d92 | Electric Cyan #00f0ff | High contrast |
| **vapor** | Soft Pink #ff71ce | Lavender #b967ff | Dreamy retro |
| **mono** | White #ffffff | Gray #666666 | Minimal power |
| **earth** | Amber #f59e0b | Teal #14b8a6 | Organic tech |

---

## Architecture

### Effect Layering (back to front)

1. **Base:** Dark gradient background (#0a0a0b → #111113)
2. **Layer 1:** Geometric grid pattern (subtle lines at 3% opacity)
3. **Layer 2:** Noise texture (SVG filter, 5% opacity)
4. **Layer 3:** 3D objects (cubes, pyramids) + flat shapes
5. **Layer 4:** Floating particles (CSS pseudo-elements)
6. **Layer 5:** Scanlines overlay (repeating gradient, 8% opacity)

### Object Composition

- **3D Objects:** 2 cubes (left/right), 1 pyramid (center-back) — CSS 3D transforms with mouse parallax
- **Flat 2D Shapes:** Circle (pulsing), diamond (rotating outline), rectangle (floating), triangle (outline) — mouse repel effect

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

**Particles:** 20-30 small dots (2-4px), floating upward, accent colors at 30-50% opacity

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

## File Structure

```
prototypes/
├── daybreak-hybrid/           # Flagship (coral/indigo)
├── daybreak-hybrid-cyberpunk/ # Neon pink/cyan variant
├── daybreak-hybrid-vapor/     # Soft pink/lavender variant
├── daybreak-hybrid-mono/      # White/gray variant
└── daybreak-hybrid-earth/     # Amber/teal variant
```

Each variant contains:
- `index.html` — Complete page with all effect layers
- `styles.css` — CSS custom properties for theming, all effects
- `objects3d.js` — 3D cube/pyramid rendering with mouse parallax
- `shapes2d.js` — 2D flat shapes with mouse repel effect
- `README.md` — Variant-specific documentation

---

## Design Decisions

### Why hybrid 2D/3D?
Combining flat shapes with 3D objects creates visual depth without the full complexity of WebGL. CSS 3D transforms are performant and widely supported.

### Why multiple effect layers?
Each layer (noise, scanlines, particles, grid) adds subtle texture that prevents the dark background from feeling flat. The low opacity values ensure they enhance rather than distract.

### Why CSS custom properties for variants?
A single `:root` block change swaps the entire color palette, making variant creation trivial. Each variant only differs in ~10 CSS variables.

### Why mouse interactivity?
- 3D objects: Parallax tilt creates subtle depth perception
- 2D shapes: Repel effect adds playfulness without being distracting

---

## Implementation Notes

Built with vanilla HTML/CSS/JavaScript for maximum portability. No build step required — prototypes can be opened directly in a browser.

**To view:** Run `just prototypes` to open all variants in the browser.
