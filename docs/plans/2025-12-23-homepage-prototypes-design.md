# Homepage Prototypes Design

**Date:** 2025-12-23
**Status:** Approved
**Goal:** Create three distinct full-page homepage prototypes to explore visual directions for the Vibes marketing website.

---

## Summary

Three homepage prototypes, each with a different visual mood, color palette, and hero animation style. All prototypes implement the full homepage structure from the PRD with light interactivity (hover states, scroll animations, mouse-reactive hero visuals).

| Prototype | Mood | Hero Visual | Key Colors |
|-----------|------|-------------|------------|
| **Midnight** | Dark & Electric | Particle flow system | Navy/black + cyan/magenta |
| **Daybreak** | Light & Bold | Geometric shapes | White + coral/indigo |
| **Aurora** | Gradient-Rich | Generative mesh | Purple → teal → gold gradients |

---

## Requirements

### Scope
- Full homepage with all PRD sections (not simplified wireframes)
- Light interactivity: hover states, scroll animations, mouse-reactive heroes
- No build step required — pure HTML/CSS/JS
- Self-contained prototypes for easy comparison

### Sections (All Prototypes)
1. Hero (headline, subhead, CTAs, dynamic visual)
2. Social Proof Bar (placeholder logos / metrics)
3. Services Overview (4 service cards)
4. Featured Work (2-3 case study cards)
5. Industry Focus (4-column grid)
6. Insights Preview (2-3 article cards + newsletter CTA)
7. Final CTA Section

### Shared Content
All prototypes use identical copy to ensure visual comparison:
- Headline: "The studio where AI agents come to life"
- Subheadline: "Delivering impact you can measure"
- Services: Agent Development, AI Strategy, Product Development, Workshops
- 3 placeholder case studies
- 4 industries: Fintech, E-commerce, SaaS, Professional Services

---

## Prototype A: "Midnight"

### Visual Identity
- **Background:** `#0a0a14` (near-black with blue undertone)
- **Surface:** `#12121f`
- **Primary accent:** `#00d4ff` (electric cyan)
- **Secondary accent:** `#ff2d7a` (hot magenta)
- **Text:** `#ffffff` headlines, `#a0a0b0` body

### Typography
- Headlines: Inter/Space Grotesk, 700 weight, tight tracking
- Body: Inter, 400 weight, 1.6 line-height
- Labels: Uppercase, tracked out

### Hero Visual
Canvas-based particle flow system:
- Interconnected particles with faint connecting lines
- Mouse interaction: particles attract/repel from cursor
- Cyan/magenta glow effects
- Edge fade for content integration

### Interaction Style
- Card hover: subtle cyan glow
- Buttons: solid cyan primary, ghost secondary
- Dividers: gradient lines (cyan → magenta)
- Scroll: fade up + 20px translate, staggered cards

---

## Prototype B: "Daybreak"

### Visual Identity
- **Background:** `#fafafa` (warm white)
- **Surface:** `#ffffff` with shadows
- **Primary accent:** `#ff4d4d` (vibrant coral)
- **Secondary accent:** `#4338ca` (deep indigo)
- **Text:** `#111111` headlines, `#555555` body

### Typography
- Headlines: Satoshi/General Sans, 800 weight, condensed
- Body: System sans-serif, 400 weight
- Accents: Bold coral highlights

### Hero Visual
SVG-based geometric composition:
- Bold overlapping shapes (circles, rounded rectangles)
- Slow rotation, scaling, position shifts
- Mouse parallax on layers
- Solid fills: coral, indigo, grays

### Interaction Style
- Card hover: crisp shadow expansion
- Buttons: solid coral primary, indigo outline secondary
- Backgrounds: alternating white / light gray sections
- Scroll: slide in from sides, scale up on reveal

---

## Prototype C: "Aurora"

### Visual Identity
- **Background:** Gradient `#1a1a2e` → `#16213e` → `#0f3460`
- **Surface:** `rgba(255,255,255,0.05)` with backdrop blur
- **Gradient accents:** `#a855f7` → `#14b8a6` → `#f59e0b`
- **Text:** `#ffffff` headlines, `#d1d5db` body

### Typography
- Headlines: Clash Display/Cabinet Grotesk, 700 weight
- Body: Inter, 400 weight
- Key headlines: gradient text effect (purple → teal)

### Hero Visual
WebGL/canvas mesh gradient:
- Continuous color morphing (organic transitions)
- Mouse interaction: colors flow toward cursor
- Aurora borealis / northern lights effect
- Soft blur and glow for depth

### Interaction Style
- Cards: glassmorphism (translucent, blur, subtle borders)
- Buttons: gradient primary, glass secondary
- Dividers: soft gradient fades
- Scroll: blur-to-clear reveal, background parallax

---

## Technical Architecture

### Directory Structure
```
prototypes/
├── shared/
│   ├── reset.css          # Normalize styles
│   ├── animations.js      # Scroll observer, easing utilities
│   └── content.js         # Shared content data
├── midnight/
│   ├── index.html
│   ├── styles.css
│   └── particles.js
├── daybreak/
│   ├── index.html
│   ├── styles.css
│   └── shapes.js
└── aurora/
    ├── index.html
    ├── styles.css
    └── gradient.js
```

### Scroll Animation System
Lightweight Intersection Observer wrapper:
- Detects section viewport entry
- Applies CSS classes to trigger transitions
- Supports stagger delays for child elements
- Each prototype defines its own animation CSS

### No Build Step
Pure HTML/CSS/JS for fast iteration. Open any `index.html` directly in browser.

---

## Success Criteria

- [ ] Three visually distinct prototypes
- [ ] All PRD sections implemented in each
- [ ] Hover states on all interactive elements
- [ ] Scroll animations functional
- [ ] Hero visuals respond to mouse
- [ ] Can open directly in browser (no build required)
- [ ] Shared content ensures fair comparison

---

## Next Steps

1. Set up directory structure and shared utilities
2. Implement Midnight prototype
3. Implement Daybreak prototype
4. Implement Aurora prototype
5. Review and compare all three
6. Select direction for production implementation
