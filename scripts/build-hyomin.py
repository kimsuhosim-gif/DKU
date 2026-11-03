"""Author the RE09 golfer, skin and bake independent clips. Blender 5.x, no services.

Axes: X across the stance, -Y towards the ball, Z up. The supplied turnaround
is used as a face texture through UV coordinates, never as a billboard body.
"""
import bpy, math, json
from pathlib import Path
from mathutils import Vector, Matrix, Quaternion

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public/models/hyomin-v3'
OUT.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
V = Vector
scene = bpy.context.scene
scene.render.fps = 30
parts = []

def material(name, color, rough=.7, metal=0):
    m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
    bs=m.node_tree.nodes.get('Principled BSDF'); bs.inputs['Base Color'].default_value=(*color,1)
    bs.inputs['Roughness'].default_value=rough; bs.inputs['Metallic'].default_value=metal
    return m

skin=material('Warm skin',(.63,.36,.22))
cloth=material('Charcoal technical knit',(.034,.045,.061))
rib=material('Ribbed cuffs',(.018,.025,.036))
pants=material('Stone trousers',(.44,.38,.30))
ivory=material('Ivory',(.86,.85,.78))
black=material('Ink',(.012,.017,.023),.35)
silver=material('Brushed steel',(.45,.55,.61),.26,.8)
gold=material('Champagne trim',(.53,.37,.15),.3,.65)
hair=material('Short dark hair',(.022,.017,.014))
face=material('Reference face',(.8,.6,.4))
image=bpy.data.images.load(str(ROOT/'assets/characters/hyomin-v02/hyomin-turnaround-v02.png'))
image.pack()
tex=face.node_tree.nodes.new('ShaderNodeTexImage'); tex.image=image
face.node_tree.links.new(tex.outputs['Color'],face.node_tree.nodes.get('Principled BSDF').inputs['Base Color'])

def finish(o,name,mat,weights):
    o.name=name
    if mat:o.data.materials.append(mat)
    if o.type=='MESH':
        for p in o.data.polygons:p.use_smooth=True
    parts.append((o,weights))
    return o

def ell(name,loc,scale,mat,bone='head',segments=32,rings=20):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments,ring_count=rings,location=loc)
    o=bpy.context.object;o.scale=scale
    bpy.ops.object.transform_apply(location=True,rotation=True,scale=True)
    return finish(o,name,mat,bone)

def tube(name,points,r,mat,bone):
    c=bpy.data.curves.new(name,'CURVE');c.dimensions='3D';c.resolution_u=12
    c.bevel_depth=r;c.bevel_resolution=2
    s=c.splines.new('BEZIER');s.bezier_points.add(len(points)-1)
    for p,co in zip(s.bezier_points,points):p.co=co;p.handle_left_type='AUTO';p.handle_right_type='AUTO'
    o=bpy.data.objects.new(name,c);scene.collection.objects.link(o)
    bpy.context.view_layer.objects.active=o;o.select_set(True)
    bpy.ops.object.convert(target='MESH');o=bpy.context.object
    o.select_set(False)
    return finish(o,name,mat,bone)

def loft(name,rings,mat,weights,n=48,sub=1):
    # Cross sections are z, x-radius, depth, center-x, center-y.
    verts=[];faces=[]
    for z,rx,ry,cx,cy in rings:
        for j in range(n):
            a=j*2*math.pi/n;verts.append((cx+rx*math.cos(a),cy+ry*math.sin(a),z))
    for i in range(len(rings)-1):
        for j in range(n):
            a=i*n+j;b=i*n+(j+1)%n;faces.append((a,b,b+n,a+n))
    faces += [tuple(reversed(range(n))),tuple((len(rings)-1)*n+j for j in range(n))]
    me=bpy.data.meshes.new(name);me.from_pydata(verts,[],faces);me.update()
    o=bpy.data.objects.new(name,me);scene.collection.objects.link(o)
    if sub:
        bpy.context.view_layer.objects.active=o
        mod=o.modifiers.new('Tailored surface','SUBSURF');mod.levels=sub
        bpy.ops.object.modifier_apply(modifier=mod.name)
    return finish(o,name,mat,weights)

def label(name,value,loc,size,mat,bone):
    c=bpy.data.curves.new(name,'FONT');c.body=value;c.align_x='CENTER';c.size=size;c.extrude=.0015
    o=bpy.data.objects.new(name,c);scene.collection.objects.link(o);o.location=loc;o.rotation_euler=(math.pi/2,0,0)
    bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o=bpy.context.object
    bpy.ops.object.transform_apply(location=True,rotation=True,scale=True);o.select_set(False)
    return finish(o,name,mat,bone)

# Armature. Each garment is weighted continuously across its joint, not swung
# as a rigid limb. Hand and club share one animated grip transform.
arm=bpy.data.armatures.new('Hyomin skeleton');rig=bpy.data.objects.new('Hyomin',arm);scene.collection.objects.link(rig)
bpy.context.view_layer.objects.active=rig;rig.select_set(True);bpy.ops.object.mode_set(mode='EDIT')
rest={}
def bone(name,a,b,parent=None):
    e=arm.edit_bones.new(name);e.head=a;e.tail=b
    if parent:e.parent=arm.edit_bones[parent]
    rest[name]=(V(a),V(b))
bone('root',(0,0,0),(0,0,.25))
bone('hips',(0,0,1.08),(0,0,1.35),'root')
bone('spine',(0,0,1.35),(0,0,1.85),'hips')
bone('head',(0,0,2.01),(0,0,2.65),'spine')
for s,side in [(-1,'R'),(1,'L')]:
    bone('upper_arm.'+side,(s*.40,0,1.82),(s*.65,-.02,1.43),'spine')
    bone('forearm.'+side,(s*.65,-.02,1.43),(s*.84,-.04,1.04),'upper_arm.'+side)
    bone('hand.'+side,(s*.84,-.04,1.04),(s*.90,-.06,.90),'forearm.'+side)
    bone('thigh.'+side,(s*.21,0,1.08),(s*.235,-.025,.60),'hips')
    bone('shin.'+side,(s*.235,-.025,.60),(s*.25,0,.16),'thigh.'+side)
    bone('foot.'+side,(s*.25,0,.16),(s*.25,-.25,.10),'shin.'+side)
bone('club',(0,-.65,1.23),(0,-1.24,.18),'root')
bpy.ops.object.mode_set(mode='OBJECT');rig.select_set(False)

def torso_weights(v):
    t=max(0,min(1,(v.z-1.18)/.38));return {'hips':1-t,'spine':t}
loft('Jacket',[(1.07,.32,.23,0,0),(1.10,.37,.255,0,0),(1.18,.40,.28,0,-.01),(1.36,.435,.29,0,-.02),(1.58,.43,.26,0,0),(1.76,.43,.22,0,0),(1.85,.35,.20,0,0),(1.91,.18,.15,0,0)],cloth,torso_weights)
loft('Hem',[(1.06,.33,.24,0,0),(1.09,.375,.26,0,0),(1.16,.39,.27,0,0)],rib,'hips')
loft('Standing collar',[(1.84,.20,.16,0,0),(1.94,.19,.15,0,0),(2.01,.17,.135,0,0)],rib,'spine')
ell('Neck',(0,0,2.04),(.15,.14,.18),skin,'head')
tube('Silver zip',[(0,-.27,1.13),(0,-.315,1.38),(0,-.265,1.65),(0,-.20,1.87),(0,-.145,1.99)],.008,silver,torso_weights)
ell('Zip pull',(0,-.215,1.88),(.025,.012,.05),silver,'spine')
for s in [-1,1]:
    tube('Pocket piping',[(s*.25,-.268,1.19),(s*.30,-.27,1.32),(s*.33,-.25,1.43)],.012,rib,torso_weights)
    tube('Shoulder seam',[(s*.16,-.12,1.91),(s*.29,-.18,1.83),(s*.40,-.14,1.75)],.004,ivory,'spine')
label('Chest 09','09',(.21,-.257,1.67),.105,ivory,'spine')

# Closed, uninterrupted head: no cut/open neck vertices and no adapted human
# mesh distorted at the jaw. Front UVs carry the approved reference likeness.
head=loft('Sculpted continuous head',[(1.99,.10,.12,0,0),(2.04,.22,.20,0,-.015),(2.13,.31,.255,0,-.005),(2.28,.365,.29,0,0),(2.46,.36,.295,0,.015),(2.63,.33,.28,0,.02),(2.75,.25,.23,0,.02),(2.81,.10,.10,0,.02)],skin,'head',64,2)
head.data.materials.append(face)
uv=head.data.uv_layers.new(name='Reference face UV')
for p in head.data.polygons:
    center=sum((head.data.vertices[i].co for i in p.vertices),V())/len(p.vertices)
    if center.y < -.11 and 2.025 < center.z < 2.68:
        p.material_index=1
    for li in p.loop_indices:
        co=head.data.vertices[head.data.loops[li].vertex_index].co
        py=260-(co.z-2.025)*219
        spread=225 if py<220 else 180-(py-220)*.9
        uv.data[li].uv=((274+co.x*spread)/1672,1-py/941)
# Nose gives the profile depth; face texture supplies brows, eyes and lips.
nose=ell('Nose bridge',(0,-.289,2.345),(.050,.055,.075),skin)
nose.data.materials.clear();nose.data.materials.append(face)
nu=nose.data.uv_layers.active
for loop in nose.data.loops:
    co=nose.data.vertices[loop.vertex_index].co
    nu.data[loop.index].uv=((274+co.x*225)/1672,1-(260-(co.z-2.025)*219)/941)
for s in [-1,1]:
    ell('Ear',(s*.355,.0,2.36),(.067,.075,.12),skin)
    ell('Ear concha',(s*.394,-.045,2.37),(.023,.026,.065),material('Ear inner '+str(s),(.48,.23,.14)))
    tube('Glasses temple',[(s*.30,-.21,2.46),(s*.365,-.12,2.46),(s*.373,.02,2.43)],.014,black,'head')
# Hair shell is limited to the back and sideburns. No black hemisphere hiding
# the entire face as in the discarded prototype.
for s in [-1,1]:
    ell('Sideburn',(s*.336,.025,2.50),(.036,.15,.17),hair)
ell('Back hair',(0,.145,2.56),(.335,.20,.24),hair)
loft('Six panel cap',[(2.59,.355,.30,0,.015),(2.64,.37,.31,0,.015),(2.74,.34,.29,0,.02),(2.84,.25,.23,0,.025),(2.90,.10,.10,0,.025),(2.905,.015,.015,0,.025)],ivory,'head',64,1)
ell('Curved cap brim',(0,-.315,2.625),(.37,.25,.032),ivory)
ell('Cap button',(0,.025,2.91),(.027,.027,.013),ivory)
label('Cap 09','09',(0,-.294,2.725),.14,black,'head')
for a in [-.8,0,.8,math.pi]:
    tube('Cap seam',[(math.sin(a)*.355,-math.cos(a)*.30+.015,2.64),(math.sin(a)*.31,-math.cos(a)*.27+.02,2.75),(math.sin(a)*.19,-math.cos(a)*.18+.025,2.86),(0,.025,2.907)],.0025,pants,'head')

for s,side in [(-1,'R'),(1,'L')]:
    def aw(v,side=side):
        t=max(0,min(1,(1.52-v.z)/.20));return {'upper_arm.'+side:1-t,'forearm.'+side:t}
    loft('Sleeve '+side,[(1.03,.095,.10,s*.84,-.04),(1.12,.12,.12,s*.80,-.035),(1.30,.14,.145,s*.72,-.025),(1.43,.15,.16,s*.65,-.02),(1.59,.17,.17,s*.55,-.01),(1.77,.18,.19,s*.43,0),(1.85,.13,.14,s*.38,0)],cloth,aw,32,1)
    ell('Cuff '+side,(s*.83,-.04,1.075),(.10,.105,.07),rib,'forearm.'+side)
    handmat=ivory if side=='L' else skin
    ell('Palm '+side,(s*.88,-.05,.96),(.085,.065,.12),handmat,'hand.'+side)
    for f in range(4):
        x=s*.88+(f-1.5)*.035
        tube('Finger '+side+str(f),[(x,-.065,.96),(x,-.10,.895),(x,-.08,.855)],.019,handmat,'hand.'+side)
    tube('Thumb '+side,[(s*.82,-.05,1.00),(s*.78,-.09,.94),(s*.81,-.11,.91)],.028,handmat,'hand.'+side)
    if side=='L':ell('Glove tab',(s*.88,.011,.97),(.045,.008,.04),black,'hand.L')
    def lw(v,side=side):
        t=max(0,min(1,(.69-v.z)/.20));return {'thigh.'+side:1-t,'shin.'+side:t}
    loft('Trousers '+side,[(.16,.135,.15,s*.25,0),(.22,.15,.16,s*.25,0),(.32,.14,.16,s*.25,.005),(.53,.16,.18,s*.235,-.015),(.62,.17,.19,s*.235,-.025),(.82,.18,.20,s*.22,0),(1.02,.21,.235,s*.205,0),(1.13,.20,.22,s*.20,0)],pants,lw,40,1)
    tube('Trouser crease '+side,[(s*.25,-.155,.26),(s*.235,-.208,.60),(s*.21,-.22,.96)],.003,ivory,lw)
    ell('Sole '+side,(s*.25,-.105,.063),(.17,.30,.055),black,'foot.'+side)
    ell('Shoe upper '+side,(s*.25,-.11,.123),(.165,.285,.095),ivory,'foot.'+side)
    ell('Shoe collar '+side,(s*.25,.015,.19),(.12,.12,.06),rib,'foot.'+side)
    for l in range(4):
        tube('Lace '+side+str(l),[(s*.25-.075,-.08-l*.035,.207-l*.008),(s*.25+.075,-.09-l*.035,.207-l*.008)],.006,ivory,'foot.'+side)

# Driver in the bind-pose grip; this same bone drives both hand targets.
grip,tip=rest['club'];axis=(tip-grip).normalized()
tube('Driver shaft',[grip+axis*.05,tip],.012,silver,'club')
tube('Driver grip',[grip-axis*.08,grip+axis*.19],.028,black,'club')
ell('Driver carbon head',tip+V((.08,0,0)),(.19,.12,.09),black,'club')
ell('Driver striking face',tip+V((.08,-.09,0)),(.16,.025,.075),silver,'club')
for i in range(4):tube('Face groove',[(tip.x-.04,tip.y-.115,tip.z-.04+i*.025),(tip.x+.20,tip.y-.115,tip.z-.04+i*.025)],.002,black,'club')

for o,weights in parts:
    if o.type!='MESH':continue
    for vert in o.data.vertices:
        ws={weights:1} if isinstance(weights,str) else weights(vert.co)
        for name,w in ws.items():
            if w>0:
                vg=o.vertex_groups.get(name) or o.vertex_groups.new(name=name)
                vg.add([vert.index],w,'REPLACE')
    mod=o.modifiers.new('Skin','ARMATURE');mod.object=rig;o.parent=rig

desired={}
def setworld(name,m):
    pb=rig.pose.bones[name]
    if pb.parent:
        pb.matrix_basis=pb.bone.matrix_local.inverted() @ pb.parent.bone.matrix_local @ desired[pb.parent.name].inverted() @ m
    else:pb.matrix_basis=pb.bone.matrix_local.inverted() @ m
    desired[name]=m.copy()

def rotz(a):return Matrix.Rotation(a,4,'Z')
def rotx(a):return Matrix.Rotation(a,4,'X')
def orient(name,a,b,roll=0):
    """Match the rest bone to the solved segment, keeping its local twist."""
    rh,rt=rest[name];q=(rt-rh).normalized().rotation_difference((b-a).normalized())
    m=q.to_matrix().to_4x4() @ arm.bones[name].matrix_local.copy()
    if roll:m=Matrix.Rotation(roll,4,(b-a).normalized()) @ m
    m.translation=a
    setworld(name,m)

def elbow(a,b,l1,l2,pole):
    d=b-a;dist=min(d.length,l1+l2-.001);u=d.normalized()
    mid=(dist*dist+l1*l1-l2*l2)/(2*max(dist,.001))
    normal=(pole-a)-u*(pole-a).dot(u)
    if normal.length<.001:normal=V((0,0,1))
    return a+u*mid+normal.normalized()*math.sqrt(max(0,l1*l1-mid*mid))

# Slow loading, quick acceleration, firm impact, then a held finish. Angles
# below are animation authoring data, sampled to quaternion tracks at 30 fps.
KEYS=[
 (0,    (0,-.65,1.23), (0,-1.24,.18), 0,0,0),
 (.34,  (-.52,-.51,1.50),(-1.24,-.72,1.23),-.25,-.12,-.035),
 (.80,  (-.54,-.13,2.12),(.15,.02,2.92),-.85,-.40,-.075),
 (1.00, (-.45,-.24,1.91),(-1.30,-.07,2.64),-.55,-.16,-.04),
 (1.16, (0,-.65,1.23),(0,-1.24,.18),.14,.27,.035),
 (1.34, (.57,-.47,1.67),(1.32,-.75,2.20),.69,.48,.08),
 (1.65, (.41,-.08,2.13),(-.55,.20,2.62),1.15,.64,.11),
 (2.30, (.41,-.08,2.13),(-.55,.20,2.62),1.15,.64,.11),
 (2.90, (0,-.65,1.23),(0,-1.24,.18),0,0,0),
]

def sample(t):
    for i in range(len(KEYS)-1):
        a,b=KEYS[i:i+2]
        if a[0]<=t<=b[0]:
            u=(t-a[0])/(b[0]-a[0]);u=u*u*(3-2*u)
            return [V(a[j]).lerp(V(b[j]),u) if j in [1,2] else a[j]*(1-u)+b[j]*u for j in range(1,6)]
    return [V(KEYS[-1][1]),V(KEYS[-1][2]),*KEYS[-1][3:]]

def pose(t,kind):
    desired.clear()
    for pb in rig.pose.bones:pb.matrix_basis=Matrix.Identity(4)
    grip,tip,turn,hipturn,shift=sample(t if kind=='Swing' else 0)
    jump=0;lean=.10;headlean=.12
    if kind=='Idle':
        grip.z+=math.sin(t*math.pi)*.012;tip.z+=math.sin(t*math.pi)*.005
    if kind=='Celebrate':
        envelope=math.sin(math.pi*min(t/3,1))**.6
        jump=max(0,math.sin(t*math.pi*3))* .30*envelope
        turn=math.sin(t*8)*.14*envelope;hipturn=turn*.4
        grip=V((-.25,-.22,1.23+1.30*envelope));tip=grip+V((-.45,.02,.96))
        headlean=-.18*envelope
    if kind=='Despair':
        envelope=math.sin(math.pi*min(t/3.2,1))**.5
        lean=.10+.75*envelope;headlean=.45*envelope
        grip=V((0,-.66,1.23-.35*envelope));tip=V((.20,-1.15,.18))
        turn=math.sin(t*9)*.13*envelope;shift=0
    rm=arm.bones['root'].matrix_local.copy();rm.translation.z+=jump;setworld('root',rm)
    hips=V((shift,0,1.08+jump))
    # The rest bone points up (its local Y); use rest orientation consistently.
    hmat=rotz(hipturn) @ arm.bones['hips'].matrix_local;hmat.translation=hips;setworld('hips',hmat)
    chest=V((shift,-.015,1.35+jump))
    bodyrot=rotz(turn) @ rotx(lean)
    sm=bodyrot @ arm.bones['spine'].matrix_local;sm.translation=chest;setworld('spine',sm)
    def upper(p):return chest+bodyrot.to_3x3() @ (V(p)-V((0,0,1.35)))
    hp=upper((0,0,2.01));headrot=rotz(turn*.25) @ rotx(headlean)
    hd=headrot @ arm.bones['head'].matrix_local;hd.translation=hp;setworld('head',hd)
    grip.z+=jump;tip.z+=jump
    axis=(tip-grip).normalized()
    orient('club',grip,grip+axis*(rest['club'][1]-rest['club'][0]).length)
    for s,side in [(-1,'R'),(1,'L')]:
        a=upper((s*.40,0,1.82));hand=grip+axis*(.10 if side=='R' else -.035)
        # Fingers extend along the shaft, wrists lie behind it.
        wrist=hand-axis*.12+V((s*.035,.035,0))
        if kind=='Celebrate' and side=='R':
            e=math.sin(math.pi*min(t/3,1))**.6
            wrist=V((-.65,-.16,1.23+1.25*e+jump))
        l1=(rest['upper_arm.'+side][1]-rest['upper_arm.'+side][0]).length
        l2=(rest['forearm.'+side][1]-rest['forearm.'+side][0]).length
        # Keep all arm targets inside the reachable volume.
        diff=wrist-a
        if diff.length>l1+l2-.015:wrist=a+diff.normalized()*(l1+l2-.015)
        pole=a+V((s*.6,-.15,-.35));e=elbow(a,wrist,l1,l2,pole)
        orient('upper_arm.'+side,a,e);orient('forearm.'+side,e,wrist)
        orient('hand.'+side,wrist,wrist+axis*.15)
        hip=hips+rotz(hipturn).to_3x3()@V((s*.21,0,0))
        heel=max(0,hipturn)*.22 if side=='R' else 0
        ankle=V((s*.25,0,.16+jump+heel))
        l1=(rest['thigh.'+side][1]-rest['thigh.'+side][0]).length
        l2=(rest['shin.'+side][1]-rest['shin.'+side][0]).length
        knee=elbow(hip,ankle,l1,l2,V((s*.25,-.7,.60+jump)))
        orient('thigh.'+side,hip,knee);orient('shin.'+side,knee,ankle)
        orient('foot.'+side,ankle,V((s*.25,-.25,.10+jump)))
    bpy.context.view_layer.update()

rig.animation_data_create()
for kind,duration in [('Idle',2),('Swing',2.90),('Celebrate',3),('Despair',3.2)]:
    action=bpy.data.actions.new(kind);rig.animation_data.action=action
    for f in range(round(duration*30)+1):
        scene.frame_set(f+1);pose(f/30,kind)
        for pb in rig.pose.bones:
            pb.rotation_mode='QUATERNION'
            pb.keyframe_insert('location',frame=f+1,group=pb.name)
            pb.keyframe_insert('rotation_quaternion',frame=f+1,group=pb.name)
            pb.keyframe_insert('scale',frame=f+1,group=pb.name)
    track=rig.animation_data.nla_tracks.new();track.name=kind
    strip=track.strips.new(kind,1,action);strip.name=kind
    track.mute=True
rig.animation_data.action=None
for tr in rig.animation_data.nla_tracks:tr.mute=False
scene.frame_set(1)
# Export animation tracks individually; all baked bones are deform bones.
bpy.ops.object.select_all(action='DESELECT');rig.select_set(True)
for o,_ in parts:o.select_set(True)
bpy.context.view_layer.objects.active=rig
bpy.ops.export_scene.gltf(filepath=str(OUT/'hyomin-golfer.glb'),export_format='GLB',use_selection=True,export_animations=True,export_animation_mode='NLA_TRACKS',export_force_sampling=True,export_nla_strips=True,export_skins=True,export_yup=True)
# Studio lighting/camera only in the editable source, excluded from GLB.
for tr in rig.animation_data.nla_tracks:tr.mute=True
rig.animation_data.action=None;pose(0,'Idle')
scene.world.color=(.3,.3,.3)
def light(loc,power,size):
    bpy.ops.object.light_add(type='AREA',location=loc);o=bpy.context.object;o.data.energy=power;o.data.shape='DISK';o.data.size=size;o.rotation_euler=(V((0,0,1.5))-o.location).to_track_quat('-Z','Y').to_euler()
light((3,-5,6),500,5);light((-4,-2,3),300,4);light((2,3,5),600,3)
bpy.ops.object.camera_add(location=(3.7,-7,3.2));cam=bpy.context.object;cam.rotation_euler=(V((0,-.1,1.45))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=3.65;scene.camera=cam
scene.render.engine='BLENDER_EEVEE';scene.render.resolution_x=800;scene.render.resolution_y=900;scene.render.resolution_percentage=100
scene.render.image_settings.file_format='PNG';scene.render.film_transparent=True
scene.render.filepath=str(OUT/'studio.png')
scene.view_settings.view_transform='AgX'
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'assets/characters/hyomin-v02/hyomin-rigged-v03.blend'))
bpy.ops.render.render(write_still=True)
print(json.dumps({'model':str(OUT/'hyomin-golfer.glb'),'bones':len(arm.bones),'clips':['Idle','Swing','Celebrate','Despair'],'impactSeconds':1.16,'meshes':len(parts)}))
