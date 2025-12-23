# Daybreak Blobs

**Mood:** Playful Modern

An alternative Daybreak animation using organic morphing shapes instead of sharp geometry. Softer, more playful, inspired by Stripe's blob animations.

---

## Visual Identity

Same color palette as Daybreak:

| Element | Value |
|---------|-------|
| Background | `#fafafa` (warm white) |
| Surface | `#ffffff` |
| Primary Accent | `#ff4d4d` (coral) |
| Secondary Accent | `#4338ca` (indigo) |

## Hero Visual: Morphing Blobs

Canvas or SVG-based organic shapes that continuously morph:

**Shape characteristics:**
- 3-5 large organic shapes with smooth, curved edges
- Soft, rounded — opposite of sharp geometry
- Colors: coral, indigo, soft pink (`#ffa0a0`), light blue (`#a0d4ff`)
- Shapes overlap creating color blending zones

**Behavior:**
- Continuous morphing (shapes "breathe" and flow)
- Slow movement across hero area
- Mouse proximity causes subtle bulge/attraction
- Bezier curves animate between random control points

**Technical approach:**
- Canvas with animated bezier curves, OR
- SVG paths with CSS/SMIL morphing animation
- Use simplex noise to drive organic shape changes

## Interaction Style

Same as Daybreak (crisp shadows, coral/indigo buttons).

## Design Rationale

Blobs create a friendlier, more approachable feel than sharp geometry. The organic movement suggests creativity and fluidity — good for audiences who find geometric shapes too corporate or rigid. Still maintains Daybreak's bold color palette and confident typography.
