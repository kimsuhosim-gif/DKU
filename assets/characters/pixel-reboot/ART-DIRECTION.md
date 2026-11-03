# RE09 pixel game reboot

Reference workflow: https://successwiki.io/guides/minimax-design-game-character-pixel-guide

The reference covers character design, consistent variants, pixel reference sheets and illustrative video. It does not supply a playable game engine. Use its reference-first art workflow; implement gameplay independently.

## Fixed character identity

Hyomin: adult Korean man, friendly round face, black rectangular glasses, short black hair, white cap with navy 09, charcoal zip jacket, beige trousers, white shoes. Preserve identity across directions and animations. No borrowed third-party game character assets.

## Asset contract

- Player atlas: 4 columns by 4 rows, transparent background, same scale and feet baseline per cell.
- Rows: down, left, right, up. Columns: idle, left step, passing, right step.
- Character rendering uses pixelated sampling.
- Character artwork and environment remain separate so actual gameplay can move characters.
- Do not substitute generated video for interactive movement or collision.
- Existing image generation only; no new paid service or subscription.

## Validation

Inspect sprite identity, alpha, grid boundaries, walking loop and in-game size. Verify keyboard and touch controls, collision, objective completion, restart, persistence if implemented, and mobile layout.

## Selected game: Hyomin's Night Shift Escape

User chose a pixel action game where Hyomin fights monsters and grows stronger. New entry: `#/pixel`; the demolition game remains at `#/game`.

- WASD / arrow keys or touch joystick movement; automatic nearest-enemy book projectile.
- Space / Shift or DASH button: brief invulnerability and movement burst, three-second cooldown.
- Slime and bat enemies drop collectible experience; level-up pauses action for an upgrade choice.
- Five upgrades: damage, attack speed, movement speed, recovery, range.
- Boss arrives after 90 seconds. Defeat it to win; zero health ends the run.
- Highest kill count persists locally; current run does not persist.
- Built-in image generation produced original player atlas, enemy atlas and campus environment. No MiniMax purchase or external paid API was used.
- Validation: `node scripts/check-pixel-survivor.mjs`, TypeScript check, production build, desktop and 390px mobile browser screenshots, actual movement/dash/pause and auto-attack checks.

## Office combat revision

The setting is now a nighttime office using `pixel-office.png`. The original campus artwork remains unused for rollback. Stapler projectiles replace books; coffee upgrades add periodic area bursts and chair upgrades add nearby defensive damage with orbiting chair visuals. Thirty-second waves add more enemies and ranged attacks; bat enemies show a directional warning before charging. Boss health is 1400 with radial projectile attacks. The office edition uses a separate local best-score key because difficulty changed. XP bar CSS width expression was corrected. Additional combat regression checks: `node scripts/check-office-combat.mjs`.
