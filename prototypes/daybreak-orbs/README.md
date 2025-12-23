# Daybreak Orbs

**Mood:** Soft Luminous

An alternative Daybreak animation using floating gradient orbs. Dreamy and approachable — simpler than Aurora's mesh gradient but with beautiful color interplay.

---

## Visual Identity

Same color palette as Daybreak:

| Element | Value |
|---------|-------|
| Background | `#fafafa` (warm white) |
| Surface | `#ffffff` |
| Primary Accent | `#ff4d4d` (coral) |
| Secondary Accent | `#4338ca` (indigo) |

## Hero Visual: Gradient Orbs

Floating circular gradients with soft edges:

**Visual characteristics:**
- 5-8 soft circular gradients (no hard edges)
- Radial gradients that fade from center outward to transparent
- Overlapping orbs create beautiful color mixing
- Colors: coral, indigo, soft pink, lavender, peach
- Dreamy, ethereal quality

**Behavior:**
- Orbs float slowly, drifting across hero area
- Mouse gently attracts nearby orbs
- Size pulses subtly (breathing effect)
- Random but smooth velocity changes
- Orbs wrap around edges

**Technical approach:**
- CSS radial gradients with transform animation, OR
- Canvas with radial gradient fills
- Simple physics: position, velocity, slight attraction to mouse
- Blur filter on orbs for extra softness

## Interaction Style

Same as Daybreak (crisp shadows, coral/indigo buttons).

## Design Rationale

Orbs create a warm, approachable feel that's more controlled than blobs but more dynamic than geometry. The soft gradients and color mixing suggest creativity and warmth. Good for audiences who want something visually interesting but not overwhelming. Simpler to implement than Aurora's full mesh gradient while achieving similar color-play effects.
