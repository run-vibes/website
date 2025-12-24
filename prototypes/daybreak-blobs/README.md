# Daybreak Blobs

Daybreak theme with organic, animated blob shapes.

## Design Philosophy

This variant replaces geometric elements with soft, organic blob shapes. The blobs use CSS animations to morph between states, creating a fluid, living feel that contrasts with the bold typography.

## Key Visual Elements

- **Morphing blobs** — CSS keyframe animations that smoothly transform shapes
- **Gradient fills** — Multi-stop gradients within blob shapes
- **Layered composition** — Multiple blobs at different depths
- **Organic motion** — Slow, breathing-like animations

## Technical Notes

Blobs are created using `border-radius` with multiple values:
```css
border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
```

Animation transitions between different radius values for morphing effect.

See `../daybreak/README.md` for base theme details.
