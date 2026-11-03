import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

export const SWING_IMPACT = 1.16;
export const SWING_DURATION = 2.9;
type Motion = 'Idle' | 'Swing' | 'Celebrate' | 'Despair';

/** Actual skinned GLB with baked joint tracks; no primitive stand-in. */
export class HyominGolfer {
  readonly root = new T.Group();
  private mixer: T.AnimationMixer | null = null;
  private actions = new Map<Motion, T.AnimationAction>();
  private current: Motion = 'Idle';
  private disposed = false;
  readonly ready: Promise<void>;

  constructor() {
    this.root.name = 'Hyomin-rigged-v3';
    this.ready = new GLTFLoader().loadAsync('/models/hyomin-v3/hyomin-golfer.glb').then(gltf => {
      if(this.disposed){this.release(gltf.scene);return;}
      const names:Motion[]=['Idle','Swing','Celebrate','Despair'];
      if(!names.every(name=>gltf.animations.some(clip=>clip.name===name))) {
        this.release(gltf.scene);throw new Error('캐릭터 동작 파일이 누락됐어요.');
      }
      gltf.scene.traverse(o=>{if(o instanceof T.Mesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;}});
      this.root.add(gltf.scene);
      this.mixer=new T.AnimationMixer(gltf.scene);
      for(const name of names){
        const action=this.mixer.clipAction(gltf.animations.find(c=>c.name===name)!);
        if(name!=='Idle'){action.setLoop(T.LoopOnce,1);action.clampWhenFinished=true;}
        this.actions.set(name,action);
      }
      this.actions.get('Idle')!.play();
      this.mixer.addEventListener('finished',()=>this.play('Idle'));
      this.mixer.update(0);
    });
  }
  play(name:Motion){
    if(!this.mixer)return;
    const previous=this.actions.get(this.current)!,next=this.actions.get(name)!;
    if(next===previous&&name==='Idle')return;
    next.reset().setEffectiveWeight(1).play();
    if(previous!==next)next.crossFadeFrom(previous,name==='Swing'?.08:.2,false);
    this.current=name;
  }
  reset(){this.mixer?.stopAllAction();this.current='Idle';this.actions.get('Idle')?.reset().play();this.mixer?.update(0);}
  poseAt(name:Motion,time:number){this.mixer?.stopAllAction();const action=this.actions.get(name);if(action){action.reset().play();action.time=time;this.current=name;this.mixer?.update(0);}}
  update(dt:number,reduced:boolean){if(this.mixer)this.mixer.update(reduced&&this.current==='Idle'?0:dt);}
  private release(root:T.Object3D){
    const geometry=new Set<T.BufferGeometry>(),materials=new Set<T.Material>(),textures=new Set<T.Texture>();
    root.traverse(o=>{if(o instanceof T.Mesh){geometry.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){materials.add(m);for(const v of Object.values(m))if(v instanceof T.Texture)textures.add(v);}}});
    geometry.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
  }
  dispose(){this.disposed=true;this.mixer?.stopAllAction();for(const child of this.root.children){this.mixer?.uncacheRoot(child);this.release(child);}this.root.clear();}
}
