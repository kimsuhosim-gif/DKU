export type Vec = { x: number; y: number; z: number };
export const GRAVITY = 14;
export const ORIGIN: Vec = { x: 0, y: .65, z: 18 };
export function velocity(yaw: number, angle: number, power: number): Vec {
  const a = angle * Math.PI / 180, d = yaw * Math.PI / 180, speed = 10 + power * .24;
  return { x: Math.sin(d) * Math.cos(a) * speed, y: Math.sin(a) * speed, z: -Math.cos(d) * Math.cos(a) * speed };
}
export function positionAt(v: Vec, t: number, wind: number): Vec {
  return { x: ORIGIN.x + v.x * t + .5 * wind * t * t, y: ORIGIN.y + v.y * t - .5 * GRAVITY * t * t, z: ORIGIN.z + v.z * t };
}
/** Swept segment/slab intersection prevents fast balls passing through walls. */
export function segmentBox(a: Vec, b: Vec, min: Vec, max: Vec): number | null {
  let enter = 0, exit = 1;
  for (const key of ['x', 'y', 'z'] as const) {
    const delta = b[key] - a[key];
    if (Math.abs(delta) < 1e-9) { if (a[key] < min[key] || a[key] > max[key]) return null; }
    else {
      const t1 = (min[key] - a[key]) / delta, t2 = (max[key] - a[key]) / delta;
      enter = Math.max(enter, Math.min(t1, t2)); exit = Math.min(exit, Math.max(t1, t2));
      if (enter > exit) return null;
    }
  }
  return enter;
}
/** Choose a reachable arc to the front face, compensating for a steady crosswind. */
export function autoAim(x: number, z: number, height: number, wind: number) {
  const dz = ORIGIN.z - z, angle = 34, rad = angle * Math.PI / 180;
  let adjustedX = x, speed = 25, t = 1;
  for (let i = 0; i < 6; i++) {
    const distance = Math.hypot(adjustedX, dz);
    speed = Math.sqrt(GRAVITY * distance * distance / (2 * Math.cos(rad) ** 2 * (distance * Math.tan(rad) - height + ORIGIN.y)));
    t = distance / (Math.cos(rad) * speed); adjustedX = x - .5 * wind * t * t;
  }
  return { yaw: Math.atan2(adjustedX, dz) * 180 / Math.PI, angle, power: Math.max(5, Math.min(100, (speed - 10) / .24)) };
}
