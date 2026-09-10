import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { cameraPoseAt, cameraTimeline } from "../lib/cameraTimeline";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { cameraDimensions as dimensions, cameraOpticalPositions as optical, mm } from "../lib/cameraDimensions";
import { createCameraHousingGeometry } from "../lib/cameraHousing";
import { cameraRibbonPath } from "../lib/cameraRibbon";

export interface CameraSceneBounds { top: number; bottom: number }

export interface CameraScene {
  setProgress: (progress: number) => void;
  dispose: () => void;
}

const smooth = (a: number, b: number, value: number) => THREE.MathUtils.smoothstep(value, a, b);

/** An illustrative optical assembly based on Michael's CTIS hardware diagram. */
export function createCameraScene(canvas: HTMLCanvasElement, diffractionImage: HTMLImageElement, reducedMotion: boolean, onFailure: () => void, onFrame: (progress: number, bounds: CameraSceneBounds) => void, onReady: () => void): CameraScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, window.innerWidth < 700 ? 1.5 : 1.75));
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.transmissionResolutionScale = 0.5;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.localClippingEnabled = true;

  const scene = new THREE.Scene();
  const studio = new RoomEnvironment();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(studio, 0.04);
  scene.environment = environment.texture;
  scene.environmentIntensity = 0.65;
  studio.dispose();
  pmrem.dispose();
  const camera = new THREE.OrthographicCamera(-5, 5, 4, -4, 0.1, 100);
  const model = new THREE.Group();
  scene.add(model);
  scene.add(new THREE.HemisphereLight(0xf7faff, 0x777c85, 0.65));
  const key = new THREE.DirectionalLight(0xfff4e5, 3.2);
  key.position.set(-3, 8, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(window.innerWidth < 700 ? 1024 : 2048, window.innerWidth < 700 ? 1024 : 2048);
  Object.assign(key.shadow.camera, { left: -9, right: 9, top: 7, bottom: -7, near: 0.1, far: 30 });
  key.shadow.normalBias = 0.025;
  key.shadow.bias = -0.00015;
  key.shadow.radius = 3;
  scene.add(key);
  const fill = new THREE.DirectionalLight(0xc8ddff, 1.6);
  fill.position.set(4, 3, -5);
  scene.add(fill);

  const geometries = new Set<THREE.BufferGeometry>();
  const materials = new Set<THREE.Material>();
  const textures = new Set<THREE.Texture>();
  const geometry = <T extends THREE.BufferGeometry>(item: T) => { geometries.add(item); return item; };
  const material = <T extends THREE.Material>(item: T) => { materials.add(item); return item; };
  const charcoal = material(new THREE.MeshStandardMaterial({ color: 0x25262a, metalness: 0.18, roughness: 0.39 }));
  const black = material(new THREE.MeshStandardMaterial({ color: 0x101217, metalness: 0.26, roughness: 0.32 }));
  const metal = material(new THREE.MeshStandardMaterial({ color: 0xadb2bc, metalness: 0.85, roughness: 0.22 }));
  const green = material(new THREE.MeshStandardMaterial({ color: 0x386653, metalness: 0.2, roughness: 0.64 }));
  const glass = material(new THREE.MeshPhysicalMaterial({ color: 0xc6e4f3, metalness: 0, roughness: 0.06, transmission: 0.82, thickness: 0.15, ior: 1.5, transparent: true, opacity: 0.75, side: THREE.DoubleSide, depthWrite: false, iridescence: 0.28, iridescenceIOR: 1.35 }));

  function box(parent: THREE.Object3D, size: [number, number, number], position: [number, number, number], mat: THREE.Material, radius = 0.018) {
    const mesh = new THREE.Mesh(geometry(new RoundedBoxGeometry(...size, 2, radius)), mat);
    mesh.position.set(...position);
    mesh.castShadow = !mat.transparent;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  function cylinder(parent: THREE.Object3D, radius: number, depth: number, x: number, mat: THREE.Material, open = false) {
    const mesh = new THREE.Mesh(geometry(new THREE.CylinderGeometry(radius, radius, depth, 96, 1, open)), mat);
    mesh.castShadow = !mat.transparent;
    mesh.receiveShadow = true;
    mesh.rotation.z = Math.PI / 2;
    mesh.position.x = x;
    parent.add(mesh);
    return mesh;
  }
  function ring(parent: THREE.Object3D, radius: number, tube: number, x: number, mat: THREE.Material) {
    const mesh = new THREE.Mesh(geometry(new THREE.TorusGeometry(radius, tube, 10, 64)), mat);
    mesh.rotation.y = Math.PI / 2;
    mesh.position.x = x;
    parent.add(mesh);
    return mesh;
  }
  function textureFrom(draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void, width = 512, height = 128) {
    const surface = document.createElement("canvas");
    surface.width = width;
    surface.height = height;
    const context = surface.getContext("2d");
    if (!context) throw new Error("Canvas 2D unavailable");
    draw(context, width, height);
    const texture = new THREE.CanvasTexture(surface);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    textures.add(texture);
    return texture;
  }

  const finish = textureFrom((ctx, width, height) => {
    const image = ctx.createImageData(width, height);
    for (let i = 0; i < image.data.length; i += 4) {
      const noise = 120 + ((Math.sin(i * 12.9898) * 43758.5453) % 1) * 18;
      image.data[i] = image.data[i + 1] = image.data[i + 2] = noise;
      image.data[i + 3] = 255;
    }
    ctx.putImageData(image, 0, 0);
  }, 256, 256);
  finish.colorSpace = THREE.NoColorSpace;
  finish.wrapS = finish.wrapT = THREE.RepeatWrapping;
  finish.repeat.set(6, 4);
  charcoal.bumpMap = finish;
  charcoal.bumpScale = 0.004;

  // The end faces and tube share one exact rectangular outline and material.
  const shell = new THREE.Group();
  model.add(shell);
  const shellMat = material(charcoal.clone());
  shellMat.bumpMap = null;
  shellMat.bumpScale = 0;
  const bodyHeight = mm(dimensions.overall.height), bodyDepth = mm(dimensions.overall.depth);
  const housing = new THREE.Mesh(geometry(createCameraHousingGeometry()), shellMat);
  housing.castShadow = true;
  housing.receiveShadow = true;
  shell.add(housing);

  function aperturePlate(parent: THREE.Object3D, width: number, height: number, holeSize: number, square: boolean, mat: THREE.Material) {
    const shape = new THREE.Shape();
    shape.moveTo(-width / 2, -height / 2);
    shape.lineTo(width / 2, -height / 2);
    shape.lineTo(width / 2, height / 2);
    shape.lineTo(-width / 2, height / 2);
    shape.closePath();
    const hole = new THREE.Path();
    if (square) {
      hole.moveTo(-holeSize, -holeSize); hole.lineTo(-holeSize, holeSize);
      hole.lineTo(holeSize, holeSize); hole.lineTo(holeSize, -holeSize); hole.closePath();
    } else { hole.absarc(0, 0, holeSize, 0, Math.PI * 2, true); }
    shape.holes.push(hole);
    const mesh = new THREE.Mesh(geometry(new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: false, curveSegments: 48 })), mat);
    mesh.rotation.y = Math.PI / 2;
    parent.add(mesh);
    return mesh;
  }

  const cutawayPlane=new THREE.Plane();
  const housingFeather={value:0};
  for(const mat of [shellMat]) {
    mat.clippingPlanes=[cutawayPlane];
    mat.clipShadows=true;
    // Multisample coverage fades the cut edge while preserving depth ordering.
    mat.alphaToCoverage=true;
    mat.onBeforeCompile=shader=>{
      shader.uniforms.housingFeather=housingFeather;
      const clipping=THREE.ShaderChunk.clipping_planes_fragment.replaceAll(
        'distanceGradient = fwidth( distanceToPlane ) / 2.0;',
        'distanceGradient = max( fwidth( distanceToPlane ) / 2.0, housingFeather );',
      );
      shader.fragmentShader='uniform float housingFeather;\n'+shader.fragmentShader.replace('#include <clipping_planes_fragment>',clipping);
    };
    mat.customProgramCacheKey=()=> 'ctis-feathered-cutaway';
  }

  const parts = Array.from({ length: 6 }, () => new THREE.Group());
  parts.forEach(part => model.add(part));
  const assembledX = [0, mm(optical.aperture), mm(optical.collimator), mm(optical.grating), mm(optical.reimaging), mm(optical.sensor)];
  // Only the illustrative exploded view expands the spacing along the axis.
  const openX = [-4.1, -2.48, -0.78, 0.9, 2.35, 3.85];

  // A hollow barrel, knurled focusing grip, recessed iris, and coated glass.
  cylinder(parts[0], 0.57, 1.05, 0, black, true);
  cylinder(parts[0], 0.62, 0.34, -0.2, charcoal, true);
  const grip = new THREE.InstancedMesh(geometry(new RoundedBoxGeometry(0.3, 0.019, 0.018, 2, 0.003)), black, 72);
  const ribTransform = new THREE.Object3D();
  for (let i = 0; i < 72; i++) {
    const angle = i / 72 * Math.PI * 2;
    ribTransform.position.set(-0.2, Math.cos(angle) * 0.621, Math.sin(angle) * 0.621);
    ribTransform.rotation.x = angle;
    ribTransform.updateMatrix();
    grip.setMatrixAt(i, ribTransform.matrix);
  }
  grip.castShadow = true;
  parts[0].add(grip);
  ring(parts[0], 0.615, 0.012, -0.385, metal);
  ring(parts[0], 0.615, 0.012, -0.018, metal);
  ring(parts[0], 0.555, 0.046, -0.535, black);
  ring(parts[0], 0.49, 0.013, -0.557, metal);
  cylinder(parts[0], 0.22, 0.02, -0.35, black);
  const iris = new THREE.Mesh(geometry(new THREE.RingGeometry(0.2, 0.46, 9)), material(new THREE.MeshStandardMaterial({ color: 0x343841, roughness: 0.48, metalness: 0.36 })));
  iris.rotation.y = -Math.PI / 2;
  iris.position.x = -0.37;
  parts[0].add(iris);
  const lensCoating = material(new THREE.MeshPhysicalMaterial({ color: 0x8babca, metalness: 0.05, roughness: 0.045, transmission: 0.5, thickness: 0.11, ior: 1.52, transparent: true, opacity: 0.78, iridescence: 0.75, iridescenceThicknessRange: [220, 410], depthWrite: false }));
  const frontGlass = new THREE.Mesh(geometry(new THREE.SphereGeometry(0.479, 64, 40)), lensCoating);
  frontGlass.scale.x = 0.14;
  frontGlass.position.x = -0.48;
  parts[0].add(frontGlass);
  const focusScale = textureFrom(ctx => {
    ctx.fillStyle = "#202227"; ctx.fillRect(0, 0, 1024, 128);
    ctx.fillStyle = "#e0ded7"; ctx.font = "28px sans-serif";
    ctx.fillText("∞      8      5      3      2      1", 25, 55);
    for (let i = 0; i < 36; i++) ctx.fillRect(i * 28, 72, 2, i % 3 === 0 ? 28 : 14);
  }, 1024, 128);
  cylinder(parts[0], 0.576, 0.29, 0.29, material(new THREE.MeshStandardMaterial({ map: focusScale, roughness: 0.42, metalness: 0.18 })), true);

  // Fit the detailed barrel to the estimated 40 mm protrusion and 33 mm
  // diameter. Its principal plane is distinct from its geometric centre.
  const barrelBounds = new THREE.Box3().setFromObject(parts[0]);
  const barrelSize = barrelBounds.getSize(new THREE.Vector3());
  parts[0].scale.set(mm(dimensions.lensProtrusion) / barrelSize.x, mm(dimensions.imaging.diameter) / barrelSize.y, mm(dimensions.imaging.diameter) / barrelSize.z);
  assembledX[0] = mm(-dimensions.overall.length / 2) - barrelBounds.min.x * parts[0].scale.x;

  aperturePlate(parts[1], mm(dimensions.aperture.width), mm(dimensions.aperture.height), mm(dimensions.aperture.opening / 2), true, metal);
  for (const index of [2, 4]) {
    const spec = index === 2 ? dimensions.collimating : dimensions.reimaging;
    const radius = mm(spec.diameter / 2);
    const lens = new THREE.Mesh(geometry(new THREE.SphereGeometry(radius, 48, 32)), glass);
    lens.scale.set(spec.thickness / spec.diameter, 1, 1); parts[index].add(lens);
    ring(parts[index], radius, mm(index === 2 ? 0.6 : 0.25), 0, metal);
  }
  // The rear glass sits in a small threaded lens housing; its 5 mm optical
  // aperture stays to scale while the housing makes the assembly legible.
  cylinder(parts[4], mm(4.25), mm(3.8), mm(0.6), black, true);
  ring(parts[4], mm(4.25), mm(0.3), -mm(1.3), metal);
  ring(parts[4], mm(2.8), mm(0.35), -mm(1.4), black);
  for (let i = 0; i < 4; i++) ring(parts[4], mm(4.25), mm(0.15), mm(-0.7 + i * 0.75), charcoal);

  // Thin film in a printed rainbow card, following the supplied reference.
  // Do not invent a groove density or label this dual-axis assembly "linear".
  const gratingCard = textureFrom((ctx, w, h) => {
    const rainbow = ctx.createLinearGradient(0, h * 0.2, w, h * 0.75);
    ["#c44684", "#4d418c", "#2c7298", "#479e83", "#d7ce52", "#ec903d", "#c43242"].forEach((color, i) => rainbow.addColorStop(i / 6, color));
    ctx.fillStyle = rainbow;
    ctx.beginPath(); ctx.roundRect(8, 8, w - 16, h - 16, 54); ctx.fill();
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath(); ctx.roundRect(130, 300, w - 260, 590, 24); ctx.fill();
    ctx.restore();
    ctx.textAlign = "center"; ctx.lineJoin = "round";
    ctx.font = "600 64px sans-serif"; ctx.lineWidth = 11;
    ctx.strokeStyle = "#ffffff"; ctx.fillStyle = "#202825";
    for (const [text, y] of [["Diffraction", 155], ["Grating", 231]] as const) {
      ctx.strokeText(text, w / 2, y); ctx.fillText(text, w / 2, y);
    }
    // A small printed spectrum echoes the card without implying calibration.
    ctx.fillStyle = "rgba(255,255,255,.88)";
    ctx.fillRect(135, 993, w - 270, 5);
    for (let i = 0; i <= 14; i++) ctx.fillRect(135 + i * (w - 270) / 14, 993, 4, i % 2 === 0 ? 30 : 17);
  }, 1024, 1228);
  const cardMat = material(new THREE.MeshStandardMaterial({ map: gratingCard, side: THREE.DoubleSide, transparent: true, alphaTest: 0.35, roughness: 0.48, metalness: 0.02 }));
  const card = new THREE.Mesh(geometry(new THREE.PlaneGeometry(1.5, 1.8)), cardMat);
  card.rotation.y = -Math.PI / 2; card.position.x = -0.014; parts[3].add(card);
  const gratingMat = material(new THREE.MeshPhysicalMaterial({ color: 0xe5ede7, roughness: 0.04, transmission: 0.9, thickness: 0.006, transparent: true, opacity: 0.24, depthWrite: false, side: THREE.DoubleSide, iridescence: 0.65 }));
  const film = new THREE.Mesh(geometry(new THREE.PlaneGeometry(1.12, 0.87)), gratingMat);
  film.rotation.y = -Math.PI / 2; film.position.y = 0.027; parts[3].add(film);
  parts[3].scale.set(1, mm(dimensions.grating.height) / 1.8, mm(dimensions.grating.width) / 1.5);

  // A Raspberry Pi camera board with its sensor facing the optical path.
  box(parts[5], [mm(1.2), mm(dimensions.sensor.boardHeight), mm(dimensions.sensor.boardWidth)], [mm(2.3), 0, 0], green, mm(0.2));
  box(parts[5], [mm(1), mm(8), mm(8)], [mm(1.2), 0, 0], metal, mm(0.15));
  const ceramic = material(new THREE.MeshStandardMaterial({color: 0x3d4148, metalness: 0.4, roughness: 0.24}));
  box(parts[5], [mm(.35), mm(6), mm(6)], [mm(.65), 0, 0], ceramic, mm(.12));
  box(parts[5], [mm(1), mm(dimensions.sensor.activeHeight), mm(dimensions.sensor.activeWidth)], [mm(0.55), 0, 0], black, mm(0.03));
  for (const y of [-mm(10), mm(10)]) for (const z of [-mm(10.5), mm(10.5)]) {
    const screw = cylinder(parts[5], mm(0.8), mm(0.5), mm(1.5), metal); screw.position.y = y; screw.position.z = z;
  }
  for (let i = 0; i < 7; i++) box(parts[5], [mm(0.5), mm(1.2), mm(2)], [mm(1.4), mm(-8 + i * 2.7), mm(9)], black, mm(0.05));
  box(parts[5], [mm(1), mm(2), mm(17)], [mm(2), -mm(10), 0], material(new THREE.MeshStandardMaterial({ color: 0xe1d6b5, roughness: 0.65 })), mm(0.1));

  const computer = new THREE.Group(); model.add(computer);
  const pcb = material(new THREE.MeshStandardMaterial({color: 0x237c53, roughness: .46, metalness: .2}));
  const gold = material(new THREE.MeshStandardMaterial({color: 0xc5a25b, roughness: .28, metalness: .8}));
  const plastic = material(new THREE.MeshStandardMaterial({color: 0x23282c, roughness: .5}));
  box(computer, [mm(85), mm(1.6), mm(56)], [0,0,0], pcb, mm(.7));
  // Processor, memory, GPIO header, USB/Ethernet housings and camera socket.
  box(computer, [mm(15), mm(1.5), mm(15)], [-mm(5),mm(1.5),0], metal, mm(.3));
  box(computer, [mm(11), mm(.9), mm(9)], [-mm(20),mm(1.25),mm(8)], ceramic, mm(.15));
  box(computer, [mm(51), mm(2.5), mm(5)], [-mm(8),mm(2),-mm(24)], plastic, mm(.2));
  for (let i = 0; i < 20; i++) for (const z of [-25.2,-22.8]) box(computer,[mm(.65),mm(5),mm(.65)],[mm(-32+i*2.54),mm(5),mm(z)],gold,mm(.08));
  for (const z of [-17,1,19]) {
    box(computer,[mm(15),mm(12),mm(14)],[mm(35),mm(6.8),mm(z)],metal,mm(.5));
    box(computer,[mm(.15),mm(8),mm(10)],[mm(42.55),mm(7),mm(z)],plastic,mm(.15));
    box(computer,[mm(.25),mm(1.3),mm(9)],[mm(42.65),mm(7),mm(z)],z===19?black:material(new THREE.MeshStandardMaterial({color:0x235f94,roughness:.5})),mm(.05));
  }
  for (const x of [-30,-12,3]) {
    box(computer,[mm(8),mm(3),mm(6)],[mm(x),mm(2.3),mm(25)],metal,mm(.4));
    box(computer,[mm(5.7),mm(1.4),mm(.1)],[mm(x),mm(2.4),mm(28.05)],black,mm(.1));
  }
  const connectorLocal = new THREE.Vector3(mm(16), mm(2.1), mm(4));
  box(computer,[mm(3),mm(2.6),mm(18)],[connectorLocal.x,mm(2),connectorLocal.z],plastic,mm(.15));
  box(computer,[mm(.8),mm(.5),mm(17)],[connectorLocal.x-mm(1.5),mm(3.3),connectorLocal.z],metal,mm(.08));
  for (const x of [-39,19]) for (const z of [-24.5,24.5]) {
    const pad = new THREE.Mesh(geometry(new THREE.RingGeometry(mm(1.3),mm(2.5),24)),gold);
    pad.rotation.x=-Math.PI/2;pad.position.set(mm(x),mm(.81),mm(z));computer.add(pad);
  }
  const silkscreen = textureFrom(ctx=>{
    ctx.fillStyle='#e8efe5';ctx.font='600 52px sans-serif';ctx.fillText('Raspberry Pi',45,72);
    ctx.font='24px sans-serif';ctx.fillText('CAMERA',650,180);
    ctx.strokeStyle='rgba(192,217,153,.6)';ctx.lineWidth=2;
    for(let i=0;i<18;i++){ctx.beginPath();ctx.moveTo(90+i*19,200);ctx.lineTo(90+i*19,230+i*8);ctx.lineTo(650+i*12,230+i*8);ctx.stroke();}
    ctx.fillStyle='#dce5ce';for(let i=0;i<24;i++)ctx.fillRect(40+i*29,470,14,8);
  },1024,672);
  const boardPrint = new THREE.Mesh(geometry(new THREE.PlaneGeometry(mm(80),mm(52))),material(new THREE.MeshBasicMaterial({map:silkscreen,transparent:true,depthWrite:false,toneMapped:false})));
  boardPrint.rotation.x=-Math.PI/2;boardPrint.position.y=mm(.82);computer.add(boardPrint);
  for(let i=0;i<18;i++)box(computer,[mm(1.6),mm(.5),mm(.8)],[mm(-31+(i%9)*5),mm(1.05),mm(15+Math.floor(i/9)*3)],i%3?ceramic:gold,mm(.06));

  // A flat CSI ribbon, with visible conductors and blue reinforced ends.
  const ribbonTexture = textureFrom((ctx,w,h)=>{
    ctx.fillStyle='#e4e6df';ctx.fillRect(0,0,w,h);
    ctx.fillStyle='#aeb6a8';for(let i=0;i<15;i++)ctx.fillRect(6+i*(w-12)/15,0,2,h);
    ctx.fillStyle='#417caa';ctx.fillRect(0,0,w,45);ctx.fillRect(0,h-45,w,45);
  },256,1024);
  const ribbonGeo = geometry(new THREE.BufferGeometry());
  const ribbonSegments=96, ribbonPositions=new Float32Array((ribbonSegments+1)*6), ribbonUvs=new Float32Array((ribbonSegments+1)*4), ribbonIndices:number[]=[];
  for(let i=0;i<=ribbonSegments;i++){
    ribbonUvs.set([0,i/ribbonSegments,1,i/ribbonSegments],i*4);
    if(i<ribbonSegments){const k=i*2;ribbonIndices.push(k,k+1,k+2,k+1,k+3,k+2);}
  }
  ribbonGeo.setAttribute('position',new THREE.BufferAttribute(ribbonPositions,3).setUsage(THREE.DynamicDrawUsage));
  ribbonGeo.setAttribute('uv',new THREE.BufferAttribute(ribbonUvs,2));ribbonGeo.setIndex(ribbonIndices);
  const ribbon=new THREE.Mesh(ribbonGeo,material(new THREE.MeshStandardMaterial({map:ribbonTexture,side:THREE.DoubleSide,roughness:.55,metalness:.12})));
  model.add(ribbon);

  // The actual capture shown in Michael's hardware slide, also used in the
  // enlarged image. No generated diffraction image or color remapping.
  const captureTexture = new THREE.Texture(diffractionImage);
  captureTexture.colorSpace = THREE.SRGBColorSpace;
  captureTexture.needsUpdate = true;
  captureTexture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  textures.add(captureTexture);
  const captureMat = material(new THREE.MeshBasicMaterial({ map: captureTexture, transparent: true, opacity: 0, toneMapped: false }));
  const captureHeight = mm(dimensions.sensor.activeHeight);
  const capture = new THREE.Mesh(geometry(new THREE.PlaneGeometry(captureHeight * diffractionImage.naturalWidth / diffractionImage.naturalHeight, captureHeight)), captureMat);
  capture.rotation.y = -Math.PI / 2; capture.position.x = 0; capture.renderOrder = 3; parts[5].add(capture);

  // Component labels stay in the scene, so they follow their respective parts.
  const labels: THREE.Sprite[] = [];
  const names = ["Imaging Lens", "Square Aperture", "Collimating Lens", "Diffraction Grating", "Re-imaging Lens", "CMOS Sensor", "Raspberry Pi"];
  names.forEach((name, index) => {
    const map = textureFrom(ctx => {
      ctx.fillStyle = "#68756c"; ctx.font = "38px sans-serif"; ctx.textAlign = "center"; ctx.fillText(`${index + 1}`, 256, 39);
      ctx.fillStyle = "#34443a"; ctx.font = "49px sans-serif"; ctx.fillText(name, 256, 86);
    });
    const label = new THREE.Sprite(material(new THREE.SpriteMaterial({ map, transparent: true, opacity: 0, depthTest: false })));
    label.scale.set(1.55, 0.3875, 1);
    label.position.set(0, index === 6 ? -2.35 : index >= 4 ? 0.9 : 1.18, 0);
    // Labels are diagram annotations, independent of the physical part scale.
    model.add(label); labels.push(label);
  });

  const rayGroup = new THREE.Group();
  model.add(rayGroup);
  const wavelengthSamples = [440, 540, 650];
  const rays: { line: THREE.Line; orderY: number; orderZ: number; wavelength: number }[] = [];
  for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
    if (y === 0 && z === 0) continue;
    for (let band = 0; band < 3; band++) {
      const spread = wavelengthSamples[band] / 700 * mm(dimensions.reimaging.diameter / 2) * 0.92;
      // Remove illustrative rays that would pass outside the clear aperture.
      // This includes the upper/lower diagonal paths in the previous model.
      if (Math.hypot(y * spread, z * spread) > mm(dimensions.reimaging.diameter / 2 - 0.25)) continue;
      const rayMat = material(new THREE.LineBasicMaterial({ color: [0x6688bd, 0x80ab79, 0xd07873][band], transparent: true, opacity: 0, depthWrite: false }));
      const rayGeo = geometry(new THREE.BufferGeometry());
      rayGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(9), 3));
      const line = new THREE.Line(rayGeo, rayMat); rayGroup.add(line);
      rays.push({ line, orderY: y, orderZ: z, wavelength: band });
    }
  }
  const incomingMat = material(new THREE.LineBasicMaterial({ color: 0x99aaa0, transparent: true, opacity: 0 }));
  const incomingGeo = geometry(new THREE.BufferGeometry());
  incomingGeo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(21), 3));
  rayGroup.add(new THREE.Line(incomingGeo, incomingMat));

  const ground = new THREE.Mesh(geometry(new THREE.PlaneGeometry(35, 20)), material(new THREE.ShadowMaterial({ opacity: 0.13, depthWrite: false })));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -bodyHeight / 2 - mm(1);
  ground.receiveShadow = true;
  scene.add(ground);
  model.traverse(object => {
    if (object instanceof THREE.Mesh && object.material === shellMat) object.castShadow = true;
  });

  const shadowTexture = textureFrom((ctx, width, height) => {
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 8, width / 2, height / 2, width / 2);
    gradient.addColorStop(0, "rgba(69,88,73,0.15)"); gradient.addColorStop(0.5, "rgba(69,88,73,0.06)"); gradient.addColorStop(1, "rgba(69,88,73,0)");
    ctx.fillStyle = gradient; ctx.fillRect(0, 0, width, height);
  }, 256, 256);
  const shadowMat = material(new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }));
  const shadow = new THREE.Mesh(geometry(new THREE.PlaneGeometry(11, 6)), shadowMat);
  shadow.rotation.x = -Math.PI / 2; shadow.position.set(0, -bodyHeight / 2 - mm(1.1), 0); scene.add(shadow);

  let width = 0;
  let height = 0;
  let current = 0;
  let target = 0;
  let destroyed = false;
  let contextLost = false;
  let running = false;
  let previousTime = 0;
  let renderedPose: number | null = null;
  let firstFrameRendered = false;
  let revealFrame = 0;
  let visibleBounds: CameraSceneBounds = {top:0,bottom:1};
  const objectBounds=new THREE.Box3(), corner=new THREE.Vector3(), spriteCenter=new THREE.Vector3(), spriteScale=new THREE.Vector3();
  function measureVisibleBounds(): CameraSceneBounds {
    let top=1,bottom=0;
    model.traverseVisible(object=>{
      if(object instanceof THREE.Sprite){
        if(object.material.opacity<.01)return;
        object.getWorldPosition(spriteCenter).project(camera);object.getWorldScale(spriteScale);
        const center=(1-spriteCenter.y)/2,half=spriteScale.y/(camera.top-camera.bottom)/2;
        top=Math.min(top,center-half);bottom=Math.max(bottom,center+half);
      } else if(object instanceof THREE.Mesh){
        if(!Array.isArray(object.material)&&object.material.opacity<.01)return;
        objectBounds.setFromObject(object);
        for(let i=0;i<8;i++){
          corner.set(i&1?objectBounds.max.x:objectBounds.min.x,i&2?objectBounds.max.y:objectBounds.min.y,i&4?objectBounds.max.z:objectBounds.min.z).project(camera);
          const y=(1-corner.y)/2;top=Math.min(top,y);bottom=Math.max(bottom,y);
        }
      }
    });
    return {top,bottom};
  }

  function draw(position: number) {
    const progress = cameraPoseAt(position);
    // Continue the page motion on every frame, but avoid drawing identical
    // geometry during the reading interval or after the sensor is exposed.
    const renderPose = progress <= cameraTimeline.openingStart ? 0
      : progress >= cameraTimeline.sensorEnd ? 1
      : progress >= cameraTimeline.separationEnd && progress <= cameraTimeline.sensorStart ? cameraTimeline.separationEnd : progress;
    if (renderPose === renderedPose) {onFrame(position,visibleBounds);return;}
    // Reveal the fitted arrangement before expanding it along the optical axis.
    const explode = smooth(cameraTimeline.separationStart, cameraTimeline.separationEnd, progress);
    const cutaway = smooth(cameraTimeline.openingStart, cameraTimeline.openingEnd, progress);
    housingFeather.value=mm(5)*smooth(0,.18,cutaway);
    shell.visible = cutaway < 1;
    parts.forEach((part, index) => {
      part.position.x = THREE.MathUtils.lerp(assembledX[index], openX[index], explode);
      part.visible = index === 0 || progress > cameraTimeline.openingStart;
    });
    computer.position.set(THREE.MathUtils.lerp(mm(dimensions.computer.centerX),2.0,explode),THREE.MathUtils.lerp(mm(dimensions.computer.centerY),-1.55,smooth(0,.15,explode)),THREE.MathUtils.lerp(0,.15,explode));
    computer.visible=progress>cameraTimeline.openingStart;
    ribbon.visible=computer.visible;
    const ribbonPath=cameraRibbonPath([parts[5].position.x*30+1.4,-10.5,0],[computer.position.x*30,computer.position.y*30,computer.position.z*30],ribbonSegments+1);
    ribbonPath.forEach(([x,y,z],i)=>ribbonPositions.set([mm(x),mm(y),mm(z-dimensions.computer.ribbonWidth/2),mm(x),mm(y),mm(z+dimensions.computer.ribbonWidth/2)],i*6));
    ribbonGeo.getAttribute('position').needsUpdate=true;ribbonGeo.computeVertexNormals();ribbonGeo.computeBoundingSphere();ribbonGeo.computeBoundingBox();
    labels.forEach((label, index) => { label.position.x = index===6?computer.position.x+1.65:parts[index].position.x; label.visible = width > 520; (label.material as THREE.SpriteMaterial).opacity = smooth(0.5, cameraTimeline.separationEnd, progress); });
    const rayOpacity = smooth(cameraTimeline.sensorStart, cameraTimeline.sensorEnd, progress);
    captureMat.opacity = rayOpacity;
    rays.forEach(({ line, orderY, orderZ, wavelength }) => {
      const nm = wavelengthSamples[wavelength];
      const spread = nm / 700 * mm(dimensions.reimaging.diameter / 2) * 0.92;
      const displacement = nm / 700 * mm(dimensions.sensor.activeHeight / 2) * 0.9;
      const attr = line.geometry.getAttribute("position") as THREE.BufferAttribute;
      attr.setXYZ(0, parts[3].position.x, 0, 0);
      attr.setXYZ(1, parts[4].position.x, orderY * spread, orderZ * spread);
      attr.setXYZ(2, parts[5].position.x, orderY * displacement, orderZ * displacement);
      attr.needsUpdate = true; line.geometry.computeBoundingSphere();
      (line.material as THREE.LineBasicMaterial).opacity = rayOpacity * 0.78;
    });
    const attr = incomingGeo.getAttribute("position") as THREE.BufferAttribute;
    attr.setXYZ(0, parts[0].position.x - 0.9, 0, 0);
    for (let i = 0; i < 5; i++) attr.setXYZ(i + 1, parts[i].position.x, 0, 0);
    attr.setXYZ(6, parts[5].position.x, 0, 0);
    attr.needsUpdate = true; incomingGeo.computeBoundingSphere(); incomingMat.opacity = rayOpacity * 0.6;
    shadowMat.opacity = 1 - explode * 0.66;
    model.rotation.y = THREE.MathUtils.lerp(-0.1, 0.02, explode);
    // Keep the assembled prism level so its front edges read as parallel.
    model.rotation.z = THREE.MathUtils.lerp(0, width < 600 ? 0.1 : 0, explode);
    camera.position.set(THREE.MathUtils.lerp(-8, -5.5, explode), THREE.MathUtils.lerp(5, 3.4, explode), 12);
    camera.lookAt(-0.25, THREE.MathUtils.lerp(0.03, -0.55, explode), 0);
    const aspect = width / height;
    const horizontal = THREE.MathUtils.lerp(8.05, 9.8, explode);
    const viewHeight = Math.max(5.3, horizontal / aspect);
    camera.left = -viewHeight * aspect / 2; camera.right = viewHeight * aspect / 2;
    camera.top = viewHeight / 2; camera.bottom = -viewHeight / 2; camera.updateProjectionMatrix();
    model.updateMatrixWorld(true);
    cutawayPlane.set(new THREE.Vector3(0,0,-1),THREE.MathUtils.lerp(bodyDepth/2+mm(8),-bodyDepth/2-mm(8),cutaway)).applyMatrix4(model.matrixWorld);
    renderer.render(scene, camera);
    visibleBounds=measureVisibleBounds();
    onFrame(position,visibleBounds);
    renderedPose = renderPose;
    if (!firstFrameRendered) {
      firstFrameRendered = true;
      // Reveal only after a correctly sized, textured frame has been rendered.
      revealFrame = requestAnimationFrame(() => { if (!destroyed && !contextLost) onReady(); });
    }
  }
  function stop() { renderer.setAnimationLoop(null); running = false; }
  function animate(time: number) {
    const elapsed = previousTime ? Math.min(time - previousTime, 250) : 16;
    previousTime = time;
    current += (target - current) * (1 - Math.exp(-elapsed / 110));
    if (Math.abs(target - current) < 0.0001) current = target;
    draw(current);
    if (current === target) stop();
  }
  function requestDraw() {
    if (destroyed || contextLost || document.hidden || width === 0 || height === 0) return;
    // A restored scroll position or a chapter selected during loading should
    // be the first visible pose, without briefly showing the closed model.
    if (!firstFrameRendered) current = target;
    if (reducedMotion) { current = target; draw(current); return; }
    if (!running) { running = true; previousTime = 0; renderer.setAnimationLoop(animate); }
  }
  const resize = new ResizeObserver(([entry]) => {
    width = Math.max(1, entry.contentRect.width); height = Math.max(1, entry.contentRect.height);
    renderedPose = null;
    renderer.setSize(width, height, false); requestDraw();
  });
  resize.observe(canvas);
  // Complete each short transition even if scrolling briefly moves the canvas
  // outside the viewport. Intersection-based pausing can strand it halfway
  // between layouts. The loop stops at its target and cached poses skip WebGL.
  const onVisibility = () => { if (document.hidden) stop(); else requestDraw(); };
  const onLost = (event: Event) => { event.preventDefault(); contextLost = true; stop(); onFailure(); };
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onLost);

  return {
    setProgress(progress) {
      const next = THREE.MathUtils.clamp(progress, 0, cameraTimeline.length);
      if (next === target) return;
      target = next;
      requestDraw();
    },
    dispose() {
      destroyed = true; stop(); resize.disconnect();
      cancelAnimationFrame(revealFrame);
      document.removeEventListener("visibilitychange", onVisibility); canvas.removeEventListener("webglcontextlost", onLost);
      model.traverse(object => { if (object instanceof THREE.InstancedMesh) object.dispose(); });
      geometries.forEach(item => item.dispose()); materials.forEach(item => item.dispose()); textures.forEach(item => item.dispose());
      scene.clear(); key.shadow.dispose(); environment.dispose(); renderer.dispose(); renderer.forceContextLoss();
    },
  };
}
