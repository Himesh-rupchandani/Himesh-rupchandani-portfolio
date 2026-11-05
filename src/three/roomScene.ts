import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { soundManager } from '../audio/soundManager';

export interface CameraStation {
  id: string;
  pos: THREE.Vector3;
  target: THREE.Vector3;
}

// 8 Cinematic Camera Stations: First scroll zooms DIRECTLY into the personal computer screen!
export const CAMERA_STATIONS: CameraStation[] = [
  // 0. Intro: Full view into the open room diorama with 3D title & furniture (zoomed-out overview)
  {
    id: 'intro',
    pos: new THREE.Vector3(0.0, 4.8, 8.2),
    target: new THREE.Vector3(0.0, 1.0, 0.2),
  },
  // 1. About: Matches exact angle from reference screenshot looking across desk!
  {
    id: 'about',
    pos: new THREE.Vector3(0.12, 1.48, 1.42),
    target: new THREE.Vector3(1.30, 0.98, 0.16),
  },
  // 2. Case Studies / Projects: Flat-on direct screen focus on active project
  {
    id: 'projects',
    pos: new THREE.Vector3(0.42, 1.34, 1.05),
    target: new THREE.Vector3(1.54, 1.28, 0.03),
  },
  // 3. Skills: Left wall view with shelves & interactive tools
  {
    id: 'skills',
    pos: new THREE.Vector3(0.1, 1.85, 1.2),
    target: new THREE.Vector3(-1.1, 1.6, -0.6),
  },
  // 4. Lab Bench: Oscilloscope, 3D printer, Half-Adder circuit & multimeter
  {
    id: 'lab',
    pos: new THREE.Vector3(-0.2, 1.45, 1.1),
    target: new THREE.Vector3(-1.35, 1.05, -0.2),
  },
  // 5. Journey: Hanging milestone frames with pendulum swing
  {
    id: 'journey',
    pos: new THREE.Vector3(0.0, 1.95, 1.3),
    target: new THREE.Vector3(-1.2, 1.7, -0.4),
  },
  // 6. Certificates: Wall gallery of credentials on left wall
  {
    id: 'certificates',
    pos: new THREE.Vector3(0.1, 2.15, 1.4),
    target: new THREE.Vector3(-1.1, 2.1, -0.5),
  },
  // 7. Contact: Desktop smartphone dock on desk
  {
    id: 'contact',
    pos: new THREE.Vector3(1.15, 1.25, 1.45),
    target: new THREE.Vector3(1.83, 0.98, 0.76),
  },
];

interface SkillKeycap {
  name: string;
  group: THREE.Group;
  initialPos: THREE.Vector3;
  initialRot: THREE.Euler;
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  rot: THREE.Euler;
  rotVel: THREE.Vector3;
  state: 'wall' | 'falling' | 'floor' | 'returning';
}

interface HangingFrame {
  group: THREE.Group;
  anchorY: number;
  swingAngle: number;
  swingVel: number;
}

export class RoomScene {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;
  private animFrameId: number = 0;

  // Camera lerp targets
  private targetPos: THREE.Vector3 = new THREE.Vector3().copy(CAMERA_STATIONS[0].pos);
  private currentPos: THREE.Vector3 = new THREE.Vector3().copy(CAMERA_STATIONS[0].pos);
  private targetLookAt: THREE.Vector3 = new THREE.Vector3().copy(CAMERA_STATIONS[0].target);
  private currentLookAt: THREE.Vector3 = new THREE.Vector3().copy(CAMERA_STATIONS[0].target);

  private pointerOffset: THREE.Vector2 = new THREE.Vector2(0, 0);

  // Dynamic Textures and Canvases
  private mainScreenCanvas: HTMLCanvasElement;
  private mainScreenCtx: CanvasRenderingContext2D;
  private mainScreenTexture: THREE.CanvasTexture;

  private phoneScreenCanvas: HTMLCanvasElement;
  private phoneScreenCtx: CanvasRenderingContext2D;
  private phoneScreenTexture: THREE.CanvasTexture;

  private scopeCanvas: HTMLCanvasElement;
  private scopeCtx: CanvasRenderingContext2D;
  private scopeTexture: THREE.CanvasTexture;

  private adderCanvas: HTMLCanvasElement;
  private adderCtx: CanvasRenderingContext2D;
  private adderTexture: THREE.CanvasTexture;

  private keyboardCanvas: HTMLCanvasElement;
  private keyboardCtx: CanvasRenderingContext2D;
  private keyboardTexture: THREE.CanvasTexture;

  // Active Project on PC Screen
  public activeProjectIdx: number = 0;

  // Newton's Cradle State
  private cradleBalls: THREE.Mesh[] = [];
  private cradleAngle: number = 0;
  private cradleVel: number = 0;
  private isCradleSwinging: boolean = false;
  private lastClickTime: number = 0;

  // Skills Keycaps State
  private keycaps: SkillKeycap[] = [];
  public keysDropped: boolean = false;

  // Logic Half Adder State
  public halfAdderA: boolean = true;
  public halfAdderB: boolean = false;

  // Hanging Milestone Frames
  private hangingFrames: HangingFrame[] = [];

  // Clock
  private clock: THREE.Clock = new THREE.Clock();

  // 3D Room Diorama Root Group (Rotates from left to center on page load)
  public roomRoot: THREE.Group = new THREE.Group();
  private introProgress: number = 0;

  constructor(container: HTMLDivElement) {
    this.scene = new THREE.Scene();
    // Pure dark void background (matching reference screenshot)
    this.scene.background = new THREE.Color(0x050505);
    this.scene.fog = new THREE.FogExp2(0x050505, 0.012);

    // Initial left tilt for starting entrance rotation
    this.roomRoot.rotation.y = -0.52;
    this.scene.add(this.roomRoot);

    const aspect = container.clientWidth / container.clientHeight;
    // 50 deg natural architectural isometric FOV
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
    this.camera.position.copy(this.currentPos);
    this.camera.lookAt(this.currentLookAt);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    container.appendChild(this.renderer.domElement);

    // Studio Environment lighting
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 1. Monitor Canvas (High-resolution 1280x720 for crisp text & detection)
    this.mainScreenCanvas = document.createElement('canvas');
    this.mainScreenCanvas.width = 1280;
    this.mainScreenCanvas.height = 720;
    this.mainScreenCtx = this.mainScreenCanvas.getContext('2d')!;
    this.mainScreenTexture = new THREE.CanvasTexture(this.mainScreenCanvas);
    this.mainScreenTexture.colorSpace = THREE.SRGBColorSpace;

    // 2. Phone Canvas
    this.phoneScreenCanvas = document.createElement('canvas');
    this.phoneScreenCanvas.width = 512;
    this.phoneScreenCanvas.height = 960;
    this.phoneScreenCtx = this.phoneScreenCanvas.getContext('2d')!;
    this.phoneScreenTexture = new THREE.CanvasTexture(this.phoneScreenCanvas);
    this.phoneScreenTexture.colorSpace = THREE.SRGBColorSpace;

    // 3. Oscilloscope Canvas
    this.scopeCanvas = document.createElement('canvas');
    this.scopeCanvas.width = 512;
    this.scopeCanvas.height = 384;
    this.scopeCtx = this.scopeCanvas.getContext('2d')!;
    this.scopeTexture = new THREE.CanvasTexture(this.scopeCanvas);
    this.scopeTexture.colorSpace = THREE.SRGBColorSpace;

    // 4. Half Adder Canvas
    this.adderCanvas = document.createElement('canvas');
    this.adderCanvas.width = 600;
    this.adderCanvas.height = 360;
    this.adderCtx = this.adderCanvas.getContext('2d')!;
    this.adderTexture = new THREE.CanvasTexture(this.adderCanvas);
    this.adderTexture.colorSpace = THREE.SRGBColorSpace;

    // 5. RGB Keyboard Canvas
    this.keyboardCanvas = document.createElement('canvas');
    this.keyboardCanvas.width = 512;
    this.keyboardCanvas.height = 180;
    this.keyboardCtx = this.keyboardCanvas.getContext('2d')!;
    this.keyboardTexture = new THREE.CanvasTexture(this.keyboardCanvas);
    this.keyboardTexture.colorSpace = THREE.SRGBColorSpace;

    this.setupLights();
    this.buildOpenRoomDiorama();

    this.animate();
  }

  private setupLights() {
    const hemiLight = new THREE.HemisphereLight(0xffedd5, 0x1c1917, 0.85);
    this.scene.add(hemiLight);

    // Warm spotlight beam onto personal computer desk
    const deskSpot = new THREE.SpotLight(0xffa550, 5.0, 6.5, Math.PI / 3.4, 0.45, 1.1);
    deskSpot.position.set(0.65, 2.4, 0.1);
    deskSpot.target.position.set(1.28, 0.85, -0.28);
    deskSpot.castShadow = true;
    deskSpot.shadow.bias = -0.0003;
    deskSpot.shadow.mapSize.width = 1024;
    deskSpot.shadow.mapSize.height = 1024;
    this.scene.add(deskSpot);
    this.scene.add(deskSpot.target);

    // Dedicated bright spotlight focused on 3D floating title
    const titleSpot = new THREE.SpotLight(0xfff7ed, 4.2, 9.0, Math.PI / 3.5, 0.4, 1.2);
    titleSpot.position.set(0, 5.4, 0.8);
    titleSpot.target.position.set(0, 3.8, -1.95);
    this.scene.add(titleSpot);
    this.scene.add(titleSpot.target);

    // Eye-catching cyan rim light for striking architectural silhouette against dark void
    const rimLight = new THREE.DirectionalLight(0x38bdf8, 1.2);
    rimLight.position.set(-4.5, 5.0, 2.2);
    this.scene.add(rimLight);

    // Moonlight through window (directional light casting soft shadows into the room)
    const moonLight = new THREE.DirectionalLight(0xa5c9ff, 1.6);
    moonLight.position.set(2.8, 4.2, 0.8);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.width = 1024;
    moonLight.shadow.mapSize.height = 1024;
    this.scene.add(moonLight);

    // Warm corner accent point light
    const cornerPoint = new THREE.PointLight(0xffedd5, 1.6, 4.2);
    cornerPoint.position.set(0, 2.4, -1.6);
    this.scene.add(cornerPoint);

    // Lab bench warm spotlight
    const labPoint = new THREE.PointLight(0xffecd2, 1.8, 3.8);
    labPoint.position.set(-1.2, 2.1, 0.2);
    this.scene.add(labPoint);
  }

  // BUILD THE OPEN V-CORNER DIORAMA (CORNER AT BACK, OPEN TO VIEWER)
  private buildOpenRoomDiorama() {
    const wallLength = 4.6;
    const wallHeight = 3.3;
    const wallThick = 0.16;

    // 1. Dark Plinth / Pedestal Base (Raised Platform under the room in Screenshot 1)
    const plinthMat = new THREE.MeshStandardMaterial({
      color: 0x14100e,
      roughness: 0.65,
      metalness: 0.15,
    });
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(wallLength + 0.35, 0.45, wallLength + 0.35),
      plinthMat
    );
    plinth.rotation.y = Math.PI / 4;
    plinth.position.set(0, -0.23, 1.02);
    plinth.receiveShadow = true;
    this.roomRoot.add(plinth);

    // 2. Warm Hardwood Parquet Floor (Fully covers the entire diorama room surface!)
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x5a3e29,
      roughness: 0.38,
      metalness: 0.05,
    });
    const floor = new THREE.Mesh(new THREE.BoxGeometry(wallLength, 0.05, wallLength), floorMat);
    floor.rotation.y = Math.PI / 4;
    floor.position.set(0, 0.025, 1.02);
    floor.receiveShadow = true;
    this.roomRoot.add(floor);

    // 3. Center Circular Cream Woven Rug with concentric rings (Screenshot 1)
    const rugMat = new THREE.MeshStandardMaterial({
      color: 0xd8cebe,
      roughness: 0.92,
    });
    const rug = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.012, 48), rugMat);
    rug.position.set(0.0, 0.056, 0.35);
    rug.receiveShadow = true;
    this.roomRoot.add(rug);

    // Concentric ring grooves on rug
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xc8bea8, roughness: 0.95 });
    [0.5, 0.9, 1.2].forEach((r) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.006, 8, 36), ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0.0, 0.062, 0.35);
      this.roomRoot.add(ring);
    });

    // Low modern coffee table with open laptop on the rug (Screenshot 1)
    const ctMat = new THREE.MeshStandardMaterial({ color: 0x3d2719, roughness: 0.4 });
    const cTable = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.18, 0.38), ctMat);
    cTable.position.set(0.05, 0.14, 0.85);
    cTable.castShadow = true;
    this.roomRoot.add(cTable);

    // Silver open laptop on coffee table
    const lapMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.85, roughness: 0.2 });
    const lapBase = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.01, 0.16), lapMat);
    lapBase.position.set(0.05, 0.235, 0.85);
    this.roomRoot.add(lapBase);

    const lapScreen = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.15, 0.008), lapMat);
    lapScreen.position.set(0.05, 0.31, 0.78);
    lapScreen.rotation.x = 0.25;
    this.roomRoot.add(lapScreen);

    // Round pouf / floor cushion beside table
    const poufMat = new THREE.MeshStandardMaterial({ color: 0x9a3412, roughness: 0.8 });
    const pouf = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.2, 0.12, 24), poufMat);
    pouf.position.set(0.55, 0.11, 1.05);
    pouf.castShadow = true;
    this.roomRoot.add(pouf);

    // 4. Back Corner Potted Snake Plant (Screenshot 1)
    const plantGroup = new THREE.Group();
    plantGroup.position.set(0, 0.05, -2.05);

    const potMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4 });
    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.32, 24), potMat);
    pot.position.y = 0.16;
    pot.castShadow = true;
    plantGroup.add(pot);

    const leafMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.35 });
    for (let i = 0; i < 9; i++) {
      const angle = (i * Math.PI * 2) / 9;
      const leafH = 0.45 + (i % 3) * 0.1;
      const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.045, leafH, 8), leafMat);
      leaf.position.set(Math.cos(angle) * 0.08, 0.32 + leafH / 2, Math.sin(angle) * 0.08);
      leaf.rotation.x = Math.sin(angle) * 0.25;
      leaf.rotation.z = -Math.cos(angle) * 0.25;
      leaf.castShadow = true;
      plantGroup.add(leaf);
    }
    this.roomRoot.add(plantGroup);

    // Small wall clock in the corner
    const clockMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, 0.02, 24),
      new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8 })
    );
    clockMesh.rotation.x = Math.PI / 2;
    clockMesh.position.set(0.35, 2.7, -2.15);
    this.roomRoot.add(clockMesh);

    // 5. Left Wall Group (Angled from back corner to front-left, facing INTO room)
    this.buildLeftWall(wallLength, wallHeight, wallThick);

    // 6. Right Wall & Personal Computer Workstation (Screen faces DIRECTLY at camera on first scroll!)
    this.buildRightWallAndPC(wallLength, wallHeight, wallThick);

    // 7. TRUE 3D EXTRUDED TITLE FLOATING ABOVE BACK CORNER (Screenshot 1: "Himesh \n Rupchandani")
    this.build3DFloatingName();
  }

  // Left Wall (Center: -1.6, 0, -0.6. Rotation: -45 deg. Facing into room!)
  private buildLeftWall(wallLength: number, wallHeight: number, wallThick: number) {
    const leftWallGroup = new THREE.Group();
    leftWallGroup.position.set(-1.6, 0, -0.6);
    leftWallGroup.rotation.y = -Math.PI / 4;

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x48372b, roughness: 0.85 });
    const capMat = new THREE.MeshStandardMaterial({ color: 0x675141, roughness: 0.6 });

    // The Wall mesh
    const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallHeight, wallLength), wallMat);
    wallMesh.position.y = wallHeight / 2 + 0.05;
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    leftWallGroup.add(wallMesh);

    const cap = new THREE.Mesh(new THREE.BoxGeometry(wallThick + 0.04, 0.05, wallLength + 0.04), capMat);
    cap.position.y = wallHeight + 0.075;
    leftWallGroup.add(cap);

    // Baseboard along wall
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x221a14, roughness: 0.5 });
    const bTrim = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, wallLength), baseMat);
    bTrim.position.set(wallThick / 2 + 0.02, 0.11, 0);
    leftWallGroup.add(bTrim);

    // Wooden Console Bench / Lab Table (Screenshot 1, 7)
    const benchGroup = new THREE.Group();
    benchGroup.position.set(0.45, 0.05, 0.2);

    const benchMat = new THREE.MeshStandardMaterial({ color: 0x3b2416, roughness: 0.4 });
    const bench = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.72, 1.95), benchMat);
    bench.position.y = 0.36;
    bench.castShadow = true;
    benchGroup.add(bench);

    // Oscilloscope (Screenshot 1, 7)
    const scopeHousing = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.26, 0.42),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.3, metalness: 0.4 })
    );
    scopeHousing.position.set(0, 0.85, -0.45);
    scopeHousing.castShadow = true;
    benchGroup.add(scopeHousing);

    const scopeScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.24, 0.18),
      new THREE.MeshBasicMaterial({ map: this.scopeTexture })
    );
    scopeScreen.position.set(0.185, 0.85, -0.45);
    scopeScreen.rotation.y = Math.PI / 2;
    benchGroup.add(scopeScreen);

    // 3D Printer with Glass Chamber & Yellow Printed Bracket (Screenshot 1)
    const printerGroup = new THREE.Group();
    printerGroup.position.set(0, 0.72, 0.35);

    const pFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.42, 0.38),
      new THREE.MeshStandardMaterial({ color: 0x111827, metalness: 0.8, roughness: 0.2 })
    );
    pFrame.position.y = 0.21;
    printerGroup.add(pFrame);

    const pGlass = new THREE.Mesh(
      new THREE.BoxGeometry(0.36, 0.38, 0.36),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.35,
        roughness: 0.1,
      })
    );
    pGlass.position.y = 0.21;
    printerGroup.add(pGlass);

    // Yellow 3D printed model on bed
    const printModel = new THREE.Mesh(
      new THREE.TorusGeometry(0.045, 0.02, 12, 24),
      new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.3 })
    );
    printModel.rotation.x = Math.PI / 2;
    printModel.position.set(0, 0.15, 0);
    printerGroup.add(printModel);

    benchGroup.add(printerGroup);

    // Stack of books and multimeter on bench
    const bookColors = [0xef4444, 0x06b6d4, 0x10b981];
    bookColors.forEach((col, i) => {
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.03, 0.24),
        new THREE.MeshStandardMaterial({ color: col, roughness: 0.4 })
      );
      book.position.set(0, 0.74 + i * 0.032, -0.85);
      benchGroup.add(book);
    });

    leftWallGroup.add(benchGroup);

    // Floating Wooden Wall Shelves with Books (Screenshot 1)
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x2e1b10, roughness: 0.4 });
    const shelf1 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.035, 1.8), shelfMat);
    shelf1.position.set(0.14, 2.15, -0.65);
    leftWallGroup.add(shelf1);

    const shelf2 = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.035, 1.4), shelfMat);
    shelf2.position.set(0.14, 2.55, -0.65);
    leftWallGroup.add(shelf2);

    // Multi-colored vertical book spines (Screenshot 1)
    const spineColors = [0xef4444, 0x06b6d4, 0x10b981, 0xf59e0b, 0xf1f5f9, 0x18181b, 0x8b5cf6];
    for (let b = 0; b < 14; b++) {
      const bH = 0.22 + (b % 3) * 0.04;
      const bMesh = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, bH, 0.042),
        new THREE.MeshStandardMaterial({ color: spineColors[b % spineColors.length], roughness: 0.4 })
      );
      bMesh.position.set(0.14, 2.17 + bH / 2, -1.35 + b * 0.048);
      leftWallGroup.add(bMesh);
    }

    // Small potted succulent & white vase
    const sPot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.045, 0.035, 0.07, 16),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 })
    );
    sPot.position.set(0.14, 2.55 + 0.035, -1.1);
    leftWallGroup.add(sPot);

    const sVase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.05, 0.12, 16),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
    );
    sVase.position.set(0.14, 2.55 + 0.06, -0.4);
    leftWallGroup.add(sVase);

    // 2 Hanging Milestone Frames with Cords (Screenshot 1, 8)
    const mData = [
      { year: '2025–29', label: 'B.Tech CSE (AI & DS)' },
      { year: 'Oct 2026', label: 'Code Carnival 3.0 1st Rank' },
    ];
    this.hangingFrames = [];

    mData.forEach((m, idx) => {
      const hGroup = new THREE.Group();
      hGroup.position.set(0.09, 1.85, 0.75 + idx * 0.65);
      hGroup.rotation.y = Math.PI / 2;

      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.36, 0.02),
        new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.6 })
      );
      hGroup.add(frame);

      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 180;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 256, 180);
      ctx.fillStyle = '#d97706';
      ctx.font = 'bold 20px monospace';
      ctx.fillText(m.year, 20, 45);
      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText(m.label, 20, 85);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const paper = new THREE.Mesh(
        new THREE.PlaneGeometry(0.44, 0.32),
        new THREE.MeshBasicMaterial({ map: tex })
      );
      paper.position.z = 0.012;
      hGroup.add(paper);

      // Brass pin
      const pin = new THREE.Mesh(
        new THREE.CylinderGeometry(0.008, 0.008, 0.02, 12),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9 })
      );
      pin.position.set(0, 0.24, 0);
      hGroup.add(pin);

      leftWallGroup.add(hGroup);

      this.hangingFrames.push({
        group: hGroup,
        anchorY: 1.85,
        swingAngle: 0,
        swingVel: 0,
      });
    });

    // Grid of White Framed Certificates on Left Wall (Screenshot 1, 9)
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 4; c++) {
        const cMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.015, 0.24, 0.34),
          new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 })
        );
        cMesh.position.set(0.09, 2.75 - r * 0.32, 0.15 + c * 0.42);
        leftWallGroup.add(cMesh);
      }
    }

    // Logic Half Adder Board on Left Wall above Lab Bench (Screenshot 7)
    const adderBoard = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.38, 0.58),
      new THREE.MeshStandardMaterial({ color: 0x09090b, metalness: 0.6, roughness: 0.4 })
    );
    adderBoard.position.set(0.09, 1.45, -0.45);
    leftWallGroup.add(adderBoard);

    const adderScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.55, 0.35),
      new THREE.MeshBasicMaterial({ map: this.adderTexture })
    );
    adderScreen.rotation.y = Math.PI / 2;
    adderScreen.position.set(0.102, 1.45, -0.45);
    leftWallGroup.add(adderScreen);

    this.roomRoot.add(leftWallGroup);
  }

  // Right Wall & PC Workstation (SCREEN FACES DIRECTLY OUTWARD TOWARD VIEWER/CAMERA!)
  private buildRightWallAndPC(wallLength: number, wallHeight: number, wallThick: number) {
    // Right wall placed along angle -45 deg, running from back corner (0, -2.2) to (3.2, 1.0)
    const rightWallGroup = new THREE.Group();
    rightWallGroup.position.set(1.6, 0, -0.6);
    rightWallGroup.rotation.y = Math.PI / 4;

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x48372b, roughness: 0.85 });
    const capMat = new THREE.MeshStandardMaterial({ color: 0x675141, roughness: 0.6 });

    // Wall mesh
    const wallMesh = new THREE.Mesh(new THREE.BoxGeometry(wallThick, wallHeight, wallLength), wallMat);
    wallMesh.position.y = wallHeight / 2 + 0.05;
    wallMesh.castShadow = true;
    wallMesh.receiveShadow = true;
    rightWallGroup.add(wallMesh);

    const cap = new THREE.Mesh(new THREE.BoxGeometry(wallThick + 0.04, 0.05, wallLength + 0.04), capMat);
    cap.position.y = wallHeight + 0.075;
    rightWallGroup.add(cap);

    // Baseboard along wall
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x221a14, roughness: 0.5 });
    const bTrim = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.12, wallLength), baseMat);
    bTrim.position.set(-wallThick / 2 - 0.02, 0.11, 0);
    rightWallGroup.add(bTrim);

    // Window with Night Sky & Moon on right wall
    const winGroup = new THREE.Group();
    winGroup.position.set(-0.09, 2.15, -0.45);
    winGroup.rotation.y = -Math.PI / 2;

    const winFrameMat = new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.8, roughness: 0.3 });
    const winFrame = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.4, 0.05), winFrameMat);
    winGroup.add(winFrame);

    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 512;
    skyCanvas.height = 512;
    const sCtx = skyCanvas.getContext('2d')!;

    const grad = sCtx.createLinearGradient(0, 0, 0, 512);
    grad.addColorStop(0, '#060d1b');
    grad.addColorStop(0.65, '#0b162a');
    grad.addColorStop(1, '#111827');
    sCtx.fillStyle = grad;
    sCtx.fillRect(0, 0, 512, 512);

    sCtx.fillStyle = '#fef3c7';
    sCtx.beginPath();
    sCtx.arc(360, 110, 32, 0, Math.PI * 2);
    sCtx.fill();

    const buildingColors = ['#050811', '#080d19', '#0b1120'];
    for (let b = 0; b < 10; b++) {
      const bx = b * 52 - 10;
      const bh = 140 + ((b * 47) % 160);
      const by = 512 - bh;
      sCtx.fillStyle = buildingColors[b % buildingColors.length];
      sCtx.fillRect(bx, by, 56, bh);

      sCtx.fillStyle = '#fef08a';
      for (let wy = by + 12; wy < 512 - 10; wy += 14) {
        for (let wx = bx + 6; wx < bx + 50; wx += 10) {
          if ((wx * wy) % 5 > 1) {
            sCtx.fillRect(wx, wy, 4, 6);
          }
        }
      }
    }

    const skyTex = new THREE.CanvasTexture(skyCanvas);
    skyTex.colorSpace = THREE.SRGBColorSpace;
    const winGlass = new THREE.Mesh(
      new THREE.PlaneGeometry(1.32, 1.32),
      new THREE.MeshBasicMaterial({ map: skyTex })
    );
    winGlass.position.z = 0.026;
    winGroup.add(winGlass);

    rightWallGroup.add(winGroup);

    // 3 Framed Posters above desk
    const posters = ['DefectGuard AI', 'HandGesture Master', 'Drone Night-Vision'];
    const pZ = [0.45, 0.98, 1.5];

    posters.forEach((pTitle, idx) => {
      const pGroup = new THREE.Group();
      pGroup.position.set(-0.09, 2.25, pZ[idx]);
      pGroup.rotation.y = -Math.PI / 2;

      const frame = new THREE.Mesh(
        new THREE.BoxGeometry(0.42, 0.58, 0.02),
        new THREE.MeshStandardMaterial({ color: 0x171717, metalness: 0.6, roughness: 0.3 })
      );
      pGroup.add(frame);

      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 340;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = idx === 0 ? '#1e1b4b' : idx === 1 ? '#042f2e' : '#1e293b';
      ctx.fillRect(0, 0, 256, 340);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(pTitle, 20, 50);
      ctx.fillStyle = '#d4ae70';
      ctx.font = '12px monospace';
      ctx.fillText('Himesh Rupchandani', 20, 78);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.fillText('Computer Vision & AI', 20, 105);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      const sheet = new THREE.Mesh(
        new THREE.PlaneGeometry(0.38, 0.54),
        new THREE.MeshBasicMaterial({ map: tex })
      );
      sheet.position.z = 0.012;
      pGroup.add(sheet);

      const sconce = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.015, 0.04),
        new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9 })
      );
      sconce.position.set(0, 0.31, 0.03);
      pGroup.add(sconce);

      rightWallGroup.add(pGroup);
    });

    // Technical Schematic Board on far right
    const schemGroup = new THREE.Group();
    schemGroup.position.set(-0.09, 1.95, 1.95);
    schemGroup.rotation.y = -Math.PI / 2;

    const sFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.82, 0.02),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.5 })
    );
    schemGroup.add(sFrame);

    const sCanvas = document.createElement('canvas');
    sCanvas.width = 300;
    sCanvas.height = 500;
    const sC = sCanvas.getContext('2d')!;
    sC.fillStyle = '#090d16';
    sC.fillRect(0, 0, 300, 500);
    sC.fillStyle = '#d4ae70';
    sC.font = 'bold 18px monospace';
    sC.fillText('AI PIPELINE SCHEMATIC', 20, 40);
    sC.strokeStyle = '#38bdf8';
    sC.lineWidth = 2;
    sC.strokeRect(30, 80, 240, 60);
    sC.strokeRect(30, 180, 240, 60);
    sC.strokeRect(30, 280, 240, 60);
    sC.fillStyle = '#ffffff';
    sC.font = '14px monospace';
    sC.fillText('YOLOv8 TENSOR PIPELINE', 45, 115);
    sC.fillText('SPATIAL FILTERING', 55, 215);
    sC.fillText('LOW-LATENCY INFERENCE', 45, 315);

    const sTex = new THREE.CanvasTexture(sCanvas);
    sTex.colorSpace = THREE.SRGBColorSpace;
    const sSheet = new THREE.Mesh(
      new THREE.PlaneGeometry(0.42, 0.78),
      new THREE.MeshBasicMaterial({ map: sTex })
    );
    sSheet.position.z = 0.012;
    schemGroup.add(sSheet);

    rightWallGroup.add(schemGroup);

    // PERSONAL COMPUTER WORKSTATION DESK (Rich aesthetic walnut tone matching screenshot)
    const deskGroup = new THREE.Group();
    deskGroup.position.set(-0.65, 0, 0.45);

    // Aesthetic warm reddish-walnut desk top (Screenshot 3)
    const topMat = new THREE.MeshStandardMaterial({
      color: 0x7c4126,
      roughness: 0.26,
      metalness: 0.04,
    });
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.055, 2.1), topMat);
    deskTop.position.set(0, 0.82, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Front beveled edge trim on desk top
    const bevelTrim = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.025, 2.1),
      new THREE.MeshStandardMaterial({ color: 0x965232, roughness: 0.22 })
    );
    bevelTrim.position.set(-0.475, 0.835, 0);
    deskGroup.add(bevelTrim);

    // Steel Legs
    const legMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.35, metalness: 0.8 });
    [-0.95, 0.95].forEach((z) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.82, 0.045), legMat);
      leg.position.set(0, 0.41, z);
      leg.castShadow = true;
      deskGroup.add(leg);
    });

    // White Under-Desk 2-Drawer Cabinet with Satin Brass Handles (Screenshot 3 foreground)
    const cabinetGroup = new THREE.Group();
    cabinetGroup.position.set(-0.15, 0.38, -0.68);

    const cabMat = new THREE.MeshStandardMaterial({ color: 0xf4f4f6, roughness: 0.35 });
    const cabBody = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.68, 0.42), cabMat);
    cabBody.castShadow = true;
    cabinetGroup.add(cabBody);

    const drawerFaceMat = new THREE.MeshStandardMaterial({ color: 0xfcfcfd, roughness: 0.3 });
    const brassHandleMat = new THREE.MeshStandardMaterial({
      color: 0xc98b50,
      metalness: 0.88,
      roughness: 0.2,
    });

    [0.17, -0.17].forEach((dY) => {
      const face = new THREE.Mesh(new THREE.BoxGeometry(0.53, 0.29, 0.015), drawerFaceMat);
      face.position.set(0, dY, -0.215);
      cabinetGroup.add(face);

      // Horizontal satin brass bar pull handle
      const handle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.014, 0.018), brassHandleMat);
      handle.position.set(0, dY + 0.03, -0.23);
      handle.castShadow = true;
      cabinetGroup.add(handle);
    });
    deskGroup.add(cabinetGroup);

    // Dark desk mat
    const dMat = new THREE.Mesh(
      new THREE.BoxGeometry(0.44, 0.005, 1.15),
      new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.75 })
    );
    dMat.position.set(-0.15, 0.852, -0.05);
    deskGroup.add(dMat);

    // PERSONAL COMPUTER ULTRA-WIDE MONITOR (SCREEN FACES DIRECTLY OUTWARD!)
    const monGroup = new THREE.Group();
    monGroup.position.set(0.18, 0.85, -0.05);
    monGroup.rotation.y = -Math.PI / 2;

    const standMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.8, roughness: 0.2 });
    const standBase = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.012, 0.16), standMat);
    standBase.position.set(0, 0.006, 0);
    monGroup.add(standBase);

    const standArm = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.38, 0.04), standMat);
    standArm.position.set(0, 0.2, -0.05);
    monGroup.add(standArm);

    const screenWidth = 1.25;
    const screenHeight = 0.62;
    const bezel = new THREE.Mesh(
      new THREE.BoxGeometry(screenWidth + 0.03, screenHeight + 0.03, 0.03),
      new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.3 })
    );
    bezel.position.set(0, 0.44, 0);
    bezel.castShadow = true;
    monGroup.add(bezel);

    // PC Screen Mesh
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(screenWidth, screenHeight),
      new THREE.MeshBasicMaterial({ map: this.mainScreenTexture })
    );
    screen.position.set(0, 0.44, 0.016);
    monGroup.add(screen);

    deskGroup.add(monGroup);

    // Mechanical RGB Keyboard (75% Compact layout with Frosted Acrylic Keycaps & Rotary Knob - Screenshot 3)
    const kbGroup = new THREE.Group();
    kbGroup.position.set(-0.18, 0.852, -0.05);
    kbGroup.rotation.y = -Math.PI / 2;

    const kbBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.38, 0.018, 0.14),
      new THREE.MeshStandardMaterial({ color: 0x141416, roughness: 0.35, metalness: 0.5 })
    );
    kbBase.position.y = 0.009;
    kbGroup.add(kbBase);

    // Top-right corner rotary brass encoder knob (Screenshot 3)
    const knob = new THREE.Mesh(
      new THREE.CylinderGeometry(0.011, 0.011, 0.015, 24),
      new THREE.MeshStandardMaterial({ color: 0xc98b50, metalness: 0.9, roughness: 0.15 })
    );
    knob.position.set(0.165, 0.024, -0.052);
    kbGroup.add(knob);

    // Keyboard RGB backplate
    const plate = new THREE.Mesh(
      new THREE.PlaneGeometry(0.36, 0.12),
      new THREE.MeshBasicMaterial({ map: this.keyboardTexture })
    );
    plate.rotation.x = -Math.PI / 2;
    plate.position.y = 0.019;
    kbGroup.add(plate);

    // Translucent Frosted Polycarbonate Keycaps (Screenshot 3)
    const keyCapMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      roughness: 0.16,
      metalness: 0.05,
      transmission: 0.55,
      ior: 1.45,
    });
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 13; c++) {
        const key = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.012, 0.02), keyCapMat);
        key.position.set(-0.15 + c * 0.025, 0.026, -0.045 + r * 0.022);
        kbGroup.add(key);
      }
    }

    // Underglow neon spill halo around keyboard base onto desk pad
    const underglowHalo = new THREE.Mesh(
      new THREE.PlaneGeometry(0.44, 0.18),
      new THREE.MeshBasicMaterial({ map: this.keyboardTexture, transparent: true, opacity: 0.8 })
    );
    underglowHalo.rotation.x = -Math.PI / 2;
    underglowHalo.position.set(-0.18, 0.853, -0.05);
    deskGroup.add(underglowHalo);

    // Dual ambient point lights casting colored specular reflections on desk mat
    const leftKbGlow = new THREE.PointLight(0x06b6d4, 1.4, 0.35);
    leftKbGlow.position.set(-0.25, 0.88, -0.18);
    deskGroup.add(leftKbGlow);

    const rightKbGlow = new THREE.PointLight(0xec4899, 1.4, 0.35);
    rightKbGlow.position.set(-0.12, 0.88, 0.08);
    deskGroup.add(rightKbGlow);

    // Sleek White Ergonomic Wireless Mouse (Screenshot 3)
    const mouse = new THREE.Mesh(
      new THREE.BoxGeometry(0.065, 0.025, 0.1),
      new THREE.MeshStandardMaterial({ color: 0xf4f4f6, roughness: 0.25 })
    );
    mouse.position.set(-0.21, 0.865, 0.28);
    deskGroup.add(mouse);

    deskGroup.add(kbGroup);

    // Newton's Cradle on Desk directly behind keyboard (Screenshot 3)
    const cradleGroup = new THREE.Group();
    cradleGroup.position.set(-0.05, 0.852, -0.28);
    cradleGroup.rotation.y = -Math.PI / 2;

    const cBase = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.015, 0.12),
      new THREE.MeshStandardMaterial({ color: 0x3d2416, roughness: 0.35 })
    );
    cBase.position.y = 0.008;
    cBase.castShadow = true;
    cradleGroup.add(cBase);

    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, metalness: 0.98, roughness: 0.05 });
    const wireMat = new THREE.LineBasicMaterial({ color: 0xe2e8f0 });

    [-0.045, 0.045].forEach((z) => {
      const arch = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.007, 0.007), chromeMat);
      arch.position.set(0, 0.15, z);
      cradleGroup.add(arch);

      [-0.08, 0.08].forEach((x) => {
        const upright = new THREE.Mesh(new THREE.CylinderGeometry(0.0035, 0.0035, 0.15, 8), chromeMat);
        upright.position.set(x, 0.075, z);
        cradleGroup.add(upright);
      });
    });

    const radius = 0.013;
    const spacing = radius * 2.02;
    const startX = -spacing * 2;
    this.cradleBalls = [];

    for (let i = 0; i < 5; i++) {
      const ball = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 24), chromeMat);
      ball.position.set(startX + i * spacing, 0.045, 0);
      ball.castShadow = true;
      cradleGroup.add(ball);
      this.cradleBalls.push(ball);

      const points = [
        new THREE.Vector3(startX + i * spacing, 0.15, -0.045),
        new THREE.Vector3(startX + i * spacing, 0.045, 0),
        new THREE.Vector3(startX + i * spacing, 0.15, 0.045),
      ];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, wireMat);
      cradleGroup.add(line);
    }
    deskGroup.add(cradleGroup);

    // Forest-Green Leather Notebook with Gold Pen (Screenshot 3)
    const nbGroup = new THREE.Group();
    nbGroup.position.set(-0.22, 0.854, -0.68);
    nbGroup.rotation.y = -0.15;

    const nbCover = new THREE.Mesh(
      new THREE.BoxGeometry(0.24, 0.014, 0.17),
      new THREE.MeshStandardMaterial({ color: 0x243928, roughness: 0.55 })
    );
    nbCover.castShadow = true;
    nbGroup.add(nbCover);

    const nbPages = new THREE.Mesh(
      new THREE.BoxGeometry(0.23, 0.01, 0.16),
      new THREE.MeshStandardMaterial({ color: 0xfef9c3, roughness: 0.8 })
    );
    nbPages.position.set(0.004, 0, 0);
    nbGroup.add(nbPages);

    const pen = new THREE.Mesh(
      new THREE.CylinderGeometry(0.0035, 0.0035, 0.14, 12),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95, roughness: 0.15 })
    );
    pen.rotation.z = Math.PI / 2;
    pen.rotation.y = 0.55;
    pen.position.set(0, 0.012, 0);
    pen.castShadow = true;
    nbGroup.add(pen);

    deskGroup.add(nbGroup);

    // White Ceramic Coffee Mug with C-Handle (Screenshot 3)
    const mugGroup = new THREE.Group();
    mugGroup.position.set(-0.21, 0.852, -0.42);

    const mugBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.038, 0.032, 0.088, 24),
      new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.18 })
    );
    mugBody.position.y = 0.044;
    mugBody.castShadow = true;
    mugGroup.add(mugBody);

    const mugHandle = new THREE.Mesh(
      new THREE.TorusGeometry(0.022, 0.0055, 12, 24, Math.PI),
      new THREE.MeshStandardMaterial({ color: 0xfafafa, roughness: 0.18 })
    );
    mugHandle.position.set(-0.038, 0.044, 0);
    mugHandle.rotation.z = Math.PI / 2;
    mugGroup.add(mugHandle);

    const coffee = new THREE.Mesh(
      new THREE.CylinderGeometry(0.033, 0.033, 0.005, 20),
      new THREE.MeshStandardMaterial({ color: 0x24140b, roughness: 0.2 })
    );
    coffee.position.y = 0.08;
    mugGroup.add(coffee);

    deskGroup.add(mugGroup);

    // Black Articulated Desk Lamp with Green LED Stripe & Hanging Counterweight (Screenshot 3)
    const lampGroup = new THREE.Group();
    lampGroup.position.set(-0.15, 0.85, -0.85);

    const lampMat = new THREE.MeshStandardMaterial({ color: 0x262626, metalness: 0.8, roughness: 0.2 });
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.02, 16), lampMat);
    lampBase.position.y = 0.01;
    lampGroup.add(lampBase);

    const arm1 = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.45, 12), lampMat);
    arm1.position.set(0, 0.22, 0.05);
    arm1.rotation.x = -0.3;
    lampGroup.add(arm1);

    const arm2 = new THREE.Mesh(new THREE.CylinderGeometry(0.007, 0.007, 0.38, 12), lampMat);
    arm2.position.set(0, 0.48, 0.16);
    arm2.rotation.x = 0.5;
    lampGroup.add(arm2);

    const lampBar = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 0.32), lampMat);
    lampBar.position.set(-0.02, 0.6, 0.32);
    lampGroup.add(lampBar);

    // Green accent LED strip along top edge of lamp bar (Screenshot 3)
    const ledStripe = new THREE.Mesh(
      new THREE.BoxGeometry(0.01, 0.004, 0.28),
      new THREE.MeshBasicMaterial({ color: 0x22c55e })
    );
    ledStripe.position.set(0, 0.012, 0);
    lampBar.add(ledStripe);

    // Hanging wire with brass counterweight sphere (Screenshot 3)
    const dropWire = new THREE.Mesh(
      new THREE.CylinderGeometry(0.001, 0.001, 0.16, 8),
      new THREE.LineBasicMaterial({ color: 0xd4af37 })
    );
    dropWire.position.set(0, -0.08, 0.12);
    lampBar.add(dropWire);

    const dropBall = new THREE.Mesh(
      new THREE.SphereGeometry(0.007, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.95 })
    );
    dropBall.position.set(0, -0.16, 0.12);
    lampBar.add(dropBall);

    deskGroup.add(lampGroup);

    // Smartphone in stand on desk
    const phoneDock = new THREE.Group();
    phoneDock.position.set(-0.15, 0.85, 0.68);
    phoneDock.rotation.y = -Math.PI / 2;

    const pStand = new THREE.Mesh(
      new THREE.BoxGeometry(0.09, 0.02, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.9 })
    );
    pStand.position.y = 0.01;
    phoneDock.add(pStand);

    const pScreen = new THREE.Mesh(
      new THREE.PlaneGeometry(0.08, 0.16),
      new THREE.MeshBasicMaterial({ map: this.phoneScreenTexture })
    );
    pScreen.position.set(0, 0.11, 0.01);
    pScreen.rotation.x = -0.15;
    phoneDock.add(pScreen);

    deskGroup.add(phoneDock);

    // PC Tower under the desk with glowing internal fans
    const pcCase = new THREE.Mesh(
      new THREE.BoxGeometry(0.46, 0.46, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.3, metalness: 0.5 })
    );
    pcCase.position.set(-0.05, 0.23, 0.78);
    pcCase.castShadow = true;
    deskGroup.add(pcCase);

    const pcFanLight = new THREE.PointLight(0x06b6d4, 1.2, 0.6);
    pcFanLight.position.set(-0.2, 0.24, 0.78);
    deskGroup.add(pcFanLight);

    rightWallGroup.add(deskGroup);

    // Server / Audio Equipment Rack to the right of the desk (Screenshot 1)
    const rackGroup = new THREE.Group();
    rackGroup.position.set(-0.35, 0.05, 1.6);
    rackGroup.rotation.y = -Math.PI / 2;

    const rackFrame = new THREE.Mesh(
      new THREE.BoxGeometry(0.48, 0.68, 0.42),
      new THREE.MeshStandardMaterial({ color: 0x18181b, metalness: 0.7, roughness: 0.3 })
    );
    rackFrame.position.y = 0.34;
    rackFrame.castShadow = true;
    rackGroup.add(rackFrame);

    for (let u = 0; u < 4; u++) {
      for (let l = 0; l < 6; l++) {
        const led = new THREE.Mesh(
          new THREE.BoxGeometry(0.012, 0.008, 0.005),
          l % 2 === 0 ? new THREE.MeshBasicMaterial({ color: 0x22c55e }) : new THREE.MeshBasicMaterial({ color: 0xf59e0b })
        );
        led.position.set(-0.16 + l * 0.06, 0.18 + u * 0.12, 0.215);
        rackGroup.add(led);
      }
    }
    rightWallGroup.add(rackGroup);

    // High-back Executive Chair in front of desk
    const chairGroup = new THREE.Group();
    chairGroup.position.set(-1.35, 0.05, 0.45);
    chairGroup.rotation.y = Math.PI / 2;

    const leatherMat = new THREE.MeshStandardMaterial({ color: 0x1f1814, roughness: 0.45 });
    const chrMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, metalness: 0.9, roughness: 0.15 });

    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.022, 0.03), chrMat);
      leg.position.set(Math.cos(angle) * 0.14, 0.06, Math.sin(angle) * 0.14);
      leg.rotation.y = -angle;
      chairGroup.add(leg);

      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.018, 12), leatherMat);
      wheel.position.set(Math.cos(angle) * 0.26, 0.02, Math.sin(angle) * 0.26);
      chairGroup.add(wheel);
    }

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.022, 0.32, 16), chrMat);
    stem.position.y = 0.2;
    chairGroup.add(stem);

    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.065, 0.42), leatherMat);
    seat.position.set(0, 0.38, 0);
    seat.castShadow = true;
    chairGroup.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.55, 0.045), leatherMat);
    back.position.set(0, 0.68, -0.19);
    back.rotation.x = -0.1;
    back.castShadow = true;
    chairGroup.add(back);

    rightWallGroup.add(chairGroup);

    this.roomRoot.add(rightWallGroup);
  }

  // TRUE 3D EXTRUDED TITLE IN THREE.JS SCENE (Screenshot 1: "Bheda \n Nikhilkumar")
  private build3DFloatingName() {
    const textGroup = new THREE.Group();
    // Positioned directly above the back corner of the room diorama
    textGroup.position.set(0, 3.8, -1.95);

    const makeTextLine = (text: string, yPos: number, scale: number) => {
      const lineGroup = new THREE.Group();
      lineGroup.position.y = yPos;

      // Front bright crisp face
      const canvasFront = document.createElement('canvas');
      canvasFront.width = 1024;
      canvasFront.height = 256;
      const ctxF = canvasFront.getContext('2d')!;
      ctxF.clearRect(0, 0, 1024, 256);
      ctxF.font = '900 135px "Plus Jakarta Sans", "Inter", sans-serif';
      ctxF.textAlign = 'center';
      ctxF.textBaseline = 'middle';
      ctxF.fillStyle = '#f8fafc';
      ctxF.fillText(text, 512, 128);

      const texFront = new THREE.CanvasTexture(canvasFront);
      texFront.colorSpace = THREE.SRGBColorSpace;

      // Depth layers (dark charcoal extrusion)
      const canvasDepth = document.createElement('canvas');
      canvasDepth.width = 1024;
      canvasDepth.height = 256;
      const ctxD = canvasDepth.getContext('2d')!;
      ctxD.clearRect(0, 0, 1024, 256);
      ctxD.font = '900 135px "Plus Jakarta Sans", "Inter", sans-serif';
      ctxD.textAlign = 'center';
      ctxD.textBaseline = 'middle';
      ctxD.fillStyle = '#1e242d';
      ctxD.fillText(text, 512, 128);

      const texDepth = new THREE.CanvasTexture(canvasDepth);
      texDepth.colorSpace = THREE.SRGBColorSpace;

      const depthLayers = 10;
      for (let d = 0; d < depthLayers; d++) {
        const isFront = d === 0;
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(scale * 4, scale),
          new THREE.MeshBasicMaterial({
            map: isFront ? texFront : texDepth,
            transparent: true,
            depthWrite: false,
          })
        );
        mesh.position.z = -d * 0.018;
        mesh.position.y = -d * 0.003;
        lineGroup.add(mesh);
      }

      return lineGroup;
    };

    const line1 = makeTextLine('Bheda', 0.44, 0.72);
    const line2 = makeTextLine('Nikhilkumar', -0.24, 0.72);

    textGroup.add(line1);
    textGroup.add(line2);

    this.roomRoot.add(textGroup);
  }

  // Dynamic Canvas Rendering (PERSONAL COMPUTER SCREEN: High-res interactive UI)
  private renderCanvases(time: number) {
    const ctx = this.mainScreenCtx;

    // Background of personal computer screen
    ctx.fillStyle = '#0a0d14';
    ctx.fillRect(0, 0, 1280, 720);

    // Top window titlebar with 3 dots (macOS style like Screenshot 4)
    ctx.fillStyle = '#111827';
    ctx.fillRect(0, 0, 1280, 48);

    // 3 Dots
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(28, 24, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(48, 24, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(68, 24, 7, 0, Math.PI * 2);
    ctx.fill();
    const pIdx = ((this.activeProjectIdx % 4) + 4) % 4;
    const projectTitles = [
      {
        tag: 'PROJECT 01 · 1ST RANK CODE CARNIVAL 3.0',
        title: 'DefectGuard AI',
        sub: 'Industrial Steel Defect Detection & Localization with YOLO',
        desc: 'Real-time inference pipeline running at 60 FPS on manufacturing strips.',
        badges: ['Python', 'YOLOv8', 'OpenCV', 'PyTorch', 'NumPy'],
      },
      {
        tag: 'PROJECT 02 · COMPUTER VISION & HCI',
        title: 'HandGesture Master',
        sub: 'Touchless PC System Volume & Screen Brightness Controller',
        desc: 'MediaPipe 21-point skeletal hand landmark tracking with zero latency.',
        badges: ['Python', 'OpenCV', 'MediaPipe', 'PyAutoGUI', 'Math'],
      },
      {
        tag: 'PROJECT 03 · ENVIRONMENTAL AI',
        title: 'Plastic Detection AI',
        sub: 'Automated Waste Segregation & Damaged Bottle Classification',
        desc: 'Morphological contour deformation analysis for recycling facilities.',
        badges: ['Python', 'YOLO', 'OpenCV', 'NumPy', 'Data Aug'],
      },
      {
        tag: 'PROJECT 04 · ROBOTICS & VISION RESEARCH',
        title: 'Drone Night-Vision',
        sub: 'Autonomous UAV Visual Docking in Low-Light & GPS-Denied Zones',
        desc: 'solvePnP 6-DOF camera pose estimation & ArUco fiducial landing marks.',
        badges: ['Python', 'OpenCV', 'ArUco', 'YOLO', 'Matrix Math'],
      },
    ];

    const curProj = projectTitles[pIdx];

    ctx.fillStyle = '#94a3b8';
    ctx.font = '14px monospace';
    ctx.fillText(`${curProj.title.toLowerCase().replace(/ /g, '-')} — personal dev rig`, 500, 30);
    ctx.fillText(`0${pIdx + 1} / 04`, 1200, 30);

    // Project Details on Left Half of PC Screen (Screenshot 4)
    ctx.fillStyle = '#d4ae70';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(curProj.tag, 50, 110);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 48px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(curProj.title, 50, 175);

    ctx.fillStyle = '#cbd5e1';
    ctx.font = '20px sans-serif';
    ctx.fillText(curProj.sub, 50, 220);
    ctx.fillText(curProj.desc, 50, 255);

    // Tech badges
    curProj.badges.forEach((b, i) => {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(50 + i * 115, 290, 100, 36, 18);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 13px monospace';
      ctx.textAlign = 'center';
      ctx.fillText(b, 50 + i * 115 + 50, 313);
    });
    ctx.textAlign = 'left';

    // Right Half of PC Screen: Live Computer Vision Stream
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(720, 80, 510, 480, 24);
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 2;
    ctx.stroke();

    const radarCx = 975;
    const radarCy = 300;

    if (pIdx === 0) {
      // DefectGuard AI: Radar circular grid + defect bounding boxes
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.lineWidth = 1.5;
      [60, 120, 170].forEach((r) => {
        ctx.beginPath();
        ctx.arc(radarCx, radarCy, r, 0, Math.PI * 2);
        ctx.stroke();
      });

      const sweepAngle = time * 2.2;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(radarCx, radarCy);
      ctx.lineTo(radarCx + Math.cos(sweepAngle) * 170, radarCy + Math.sin(sweepAngle) * 170);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(radarCx, radarCy, 32, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0a0d14';
      ctx.font = 'bold 24px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('✓', radarCx, radarCy + 8);
      ctx.textAlign = 'left';

      const offset1 = Math.sin(time * 1.8) * 35;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(820 + offset1, 200, 140, 90);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(820 + offset1, 180, 110, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText('crack 0.94', 826 + offset1, 194);

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(835, 490, 280, 42, 21);
      ctx.fill();
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(860, 511, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '14px monospace';
      ctx.fillText('Live inference active · 60 FPS', 880, 516);
    } else if (pIdx === 1) {
      // HandGesture Master: Skeletal hand landmarks
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 3;
      const handPoints = [
        [radarCx - 60, radarCy + 80],
        [radarCx - 40, radarCy + 30],
        [radarCx - 20, radarCy - 20 + Math.sin(time * 3) * 15],
        [radarCx + 10, radarCy - 50 + Math.cos(time * 3) * 10],
        [radarCx + 40, radarCy - 30],
        [radarCx + 60, radarCy + 10],
      ];
      ctx.beginPath();
      handPoints.forEach(([x, y], idx) => {
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      handPoints.forEach(([x, y]) => {
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fill();
      });

      // Volume bar HUD
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(760, 480, 430, 46, 23);
      ctx.fill();
      const volWidth = 240 + Math.sin(time * 2) * 50;
      ctx.fillStyle = '#06b6d4';
      ctx.beginPath();
      ctx.roundRect(770, 490, volWidth, 26, 13);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`VOLUME: ${Math.round((volWidth / 360) * 100)}%`, 790, 508);
    } else if (pIdx === 2) {
      // Plastic Detection: Contour deformation
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 3;
      ctx.strokeRect(radarCx - 100, radarCy - 110, 200, 220);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(radarCx - 100, radarCy - 135, 160, 24);
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('CRUSHED PET BOTTLE', radarCx - 92, radarCy - 119);

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(800, 490, 350, 42, 21);
      ctx.fill();
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.arc(825, 511, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '14px monospace';
      ctx.fillText('Edge deformation: 88.4% match', 845, 516);
    } else {
      // Drone Night-Vision: ArUco crosshairs & altitude lock
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(radarCx - 120, radarCy);
      ctx.lineTo(radarCx + 120, radarCy);
      ctx.moveTo(radarCx, radarCy - 120);
      ctx.lineTo(radarCx, radarCy + 120);
      ctx.stroke();

      ctx.strokeRect(radarCx - 70, radarCy - 70, 140, 140);
      ctx.fillStyle = '#22c55e';
      ctx.font = '15px monospace';
      ctx.fillText(`ALT: ${(12.4 + Math.sin(time) * 0.4).toFixed(1)}m`, radarCx - 60, radarCy - 85);
      ctx.fillText('DOCKING LOCK: ACQUIRED', radarCx - 90, radarCy + 100);

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(815, 490, 320, 42, 21);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.beginPath();
      ctx.arc(840, 511, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f8fafc';
      ctx.font = '14px monospace';
      ctx.fillText('Autonomous visual servo active', 860, 516);
    }

    // Bottom prompt on monitor
    ctx.fillStyle = '#94a3b8';
    ctx.font = '16px monospace';
    ctx.fillText('Tap the screen or use < > to switch projects →', 50, 440);

    // Carousel indicator dots on monitor (Screenshot 4)
    for (let d = 0; d < 4; d++) {
      ctx.fillStyle = d === pIdx ? '#d4ae70' : '#334155';
      ctx.beginPath();
      ctx.roundRect(50 + d * 26, 480, d === pIdx ? 28 : 12, 10, 5);
      ctx.fill();
    }

    this.mainScreenTexture.needsUpdate = true;

    // 2. Phone Screen (Direct contact links)
    const pCtx = this.phoneScreenCtx;
    pCtx.fillStyle = '#0a0d14';
    pCtx.fillRect(0, 0, 512, 960);

    pCtx.fillStyle = '#f8fafc';
    pCtx.font = 'bold 26px sans-serif';
    pCtx.fillText('Himesh Rupchandani', 40, 80);

    pCtx.fillStyle = '#d4ae70';
    pCtx.font = '18px monospace';
    pCtx.fillText('AI & DS Developer', 40, 115);

    const links = [
      { label: 'Email', val: 'rupchandanihimesh69@gmail.com' },
      { label: 'LinkedIn', val: 'linkedin.com/in/himesh-rupchandani' },
      { label: 'GitHub', val: 'github.com/Himesh-rupchandani' },
      { label: 'LeetCode', val: '197 Problems Solved' },
    ];

    links.forEach((l, i) => {
      pCtx.fillStyle = '#1e293b';
      pCtx.fillRect(40, 160 + i * 140, 432, 110);
      pCtx.fillStyle = '#38bdf8';
      pCtx.font = 'bold 20px sans-serif';
      pCtx.fillText(l.label, 60, 205 + i * 140);
      pCtx.fillStyle = '#94a3b8';
      pCtx.font = '15px monospace';
      pCtx.fillText(l.val, 60, 240 + i * 140);
    });

    this.phoneScreenTexture.needsUpdate = true;

    // 3. Oscilloscope CRT screen (dynamic green Lissajous curve)
    const sCtx = this.scopeCtx;
    sCtx.fillStyle = '#05180c';
    sCtx.fillRect(0, 0, 512, 384);

    sCtx.strokeStyle = '#0f381c';
    sCtx.lineWidth = 1;
    for (let x = 0; x < 512; x += 32) {
      sCtx.beginPath();
      sCtx.moveTo(x, 0);
      sCtx.lineTo(x, 384);
      sCtx.stroke();
    }
    for (let y = 0; y < 384; y += 32) {
      sCtx.beginPath();
      sCtx.moveTo(0, y);
      sCtx.lineTo(512, y);
      sCtx.stroke();
    }

    sCtx.strokeStyle = '#22c55e';
    sCtx.lineWidth = 3;
    sCtx.beginPath();
    for (let t = 0; t <= Math.PI * 2; t += 0.05) {
      const lx = 256 + Math.sin(t * 3 + time * 3) * 160;
      const ly = 192 + Math.cos(t * 2) * 120;
      if (t === 0) sCtx.moveTo(lx, ly);
      else sCtx.lineTo(lx, ly);
    }
    sCtx.stroke();

    this.scopeTexture.needsUpdate = true;

    // 4. Logic Half Adder Board Canvas
    const aCtx = this.adderCtx;
    aCtx.fillStyle = '#090d16';
    aCtx.fillRect(0, 0, 600, 360);

    aCtx.fillStyle = '#d4ae70';
    aCtx.font = 'bold 22px monospace';
    aCtx.fillText('HALF ADDER: S = A ⊕ B,  C = A · B', 30, 45);

    const sumVal = (this.halfAdderA !== this.halfAdderB) ? 1 : 0;
    const carryVal = (this.halfAdderA && this.halfAdderB) ? 1 : 0;

    aCtx.fillStyle = '#ffffff';
    aCtx.font = '18px monospace';
    aCtx.fillText(`INPUT A: ${this.halfAdderA ? '1 (HIGH)' : '0 (LOW)'}`, 40, 110);
    aCtx.fillText(`INPUT B: ${this.halfAdderB ? '1 (HIGH)' : '0 (LOW)'}`, 40, 160);

    aCtx.fillStyle = sumVal ? '#22c55e' : '#334155';
    aCtx.beginPath();
    aCtx.arc(420, 105, 16, 0, Math.PI * 2);
    aCtx.fill();
    aCtx.fillStyle = '#ffffff';
    aCtx.fillText(`SUM (S): ${sumVal}`, 450, 112);

    aCtx.fillStyle = carryVal ? '#ef4444' : '#334155';
    aCtx.beginPath();
    aCtx.arc(420, 155, 16, 0, Math.PI * 2);
    aCtx.fill();
    aCtx.fillStyle = '#ffffff';
    aCtx.fillText(`CARRY (C): ${carryVal}`, 450, 162);

    this.adderTexture.needsUpdate = true;

    // 5. RGB Mechanical Keyboard Lighting & Underglow (Screenshot 3)
    const kCtx = this.keyboardCtx;
    kCtx.clearRect(0, 0, 512, 180);

    // Diagonal color flow matching reference screenshot (cyan -> purple -> hot pink)
    const flow = Math.sin(time * 1.6) * 35;
    const kGrad = kCtx.createLinearGradient(0, 0, 512 + flow, 180);
    kGrad.addColorStop(0.0, '#00f5d4'); // Bright neon cyan
    kGrad.addColorStop(0.18, '#10b981'); // Emerald green
    kGrad.addColorStop(0.38, '#06b6d4'); // Sky cyan
    kGrad.addColorStop(0.55, '#6366f1'); // Electric blue/indigo
    kGrad.addColorStop(0.72, '#8b5cf6'); // Royal violet
    kGrad.addColorStop(0.86, '#d946ef'); // Bright magenta
    kGrad.addColorStop(1.0, '#f43f5e'); // Vivid hot pink / coral

    kCtx.fillStyle = kGrad;
    kCtx.fillRect(0, 0, 512, 180);

    // Keycap grid borders and laser key lines
    kCtx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    kCtx.lineWidth = 1.5;
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 14; c++) {
        const kx = 12 + c * 35;
        const ky = 10 + r * 32;
        kCtx.strokeRect(kx, ky, 30, 26);
      }
    }

    this.keyboardTexture.needsUpdate = true;
  }

  // Animation Frame Loop
  private animate = () => {
    this.animFrameId = requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Starting Entrance Animation: Rotate room diorama frame smoothly from left to center on page load
    if (this.introProgress < 1.0) {
      this.introProgress += delta / 2.2;
      if (this.introProgress > 1.0) this.introProgress = 1.0;
      // Smooth cubic ease-out
      const ease = 1 - Math.pow(1 - this.introProgress, 3);
      this.roomRoot.rotation.y = -0.52 * (1 - ease);
    }

    // Camera Lerp
    this.currentPos.lerp(
      new THREE.Vector3(
        this.targetPos.x + this.pointerOffset.x,
        this.targetPos.y - this.pointerOffset.y,
        this.targetPos.z
      ),
      delta * 4.5
    );

    this.currentLookAt.lerp(
      new THREE.Vector3(
        this.targetLookAt.x + this.pointerOffset.x * 0.35,
        this.targetLookAt.y - this.pointerOffset.y * 0.35,
        this.targetLookAt.z
      ),
      delta * 4.5
    );

    this.camera.position.copy(this.currentPos);
    this.camera.lookAt(this.currentLookAt);

    // Newton's Cradle Physics
    if (this.isCradleSwinging) {
      this.cradleAngle += this.cradleVel * delta;
      this.cradleVel -= Math.sin(this.cradleAngle) * 22 * delta;
      this.cradleVel *= 0.992;

      if (this.cradleAngle > 0 && this.cradleBalls.length === 5) {
        const rightBall = this.cradleBalls[4];
        rightBall.position.x = 0.05 + Math.sin(this.cradleAngle) * 0.08;
        rightBall.position.y = 0.045 - (1 - Math.cos(this.cradleAngle)) * 0.04;
        this.cradleBalls[0].position.set(-0.05, 0.045, 0);

        if (Math.abs(this.cradleVel) > 2.0 && time - this.lastClickTime > 0.18) {
          soundManager.playMetalClick();
          this.lastClickTime = time;
        }
      } else if (this.cradleBalls.length === 5) {
        const leftBall = this.cradleBalls[0];
        leftBall.position.x = -0.05 + Math.sin(this.cradleAngle) * 0.08;
        leftBall.position.y = 0.045 - (1 - Math.cos(this.cradleAngle)) * 0.04;
        this.cradleBalls[4].position.set(0.05, 0.045, 0);
      }
    }

    // Hanging Milestone Frames Pendulum Swing
    this.hangingFrames.forEach((hf) => {
      if (Math.abs(hf.swingAngle) > 0.001 || Math.abs(hf.swingVel) > 0.001) {
        hf.swingAngle += hf.swingVel * delta;
        hf.swingVel -= Math.sin(hf.swingAngle) * 14 * delta;
        hf.swingVel *= 0.985;
        hf.group.rotation.z = hf.swingAngle;
      }
    });

    this.renderCanvases(time);
    this.renderer.render(this.scene, this.camera);
  };

  // Public Interaction APIs
  public triggerNewtonsCradle() {
    this.isCradleSwinging = true;
    this.cradleAngle = -0.75;
    this.cradleVel = 0;
    soundManager.playMetalClick();
  }

  public dropKeycaps() {
    this.keysDropped = true;
    soundManager.playKeyClatter();
  }

  public reassembleKeycaps() {
    this.keysDropped = false;
    soundManager.playWhoosh();
  }

  public toggleHalfAdder(input: 'A' | 'B') {
    soundManager.playClick();
    if (input === 'A') this.halfAdderA = !this.halfAdderA;
    if (input === 'B') this.halfAdderB = !this.halfAdderB;
  }

  public swingMilestone(index: number) {
    soundManager.playClick();
    if (this.hangingFrames[index]) {
      this.hangingFrames[index].swingVel = 3.5;
    }
  }

  public setActiveProjectIdx(idx: number) {
    this.activeProjectIdx = ((idx % 4) + 4) % 4;
    soundManager.playClick();
  }

  public cycleProject(direction: 1 | -1 = 1) {
    this.activeProjectIdx = ((this.activeProjectIdx + direction) % 4 + 4) % 4;
    soundManager.playClick();
  }

  public setScrollProgress(progress: number) {
    if (progress > 0.01 && this.introProgress < 1.0) {
      this.introProgress = 1.0;
      this.roomRoot.rotation.y = 0;
    }

    const totalSegments = CAMERA_STATIONS.length - 1;
    const clampedProgress = Math.max(0, Math.min(1, progress));
    const rawIdx = clampedProgress * totalSegments;
    const idx = Math.min(Math.floor(rawIdx), totalSegments - 1);
    const alpha = rawIdx - idx;

    const fromStation = CAMERA_STATIONS[idx];
    const toStation = CAMERA_STATIONS[idx + 1] || fromStation;

    this.targetPos.lerpVectors(fromStation.pos, toStation.pos, alpha);
    this.targetLookAt.lerpVectors(fromStation.target, toStation.target, alpha);
  }

  public setPointerOffset(x: number, y: number) {
    this.pointerOffset.set(x * 0.22, y * 0.15);
  }

  public onResize(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  public destroy() {
    cancelAnimationFrame(this.animFrameId);
    this.renderer.dispose();
    this.mainScreenTexture.dispose();
    this.phoneScreenTexture.dispose();
    this.scopeTexture.dispose();
    this.adderTexture.dispose();
    this.keyboardTexture.dispose();
  }
}
