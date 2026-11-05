# Rooftop impact effects

Source: https://github.com/patch-gg/pixelfx
Revision: a84159688af3ca37a4be05a0d422b94451b2e24e (0.3.0)
License: MIT; see LICENSE.txt and NOTICE.md in this directory.

Selected effects: impacts/hit-spark, impacts/crit-hit, impacts/shield-block.
Generated with the upstream renderer (no actor or background):

    node tools/render.mjs impacts/hit-spark impacts/crit-hit impacts/shield-block --sheet --no-actor --bg none --out <project>/output/pixelfx

Copy the three generated PNG sheets into this directory. If regenerating with a
different version, reconcile frame count, dimensions and columns from each JSON
sidecar with utils/rooftopEffects.ts. The renderer positions the impact centre
at chest height and compresses playback to 0.4/0.6/0.5 seconds respectively.
No pixelfx runtime or Claude integration is loaded by the game.
