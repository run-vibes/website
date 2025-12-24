# Prototype Refinements Design

**Date:** 2025-12-23
**Status:** Approved
**Goal:** Expand Midnight and Daybreak prototypes with light/dark variants and alternative hero animations.

---

## Summary

Create 6 new prototype variations to explore visual directions:

| Prototype | Base | Description |
|-----------|------|-------------|
| **Midnight Light** | Midnight | Particle system on light background |
| **Daybreak Dark** | Daybreak | Geometric shapes on dark background |
| **Daybreak Blobs** | Daybreak | Organic morphing shapes |
| **Daybreak 3D** | Daybreak | CSS 3D floating/rotating objects |
| **Daybreak Lines** | Daybreak | Animated SVG path drawing |
| **Daybreak Orbs** | Daybreak | Floating gradient orbs |

---

## Midnight Light

**Mood:** Clean Tech

Particle system aesthetic on light background. Futuristic and clean.

**Key colors:**
- Background: `#f8f9fc` (cool white)
- Accents: `#00b8e6` (deeper cyan), `#e6006a` (deeper magenta)
- Text: `#0a0a14` primary, `#5a5a6a` secondary

**Adjustments from Midnight:**
- Reduced glow effects (subtle shadows instead)
- Darker connection line opacity for visibility
- Cards use shadow expansion instead of glow-on-hover
- Frosted white navigation with blur

---

## Daybreak Dark

**Mood:** Bold Premium

Geometric shapes on dark background. Bold and sophisticated.

**Key colors:**
- Background: `#1a1a24` (warm charcoal)
- Accents: `#ff6b6b` (brighter coral), `#6366f1` (brighter indigo)
- Text: `#ffffff` primary, `#a0a0a8` secondary

**Adjustments from Daybreak:**
- Shadows become subtle glows
- Cards get soft border glow on hover
- Brighter shape fills for dark contrast
- Shapes gain subtle glow effect

---

## Daybreak Animation Alternatives

All alternatives use Daybreak's color palette and component styling. Only the hero animation changes.

### Blobs

**Visual:** 3-5 large organic shapes with smooth curves that continuously morph.

**Behavior:**
- Shapes breathe and flow
- Mouse proximity causes bulge/attraction
- Overlapping creates color blending

**Tech:** Canvas bezier curves or SVG path morphing

### 3D Objects

**Visual:** Geometric primitives (cubes, spheres, tori) with CSS 3D transforms.

**Behavior:**
- Slow rotation on multiple axes
- Gentle floating bob motion
- Mouse tilts perspective slightly

**Tech:** Pure CSS 3D transforms, no WebGL

### Lines

**Visual:** Thin SVG paths that draw themselves. Architectural/blueprint aesthetic.

**Behavior:**
- Draw-in animation on page load
- Continuous subtle flow along paths
- Mouse creates ripple through network

**Tech:** SVG stroke-dasharray animation

### Orbs

**Visual:** 5-8 soft circular gradients floating and overlapping.

**Behavior:**
- Slow drift across hero
- Mouse attracts nearby orbs
- Subtle breathing/pulsing size

**Tech:** CSS radial gradients or simple canvas

---

## Directory Structure

```
prototypes/
├── midnight/          # existing (dark particles)
├── midnight-light/    # NEW (light particles)
├── daybreak/          # existing (light geometry)
├── daybreak-dark/     # NEW (dark geometry)
├── daybreak-blobs/    # NEW (light morphing blobs)
├── daybreak-3d/       # NEW (light 3D objects)
├── daybreak-lines/    # NEW (light animated lines)
├── daybreak-orbs/     # NEW (light gradient orbs)
├── aurora/            # existing (gradient mesh)
└── shared/            # existing utilities
```

---

## Implementation Notes

- All variants reuse shared content.js and animations.js
- HTML structure identical across variants
- Only CSS colors and hero JS differ per variant
- Each variant should be self-contained and viewable independently
