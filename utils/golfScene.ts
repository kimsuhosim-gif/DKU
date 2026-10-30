import * as THREE from 'three';
import { Ball, COURSES, Point, shotVelocity, stepBall } from './puttingGame';

export type ShotResult = 'stopped' | 'water' | 'holed';
type Mood = 'idle' | 'swing' | 'win' | 'lose';
type Particle = { mesh: THREE.Mesh; velocity: THREE.Vector3; life: number };
const W = (p: Point) => new THREE.Vector3((p.x - 180) / 20, .36, (p.y - 250) / 20);

/** Imperative render loop: ball and character animation do not re-render React. */
export class GolfScene {
  readonly renderer: THREE.WebGLRenderer;
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(42, 1, .1, 160);
  private world = new THREE.Group();
  private courseGroup = new THREE.Group();
  private actor = new THREE.Group();
  private torso = new THREE.Group();
  private arms = new THREE.Group();
  private legs: THREE.Group[] = [];
  private ballMesh!: THREE.Mesh;
  private shadow!: THREE.Mesh;
  private flag!: THREE.Mesh;
  private aim = new THREE.Group();
  private trail: THREE.Mesh[] = [];
  private particles: Particle[] = [];
  private treeCrowns: THREE.Mesh[] = [];
  private ball: Ball = { ...COURSES[0].start, vx: 0, vy: 0 };
  private origin: Point = COURSES[0].start;
  private course = 0;
  private angle = 0;
  private power = 50;
  private mood: Mood = 'idle';
  private moodTime = 0;
  private moving = false;
  private swingPending = false;
  private active = false;
  private disposed = false;
  private overhead = false;
  private sound = false;
  private reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  private audio: AudioContext | null = null;
  private frame = 0;
  private elapsed = 0;
  private moveTime = 0;
  private observer: ResizeObserver;
  private materials = new Set<THREE.Material>();
  private lastShadow = 0;
  private textures: THREE.Texture[] = [];
  private cameraTarget = new THREE.Vector3(0, 0, 0);
  private actorPosition = new THREE.Vector3();
  private onLost = (e: Event) => { e.preventDefault(); this.onError('그래픽 연결이 끊겼어요. 게임을 다시 불러와 주세요.'); };

  constructor(private host: HTMLElement, private onResult: (result: ShotResult) => void, private onError: (message: string) => void) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    this.renderer.setPixelRatio(Math.min(devicePixelRatio, 1.25));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.autoUpdate = false;
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.25;
    this.renderer.domElement.setAttribute('aria-label', '3D 골프 코스. 아래 방향과 파워 버튼으로 플레이하세요.');
    this.renderer.domElement.setAttribute('role', 'img');
    this.renderer.domElement.addEventListener('webglcontextlost', this.onLost);
    host.appendChild(this.renderer.domElement);
    this.scene.background = new THREE.Color('#b7d8cf');
    this.scene.fog = new THREE.Fog('#b7d8cf', 90, 160);
    this.scene.add(new THREE.HemisphereLight('#fff7de', '#537c70', 2.7));
    const sun = new THREE.DirectionalLight('#fff0cd', 3.5);
    sun.position.set(-12, 24, 8); sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, { left: -25, right: 25, top: 25, bottom: -25, far: 70 });
    sun.shadow.bias = -.001; sun.shadow.normalBias = .06;
    this.scene.add(sun); this.scene.add(this.world); this.world.add(this.courseGroup);
    this.makeLandscape(); this.makeActor();
    this.ballMesh = this.mesh(new THREE.SphereGeometry(.21, 20, 12), '#fffef3');
    this.ballMesh.castShadow = true; this.scene.add(this.ballMesh);
    this.shadow = this.mesh(new THREE.CircleGeometry(.3, 24), '#1d4130');
    this.shadow.rotation.x = -Math.PI / 2; this.shadow.position.y = .13;
    (this.shadow.material as THREE.MeshStandardMaterial).transparent = true;
    (this.shadow.material as THREE.MeshStandardMaterial).opacity = .22; this.scene.add(this.shadow);
    this.scene.add(this.aim);
    for (let i = 0; i < 18; i++) {
      const dot = this.mesh(new THREE.SphereGeometry(.055, 6, 4), '#fff8d1');
      this.aim.add(dot);
      const trace = this.mesh(new THREE.SphereGeometry(.08, 6, 4), '#fffdf1');
      trace.visible = false; this.scene.add(trace); this.trail.push(trace);
    }
    this.loadCourse(0);
    this.observer = new ResizeObserver(() => this.resize()); this.observer.observe(host); this.resize();
    let last = 0;
    const tick = (now: number) => {
      if (this.disposed) return;
      const dt = Math.min(last ? (now - last) / 1000 : 1 / 60, .1); last = now;
      if (!document.hidden) { this.update(dt); this.renderer.render(this.scene, this.camera); }
      this.frame = requestAnimationFrame(tick);
    };
    this.frame = requestAnimationFrame(tick);
  }

  private material(color: string, options: THREE.MeshStandardMaterialParameters = {}) {
    const mat = new THREE.MeshStandardMaterial({ color, roughness: .85, ...options });
    this.materials.add(mat); return mat;
  }
  private mesh(geometry: THREE.BufferGeometry, color: string) { return new THREE.Mesh(geometry, this.material(color)); }
  private box(parent: THREE.Object3D, color: string, size: number[], pos: number[]) {
    const m = this.mesh(new THREE.BoxGeometry(...size as [number, number, number]), color);
    m.position.set(...pos as [number, number, number]); m.castShadow = true; m.receiveShadow = true; parent.add(m); return m;
  }
  private roundRect(w: number, h: number, r: number) {
    const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y); return s;
  }
  private slab(parent: THREE.Object3D, w: number, h: number, r: number, depth: number, color: string, y: number) {
    const geo = new THREE.ExtrudeGeometry(this.roundRect(w, h, r), { depth, bevelEnabled: true, bevelSize: .12, bevelThickness: .12, bevelSegments: 2, steps: 1 });
    geo.rotateX(-Math.PI / 2);
    const m = this.mesh(geo, color); m.position.y = y; m.receiveShadow = true; m.castShadow = true; parent.add(m); return m;
  }
  private makeLandscape() {
    const sea = this.mesh(new THREE.PlaneGeometry(250, 250), '#83b9b0'); sea.rotation.x = -Math.PI / 2; sea.position.y = -3.4; sea.receiveShadow = true; this.world.add(sea);
    this.slab(this.world, 25, 32, 6, 2.2, '#ae9571', -3.2);
    this.slab(this.world, 25.2, 32.2, 6, .5, '#587c46', -1);
    this.slab(this.world, 19, 26, 2.2, .45, '#e9dfbd', -.55);
    this.slab(this.world, 16.4, 23.4, 1.1, .12, '#91bd6c', -.15);
    // Fine fairway mowing lines, all within the playable surface.
    for (let z = -10.5; z < 11; z += 2.2) {
      const stripe = this.mesh(new THREE.PlaneGeometry(16.05, 1.1), '#9ac778'); stripe.rotation.x = -Math.PI / 2; stripe.position.set(0, .13, z); stripe.receiveShadow = true; this.world.add(stripe);
    }
    const random = (i: number) => { const n = Math.sin(i * 127.1 + 311.7) * 43758.5453; return n - Math.floor(n); };
    for (let i = 0; i < 30; i++) {
      const side = i % 2 ? -1 : 1, x = side * (10.5 + random(i) * .9), z = -13.5 + (i / 30) * 27;
      this.tree(x, z, .7 + random(i + 80) * .6, i % 3);
    }
    for (let i = 0; i < 12; i++) {
      const rock = this.mesh(new THREE.DodecahedronGeometry(.45 + random(i + 60) * .55, 0), i % 2 ? '#a9a78e' : '#b9b49b');
      rock.position.set((i % 2 ? 1 : -1) * (11 + random(i + 90) * 2), -1.3, -13 + random(i + 20) * 26); rock.scale.y = .7; rock.castShadow = true; this.world.add(rock);
    }
    // A little clubhouse with a shaded veranda and brass signage.
    const house = new THREE.Group(); house.position.set(-5.5, -.35, -14.2); this.world.add(house);
    this.box(house, '#f4e5c4', [4, 2.2, 2], [0, 1, 0]);
    const roof = this.mesh(new THREE.ConeGeometry(3.2, 1.25, 4), '#2f645c'); roof.rotation.y = Math.PI / 4; roof.position.y = 2.65; roof.scale.z = .68; roof.castShadow = true; house.add(roof);
    for (const x of [-1.25, 0, 1.25]) this.box(house, '#2f5b58', [.7, 1.15, .07], [x, 1.25, 1.04]);
    this.box(house, '#ceaf78', [4.5, .2, 1.5], [0, .1, 1.2]);
    const sign = this.label('RE09 CLUB', '#f2dfb1', '#244d43', 256, 70); sign.scale.set(2.6, .7, 1); sign.position.set(0, 2.1, 1.08); house.add(sign);
    // Distant island silhouettes create depth without expensive textures.
    for (let i = 0; i < 9; i++) {
      const island = this.mesh(new THREE.ConeGeometry(6 + random(i) * 7, 5 + random(i + 8) * 5, 7), '#82a795');
      island.position.set(-55 + i * 14, -4, -46 - random(i + 3) * 15); this.world.add(island);
    }
    for (let i = 0; i < 16; i++) {
      const ripple = this.mesh(new THREE.TorusGeometry(1 + random(i + 44), .025, 3, 40), '#a5cbc0');
      ripple.rotation.x = -Math.PI / 2; ripple.scale.y = .35; ripple.position.set((i % 2 ? -1 : 1) * (15 + random(i + 4) * 15), -3.35, -20 + random(i + 12) * 50); this.world.add(ripple);
    }
  }
  private tree(x: number, z: number, scale: number, variant: number) {
    const tree = new THREE.Group(); tree.position.set(x, -.45, z); tree.scale.setScalar(scale); this.world.add(tree);
    const trunk = this.mesh(new THREE.CylinderGeometry(.13, .2, 1.5, 6), '#866b4d'); trunk.position.y = .7; tree.add(trunk);
    const crown = this.mesh(variant ? new THREE.IcosahedronGeometry(1.2, 0) : new THREE.ConeGeometry(1.1, 2.7, 7), variant === 1 ? '#638d51' : '#3a7152');
    crown.position.y = 2; crown.scale.y = variant ? 1.15 : 1; crown.castShadow = true; tree.add(crown); this.treeCrowns.push(crown);
  }
  private label(text: string, color: string, bg: string, width = 128, height = 128) {
    const canvas = document.createElement('canvas'); canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d')!; ctx.fillStyle = bg; ctx.fillRect(0, 0, width, height); ctx.fillStyle = color;
    ctx.font = `bold ${height * .6}px sans-serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, width / 2, height / 2);
    const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace; this.textures.push(texture);
    const material = new THREE.MeshBasicMaterial({ map: texture }); this.materials.add(material);
    return new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
  }
  private makeActor() {
    this.scene.add(this.actor); this.actor.add(this.torso);
    const body = this.mesh(new THREE.CapsuleGeometry(.35, .48, 4, 8), '#263a3a'); body.position.y = 1.12; body.castShadow = true; this.torso.add(body);
    const zip = this.box(this.torso, '#b4b8ac', [.025, .63, .04], [0, 1.18, .35]); zip.rotation.x = -.05;
    const badge = this.label('09', '#ede1b5', '#263a3a'); badge.scale.set(.17, .17, 1); badge.position.set(.18, 1.32, .345); this.torso.add(badge);
    const head = new THREE.Group(); head.position.y = 1.9; this.torso.add(head);
    const face = this.mesh(new THREE.SphereGeometry(.48, 16, 12), '#e9b286'); face.scale.set(1, 1.04, .88); face.castShadow = true; head.add(face);
    const cap = this.mesh(new THREE.SphereGeometry(.5, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), '#fbf4df'); cap.position.y = .13; head.add(cap);
    const brim = this.mesh(new THREE.SphereGeometry(.46, 12, 8), '#f6eddb'); brim.scale.set(1, .1, .85); brim.position.set(0, .15, .37); head.add(brim);
    const capBadge = this.label('09', '#244d43', '#fbf4df'); capBadge.scale.set(.23, .18, 1); capBadge.position.set(0, .32, .43); head.add(capBadge);
    for (const x of [-.22, .22]) {
      const glasses = this.mesh(new THREE.BoxGeometry(.37, .24, .07), '#172c2a'); glasses.position.set(x, 0, .39); head.add(glasses);
      const lens = this.mesh(new THREE.BoxGeometry(.27, .15, .075), '#b2c5b4'); lens.position.set(x, 0, .4); head.add(lens);
      const eye = this.mesh(new THREE.SphereGeometry(.035, 6, 6), '#182c28'); eye.position.set(x, -.005, .445); head.add(eye);
    }
    this.box(head, '#172c2a', [.1, .04, .08], [0, .02, .43]);
    const nose = this.mesh(new THREE.SphereGeometry(.08, 8, 6), '#d99b73'); nose.position.set(0, -.12, .43); head.add(nose);
    const smile = this.mesh(new THREE.TorusGeometry(.11, .018, 4, 12, Math.PI), '#6c3d2e'); smile.rotation.z = Math.PI; smile.position.set(0, -.24, .385); head.add(smile);
    this.arms.position.set(0, 1.4, 0); this.torso.add(this.arms);
    for (const x of [-.43, .43]) {
      const arm = this.mesh(new THREE.CapsuleGeometry(.13, .55, 3, 8), '#263a3a'); arm.position.set(x, -.25, .18); arm.rotation.x = -.45; arm.rotation.z = x > 0 ? -.2 : .2; this.arms.add(arm);
      const hand = this.mesh(new THREE.SphereGeometry(.14, 8, 6), x > 0 ? '#f1e9d8' : '#e9b286'); hand.position.set(x * .65, -.58, .37); this.arms.add(hand);
    }
    const club = new THREE.Group(); club.position.set(.27, -.55, .4); club.rotation.x = -.3; this.arms.add(club);
    const shaft = this.mesh(new THREE.CylinderGeometry(.023, .023, 1.1, 6), '#bfc9c3'); shaft.position.y = -.5; club.add(shaft);
    this.box(club, '#455558', [.42, .13, .2], [.08, -1.05, 0]);
    for (const x of [-.2, .2]) {
      const leg = new THREE.Group(); leg.position.set(x, .7, 0); this.actor.add(leg); this.legs.push(leg);
      const pants = this.mesh(new THREE.CapsuleGeometry(.16, .36, 3, 8), '#c6baa4'); pants.position.y = -.25; leg.add(pants);
      const shoe = this.mesh(new THREE.SphereGeometry(.22, 10, 8), '#f1ecdc'); shoe.scale.set(.85, .55, 1.3); shoe.position.set(0, -.6, .12); shoe.castShadow = true; leg.add(shoe);
    }
    this.actor.scale.setScalar(1.15);
  }

  loadCourse(index: number) {
    this.renderer.shadowMap.needsUpdate = true; this.course = index; this.moving = false; this.swingPending = false; this.mood = 'idle'; this.moodTime = 0;
    this.ball = { ...COURSES[index].start, vx: 0, vy: 0 }; this.ballMesh.visible = true; this.shadow.visible = true;
    this.clearGroup(this.courseGroup); this.clearParticles(); this.trail.forEach(t => t.visible = false);
    const course = COURSES[index];
    course.walls.forEach(w => {
      const p = W({ x: w.x + w.w / 2, y: w.y + w.h / 2 });
      this.box(this.courseGroup, '#b19a72', [w.w / 20, .6, w.h / 20], [p.x, .3, p.z]);
      this.box(this.courseGroup, '#f2dfb8', [w.w / 20 + .08, .12, w.h / 20 + .08], [p.x, .64, p.z]);
    });
    course.sand.forEach(r => {
      const p = W({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
      const m = this.mesh(new THREE.PlaneGeometry(r.w / 20, r.h / 20), '#e9d49c'); m.rotation.x = -Math.PI / 2; m.position.set(p.x, .14, p.z); m.receiveShadow = true; this.courseGroup.add(m);
      for (let i = 0; i < 6; i++) { const rake = this.mesh(new THREE.PlaneGeometry(r.w / 20 * .8, .018), '#cfb77d'); rake.rotation.x = -Math.PI / 2; rake.position.set(p.x, .15, p.z + (i - 2.5) * r.h / 140); this.courseGroup.add(rake); }
    });
    course.water.forEach(r => {
      const p = W({ x: r.x + r.w / 2, y: r.y + r.h / 2 });
      const m = this.mesh(new THREE.PlaneGeometry(r.w / 20, r.h / 20), '#4fa4b1'); m.rotation.x = -Math.PI / 2; m.position.set(p.x, .15, p.z); this.courseGroup.add(m);
      for (let i = 0; i < 5; i++) { const wave = this.mesh(new THREE.TorusGeometry(.2 + i * .17, .018, 3, 32), '#b3e4dc'); wave.rotation.x = -Math.PI / 2; wave.position.set(p.x, .16, p.z); this.courseGroup.add(wave); }
    });
    const cup = W(course.cup);
    const halo = this.mesh(new THREE.CircleGeometry(.85, 36), '#bdd28b'); halo.rotation.x = -Math.PI / 2; halo.position.set(cup.x, .14, cup.z); this.courseGroup.add(halo);
    const hole = this.mesh(new THREE.CircleGeometry(.43, 32), '#183e33'); hole.rotation.x = -Math.PI / 2; hole.position.set(cup.x, .15, cup.z); this.courseGroup.add(hole);
    const rim = this.mesh(new THREE.TorusGeometry(.43, .025, 4, 32), '#f6e6b9'); rim.rotation.x = -Math.PI / 2; rim.position.copy(hole.position); this.courseGroup.add(rim);
    const pole = this.mesh(new THREE.CylinderGeometry(.035, .035, 2.5, 8), '#f2e6c8'); pole.position.set(cup.x, 1.25, cup.z); pole.castShadow = true; this.courseGroup.add(pole);
    this.flag = this.label(String(index + 1).padStart(2, '0'), '#fff7d6', '#c26b43', 128, 84); this.flag.scale.set(1, .65, 1); this.flag.position.set(cup.x + .5, 2.15, cup.z); this.courseGroup.add(this.flag);
    this.actorPosition.copy(W(this.ball)).add(new THREE.Vector3(-.95, -.2, .25)); this.actor.position.copy(this.actorPosition);
    this.setAim(0, 50); this.syncBall();
  }
  setActive(active: boolean) { this.active = active; }
  setAim(angle: number, power: number) { this.angle = angle; this.power = power; }
  toggleView() { this.overhead = !this.overhead; return this.overhead; }
  setSound(enabled: boolean) {
    this.sound = enabled;
    if (enabled) try { this.audio ??= new AudioContext(); void this.audio.resume(); } catch { this.sound = false; }
  }
  private tone(freq: number, duration = .12, slide = 0) {
    if (!this.sound || !this.audio) return;
    const ctx = this.audio, o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'sine';
    o.connect(g); g.connect(ctx.destination); o.frequency.setValueAtTime(freq, ctx.currentTime);
    if (slide) o.frequency.exponentialRampToValueAtTime(slide, ctx.currentTime + duration);
    g.gain.setValueAtTime(.12, ctx.currentTime); g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + duration); o.start(); o.stop(ctx.currentTime + duration);
  }
  shoot(angle: number, power: number) {
    if (this.moving || this.swingPending || this.disposed) return false;
    this.angle = angle; this.power = power; this.origin = { x: this.ball.x, y: this.ball.y };
    this.swingPending = true; this.mood = 'swing'; this.moodTime = 0; this.moveTime = 0; this.aim.visible = false;
    return true;
  }
  private syncBall() { this.ballMesh.position.copy(W(this.ball)); this.shadow.position.set(this.ballMesh.position.x, .13, this.ballMesh.position.z); }
  private burst(position: THREE.Vector3, colors: string[], count: number) {
    for (let i = 0; i < count; i++) {
      const m = this.mesh(new THREE.BoxGeometry(.09, .09, .06), colors[i % colors.length]); m.position.copy(position);
      this.scene.add(m); this.particles.push({ mesh: m, velocity: new THREE.Vector3(Math.sin(i * 2.4) * (1 + i % 3), 2 + i % 5, Math.cos(i * 2.4) * (1 + i % 3)), life: 1.2 + i % 3 * .3 });
    }
  }
  private update(dt: number) {
    this.elapsed += dt; this.moodTime += dt;
    if (this.elapsed - this.lastShadow > .12) { this.renderer.shadowMap.needsUpdate = true; this.lastShadow = this.elapsed; }
    if (this.swingPending && this.moodTime > .42) {
      this.swingPending = false; this.moving = true; Object.assign(this.ball, shotVelocity(this.angle, this.power));
      this.tone(650, .1, 160); this.burst(W(this.ball), ['#fff7cd', '#b4d68b'], this.reduced ? 4 : 14);
    }
    if (this.moving) {
      this.moveTime += dt; let result: ReturnType<typeof stepBall> = 'moving';
      const previous = { ...this.ball }, n = Math.ceil(dt / (1 / 120));
      for (let i = 0; i < n; i++) { result = stepBall(this.ball, COURSES[this.course], dt / n); if (result !== 'moving') break; }
      if (previous.vx * this.ball.vx < 0 || previous.vy * this.ball.vy < 0) { this.tone(240, .06, 120); this.burst(W(this.ball), ['#d7d6a1'], 4); }
      this.syncBall(); this.ballMesh.rotation.x += this.ball.vy * dt / 5; this.ballMesh.rotation.z -= this.ball.vx * dt / 5;
      this.trail.forEach((t, i) => { t.visible = !this.reduced; if (i === 0) t.position.copy(this.ballMesh.position); else t.position.lerp(this.trail[i - 1].position, Math.min(1, dt * 25)); t.scale.setScalar((1 - i / this.trail.length) * .8); });
      if (this.moveTime > 12 && result === 'moving') result = 'stopped';
      if (result !== 'moving') {
        this.moving = false; this.moodTime = 0; this.mood = result === 'holed' ? 'win' : 'lose';
        if (result === 'holed') { this.ballMesh.visible = false; this.shadow.visible = false; this.burst(W(this.ball), ['#f8d781', '#ed997a', '#faf2ca', '#81bca2'], this.reduced ? 6 : 65); this.tone(520, .5, 1040); }
        else if (result === 'water') { this.burst(W(this.ball), ['#b2eeed', '#65c8dd'], this.reduced ? 6 : 35); this.ball = { ...this.origin, vx: 0, vy: 0 }; this.syncBall(); this.tone(200, .35, 65); }
        else this.tone(230, .2, 140);
        this.trail.forEach(t => t.visible = false); this.onResult(result);
      }
    }
    this.animateActor(dt);
    this.aim.visible = this.active && !this.moving && !this.swingPending && this.mood !== 'win';
    const rad = this.angle * Math.PI / 180;
    this.aim.children.forEach((dot, i) => {
      const dist = .5 + i * (.1 + this.power / 600);
      dot.position.set(this.ballMesh.position.x + Math.sin(rad) * dist, .16, this.ballMesh.position.z - Math.cos(rad) * dist);
      dot.visible = Math.abs(dot.position.x) < 7.8 && Math.abs(dot.position.z) < 11.3;
    });
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]; p.life -= dt; p.velocity.y -= dt * 8; p.mesh.position.addScaledVector(p.velocity, dt); p.mesh.rotation.x += dt * 5; p.mesh.rotation.z += dt * 3;
      if (p.life <= 0 || p.mesh.position.y < -.1) { this.disposeObject(p.mesh); this.scene.remove(p.mesh); this.particles.splice(i, 1); }
    }
    if (!this.reduced) { this.flag.rotation.y = Math.sin(this.elapsed * 2) * .15; this.treeCrowns.forEach((t, i) => t.rotation.z = Math.sin(this.elapsed + i) * .025); }
    const aspect = this.camera.aspect, portrait = aspect < .85;
    const desired = this.overhead ? new THREE.Vector3(0, portrait ? 60 : 37, 6) : new THREE.Vector3(portrait ? 10 : 18, portrait ? 44 : 26, portrait ? 48 : 28);

    if (aspect < .42) desired.multiplyScalar(1.12);
    if (aspect > 1.8) desired.multiplyScalar(1.12);
    const target = new THREE.Vector3(0, 0, portrait ? 3 : 0);
    if (this.active && !this.overhead && !this.reduced) { target.x = this.ballMesh.position.x * .07; target.z += this.ballMesh.position.z * .06; }
    this.camera.position.lerp(desired, this.reduced ? 1 : Math.min(1, dt * 3)); this.cameraTarget.lerp(target, Math.min(1, dt * 3)); this.camera.lookAt(this.cameraTarget);
  }
  private animateActor(dt: number) {
    const t = this.moodTime, target = W(this.ball).add(new THREE.Vector3(-.95, -.2, .25));
    if (!this.moving && !this.swingPending && this.mood !== 'win' && t > 1.4) this.actorPosition.lerp(target, Math.min(1, dt * 5));
    this.actor.position.copy(this.actorPosition); this.torso.rotation.set(0, 0, 0); this.arms.rotation.set(0, 0, 0); this.legs.forEach(l => l.rotation.set(0, 0, 0));
    this.actor.rotation.y = .9 + this.angle * -.008;
    if (this.mood === 'swing') { this.arms.rotation.x = t < .42 ? -Math.sin(t / .42 * Math.PI / 2) * 1.2 : Math.sin(Math.min(1, (t - .42) / .35) * Math.PI) * 1.1; this.torso.rotation.y = Math.sin(Math.min(t, .9) * Math.PI) * -.35; }
    else if (this.mood === 'win') { this.actor.rotation.y = .2; this.arms.rotation.x = -2.8; if (!this.reduced) { this.actor.position.y += Math.abs(Math.sin(t * 5)) * 1.1; this.torso.rotation.z = Math.sin(t * 7) * .13; this.legs.forEach((l, i) => l.rotation.x = Math.sin(t * 5 + i) * .6); } }
    else if (this.mood === 'lose' && t < 1.5) { this.actor.position.y -= Math.sin(Math.min(1, t * 3) * Math.PI / 2) * .35; this.torso.rotation.x = .45; this.arms.rotation.x = -2.2; this.legs.forEach(l => l.rotation.x = -.65); if (!this.reduced) this.torso.rotation.z = Math.sin(t * 18) * .13; }
    else if (!this.reduced) { this.torso.position.y = Math.sin(this.elapsed * 2) * .025; }
  }
  private resize() {
    const w = this.host.clientWidth, h = this.host.clientHeight; if (!w || !h) return;
    this.renderer.setSize(w, h); this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    if (this.camera.position.length() < 1) this.camera.position.set(19, 33, 34);
  }
  aimFromDrag(dx: number, dy: number) {
    // Convert screen-space pull into a horizontal world direction using camera axes.
    const right = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 0);
    const up = new THREE.Vector3().setFromMatrixColumn(this.camera.matrixWorld, 1); right.y = 0; up.y = 0; right.normalize(); up.normalize();
    const direction = right.multiplyScalar(-dx).addScaledVector(up, dy);
    return { angle: Math.atan2(direction.x, -direction.z) * 180 / Math.PI, power: Math.min(100, Math.hypot(dx, dy) / 1.3) };
  }
  private disposeObject(object: THREE.Object3D) { object.traverse(o => { if (o instanceof THREE.Mesh) { o.geometry.dispose();
      for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
        const texture = (m as THREE.MeshStandardMaterial).map;
        if (texture) { texture.dispose(); this.textures = this.textures.filter(t => t !== texture); }
        m.dispose(); this.materials.delete(m);
      } } }); }
  private clearGroup(group: THREE.Group) { group.children.forEach(o => this.disposeObject(o)); group.clear(); }
  private clearParticles() { this.particles.forEach(p => { this.scene.remove(p.mesh); this.disposeObject(p.mesh); }); this.particles = []; }
  dispose() {
    this.disposed = true; cancelAnimationFrame(this.frame); this.observer.disconnect(); void this.audio?.close();
    this.renderer.domElement.removeEventListener('webglcontextlost', this.onLost); this.disposeObject(this.scene);
    this.materials.forEach(m => m.dispose()); this.textures.forEach(t => t.dispose()); this.renderer.dispose(); this.renderer.domElement.remove();
  }
}
