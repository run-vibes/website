# Daybreak Hybrid

A dark-mode theme combining 2D and 3D objects with layered visual effects.

## Design Philosophy

This flagship hybrid theme layers multiple visual effects to create depth and atmosphere while mixing flat 2D shapes with rotating 3D objects. The result is a complex, immersive visual experience that maintains clarity and performance through CSS-only effects.

## Color Palette

| Role | Color | Hex |
|------|-------|-----|
| Background Primary | Near Black | `#0a0a0b` |
| Background Surface | Dark Gray | `#111113` |
| Accent Primary | Coral | `#ff5757` |
| Accent Secondary | Indigo | `#818cf8` |
| Text Primary | Off White | `#fafafa` |

## Typography

**Display Font:** JetBrains Mono (monospace)
- Headlines: Uppercase, tight letter-spacing (-0.03em)
- Labels: Uppercase with wide letter-spacing (0.15em)

**Body Font:** Inter
- Paragraphs: Regular weight, relaxed line-height (1.6)

## Visual Effects

### Layer 1: Geometric Grid
Subtle 60px grid pattern at 3% opacity using CSS linear gradients.

### Layer 2: Noise Texture
SVG-based fractal noise filter at 4% opacity with overlay blend mode.

### Layer 3: Objects
- **3D:** Cubes and pyramids with CSS transforms and mouse parallax
- **2D:** Circles, diamonds, rectangles, triangles with CSS animations

### Layer 4: Particles
25 floating particles with glow effects, alternating between coral and indigo.

### Layer 5: Scanlines
Horizontal lines every 4px at 8% opacity for retro CRT aesthetic.

## Key Features

- **Mixed dimensionality** — 3D cubes/pyramids alongside flat geometric shapes
- **Mouse interactivity** — 3D objects tilt toward cursor, 2D shapes repel away
- **Mono typography** — Terminal-style fonts for tech-forward aesthetic
- **Layered atmosphere** — Five effect layers create depth without canvas

## Technical Notes

All visual effects are CSS-only (no WebGL/canvas) for broad compatibility:
- Effects use `pointer-events: none` to prevent interaction blocking
- Animations leverage `will-change: transform` for GPU acceleration
- Fixed positioning with high z-index for effect layers
- SVG data URIs for noise texture (no external assets)

## Color Variants

This is the flagship "current" color scheme. See related variants:
- `daybreak-hybrid-cyberpunk` — Neon pink + electric cyan
- `daybreak-hybrid-vapor` — Soft pink + lavender
- `daybreak-hybrid-mono` — White + gray
- `daybreak-hybrid-earth` — Amber + teal
