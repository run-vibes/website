# Daybreak Lines

**Mood:** Elegant Architectural

An alternative Daybreak animation using animated SVG paths that draw themselves. Minimal, elegant, and sophisticated — like architectural blueprints coming to life.

---

## Visual Identity

Same color palette as Daybreak:

| Element | Value |
|---------|-------|
| Background | `#fafafa` (warm white) |
| Surface | `#ffffff` |
| Primary Accent | `#ff4d4d` (coral) |
| Secondary Accent | `#4338ca` (indigo) |

## Hero Visual: Animated Lines

SVG paths that draw and flow:

**Visual characteristics:**
- Thin SVG paths (1-2px stroke width)
- Architectural/blueprint aesthetic
- Lines connect, branch, and flow in patterns
- Coral accent on key lines, gray (`#d0d0d0`) for structure
- Clean, precise, intentional

**Behavior:**
- Lines draw on page load using stroke-dasharray animation
- Continuous subtle flow along paths after initial draw
- Mouse creates ripple effect through line network
- Some lines pulse or glow briefly

**Technical approach:**
- SVG with stroke-dasharray and stroke-dashoffset animation
- CSS keyframes for draw-in effect
- JavaScript for mouse interaction ripples
- Paths defined as bezier curves for smooth flow

## Interaction Style

Same as Daybreak (crisp shadows, coral/indigo buttons).

## Design Rationale

Lines create a minimal, sophisticated aesthetic that suggests precision and intentionality. The drawing animation reveals the design progressively, creating engagement. Good for audiences who appreciate restraint and elegance over visual complexity. The architectural feel reinforces the "we build things" message.
