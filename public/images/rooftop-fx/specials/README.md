# Rooftop signature effects (PixelFX)
Source: patch-gg/pixelfx, revision a84159688af3ca37a4be05a0d422b94451b2e24e.
MIT license and Sprite Fusion attribution: ../LICENSE.txt and ../NOTICE.md.
Generated without actors/background with seed 9 at 20 FPS. No runtime package or Claude integration.
Reproduce: node scripts/build-rooftop-special-fx.mjs [installed-pixelfx-directory]
The build script specifies palettes, pivots and selected frames. PNG + manifest.json are served by the game.
- cannon: arcane/arcane-beam, teal; horizontal shaft aligned to attack direction.
- homerun: melee/spin-slash, gold; starts at the active arc, not the original windup.
- thunder: lightning/lightning-strike, starts at frame 16 (strike) on the ground.
- rush: melee/uppercut; one animation per confirmed special pulse (also on whiff, no fake damage).
- lance: ice/ice-lance, recolored red/pink; visual tip within special reach.
- counter: holy/sunburst, gold; appears only on a successful counter, trimmed to 26 frames.
- charge: arcane/spell-charge, teal; preliminary gathering effect before the first strike.
Reduced motion uses a stationary, subdued representative frame. Failed sheet loads fall back to vector effects.
