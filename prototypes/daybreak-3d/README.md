# Daybreak 3D Theme

The Daybreak theme enhanced with floating 3D CSS cubes that respond to mouse movement.

## Design Philosophy

Building on Daybreak's clean, bold aesthetic, this variant adds depth through CSS 3D-transformed cubes that float in the hero section. The cubes rotate continuously and tilt in response to cursor position, creating an engaging, interactive experience.

## Color Palette

Inherits from Daybreak:

| Role | Color | Hex |
|------|-------|-----|
| Background Primary | Off-White | `#fafafa` |
| Accent Primary | Coral Red | `#ff4d4d` |
| Accent Secondary | Deep Indigo | `#4338ca` |
| Cube Neutral | Light Gray | `#c8c8c8` |

## Key Visual Elements

- **3D CSS cubes** — Six-faced cubes using `transform-style: preserve-3d`
- **Mouse-reactive tilt** — Cubes tilt based on cursor position
- **Continuous rotation** — Smooth Y-axis rotation animation
- **Floating bob** — Sine-wave vertical movement for organic feel
- **Perspective depth** — 1000px perspective for natural 3D appearance

## Technical Implementation

```javascript
// Mouse tilt influence
const tiltX = (mouse.y - 0.5) * 20;
const tiltY = (mouse.x - 0.5) * 20;

// Combined transform
transform: translateY(bob) rotateX(rot + tiltX) rotateY(rot + tiltY)
```

## Variants

This theme has multiple color variants:
- `daybreak-3d-teal-gold` — Teal primary with gold accents
- `daybreak-3d-ocean` — Ocean blue color palette
- `daybreak-3d-earth` — Warm earthy tones
- `daybreak-3d-emerald` — Green/emerald theme
- `daybreak-3d-sunset` — Orange/pink sunset colors
- `daybreak-3d-forest` — Deep green forest palette
- `daybreak-3d-slate-rose` — Slate gray with rose accents
- `daybreak-3d-electric` — Purple/cyan electric colors
