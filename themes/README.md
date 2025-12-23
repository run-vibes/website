# Vibes Homepage Prototypes

Three distinct visual directions for the Vibes marketing website, each interpreting the brand's "bold and energetic" personality differently.

---

## Prototype A: "Midnight"

**Mood:** Dark & Electric

A premium, tech-forward aesthetic with deep backgrounds and vibrant accents.

### Visual Identity

| Element | Value |
|---------|-------|
| Background | `#0a0a14` (near-black with blue undertone) |
| Surface | `#12121f` (cards, elevated elements) |
| Primary Accent | `#00d4ff` (electric cyan) |
| Secondary Accent | `#ff2d7a` (hot magenta) |
| Headline Text | `#ffffff` |
| Body Text | `#a0a0b0` |

### Typography
- **Headlines:** Inter or Space Grotesk, 700 weight, tight letter-spacing
- **Body:** Inter, 400 weight, line-height 1.6
- **Accents:** Uppercase, tracked out, smaller size for labels

### Hero Visual: Particle Flow System
Canvas-based animation with interconnected particles that:
- Drift slowly in a field, connected by faint lines when near each other
- React to mouse position (particles gently attract/repel from cursor)
- Glow with cyan/magenta accent colors
- Fade at edges for seamless integration

### Interaction Style
- Cards have subtle cyan glow on hover
- Buttons: Solid cyan primary, ghost outline secondary
- Dividers: Gradient lines (cyan → magenta)
- Scroll: Sections fade up with 20px translate, staggered card timing

### Best For
Teams wanting a premium, cutting-edge impression. Suggests sophistication and technical depth.

---

## Prototype B: "Daybreak"

**Mood:** Light & Bold

A confident, accessible aesthetic with punchy colors on clean backgrounds.

### Visual Identity

| Element | Value |
|---------|-------|
| Background | `#fafafa` (warm white) |
| Surface | `#ffffff` (cards with subtle shadow) |
| Primary Accent | `#ff4d4d` (vibrant coral) |
| Secondary Accent | `#4338ca` (deep indigo) |
| Headline Text | `#111111` |
| Body Text | `#555555` |

### Typography
- **Headlines:** Satoshi or General Sans, 800 weight, slightly condensed
- **Body:** System sans-serif stack, 400 weight
- **Accents:** Bold, coral-colored highlights for emphasis

### Hero Visual: Geometric Shapes
SVG-based animated composition featuring:
- Bold overlapping shapes (circles, rounded rectangles, abstract forms)
- Shapes slowly rotate, scale, and shift position
- Mouse movement creates subtle parallax layers
- Solid fills in coral, indigo, and soft grays

### Interaction Style
- Cards have crisp shadows with clear edges
- Buttons: Solid coral primary, indigo outline secondary
- Section backgrounds alternate: white → `#f5f5f5` → white
- Scroll: Sections slide in from left/right, cards scale up on reveal

### Best For
Teams wanting an approachable yet confident feel. More accessible, energetic, and optimistic.

---

## Prototype C: "Aurora"

**Mood:** Gradient-Rich

A flowing, dynamic aesthetic with continuous color transitions.

### Visual Identity

| Element | Value |
|---------|-------|
| Background | Gradient: `#1a1a2e` → `#16213e` → `#0f3460` |
| Surface | `rgba(255,255,255,0.05)` with backdrop blur |
| Gradient Range | Purple `#a855f7` → Teal `#14b8a6` → Gold `#f59e0b` |
| Headline Text | `#ffffff` |
| Body Text | `#d1d5db` |

### Typography
- **Headlines:** Clash Display or Cabinet Grotesk, 700 weight
- **Body:** Inter, 400 weight
- **Accents:** Gradient text effect on key headlines (purple → teal)

### Hero Visual: Generative Mesh Gradient
WebGL or canvas-based mesh gradient that:
- Continuously morphs between color states (slow, organic transitions)
- Responds to mouse position (colors shift and flow toward cursor)
- Creates an aurora borealis / northern lights effect
- Soft blur and glow create depth

### Interaction Style
- Cards use glassmorphism: translucent backgrounds, subtle borders, backdrop blur
- Buttons: Gradient fills (purple→teal) primary, glass effect secondary
- Dividers: Soft gradient fades rather than hard lines
- Scroll: Sections emerge with blur-to-clear transition, parallax on background

### Best For
Teams wanting a distinctive, artistic impression. Feels modern and creative without being corporate.

---

## Comparison Matrix

| Aspect | Midnight | Daybreak | Aurora |
|--------|----------|----------|--------|
| **Mood** | Premium, tech-forward | Confident, accessible | Artistic, flowing |
| **Background** | Dark | Light | Dark gradient |
| **Hero Visual** | Particles | Geometry | Mesh gradient |
| **Card Style** | Glow effects | Crisp shadows | Glassmorphism |
| **Animation Feel** | Subtle, elegant | Snappy, energetic | Dreamy, organic |
| **Best Audience** | Technical leaders | Business executives | Creative/innovation leads |

---

## Shared Elements

All three prototypes share:

- **Headline:** "The studio where AI agents come to life"
- **Subheadline:** "Delivering impact you can measure"
- **Sections:** Hero → Social Proof → Services → Featured Work → Industries → Insights → Final CTA
- **Interactivity:** Hover states, scroll animations, mouse-reactive hero visuals
- **Content:** Same copy, services, and placeholder case studies

This ensures you're comparing visual direction, not content differences.

---

## Directory Structure

```
prototypes/
├── shared/
│   ├── reset.css
│   ├── animations.js
│   └── content.js
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
