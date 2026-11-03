import {useEffect,useState} from 'react';
import * as T from 'three';
import {createBallModel,EquipmentKind} from '../utils/driveEquipment';
const cache=new Map<string,string>();
export default function BallArt({kind}:{kind:EquipmentKind}){
 const [src,setSrc]=useState(()=>cache.get(kind));
 useEffect(()=>{let value=cache.get(kind);if(!value){let renderer:T.WebGLRenderer|undefined;let model:T.Group|undefined;try{renderer=new T.WebGLRenderer({alpha:true,antialias:true});renderer.setSize(128,128);renderer.toneMapping=T.ACESFilmicToneMapping;const scene=new T.Scene();scene.add(new T.HemisphereLight('#ffffff','#6e8c9b',3));const light=new T.DirectionalLight('#fff1da',4);light.position.set(-3,5,4);scene.add(light);model=createBallModel(kind);scene.add(model);const camera=new T.PerspectiveCamera(36,1,.1,20);camera.position.set(2,1.4,4.7);camera.lookAt(0,.1,0);renderer.render(scene,camera);value=renderer.domElement.toDataURL();cache.set(kind,value);}catch{/* Text labels remain available without WebGL previews. */}finally{model?.traverse(o=>{if(o instanceof T.Mesh){o.geometry.dispose();for(const m of Array.isArray(o.material)?o.material:[o.material])m.dispose();}});renderer?.dispose();renderer?.forceContextLoss();}}setSrc(value);},[kind]);
 return src?<img className="equipment-art" src={src} alt="" draggable={false}/>:<span aria-hidden="true">◉</span>;
}
