# Rooftop painted assets v2

Generated with the built-in image generation tool. Original generated files are
preserved outside this repository. Runtime assets live in `public/images`.

## Stage

`rooftop-painted-stage-v2.png`: 1536 x 1024 hand-painted Seoul rooftop at sunset,
weathered teal floor, warm skyline, perimeter fencing, rooftop door and water
tank. Empty playable floor; no interior collision props.

## Fighters

All six PNG atlases are 1536 x 1024, four columns and two rows, 384 x 512 per cell.
Frame order: ready, left stride, right stride, windup, impact, recovery, hurt,
victory. These are eight key poses, not full multi-frame cel animation clips.

| Asset prefix | Weapon |
| --- | --- |
| rooftop-hyomin | Golf iron |
| rooftop-jaeyeop | Wooden bat |
| rooftop-seongtae | Cobalt hammer |
| rooftop-manjong | Orange gloves |
| rooftop-yeonseong | Red spear |
| rooftop-moseongjin | Gold-rimmed pan |

## Reproduction prompt specification

Premium hand-inked Korean comic cel animation, not 3D. Retain identity and
clothing from the corresponding v1 character reference. Exact four-column,
two-row atlas with eight full-body poses in the order above. Face right in
three-quarter view. Keep body scale consistent and feet near 94% of cell height.
Held weapon appears in every pose, anatomically connected to the hands.
True transparent alpha outside the ink outlines; no background, cast shadow,
glow, grid or lettering. Every character and weapon must fit inside its cell.

Targeted follow-up edits removed the spear character's backdrop and shortened
or foreshortened the bat and iron impact poses to fit their cells. No offline
pixel cleanup was applied.

## Runtime

Canvas2D renderer uses depth-sorted sprites, perspective floor mapping, camera
tracking, ground shadows, jump elevation and impact sparks. Attack windup is
120 ms; hit resolution is delayed until the impact pose. Existing gameplay and
input APIs remain compatible. The previous 3D asset studies are not used.
