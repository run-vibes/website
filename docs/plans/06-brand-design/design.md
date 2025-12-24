# Brand Design: Daybreak Hybrid Mono Theme

**Date:** 2025-12-23
**Status:** Approved
**Branch:** `brand-design`

---

## Summary

Apply the daybreak-hybrid-mono theme to the Vibes website with a new `/V` logo, monochrome color palette, JetBrains Mono + Inter typography, and full visual effects system. Work proceeds styleguide-first via Ladle, then site-wide application.

---

## Identity

**Brand:** Vibes
**Domain:** vibes.run
**Tagline:** "The studio where AI agents come to life"

### Logo System

| Element | Description |
|---------|-------------|
| **Primary mark** | `/V` (Slash V) — forward slash + bold V |
| **Wordmark** | `vibes.run` in JetBrains Mono |
| **Combined** | `/V vibes.run` or `/Vibes.run` |
| **Favicon/small** | `/V` mark alone, or just `V` |

**Rationale:** The forward slash evokes code paths (`/usr/bin/vibes`), URLs, and forward motion. Combined with a bold V, it creates a developer-native, motion-oriented mark that's minimal and scalable.

### Color Palette

```css
:root {
  /* Backgrounds */
  --bg-primary: #0a0a0b;
  --bg-surface: #111113;
  --bg-alt: #18181b;
  --bg-elevated: #1f1f23;

  /* Accents */
  --accent-primary: #ffffff;
  --accent-secondary: #666666;
  --accent-glow: rgba(255, 255, 255, 0.3);

  /* Text */
  --text-primary: #fafafa;
  --text-secondary: #a1a1aa;
  --text-muted: #71717a;
}
```

| Role | Value | Usage |
|------|-------|-------|
| Background | `#0a0a0b` → `#111113` | Page base, gradient |
| Surface | `#18181b` | Cards, elevated areas |
| Primary accent | `#ffffff` | CTAs, headlines, key elements |
| Secondary accent | `#666666` | Supporting text, `.run` suffix |
| Text primary | `#fafafa` | Headlines, important copy |
| Text secondary | `#a1a1aa` | Body text |
| Text muted | `#71717a` | Captions, metadata |

**Future consideration:** May add a single accent color (teal, coral, or electric blue) for CTAs, or warm up grays for a more approachable feel.

---

## Typography

### Font Stack

```css
--font-display: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
--font-body: 'Inter', system-ui, sans-serif;
```

### Hierarchy

| Element | Font | Weight | Size | Style |
|---------|------|--------|------|-------|
| Hero headline | JetBrains Mono | 800 | 48-72px | Uppercase, tight tracking |
| Section titles | JetBrains Mono | 700 | 32-48px | Uppercase |
| Card titles | JetBrains Mono | 700 | 18-22px | Uppercase |
| Taglines/labels | JetBrains Mono | 600 | 11-14px | Uppercase, wide tracking |
| Body copy | Inter | 400 | 16-18px | Normal case |
| UI elements | JetBrains Mono | 600 | 14px | Buttons, nav, inputs |

### Principles

- **Headlines are loud:** Uppercase, bold, tight letter-spacing (-0.02em)
- **Labels whisper:** Uppercase, wide letter-spacing (0.1em), muted color
- **Body is comfortable:** Inter at 16-18px, 1.6 line-height, secondary color
- **Monospace = brand voice:** Anything that "speaks" as Vibes uses JetBrains Mono
- **Sans = content:** Longer-form reading uses Inter for comfort

### Special Treatments

- CTAs use monospace, uppercase, letter-spaced
- The `.run` in the logo is always secondary gray
- Code-like elements (metrics, tech terms) can use monospace inline

---

## Visual Effects System

### Layering Architecture

```
┌─────────────────────────────────────────┐
│  Layer 6: Content (z-index: 10+)        │  ← Text, cards, UI
├─────────────────────────────────────────┤
│  Layer 5: Scanlines (z-index: 3)        │  ← 8% opacity overlay
├─────────────────────────────────────────┤
│  Layer 4: Particles (z-index: 5)        │  ← 25 floating dots
├─────────────────────────────────────────┤
│  Layer 3: 3D/2D Objects (z-index: 1-2)  │  ← Cubes, shapes
├─────────────────────────────────────────┤
│  Layer 2: Noise texture (z-index: 2)    │  ← 4% grain overlay
├─────────────────────────────────────────┤
│  Layer 1: Geometric grid (z-index: 1)   │  ← 3% line grid
├─────────────────────────────────────────┤
│  Layer 0: Background gradient           │  ← #0a0a0b → #111113
└─────────────────────────────────────────┘
```

### Effect Specifications

| Effect | Implementation | Opacity | Notes |
|--------|---------------|---------|-------|
| **Geometric grid** | CSS linear-gradient, 60px spacing | 3% | White lines |
| **Noise texture** | SVG feTurbulence filter | 4% | mix-blend-mode: overlay |
| **Scanlines** | CSS repeating-gradient, 4px gap | 8% | Subtle CRT feel |
| **Particles** | 25 CSS-animated dots | 30-50% | Float upward, white/gray |
| **3D cubes** | CSS 3D transforms + JS parallax | — | 2 cubes, mouse-reactive |
| **3D pyramid** | CSS 3D transforms + JS parallax | — | 1 pyramid, center-back |
| **2D shapes** | CSS + JS mouse repel | 40-50% | Circle, diamond, rectangle, triangle |

### Performance Considerations

- All effects use CSS transforms (GPU-accelerated)
- Particles use CSS animations (no JS runtime)
- 3D/2D interactivity uses requestAnimationFrame
- Effects container uses `pointer-events: none`
- Implement `prefers-reduced-motion` media query for accessibility

---

## Implementation Approach

### Phase A: Design Tokens & Styleguide (Ladle)

1. Update `src/styles/tokens.css` with daybreak-hybrid-mono values
2. Update `src/styles/global.css` for dark theme base styles
3. Create effect layer components (noise, scanlines, particles, grid)
4. Update existing UI components (Button, Card, Input, etc.) for dark theme
5. Add `/V` logo as SVG component
6. Preview all components in Ladle to validate

### Phase B: Site-wide Application

1. Apply background and effect layers to root layout
2. Update Navbar with new logo and dark styling
3. Update Footer styling
4. Update page sections (hero, services, work, etc.)
5. Test all pages for consistency

### File Changes Summary

| File | Change |
|------|--------|
| `src/styles/tokens.css` | Replace color values, add effect variables |
| `src/styles/global.css` | Dark theme base, font imports |
| `src/components/ui/Logo.tsx` | New — `/V` logo component |
| `src/components/effects/*` | New — Effect layer components |
| `src/components/ui/*.tsx` | Update for dark theme variants |
| `src/routes/*.tsx` | Apply effects, verify styling |

### Verification Checklist

- [ ] `just ladle` — Visual review of all components
- [ ] `just check` — Type checking, linting, tests
- [ ] `just dev` — Full site preview
- [ ] `just e2e` — End-to-end tests still pass

---

## Assets

- Logo explorations: `prototypes/logo-explorations/index.html`
- Reference prototype: `prototypes/daybreak-hybrid-mono/`

---

## Design Decisions

### Why `/V` (Slash V)?

The forward slash is a universal symbol in code (paths, URLs, commands) and suggests forward motion — perfect for a `.run` domain. It's distinctive, scalable, and developer-native.

### Why pure monochrome?

Monochrome projects confidence and minimalism — "we don't need color to stand out." It also provides a strong foundation that can later accept a single accent color if desired.

### Why full visual effects?

The layered effects (noise, scanlines, particles, 3D objects) create an immersive, premium feel that differentiates Vibes from typical agency sites. Performance is maintained through CSS-only implementations where possible.

### Why styleguide-first?

Working in Ladle first ensures each component is validated in isolation before site integration. This catches issues early and creates a living style guide for future development.
