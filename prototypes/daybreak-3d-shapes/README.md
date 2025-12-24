# Daybreak 3D Shapes

Extended 3D variant with cubes, wireframes, and pyramids for maximum visual variety.

## Design Philosophy

This variant expands the 3D element library beyond simple cubes to include wireframe cubes and pyramids. Each shape type has distinct visual characteristics while sharing the same animation behaviors.

## Shape Types

| Shape | Description |
|-------|-------------|
| Cube | Solid six-faced cubes with semi-transparent fills |
| Wireframe | Edge-only cubes showing just the border lines |
| Pyramid | Four-sided pyramids with triangular faces |

## Color Classes

Shapes can be assigned one of three color classes:
- `primary` — Main accent color (coral/red tones)
- `secondary` — Supporting accent (indigo/purple tones)
- `tertiary` — Neutral accent (gray tones)

## Technical Details

All shapes share:
- Mouse-reactive tilt (±15° based on cursor)
- Continuous rotation animation
- Sine-wave bobbing motion
- CSS `transform-style: preserve-3d`
- Base size: 80px (scaled 8-14x)
