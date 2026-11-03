# Hyomin golfer v03

The game and character viewer both load `public/models/hyomin-v3/hyomin-golfer.glb`.
This replaces the primitive game actor and the discarded cut-head prototype.

- 17-bone skeleton, weighted garments and hands, four baked animation clips.
- `Idle` 2 s, `Swing` 2.9 s, `Celebrate` 3 s, `Despair` 3.2 s.
- Swing impact is 1.16 s. Keep `SWING_IMPACT` in `utils/hyominGolfer.ts` synchronized.
- Head is a closed custom mesh. Front-face UVs use the supplied AI turnaround;
  this is a stylized likeness, not a scan or a photoreal facial rig.
- Motion is custom authored and baked in Blender, not Mixamo motion capture.
- No paid service, API key, external runtime asset host or ripped game asset.

Rebuild with Blender 5.2:

```powershell
& 'C:/Program Files/Blender Foundation/Blender 5.2/blender.exe' --background --python scripts/build-hyomin.py
```

Editable source: `hyomin-rigged-v03.blend`. The script recreates it from the
reference and exports the GLB. Studio camera/lights are excluded from the GLB.

Verified: six sampled poses in a real browser; desktop/mobile studio and game;
item ball firing after impact, pause during backswing, reset cancels animation
and projectile; TypeScript/build and existing ballistic/collision cases.
