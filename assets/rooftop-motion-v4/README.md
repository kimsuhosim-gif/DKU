# Weapon motion revision — 2026-11-05

Generated with built-in image_gen using the corresponding character's existing
`rooftop-<id>-motion-v3.png` neutral pose as the identity reference. Source sheets
are preserved here; runtime sheets are in `public/images/*-heavy-v4.png`.

These are **four generated key poses per character**, not a completed 14-frame
interpolated animation. Existing light attack frames are selected and timed
separately for each weapon and combo step. No poses were made by rotating limbs,
warping pixels, or drawing replacement characters in code.

## Shared prompt / identity lock

Exactly four separate whole-body sprites in a 2x2 grid, equal cells, generous
gutters. Use the supplied baseline as the exact identity source, not loose
inspiration. Preserve face, cap, clothing, palette, proportions, weapon size,
outline weight and painted cartoon style. Only change pose and weight. All face
screen-right; maintain the same shoulder/hand ownership throughout. Same scale
and foot baseline. No labels, borders, effects, motion lines or shadows.

For two-handed weapons, the screen-left shoulder supplies the rear power hand;
the other hand supports the shaft without exchanging grip order. For the pan,
the other arm remains empty. For boxing, the opposite glove protects the cheek.

## Per-character key-pose briefs

| Character | Anticipation | Contact | Follow-through | Recovery |
|---|---|---|---|---|
| hyomin | golf backswing coil | rising iron swing | high golf finish, rear heel raised | lower iron |
| jaeyeop | bat behind rear shoulder | chest-height horizontal home-run swing | bat wraps around shoulder | two-hand guard |
| seongtae | hammer raised overhead | deep knee bend, downward hammer impact | low compressed hold | haul hammer up |
| manjong | crouch, rear glove by hip | rear-hand rising uppercut | compact raised glove | boxing guard |
| yeonseong | withdraw horizontal spear | long forward lunge and linear thrust | extension hold | withdraw to diagonal guard |
| moseongjin | pan by rear shoulder | broad pan face strikes right | diagonal low follow-through | low pan guard |

Image generation returned some poses in a different order. Packing explicitly
orders the approved source cells; it does not invent in-between frames. The
glove sheet's raised pose is used for contact; its compact pose is recovery.

## Reproduce / validate

- `python scripts/pack-rooftop-keyposes.py` (Pillow + NumPy)
- `node scripts/check-rooftop.mjs` — P0 combat rules and 20 seeded matches
- `node scripts/check-rooftop-visuals.mjs` — frame timing, assets, 18 input-only bot matches against 2d62a8b
- `npm run typecheck` / `npm run build`

Packing removes low-alpha noise and connected light background; preserves
enclosed white hats/shoes; applies one shared scale/translation per character;
exports transparent atlases, contact sheets, white-background GIF previews and
a manifest under `output/combat-v4/review/`. Original sprites remain unchanged.

Actual game renderer comparison is in `output/combat-v4/review.html` locally.
That fixed-pose art fixture is not evidence of gameplay or victory. Input-only
simulation results are separately recorded in `output/combat-v4/bot-results.json`.
No measured browser FPS or independent art review is claimed.
