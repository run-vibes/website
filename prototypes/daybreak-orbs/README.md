# Daybreak Orbs

Daybreak theme with floating circular orb elements.

## Design Philosophy

This variant features floating orbs that add depth and movement to the page. The orbs use radial gradients and blur effects to create a soft, atmospheric presence.

## Key Visual Elements

- **Gradient orbs** — Circular elements with radial gradient fills
- **Blur effects** — Soft edges through CSS filter blur
- **Floating animation** — Gentle up/down movement
- **Parallax behavior** — Different speeds create depth

## Technical Notes

Orbs are pure CSS using:
```css
border-radius: 50%;
background: radial-gradient(circle, rgba(255,77,77,0.3) 0%, transparent 70%);
filter: blur(20px);
```

See `../daybreak/README.md` for base theme details.
