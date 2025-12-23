# Daybreak 3D

**Mood:** Premium Dimensional

An alternative Daybreak animation using CSS 3D transforms for depth and dimension. More premium and sophisticated, with objects that rotate in 3D space.

---

## Visual Identity

Same color palette as Daybreak:

| Element | Value |
|---------|-------|
| Background | `#fafafa` (warm white) |
| Surface | `#ffffff` |
| Primary Accent | `#ff4d4d` (coral) |
| Secondary Accent | `#4338ca` (indigo) |

## Hero Visual: 3D Floating Objects

CSS 3D transforms creating depth without WebGL:

**Shape characteristics:**
- Geometric primitives: cubes, spheres (approximated), tori, cylinders
- Built with CSS 3D transforms (transform-style: preserve-3d)
- Soft shadows cast on an invisible "floor" plane
- Colors: muted coral, indigo, white, light gray

**Behavior:**
- Objects slowly rotate on multiple axes
- Gentle floating motion (subtle up/down bob)
- Mouse movement tilts the overall perspective slightly
- Staggered timing creates organic, non-mechanical rhythm

**Technical approach:**
- Pure CSS 3D transforms (no WebGL/Three.js)
- Each shape is a div with transformed child faces
- requestAnimationFrame for smooth rotation updates
- CSS perspective on container for depth

## Interaction Style

Same as Daybreak (crisp shadows, coral/indigo buttons).

## Design Rationale

3D objects create a sense of premium craftsmanship and attention to detail. The dimensional depth suggests sophistication and forward-thinking — good for technical audiences who appreciate subtle complexity. The CSS-only approach keeps it lightweight and performant.
