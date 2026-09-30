/**
 * Dholavira 3D Canvas - Dark Cinematic Archaeological Mystery Reconstruction
 * Features:
 * - Twilight / late-evening environment with deep blue-black shadows and dramatic raking directional sunlight
 * - Ancient stone braziers with natural flickering fire embers and warm orange-gold light
 * - Volumetric ground fog & atmospheric haze layers drifting across seasonal nullahs and reservoirs
 * - Atmospheric dust motes and floating sand particles illuminated by low-angle golden sunbeams
 * - Dark, reflective deep reservoir water with undulating mist layer hovering above
 * - Self-illuminating subterranean hydraulic conduits with subtle cyan emission
 * - Archaeologist character with subtle golden rim lighting and chest survey lamp
 * - Cinematic anamorphic lens radial vignette
 * - Complete preservation of game controls, camera modes, missions, collisions, and interactions
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { soundManager, CityZone } from '../../utils/audio';
import { CameraMode, TimeOfDay } from './GameHUDOverlay';
import {
  createSandstoneTexture,
  createSandstoneNormalTexture,
  createSandstoneRoughnessTexture,
  createBedrockTexture,
  createBedrockNormalTexture,
  createLimestoneTexture,
  createDesertGroundTexture,
  createDesertGroundNormalTexture,
  createDesertGroundRoughnessTexture,
  createWaterRippleTexture,
  createWaterSecondaryRippleTexture,
  createDarkWaterAlbedoTexture,
  createWetStoneTexture,
  createWetStoneNormalTexture,
  createDarkReservoirInteriorTexture,
  createReservoirMistTexture,
  createTerracottaPotteryTexture,
  createPotteryDetailedTexture,
  createWeatheredWoodTexture,
  createStratigraphyTexture,
  createExplorerFabricTexture,
  createHazeTexture,
  createBrazierFlameTexture,
  createTwilightSkyTexture,
  createGoldenSkyTexture,
  createNoonSkyTexture,
  createAncientStreetTexture,
  createAncientStreetNormalTexture,
  createVolumetricBeamTexture,
  createArchaeologicalInscriptionTexture,
  createArchaeologicalSurveyDecalTexture,
  createDustParticleTexture,
  createGoldenGlowBeamTexture,
} from './textureGenerator';

interface ClueLocation {
  id: string;
  evidenceId: string;
  name: string;
  type: string;
  x: number;
  y: number;
  z: number;
  cameraFocus: [number, number, number];
  featureTitle: string;
  featureSubtitle: string;
}

const SKY_PANORAMA_URL = '/src/assets/images/dholavira_sky_panorama_1790659204505.jpg';

// Archaeological Evidence Hotspot Coordinates - Exact alignment with archaeological strata & water system
const CLUE_LOCATIONS: ClueLocation[] = [
  {
    id: 'manhar_bund',
    evidenceId: 'm1_stream_bund',
    name: 'Check-Dam & Bund (Manhar Nullah)',
    type: 'Hydraulic Engineering',
    x: 0,
    y: 0,
    z: -68,
    cameraFocus: [0, 2.5, -68],
    featureTitle: 'MONSOON CATCHMENT BUND',
    featureSubtitle: 'Limestone cyclopean dam retaining storm runoff',
  },
  {
    id: 'silt_chamber',
    evidenceId: 'm1_silt_chamber',
    name: 'Sediment Desilting Chamber',
    type: 'Filtration System',
    x: 16,
    y: 0,
    z: -48,
    cameraFocus: [16, 1.8, -48],
    featureTitle: 'INLET SETTLING BASIN',
    featureSubtitle: 'Stratified settling chamber for coarse sand',
  },
  {
    id: 'eastern_reservoir',
    evidenceId: 'm1_rock_cut_reservoir',
    name: 'Great Eastern Rock-Cut Reservoir',
    type: 'Deep Water Storage',
    x: 48,
    y: 0,
    z: 8,
    cameraFocus: [48, -1.5, 8],
    featureTitle: 'BEDROCK-CUT RESERVOIR',
    featureSubtitle: '73.4m × 29.3m monumental hydraulic tank',
  },
  {
    id: 'stone_ghats',
    evidenceId: 'm1_masonry_channel',
    name: 'Monumental Flight of Steps & Aqueduct',
    type: 'Stepwell Access & Aqueduct',
    x: 36,
    y: 0,
    z: 8,
    cameraFocus: [36, 1.2, 8],
    featureTitle: 'MONUMENTAL GHATS & CONDUIT',
    featureSubtitle: 'Dressed sandstone steps with masonry aqueduct',
  },
  {
    id: 'sluice_gate',
    evidenceId: 'm1_sluice_steps',
    name: 'Regulating Sluice & Drain Channel',
    type: 'Flow Gate Control',
    x: 68,
    y: 0,
    z: 14,
    cameraFocus: [68, 1.6, 14],
    featureTitle: 'SLUICE GATE & TIMBER SLOTS',
    featureSubtitle: 'Stone-cut vertical grooves for sluice boards',
  },
  {
    id: 'signboard_inscription',
    evidenceId: 'm1_overflow_drain',
    name: 'Monumental Gateway & 10-Glyph Signboard',
    type: 'Harappan Epigraphy',
    x: -15,
    y: 4.5,
    z: -7.5,
    cameraFocus: [-15, 6.5, -7.5],
    featureTitle: 'NORTH GATEWAY INSCRIPTION',
    featureSubtitle: '10-character Harappan inscription in white gypsum',
  },
];

interface Props {
  collectedEvidenceIds: string[];
  onInspectClue: (clueId: string) => void;
  onNearbyClueChange: (clue: { id: string; name: string; type: string; isCollected: boolean } | null) => void;
  cameraMode: CameraMode;
  timeOfDay: TimeOfDay;
  zoomLevel: number;
  cameraResetTrigger: number;
  quickFocusTarget: 'reservoir' | 'bund' | 'citadel' | 'player' | null;
  isWaterFlowing: boolean;
  virtualMoveDirection: 'forward' | 'backward' | 'left' | 'right' | 'stop';
  onZoneChange?: (zone: CityZone) => void;
  onOpenPause?: () => void;
  onCompleteMission?: (missionId: string, durationSeconds: number) => void;
}

export const Dholavira3DCanvas: React.FC<Props> = ({
  collectedEvidenceIds,
  onInspectClue,
  onNearbyClueChange,
  cameraMode,
  timeOfDay,
  zoomLevel,
  cameraResetTrigger,
  quickFocusTarget,
  isWaterFlowing,
  virtualMoveDirection,
  onZoneChange,
  onOpenPause,
  onCompleteMission,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mutable game state refs for 60fps render loop
  const playerPosRef = useRef<THREE.Vector3>(new THREE.Vector3(16.0, 0.0, -10.0)); // Scenic viewpoint on Grand Avenue looking across the ruins
  const playerRotRef = useRef<number>(Math.PI * 0.72); // Facing Southeast toward the Great Reservoir and Citadel
  const velocityYRef = useRef<number>(0);
  const zoomDistRef = useRef<number>(3.2); // Comfortable third-person follow distance matching reference image
  const targetMovePosRef = useRef<THREE.Vector3 | null>(null);
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const cameraAngleRef = useRef<{ theta: number; phi: number }>({ theta: -Math.PI * 0.28, phi: 0.20 }); // Positioned directly behind archaeologist
  const isDraggingRef = useRef<boolean>(false);
  const lastMousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const nearbyClueRef = useRef<ClueLocation | null>(null);
  const currentZoneRef = useRef<CityZone>('reservoir');

  // References to dynamic animated 3D objects
  const waterMeshRef = useRef<THREE.Mesh | null>(null);
  const waterGeomRef = useRef<THREE.PlaneGeometry | null>(null);
  const secondaryWaterNormalRef = useRef<THREE.CanvasTexture | null>(null);
  const waterMistMeshRef = useRef<THREE.Mesh | null>(null);
  const waterMistSecondaryRef = useRef<THREE.Mesh | null>(null);
  const waterChannelMeshesRef = useRef<THREE.Mesh[]>([]);
  const characterGroupRef = useRef<THREE.Group | null>(null);
  const characterHeadRef = useRef<THREE.Group | null>(null);
  const characterTorsoRef = useRef<THREE.Group | null>(null);
  const characterLegsRef = useRef<{ left: THREE.Group; right: THREE.Group } | null>(null);
  const characterArmsRef = useRef<{ left: THREE.Group; right: THREE.Group } | null>(null);
  const dustParticlesRef = useRef<THREE.Points | null>(null);
  const beaconRingsRef = useRef<{ ring: THREE.Mesh; id: string }[]>([]);
  const clueVisualsRef = useRef<{
    id: string;
    evidenceId: string;
    ring: THREE.Mesh;
    light: THREE.PointLight;
    dustPoints: THREE.Points;
    beam?: THREE.Mesh;
    baseIntensity: number;
    initialDustPos: Float32Array;
  }[]>([]);
  const targetRingRef = useRef<THREE.Mesh | null>(null);
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const ambLightRef = useRef<THREE.AmbientLight | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const braziersRef = useRef<{ light: THREE.PointLight; flame: THREE.Mesh; baseIntensity: number; phase: number }[]>([]);
  const hazePlanesRef = useRef<THREE.Mesh[]>([]);
  const skyMatRef = useRef<THREE.MeshBasicMaterial | null>(null);
  const walkAudioTimerRef = useRef<number>(0);
  const waterFlowTimerRef = useRef<number>(0);
  const hasCompletedMissionRef = useRef<boolean>(false);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      soundManager.startAmbient();
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      keysRef.current[e.key.toLowerCase()] = true;
      if (e.key === 'Shift') keysRef.current['shift'] = true;
      if (e.key === ' ') {
        e.preventDefault();
        keysRef.current['space'] = true;
      }
      if (e.key === 'e' || e.key === 'E') {
        if (nearbyClueRef.current) {
          onInspectClue(nearbyClueRef.current.id);
        }
      }
      if (e.key === 'Escape') {
        if (document.pointerLockElement) {
          document.exitPointerLock?.();
        }
        if (onOpenPause) onOpenPause();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key.toLowerCase()] = false;
      if (e.key === 'Shift') keysRef.current['shift'] = false;
      if (e.key === ' ') keysRef.current['space'] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [onInspectClue, onOpenPause]);

  // Main Three.js Scene Setup & Loop
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth || 800;
    const height = containerRef.current.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.4, 1400);
    cameraRef.current = camera;
    
    // Position camera immediately at scenic third-person perspective behind player (Uncharted / Tomb Raider style)
    const initP = playerPosRef.current;
    const initDist = zoomDistRef.current;
    const initCamHeight = Math.sin(cameraAngleRef.current.phi) * initDist + 1.55;
    const initHorizontalDist = Math.cos(cameraAngleRef.current.phi) * initDist;
    const initTargetX = initP.x + Math.sin(cameraAngleRef.current.theta) * initHorizontalDist;
    const initTargetZ = initP.z + Math.cos(cameraAngleRef.current.theta) * initHorizontalDist;
    const initTargetY = Math.max(0.60, initP.y + initCamHeight);
    camera.position.set(initTargetX, initTargetY, initTargetZ);
    camera.lookAt(initP.x, initP.y + 1.25, initP.z);

    // 2. Renderer with High-Fidelity ACES Tone Mapping & Soft Shadows
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.80; // Cinematic golden-hour dynamic range

    // Handle Context Lost/Restored
    const handleContextLost = (e: Event) => {
      e.preventDefault();
      console.warn('WebGL Context Lost');
    };
    const handleContextRestored = () => {
      console.log('WebGL Context Restored');
    };
    const canvasEl = canvasRef.current;
    canvasEl.addEventListener('webglcontextlost', handleContextLost);
    canvasEl.addEventListener('webglcontextrestored', handleContextRestored);

    // 3. Clear Atmospheric Desert Horizon (0% fog within 150m so all ruins are 100% crisp)
    const clearSkyColor = new THREE.Color('#8abce6');
    scene.background = clearSkyColor;
    scene.fog = new THREE.Fog(clearSkyColor.getHex(), 150, 600);

    // Procedural Sky Dome
    const skyGeo = new THREE.SphereGeometry(500, 36, 20);
    const initialSkyTex = createNoonSkyTexture();
    const skyMat = new THREE.MeshBasicMaterial({
      map: initialSkyTex,
      side: THREE.BackSide,
      fog: false,
    });
    skyMatRef.current = skyMat;
    const skyMesh = new THREE.Mesh(skyGeo, skyMat);
    skyMesh.position.y = 35;
    scene.add(skyMesh);

    // 4. Balanced Crisp Daytime Sunlight
    const dirLight = new THREE.DirectionalLight(0xfff7ed, 1.30);
    dirLight.position.set(-55, 65, 45);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 340;
    dirLight.shadow.camera.left = -95;
    dirLight.shadow.camera.right = 95;
    dirLight.shadow.camera.top = 95;
    dirLight.shadow.camera.bottom = -95;
    dirLight.shadow.bias = -0.00015;
    dirLight.shadow.normalBias = 0.03;
    scene.add(dirLight);
    dirLightRef.current = dirLight;

    // Natural Sky & Terracotta Ground Ambient Bounce
    const hemiLight = new THREE.HemisphereLight(0x92c8fc, 0x907055, 0.55);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // Soft Ambient fill
    const ambLight = new THREE.AmbientLight(0xfdf8f0, 0.40);
    scene.add(ambLight);
    ambLightRef.current = ambLight;

    // 5. Procedural PBR Material Suite
    const groundTex = createDesertGroundTexture();
    const groundNormalTex = createDesertGroundNormalTexture();
    const groundRoughnessTex = createDesertGroundRoughnessTexture();
    const sandstoneTex = createSandstoneTexture();
    const sandstoneNormalTex = createSandstoneNormalTexture();
    const sandstoneRoughnessTex = createSandstoneRoughnessTexture();
    const bedrockTex = createBedrockTexture();
    const bedrockNormalTex = createBedrockNormalTexture();
    const limestoneTex = createLimestoneTexture();
    const waterRippleTex = createWaterRippleTexture();
    const waterSecondaryRippleTex = createWaterSecondaryRippleTexture();
    secondaryWaterNormalRef.current = waterSecondaryRippleTex;
    const darkWaterTex = createDarkWaterAlbedoTexture();
    const wetStoneTex = createWetStoneTexture();
    const wetStoneNormalTex = createWetStoneNormalTexture();
    const darkReservoirWallTex = createDarkReservoirInteriorTexture();
    const reservoirMistTex = createReservoirMistTexture();
    const potteryTex = createPotteryDetailedTexture();
    const woodTex = createWeatheredWoodTexture();
    const stratigraphyTex = createStratigraphyTexture();
    const hazeTex = createHazeTexture();
    const brazierFlameTex = createBrazierFlameTexture();
    const streetTex = createAncientStreetTexture();
    const streetNormalTex = createAncientStreetNormalTexture();

    // High-fidelity Realistic Archaeological PBR Materials
    const groundMat = new THREE.MeshStandardMaterial({
      map: groundTex,
      normalMap: groundNormalTex,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughnessMap: groundRoughnessTex,
      roughness: 0.92,
      metalness: 0.02,
    });

    const sandstoneMat = new THREE.MeshStandardMaterial({
      map: sandstoneTex,
      normalMap: sandstoneNormalTex,
      normalScale: new THREE.Vector2(1.25, 1.25),
      roughnessMap: sandstoneRoughnessTex,
      roughness: 0.86,
      metalness: 0.04, // Subtle warm specular highlights along chipped stone bevels
    });

    const bedrockMat = new THREE.MeshStandardMaterial({
      map: bedrockTex,
      normalMap: bedrockNormalTex,
      normalScale: new THREE.Vector2(1.15, 1.15),
      roughness: 0.85,
      metalness: 0.04,
    });

    const limestoneMat = new THREE.MeshStandardMaterial({
      map: limestoneTex,
      roughness: 0.74,
      metalness: 0.06,
    });

    const ancientStreetMat = new THREE.MeshStandardMaterial({
      map: streetTex,
      normalMap: streetNormalTex,
      normalScale: new THREE.Vector2(1.1, 1.1),
      roughness: 0.82,
      metalness: 0.04,
    });

    // Dark, drenched wet stone with glistening specular sheen & salt efflorescence
    const wetStoneMat = new THREE.MeshStandardMaterial({
      map: wetStoneTex,
      normalMap: wetStoneNormalTex,
      normalScale: new THREE.Vector2(1.1, 1.1),
      roughness: 0.08,
      metalness: 0.55, // Glistening specular sheen reflecting sky, stars, and braziers
    });

    // Dark rock-cut reservoir interior with deep strata, water seepage and silt settling
    const darkReservoirWallMat = new THREE.MeshStandardMaterial({
      map: darkReservoirWallTex,
      normalMap: bedrockNormalTex,
      normalScale: new THREE.Vector2(1.3, 1.3),
      roughness: 0.90,
      metalness: 0.04,
    });

    const darkBasinMat = new THREE.MeshStandardMaterial({
      map: darkReservoirWallTex,
      normalMap: bedrockNormalTex,
      normalScale: new THREE.Vector2(1.15, 1.15),
      roughness: 0.94,
      metalness: 0.03,
    });

    // Deep dark reflective Harappan reservoir water
    const darkWaterMat = new THREE.MeshStandardMaterial({
      map: darkWaterTex,
      normalMap: waterRippleTex,
      normalScale: new THREE.Vector2(1.3, 1.3),
      color: 0x01111a, // Deep obsidian-aquatic tone
      roughness: 0.026, // Mirror-like reflection of sky and warm braziers
      metalness: 0.88, // Strong Fresnel reflection for warm lights & crepuscular rays
      transparent: true,
      opacity: 0.95,
    });

    const woodMat = new THREE.MeshStandardMaterial({
      map: woodTex,
      roughness: 0.88,
      metalness: 0.06,
    });

    const potteryMat = new THREE.MeshStandardMaterial({
      map: potteryTex,
      roughness: 0.58,
      metalness: 0.05,
    });

    // 6. Uneven Natural Desert Terrain & Riverbeds
    const groundGeo = new THREE.PlaneGeometry(300, 300, 100, 100);
    groundGeo.rotateX(-Math.PI / 2);
    const groundPos = groundGeo.attributes.position;

    for (let i = 0; i < groundPos.count; i++) {
      const x = groundPos.getX(i);
      const z = groundPos.getZ(i);
      let y = 0;

      // Northern seasonal stream channel (Manhar Nullah) - only outside the city walls
      const distToManhar = Math.abs(z - (-70));
      if (distToManhar < 15 && Math.abs(x) > 30) {
        y -= Math.cos((distToManhar / 15) * (Math.PI / 2)) * 2.6;
      }

      // Southern seasonal stream channel (Mansar Nullah) - outside city walls
      const distToMansar = Math.abs(z - 75);
      if (distToMansar < 16 && Math.abs(x) > 30) {
        y -= Math.cos((distToMansar / 16) * (Math.PI / 2)) * 2.8;
      }

      // Archaeological city plateau (x: -75 to 75, z: -65 to 65) is solid and flat at y = 0.0
      // Dunes and perimeter hills only exist outside the excavated archaeological city
      const distFromCity = Math.max(Math.abs(x) - 52, Math.abs(z) - 50);
      if (distFromCity > 0) {
        const falloff = Math.min(1.0, distFromCity / 22);
        const naturalDunes = (Math.sin(x * 0.038) * Math.cos(z * 0.038) * 1.8 + Math.sin((x + z) * 0.022) * 1.2) * falloff;
        y += naturalDunes;

        // Outer distant hill ridge
        if (Math.abs(x) > 85 || Math.abs(z) > 85) {
          y += (Math.sin(x * 0.04) * Math.cos(z * 0.04) * 8 + 4) * falloff;
        }
      }

      groundPos.setY(i, y);
    }
    groundGeo.computeVertexNormals();
    const groundMesh = new THREE.Mesh(groundGeo, groundMat);
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Natural Boulders & Rock Formations scattered across terrain
    const boulderGeo = new THREE.DodecahedronGeometry(1.2, 1);
    for (let b = 0; b < 45; b++) {
      const bx = (Math.sin(b * 7.3) * 0.5 + 0.5) * 220 - 110;
      const bz = (Math.cos(b * 5.1) * 0.5 + 0.5) * 220 - 110;

      if (bx > -45 && bx < 75 && bz > -75 && bz < 45) continue;

      const scaleX = 0.8 + Math.sin(b * 2) * 0.5;
      const scaleY = 0.5 + Math.cos(b * 3) * 0.3;
      const scaleZ = 0.8 + Math.sin(b * 5) * 0.5;

      const rock = new THREE.Mesh(boulderGeo, sandstoneMat);
      rock.position.set(bx, scaleY * 0.5, bz);
      rock.scale.set(scaleX * 1.5, scaleY * 1.4, scaleZ * 1.5);
      rock.rotation.set(b * 0.4, b * 0.8, b * 0.2);
      rock.castShadow = true;
      rock.receiveShadow = true;
      scene.add(rock);
    }

    // Windblown Sand Drifts banked against ancient wall bases
    const addSandDrift = (x: number, z: number, length: number, angle = 0) => {
      const driftGeo = new THREE.ConeGeometry(1.8, length, 12, 1, false, 0, Math.PI);
      driftGeo.rotateZ(Math.PI / 2);
      const drift = new THREE.Mesh(driftGeo, groundMat);
      drift.position.set(x, 0.4, z);
      drift.rotation.y = angle;
      drift.receiveShadow = true;
      scene.add(drift);
    };

    addSandDrift(-15, -8.2, 42, 0);
    addSandDrift(-38.2, 15, 42, Math.PI / 2);
    addSandDrift(8.2, 15, 42, Math.PI / 2);

    // 7. Volumetric Ground Haze (Kept minimal and transparent to preserve clear visibility)
    hazePlanesRef.current = [];

    // 8. Ancient Dholavira Dressed Stone Architecture
    // A. Citadel Raised Mound (Acropolis)
    const citadelPodiumGeo = new THREE.BoxGeometry(45.5, 3.6, 45.5);
    const citadelPodium = new THREE.Mesh(citadelPodiumGeo, sandstoneMat);
    citadelPodium.position.set(-15, 1.8, 15);
    citadelPodium.castShadow = true;
    citadelPodium.receiveShadow = true;
    scene.add(citadelPodium);

    // Podium Coping Stone Plinth Projection
    const podiumCrest = new THREE.Mesh(new THREE.BoxGeometry(46.2, 0.3, 46.2), limestoneMat);
    podiumCrest.position.set(-15, 3.75, 15);
    podiumCrest.castShadow = true;
    podiumCrest.receiveShadow = true;
    scene.add(podiumCrest);

    // Multi-Course Fortification Walls with Coping, Foundation Plinths, and Chipped Weathered Blocks
    const addRealisticWall = (w: number, h: number, d: number, x: number, y: number, z: number) => {
      const wallGroup = new THREE.Group();

      // Projecting ashlar foundation plinth (characteristic Harappan anti-seismic footing)
      const plinthW = w >= d ? w + 0.45 : w + 0.2;
      const plinthD = d >= w ? d + 0.45 : d + 0.2;
      const plinth = new THREE.Mesh(new THREE.BoxGeometry(plinthW, 0.45, plinthD), sandstoneMat);
      plinth.position.set(0, 0.22, 0);
      plinth.receiveShadow = true;
      wallGroup.add(plinth);

      // Main battered ashlar wall body
      const wallBody = new THREE.Mesh(new THREE.BoxGeometry(w, h - 0.45, d), sandstoneMat);
      wallBody.position.set(0, (h - 0.45) / 2 + 0.45, 0);
      wallBody.castShadow = true;
      wallBody.receiveShadow = true;
      wallGroup.add(wallBody);

      // Weathered limestone coping with subtle overhang
      const copingW = w >= d ? w + 0.35 : w + 0.12;
      const copingD = d >= w ? d + 0.35 : d + 0.12;
      const coping = new THREE.Mesh(new THREE.BoxGeometry(copingW, 0.24, copingD), limestoneMat);
      coping.position.set(0, h + 0.12, 0);
      coping.castShadow = true;
      coping.receiveShadow = true;
      wallGroup.add(coping);

      // Random chipped stone blocks & fallen ashlar rubble at base
      const blockCount = Math.min(6, Math.floor(Math.max(w, d) / 6));
      for (let rb = 0; rb < blockCount; rb++) {
        const isLongX = w >= d;
        const rx = isLongX ? (Math.random() - 0.5) * (w - 3) : (Math.random() > 0.5 ? 1.4 : -1.4);
        const rz = isLongX ? (Math.random() > 0.5 ? 1.4 : -1.4) : (Math.random() - 0.5) * (d - 3);
        const rubbleBlock = new THREE.Mesh(new THREE.BoxGeometry(0.75 + Math.random() * 0.4, 0.35 + Math.random() * 0.2, 0.55 + Math.random() * 0.3), sandstoneMat);
        rubbleBlock.position.set(rx, 0.2, rz);
        rubbleBlock.rotation.y = Math.random() * Math.PI;
        rubbleBlock.castShadow = true;
        rubbleBlock.receiveShadow = true;
        wallGroup.add(rubbleBlock);
      }

      wallGroup.position.set(x, y, z);
      scene.add(wallGroup);
      return wallGroup;
    };

    // Outer Citadel Fortification Walls (Massive Stone Ramparts)
    addRealisticWall(45, 3.4, 2.4, -15, 3.6, -7.5); // North Wall
    addRealisticWall(45, 3.4, 2.4, -15, 3.6, 37.5); // South Wall
    addRealisticWall(2.4, 3.4, 45, -37.5, 3.6, 15); // West Wall
    addRealisticWall(2.4, 3.4, 45, 7.5, 3.6, 15);  // East Wall

    // Heavy Stone Bastions with Tiered Parapets & Chamfered Profiles
    const addRealisticBastion = (x: number, z: number) => {
      const bastionGroup = new THREE.Group();

      const plinthRing = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.8, 0.6, 16), sandstoneMat);
      plinthRing.position.y = 0.3;
      plinthRing.receiveShadow = true;
      bastionGroup.add(plinthRing);

      const base = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 4.5, 7.2, 16), sandstoneMat);
      base.position.y = 3.9;
      base.castShadow = true;
      base.receiveShadow = true;
      bastionGroup.add(base);

      const parapet = new THREE.Mesh(new THREE.CylinderGeometry(4.45, 4.45, 0.55, 16), limestoneMat);
      parapet.position.y = 7.75;
      parapet.castShadow = true;
      bastionGroup.add(parapet);

      bastionGroup.position.set(x, 0, z);
      scene.add(bastionGroup);
    };

    addRealisticBastion(-37.5, -7.5);
    addRealisticBastion(7.5, -7.5);
    addRealisticBastion(-37.5, 37.5);
    addRealisticBastion(7.5, 37.5);

    // Monumental North Gateway with Turned Limestone Pillar Bases & Authentic Signboard
    const addMonumentalGateway = (x: number, z: number) => {
      const createPillar = (px: number) => {
        const pillarGroup = new THREE.Group();

        const baseRing = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 1.0, 0.45, 20), limestoneMat);
        baseRing.position.y = 0.22;
        baseRing.castShadow = true;
        pillarGroup.add(baseRing);

        const squareBase = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.65, 1.4), sandstoneMat);
        squareBase.position.y = 0.55;
        squareBase.castShadow = true;
        pillarGroup.add(squareBase);

        const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.68, 0.74, 5.2, 20), limestoneMat);
        shaft.position.y = 3.48;
        shaft.castShadow = true;
        pillarGroup.add(shaft);

        const capital = new THREE.Mesh(new THREE.CylinderGeometry(0.92, 0.68, 0.6, 20), limestoneMat);
        capital.position.y = 6.38;
        capital.castShadow = true;
        pillarGroup.add(capital);

        pillarGroup.position.set(px, 3.6, z);
        scene.add(pillarGroup);
      };

      createPillar(x - 3.8);
      createPillar(x + 3.8);

      const lintel = new THREE.Mesh(new THREE.BoxGeometry(11.2, 1.25, 2.4), limestoneMat);
      lintel.position.set(x, 10.5, z);
      lintel.castShadow = true;
      lintel.receiveShadow = true;
      scene.add(lintel);

      // Authentic 10-Symbol Dholavira Inscription Signboard
      const boardCanvas = document.createElement('canvas');
      boardCanvas.width = 1024;
      boardCanvas.height = 256;
      const bctx = boardCanvas.getContext('2d');
      if (bctx) {
        bctx.fillStyle = '#160e0a';
        bctx.fillRect(0, 0, 1024, 256);

        bctx.strokeStyle = '#422c18';
        bctx.lineWidth = 14;
        bctx.strokeRect(7, 7, 1010, 242);

        bctx.strokeStyle = '#f8f4ec';
        bctx.fillStyle = '#f8f4ec';
        bctx.lineWidth = 9;
        bctx.lineCap = 'round';
        bctx.lineJoin = 'round';

        const glyphs = [
          (cx: number, cy: number) => {
            bctx.beginPath();
            bctx.moveTo(cx - 20, cy - 35);
            bctx.lineTo(cx, cy + 35);
            bctx.lineTo(cx + 20, cy - 35);
            bctx.stroke();
            bctx.beginPath();
            bctx.moveTo(cx - 10, cy);
            bctx.lineTo(cx + 10, cy);
            bctx.stroke();
          },
          (cx: number, cy: number) => {
            bctx.beginPath();
            bctx.ellipse(cx, cy, 26, 38, 0, 0, Math.PI * 2);
            bctx.stroke();
            bctx.beginPath();
            bctx.moveTo(cx - 14, cy);
            bctx.lineTo(cx + 14, cy);
            bctx.stroke();
          },
          (cx: number, cy: number) => {
            bctx.beginPath();
            bctx.ellipse(cx, cy - 10, 22, 14, 0, 0, Math.PI * 2);
            bctx.stroke();
            bctx.beginPath();
            bctx.moveTo(cx, cy + 4);
            bctx.lineTo(cx, cy + 38);
            bctx.moveTo(cx - 18, cy + 22);
            bctx.lineTo(cx + 18, cy + 22);
            bctx.stroke();
          },
          (cx: number, cy: number) => {
            bctx.beginPath();
            bctx.ellipse(cx, cy, 26, 38, 0, 0, Math.PI * 2);
            bctx.stroke();
            bctx.beginPath();
            bctx.moveTo(cx, cy - 38);
            bctx.lineTo(cx, cy + 38);
            bctx.stroke();
          },
          (cx: number, cy: number) => {
            bctx.beginPath();
            bctx.moveTo(cx - 24, cy - 34);
            bctx.lineTo(cx, cy);
            bctx.lineTo(cx + 24, cy - 34);
            bctx.moveTo(cx, cy);
            bctx.lineTo(cx, cy + 38);
            bctx.stroke();
          },
          (cx: number, cy: number) => {
            for (let c = -20; c <= 20; c += 20) {
              bctx.beginPath();
              bctx.moveTo(cx - 24, cy + c + 14);
              bctx.lineTo(cx, cy + c - 14);
              bctx.lineTo(cx + 24, cy + c + 14);
              bctx.stroke();
            }
          },
          (cx: number, cy: number) => {
            bctx.strokeRect(cx - 24, cy - 32, 48, 64);
            bctx.beginPath();
            bctx.moveTo(cx, cy - 32);
            bctx.lineTo(cx, cy + 32);
            bctx.moveTo(cx - 24, cy);
            bctx.lineTo(cx + 24, cy);
            bctx.stroke();
          },
          (cx: number, cy: number) => {
            bctx.beginPath();
            bctx.moveTo(cx, cy - 36);
            bctx.lineTo(cx, cy + 36);
            bctx.stroke();
            for (let b = -24; b <= 24; b += 16) {
              bctx.beginPath();
              bctx.moveTo(cx, cy + b);
              bctx.lineTo(cx + 24, cy + b - 8);
              bctx.stroke();
            }
          },
          (cx: number, cy: number) => {
            bctx.beginPath();
            bctx.arc(cx, cy, 32, 0, Math.PI * 2);
            bctx.stroke();
            bctx.beginPath();
            bctx.arc(cx, cy, 14, 0, Math.PI * 2);
            bctx.stroke();
          },
          (cx: number, cy: number) => {
            bctx.beginPath();
            bctx.arc(cx, cy, 26, Math.PI, 0);
            bctx.stroke();
            bctx.beginPath();
            bctx.moveTo(cx, cy);
            bctx.lineTo(cx, cy + 32);
            bctx.stroke();
          }
        ];

        glyphs.forEach((drawGlyph, idx) => {
          const gx = 65 + idx * 98;
          drawGlyph(gx, 128);
        });

        bctx.fillStyle = '#b89254';
        for (let bx = 16; bx < 1024; bx += 32) {
          bctx.beginPath();
          bctx.arc(bx, 14, 4, 0, Math.PI * 2);
          bctx.arc(bx, 242, 4, 0, Math.PI * 2);
          bctx.fill();
        }
      }

      const boardTex = new THREE.CanvasTexture(boardCanvas);
      const signboard = new THREE.Mesh(
        new THREE.BoxGeometry(8.2, 1.9, 0.28),
        new THREE.MeshStandardMaterial({ map: boardTex, roughness: 0.65, metalness: 0.15 })
      );
      signboard.position.set(x, 10.9, z - 1.35);
      signboard.castShadow = true;
      scene.add(signboard);
    };

    addMonumentalGateway(-15, -7.5);

    // B. Ceremonial Ground (Harappan Stadium / Plaza)
    const stadiumFloor = new THREE.Mesh(
      new THREE.BoxGeometry(46, 0.45, 21),
      sandstoneMat
    );
    stadiumFloor.position.set(-15, 0.22, -22);
    stadiumFloor.receiveShadow = true;
    scene.add(stadiumFloor);

    // Stepped Spectator Grandstands with coping
    for (let s = 1; s <= 4; s++) {
      const step = new THREE.Mesh(
        new THREE.BoxGeometry(46, 0.48 * s, 1.6),
        limestoneMat
      );
      step.position.set(-15, (0.48 * s) / 2, -32 - s * 1.6);
      step.castShadow = true;
      step.receiveShadow = true;
      scene.add(step);
    }

    // C. Middle Town & Artisan Craft Quarters (Ruined Grid Foundations)
    for (let gx = 25; gx <= 75; gx += 17) {
      for (let gz = -36; gz <= -10; gz += 14) {
        const houseW = 12.5;
        const houseD = 10.5;
        const wallH = 1.3 + Math.sin(gx * gz) * 0.4;

        addRealisticWall(houseW, wallH, 0.85, gx, 0, gz - houseD / 2);
        addRealisticWall(houseW, wallH, 0.85, gx, 0, gz + houseD / 2);
        addRealisticWall(0.85, wallH, houseD, gx - houseW / 2, 0, gz);
        addRealisticWall(0.85, wallH, houseD * 0.62, gx + houseW / 2, 0, gz - houseD * 0.19);

        const bathFloor = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.15, 3.5), limestoneMat);
        bathFloor.position.set(gx - 2, 0.1, gz - 2);
        bathFloor.receiveShadow = true;
        scene.add(bathFloor);
      }
    }

    // D. Ancient Harappan Paved Thoroughfare Network & Covered Drainage System
    // 1. East-West Main Street connecting Ceremonial Plaza & Gateway to Great Eastern Reservoir
    const mainStreet = new THREE.Mesh(new THREE.BoxGeometry(64, 0.14, 5.4), ancientStreetMat);
    mainStreet.position.set(16, 0.08, -6.5);
    mainStreet.receiveShadow = true;
    scene.add(mainStreet);

    // 2. North-South Grand Ceremonial Avenue passing between Ceremonial Plaza and Citadel
    const ceremonialAvenue = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.14, 56), ancientStreetMat);
    ceremonialAvenue.position.set(-15, 0.08, -12);
    ceremonialAvenue.receiveShadow = true;
    scene.add(ceremonialAvenue);

    // 3. Western Sacred Avenue leading from North Gateway to the ancient Megalithic Cairn Tombs
    const westAvenueTombs = new THREE.Mesh(new THREE.BoxGeometry(46, 0.14, 5.2), ancientStreetMat);
    westAvenueTombs.position.set(-38, 0.08, -15);
    westAvenueTombs.receiveShadow = true;
    scene.add(westAvenueTombs);

    // 4. Reservoir West Promenade & Elevated Viewpoint Esplanade
    const reservoirWestPromenade = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.14, 46), ancientStreetMat);
    reservoirWestPromenade.position.set(22, 0.08, 8);
    reservoirWestPromenade.receiveShadow = true;
    scene.add(reservoirWestPromenade);

    // 5. Reservoir North Paved Walkway
    const reservoirNorthPromenade = new THREE.Mesh(new THREE.BoxGeometry(54, 0.14, 5.2), ancientStreetMat);
    reservoirNorthPromenade.position.set(48, 0.08, -14);
    reservoirNorthPromenade.receiveShadow = true;
    scene.add(reservoirNorthPromenade);

    // Raised Limestone Kerbstones defining pathway boundaries
    for (let k = -12; k <= 44; k += 4) {
      const kerbL = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.22, 0.35), limestoneMat);
      kerbL.position.set(k, 0.11, -3.6);
      kerbL.receiveShadow = true;
      scene.add(kerbL);

      const kerbR = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.22, 0.35), limestoneMat);
      kerbR.position.set(k, 0.11, -9.4);
      kerbR.receiveShadow = true;
      scene.add(kerbR);
    }

    // Covered Cut-Stone Municipal Drain running parallel to the street
    const drainBase = new THREE.Mesh(new THREE.BoxGeometry(64, 0.45, 1.4), bedrockMat);
    drainBase.position.set(16, 0.22, -9.8);
    drainBase.receiveShadow = true;
    scene.add(drainBase);

    // Segmented limestone drain inspection slabs with subtle drainage slits
    for (let sl = 0; sl < 28; sl++) {
      const slabW = 2.1;
      const isMissing = sl === 8 || sl === 19; // Missing slabs revealing inner stone drain conduit
      if (!isMissing) {
        const drainSlab = new THREE.Mesh(new THREE.BoxGeometry(slabW - 0.1, 0.12, 1.5), limestoneMat);
        drainSlab.position.set(-15 + sl * 2.25, 0.48, -9.8);
        drainSlab.castShadow = true;
        drainSlab.receiveShadow = true;
        scene.add(drainSlab);
      }
    }

    // Harappan Domestic Soakage Sump Pit with terracotta ring pottery
    const soakPit = new THREE.Mesh(new THREE.CylinderGeometry(1.35, 1.25, 1.8, 16), limestoneMat);
    soakPit.position.set(24, 0.8, -19.5);
    soakPit.castShadow = true;
    soakPit.receiveShadow = true;
    scene.add(soakPit);

    const soakLid = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 0.18, 16), limestoneMat);
    soakLid.position.set(24, 1.75, -19.5);
    soakLid.castShadow = true;
    scene.add(soakLid);

    // Terracotta drainage discharge pipe running from domestic quarter into soak pit
    const drainPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 4.2, 12), potteryMat);
    drainPipe.rotation.x = Math.PI / 2;
    drainPipe.position.set(24, 0.6, -17);
    drainPipe.castShadow = true;
    scene.add(drainPipe);

    // E. Ancient Harappan Megalithic Tombs & Funerary Complex (Western Sacred Terrace)
    // ----------------------------------------------------------------------------------
    // Tomb 1: The Great Spoked-Wheel Cairn Circle (Dholavira's unique funerary architecture)
    const cairnCenter = new THREE.Vector3(-58, 0, -6);
    const cairnRadius = 6.8;

    // Outer circular dressed limestone retaining wall (16 stone segments forming the circle)
    for (let a = 0; a < 20; a++) {
      const angle = (a / 20) * Math.PI * 2;
      const wx = cairnCenter.x + Math.cos(angle) * cairnRadius;
      const wz = cairnCenter.z + Math.sin(angle) * cairnRadius;
      const wallSeg = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.35, 0.75), sandstoneMat);
      wallSeg.position.set(wx, 0.67, wz);
      wallSeg.rotation.y = -angle;
      wallSeg.castShadow = true;
      wallSeg.receiveShadow = true;
      scene.add(wallSeg);
    }

    // Central Stone Cist Burial Chamber
    const cistChamber = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.4, 2.4), bedrockMat);
    cistChamber.position.set(cairnCenter.x, 0.7, cairnCenter.z);
    cistChamber.castShadow = true;
    cistChamber.receiveShadow = true;
    scene.add(cistChamber);

    // Heavy Limestone Capstone Cover Slabs
    const capstone1 = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.28, 2.7), limestoneMat);
    capstone1.position.set(cairnCenter.x - 0.9, 1.48, cairnCenter.z);
    capstone1.castShadow = true;
    scene.add(capstone1);

    const capstone2 = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.28, 2.7), limestoneMat);
    capstone2.position.set(cairnCenter.x + 0.9, 1.48, cairnCenter.z);
    capstone2.castShadow = true;
    scene.add(capstone2);

    // 8 Radial Stone Spokes connecting Central Chamber to Outer Wall (The Harappan Spoked-Wheel Motif)
    for (let s = 0; s < 8; s++) {
      const sAngle = (s / 8) * Math.PI * 2;
      const spokeLength = cairnRadius - 1.8;
      const sx = cairnCenter.x + Math.cos(sAngle) * (1.8 + spokeLength / 2);
      const sz = cairnCenter.z + Math.sin(sAngle) * (1.8 + spokeLength / 2);
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(spokeLength, 0.95, 0.6), sandstoneMat);
      spoke.position.set(sx, 0.48, sz);
      spoke.rotation.y = -sAngle;
      spoke.castShadow = true;
      spoke.receiveShadow = true;
      scene.add(spoke);
    }

    // Upright Memorial Stele Stone (Menhir) at East entrance of Cairn
    const tombStele = new THREE.Mesh(new THREE.BoxGeometry(0.55, 2.6, 0.35), limestoneMat);
    tombStele.position.set(cairnCenter.x + cairnRadius + 1.2, 1.3, cairnCenter.z);
    tombStele.rotation.z = -0.06;
    tombStele.castShadow = true;
    scene.add(tombStele);

    // Terracotta Funerary Offering Urns and Perforated Jars placed around the burial cist
    for (let u = 0; u < 5; u++) {
      const uAngle = (u / 5) * Math.PI * 2;
      const ux = cairnCenter.x + Math.cos(uAngle) * 2.8;
      const uz = cairnCenter.z + Math.sin(uAngle) * 2.8;
      const urn = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.32, 0.55, 12), potteryMat);
      urn.position.set(ux, 0.28, uz);
      urn.castShadow = true;
      scene.add(urn);
    }

    // Tomb 2: Stepped Hemispherical Tumulus Mound
    const tumulusCenter = new THREE.Vector3(-55, 0, 15);
    for (let tier = 0; tier < 3; tier++) {
      const tRadius = 4.8 - tier * 1.3;
      const tHeight = 0.75;
      const tMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(tRadius * 0.88, tRadius, tHeight, 18),
        sandstoneMat
      );
      tMesh.position.set(tumulusCenter.x, tier * tHeight + tHeight / 2, tumulusCenter.z);
      tMesh.castShadow = true;
      tMesh.receiveShadow = true;
      scene.add(tMesh);
    }

    // Monolithic Memorial Column atop the tumulus
    const tumulusPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.42, 1.6, 12), limestoneMat);
    tumulusPillar.position.set(tumulusCenter.x, 2.25 + 0.8, tumulusCenter.z);
    tumulusPillar.castShadow = true;
    scene.add(tumulusPillar);

    // Tomb 3 & 4: Rectangular Megalithic Cist Burials
    const cistLocations = [
      { x: -66, z: -18 },
      { x: -67, z: 5 },
    ];
    cistLocations.forEach(cloc => {
      // Upright sandstone slab walls
      const cistBox = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.95, 1.6), sandstoneMat);
      cistBox.position.set(cloc.x, 0.48, cloc.z);
      cistBox.castShadow = true;
      cistBox.receiveShadow = true;
      scene.add(cistBox);

      // Angled propped capstone
      const cistLid = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.22, 1.8), limestoneMat);
      cistLid.position.set(cloc.x, 1.05, cloc.z);
      cistLid.rotation.z = 0.12;
      cistLid.castShadow = true;
      scene.add(cistLid);
    });

    // F. Ceremonial Plaza Monumental Stone Water Fountain & Cascading Basin
    // -------------------------------------------------------------------------
    // An active carved stone aeration fountain located at the Civic Plaza intersection (-2, 0, -18)
    const fountainCenter = new THREE.Vector3(-2, 0, -18);

    // Tier 1: Elevated Dressed Stone Foundation Plinth
    const fountainPlinth = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.55, 7.2), sandstoneMat);
    fountainPlinth.position.set(fountainCenter.x, 0.28, fountainCenter.z);
    fountainPlinth.receiveShadow = true;
    scene.add(fountainPlinth);

    // Tier 2: Stepped Stone Basin Coping & Kerb Walls
    const basinWallNorth = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.45, 0.65), limestoneMat);
    basinWallNorth.position.set(fountainCenter.x, 0.72, fountainCenter.z - 3.25);
    basinWallNorth.castShadow = true;
    scene.add(basinWallNorth);

    const basinWallSouth = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.45, 0.65), limestoneMat);
    basinWallSouth.position.set(fountainCenter.x, 0.72, fountainCenter.z + 3.25);
    basinWallSouth.castShadow = true;
    scene.add(basinWallSouth);

    const basinWallWest = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 5.9), limestoneMat);
    basinWallWest.position.set(fountainCenter.x - 3.25, 0.72, fountainCenter.z);
    basinWallWest.castShadow = true;
    scene.add(basinWallWest);

    const basinWallEast = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 5.9), limestoneMat);
    basinWallEast.position.set(fountainCenter.x + 3.25, 0.72, fountainCenter.z);
    basinWallEast.castShadow = true;
    scene.add(basinWallEast);

    // Reflective Clear Water Pool inside Fountain Basin
    const fountainWaterGeo = new THREE.PlaneGeometry(5.8, 5.8, 8, 8);
    fountainWaterGeo.rotateX(-Math.PI / 2);
    const fountainWaterMat = new THREE.MeshStandardMaterial({
      color: 0x3ab8b8,
      roughness: 0.08,
      metalness: 0.85,
      transparent: true,
      opacity: 0.88,
    });
    const fountainWater = new THREE.Mesh(fountainWaterGeo, fountainWaterMat);
    fountainWater.position.set(fountainCenter.x, 0.68, fountainCenter.z);
    fountainWater.receiveShadow = true;
    scene.add(fountainWater);

    // Central Monumental Carved Limestone Fountain Pillar with 4 Directional Water Spouts
    const fountainPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.72, 2.6, 12), limestoneMat);
    fountainPillar.position.set(fountainCenter.x, 1.85, fountainCenter.z);
    fountainPillar.castShadow = true;
    scene.add(fountainPillar);

    const fountainCap = new THREE.Mesh(new THREE.CylinderGeometry(0.85, 0.55, 0.45, 12), limestoneMat);
    fountainCap.position.set(fountainCenter.x, 3.25, fountainCenter.z);
    fountainCap.castShadow = true;
    scene.add(fountainCap);

    // 4 Directional Carved Stone Fountain Spouts & Gushing Water Cascades
    const spoutOffsets = [
      { dx: 0, dz: -0.7, rx: -0.45, rz: 0 },
      { dx: 0, dz: 0.7, rx: 0.45, rz: 0 },
      { dx: -0.7, dz: 0, rx: 0, rz: 0.45 },
      { dx: 0.7, dz: 0, rx: 0, rz: -0.45 },
    ];
    spoutOffsets.forEach(sp => {
      // Stone spout nozzle
      const spoutNozzle = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.45), limestoneMat);
      spoutNozzle.position.set(fountainCenter.x + sp.dx, 2.4, fountainCenter.z + sp.dz);
      spoutNozzle.castShadow = true;
      scene.add(spoutNozzle);

      // Cascading crystalline water stream pouring down into pool
      const waterStreamMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.065, 0.14, 1.7, 8),
        new THREE.MeshBasicMaterial({ color: 0x9de8e8, transparent: true, opacity: 0.72 })
      );
      waterStreamMesh.position.set(
        fountainCenter.x + sp.dx * 1.5,
        1.55,
        fountainCenter.z + sp.dz * 1.5
      );
      waterStreamMesh.rotation.x = sp.rx;
      waterStreamMesh.rotation.z = sp.rz;
      scene.add(waterStreamMesh);
    });

    // 9. THE HYDRAULIC SYSTEM (CORE ARCHAEOLOGICAL RECONSTRUCTION)
    // ------------------------------------------------------------------
    // A. Manhar Seasonal Stream Check-Dam / Bund at (0, 0, -68)
    const bundGeo = new THREE.BoxGeometry(38, 5.0, 8.4);
    const bundMesh = new THREE.Mesh(bundGeo, sandstoneMat);
    bundMesh.position.set(0, 1.4, -68);
    bundMesh.castShadow = true;
    bundMesh.receiveShadow = true;
    scene.add(bundMesh);

    // Stone weir spillway crest with dressed limestone coping
    const crestMesh = new THREE.Mesh(new THREE.BoxGeometry(20, 1.0, 8.8), limestoneMat);
    crestMesh.position.set(0, 4.0, -68);
    crestMesh.castShadow = true;
    crestMesh.receiveShadow = true;
    scene.add(crestMesh);

    // Upstream Pooled Seasonal Stream Water (Dark reflective pool gathered behind the bund)
    const upstreamWaterGeo = new THREE.PlaneGeometry(36, 18, 16, 16);
    upstreamWaterGeo.rotateX(-Math.PI / 2);
    const upstreamWaterMesh = new THREE.Mesh(upstreamWaterGeo, darkWaterMat);
    upstreamWaterMesh.position.set(0, 1.35, -79);
    scene.add(upstreamWaterMesh);

    // Stream intake sluice directing water into the stone aqueduct
    const intakeChute = new THREE.Mesh(new THREE.BoxGeometry(4.2, 1.2, 4.8), wetStoneMat);
    intakeChute.position.set(0, 1.8, -62);
    intakeChute.castShadow = true;
    intakeChute.receiveShadow = true;
    scene.add(intakeChute);

    // Downstream Rip-rap Boulder Apron (energy dissipator)
    for (let rb = 0; rb < 14; rb++) {
      const boulder = new THREE.Mesh(boulderGeo, sandstoneMat);
      boulder.position.set(-15 + rb * 2.4, 0.3, -63.5 + (rb % 2) * 1.5);
      boulder.scale.set(1.4, 0.9, 1.4);
      boulder.rotation.y = rb * 0.7;
      boulder.castShadow = true;
      scene.add(boulder);
    }

    // B. Sediment Desilting Basin at (16, 0, -48)
    const siltChamberOuter = new THREE.Mesh(new THREE.BoxGeometry(15, 2.7, 11), sandstoneMat);
    siltChamberOuter.position.set(16, 0.9, -48);
    siltChamberOuter.castShadow = true;
    siltChamberOuter.receiveShadow = true;
    scene.add(siltChamberOuter);

    // Interior rock-cut chamber with dark stratified stone
    const siltBasinPit = new THREE.Mesh(new THREE.BoxGeometry(12, 2.5, 8), darkReservoirWallMat);
    siltBasinPit.position.set(16, 1.25, -48);
    siltBasinPit.receiveShadow = true;
    scene.add(siltBasinPit);

    // Wet stone lining around silt pit waterline
    const siltWetTrim = new THREE.Mesh(new THREE.BoxGeometry(12.2, 0.45, 8.2), wetStoneMat);
    siltWetTrim.position.set(16, 1.45, -48);
    scene.add(siltWetTrim);

    // Tranquil reflective settling pool surface
    const siltWaterGeo = new THREE.PlaneGeometry(11.6, 7.6);
    siltWaterGeo.rotateX(-Math.PI / 2);
    const siltWaterMesh = new THREE.Mesh(siltWaterGeo, darkWaterMat);
    siltWaterMesh.position.set(16, 1.32, -48);
    scene.add(siltWaterMesh);

    // Stone sediment baffle plates with wet waterline marks
    const baffle1 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.0, 5.5), wetStoneMat);
    baffle1.position.set(13.8, 1.1, -48);
    baffle1.castShadow = true;
    scene.add(baffle1);

    const baffle2 = new THREE.Mesh(new THREE.BoxGeometry(0.85, 2.0, 5.5), wetStoneMat);
    baffle2.position.set(18.2, 1.1, -48);
    baffle2.castShadow = true;
    scene.add(baffle2);

    // C. Cut-Stone Feeder Channels (Aqueducts)
    const createChannelSection = (from: THREE.Vector3, to: THREE.Vector3) => {
      const length = from.distanceTo(to);
      const angle = Math.atan2(to.x - from.x, to.z - from.z);
      const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);

      // Glistening wet stone channel bed
      const channelBase = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.65, length), wetStoneMat);
      channelBase.position.set(mid.x, 0.22, mid.z);
      channelBase.rotation.y = angle;
      channelBase.receiveShadow = true;
      scene.add(channelBase);

      // Flanking cut-stone masonry curbs
      const curbLeft = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.9, length), limestoneMat);
      curbLeft.position.set(mid.x - Math.cos(angle) * 1.18, 0.5, mid.z + Math.sin(angle) * 1.18);
      curbLeft.rotation.y = angle;
      curbLeft.castShadow = true;
      scene.add(curbLeft);

      const curbRight = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.9, length), limestoneMat);
      curbRight.position.set(mid.x + Math.cos(angle) * 1.18, 0.5, mid.z - Math.sin(angle) * 1.18);
      curbRight.rotation.y = angle;
      curbRight.castShadow = true;
      scene.add(curbRight);

      // Flowing water stream inside channel with dark aquatic reflection & flow animation
      const waterStreamMat = new THREE.MeshStandardMaterial({
        color: 0x031c26,
        emissive: 0x052e3c,
        emissiveIntensity: 0.55,
        roughness: 0.04,
        metalness: 0.78,
        normalMap: waterRippleTex,
        transparent: true,
        opacity: 0.0,
      });
      const waterStream = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.12, length), waterStreamMat);
      waterStream.position.set(mid.x, 0.40, mid.z);
      waterStream.rotation.y = angle;
      scene.add(waterStream);
      waterChannelMeshesRef.current.push(waterStream);
    };

    createChannelSection(new THREE.Vector3(0, 0, -65), new THREE.Vector3(14, 0, -52));
    createChannelSection(new THREE.Vector3(18, 0, -44), new THREE.Vector3(32, 0, -24));
    createChannelSection(new THREE.Vector3(32, 0, -24), new THREE.Vector3(48, 0, -4));

    // Monumental Carved Stone Inflow Spout pouring into the Great Eastern Reservoir
    const inletSpout = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.9, 3.2), limestoneMat);
    inletSpout.position.set(48, 0.2, -4);
    inletSpout.castShadow = true;
    inletSpout.receiveShadow = true;
    scene.add(inletSpout);

    // Inflow wet rock cascade steps leading into the reservoir
    for (let cs = 0; cs < 4; cs++) {
      const cascadeRock = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.45, 1.2), wetStoneMat);
      cascadeRock.position.set(48, -0.2 - cs * 0.45, -2.6 + cs * 1.1);
      cascadeRock.castShadow = true;
      cascadeRock.receiveShadow = true;
      scene.add(cascadeRock);
    }

    // D. The Great Eastern Rock-Cut Reservoir at (48, 0, 8)
    // Monumental 7-meter deep hydraulic masterpiece carved directly into sandstone bedrock
    const resOuterW = 48;
    const resOuterD = 24;

    // Deep rock-cut ashlar walls with dark stratified stone and shadow overhangs
    addRealisticWall(resOuterW + 4, 4.8, 2.4, 48, -2.4, 8 - resOuterD / 2 - 1.2);
    addRealisticWall(resOuterW + 4, 4.8, 2.4, 48, -2.4, 8 + resOuterD / 2 + 1.2);
    addRealisticWall(2.4, 4.8, resOuterD + 4, 48 - resOuterW / 2 - 1.2, -2.4, 8);
    addRealisticWall(2.4, 4.8, resOuterD + 4, 48 + resOuterW / 2 + 1.2, -2.4, 8);

    // Deep dark bedrock floor with settled alluvial silt
    const basinFloor = new THREE.Mesh(new THREE.BoxGeometry(resOuterW, 0.6, resOuterD), darkBasinMat);
    basinFloor.position.set(48, -4.5, 8);
    basinFloor.receiveShadow = true;
    scene.add(basinFloor);

    // Tiered Bedrock Terraces: lower tiers submerged/drenched, upper tiers weathered sandstone
    for (let t = 1; t <= 5; t++) {
      const tierW = resOuterW - t * 3.2;
      const tierD = resOuterD - t * 3.2;
      const tierH = 0.85;
      const tierY = -4.3 + t * tierH;

      // Submerged & waterline tiers use dark rock-cut and wet stone materials
      const tierMaterial = t <= 2 ? darkReservoirWallMat : bedrockMat;
      const terrace = new THREE.Mesh(
        new THREE.BoxGeometry(tierW, 0.42, tierD),
        tierMaterial
      );
      terrace.position.set(48, tierY, 8);
      terrace.receiveShadow = true;
      scene.add(terrace);

      // Wet stone waterline trim on lower inundated terraces
      if (t === 2 || t === 3) {
        const wetTierBorder = new THREE.Mesh(
          new THREE.BoxGeometry(tierW + 0.15, 0.15, tierD + 0.15),
          wetStoneMat
        );
        wetTierBorder.position.set(48, tierY + 0.22, 8);
        scene.add(wetTierBorder);
      }
    }

    // Wet stone splash zone bands encircling reservoir perimeter at historical waterlines
    const addWetPerimeterBand = (yLevel: number, height: number) => {
      const wetBandNorth = new THREE.Mesh(new THREE.BoxGeometry(resOuterW - 0.4, height, 0.22), wetStoneMat);
      wetBandNorth.position.set(48, yLevel, 8 - resOuterD / 2 + 0.11);
      scene.add(wetBandNorth);

      const wetBandSouth = new THREE.Mesh(new THREE.BoxGeometry(resOuterW - 0.4, height, 0.22), wetStoneMat);
      wetBandSouth.position.set(48, yLevel, 8 + resOuterD / 2 - 0.11);
      scene.add(wetBandSouth);

      const wetBandWest = new THREE.Mesh(new THREE.BoxGeometry(0.22, height, resOuterD - 0.4), wetStoneMat);
      wetBandWest.position.set(48 - resOuterW / 2 + 0.11, yLevel, 8);
      scene.add(wetBandWest);

      const wetBandEast = new THREE.Mesh(new THREE.BoxGeometry(0.22, height, resOuterD - 0.4), wetStoneMat);
      wetBandEast.position.set(48 + resOuterW / 2 - 0.11, yLevel, 8);
      scene.add(wetBandEast);
    };

    addWetPerimeterBand(-2.1, 0.85); // Current low waterline band
    addWetPerimeterBand(-1.1, 0.55); // Monsoon high waterline tide mark

    // Monumental Carved Bedrock Steps (Harappan Ghats)
    // Western Ghats: 12 monumental stepped ashlar landings leading into the depths
    for (let st = 0; st < 12; st++) {
      // Lower submerged steps are glistening wet stone with salt tide marks
      const stepMat = st < 5 ? wetStoneMat : limestoneMat;
      const stepMesh = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.42, 1.45), stepMat);
      stepMesh.position.set(48 - resOuterW / 2 + 3.0 + st * 0.85, -4.1 + st * 0.38, 8);
      stepMesh.castShadow = true;
      stepMesh.receiveShadow = true;
      scene.add(stepMesh);
    }

    // Southern Ghats: 8 rock-cut steps
    for (let st = 0; st < 8; st++) {
      const stepMat = st < 4 ? wetStoneMat : limestoneMat;
      const stepSouth = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.42, 4.4), stepMat);
      stepSouth.position.set(58, -3.8 + st * 0.42, 8 + resOuterD / 2 - 2.8 - st * 0.85);
      stepSouth.castShadow = true;
      stepSouth.receiveShadow = true;
      scene.add(stepSouth);
    }

    // Ancient Dholavira Nilometer Gauge Marker (Graduated water measuring pillar on western ghat)
    const gaugePillar = new THREE.Mesh(new THREE.BoxGeometry(0.65, 4.2, 0.65), limestoneMat);
    gaugePillar.position.set(33.5, -1.8, 4.8);
    gaugePillar.castShadow = true;
    scene.add(gaugePillar);

    // Carved measurement notches on gauge pillar
    for (let n = 0; n < 8; n++) {
      const notch = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.08, 0.72), wetStoneMat);
      notch.position.set(33.5, -3.4 + n * 0.48, 4.8);
      scene.add(notch);
    }

    // Scaffolding & Newly Dressed Limestone Blocks on eastern terrace
    for (let scx = 0; scx < 3; scx++) {
      for (let scz = 0; scz < 2; scz++) {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 5.5, 8), woodMat);
        pole.position.set(58 + scx * 2.8, 1.0, -2 + scz * 2.8);
        pole.castShadow = true;
        scene.add(pole);
      }
    }
    const plank1 = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.14, 0.9), woodMat);
    plank1.position.set(60.8, 2.0, -0.6);
    plank1.castShadow = true;
    scene.add(plank1);

    const plank2 = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.14, 0.9), woodMat);
    plank2.position.set(60.8, 3.4, -0.6);
    plank2.castShadow = true;
    scene.add(plank2);

    for (let b = 0; b < 8; b++) {
      const block = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.85, 1.1), limestoneMat);
      block.position.set(60 + (b % 4) * 2.0, 0.45 + Math.floor(b / 4) * 0.9, 3.5);
      block.castShadow = true;
      scene.add(block);
    }

    // E. Regulating Sluice & Stepwell Access at (68, 0, 14)
    const sluicePillar1 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 4.8, 12), limestoneMat);
    sluicePillar1.position.set(67, 1.3, 14);
    sluicePillar1.castShadow = true;
    scene.add(sluicePillar1);

    const sluicePillar2 = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 4.8, 12), limestoneMat);
    sluicePillar2.position.set(70.2, 1.3, 14);
    sluicePillar2.castShadow = true;
    scene.add(sluicePillar2);

    // Weathered timber sluice gate with bronze reinforcing bands
    const sluiceGate = new THREE.Mesh(new THREE.BoxGeometry(2.4, 2.6, 0.32), woodMat);
    sluiceGate.position.set(68.6, 1.1, 14);
    sluiceGate.castShadow = true;
    scene.add(sluiceGate);

    const bronzeBand1 = new THREE.Mesh(new THREE.BoxGeometry(2.45, 0.12, 0.36), limestoneMat);
    bronzeBand1.position.set(68.6, 1.6, 14);
    scene.add(bronzeBand1);

    const winchRoller = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 3.0, 8), woodMat);
    winchRoller.rotation.z = Math.PI / 2;
    winchRoller.position.set(68.6, 3.6, 14);
    winchRoller.castShadow = true;
    scene.add(winchRoller);

    // F. Secondary Cascading Spillway Drain at (54, 0, 36)
    for (let c = 0; c < 5; c++) {
      const cascadeStepMat = c <= 2 ? wetStoneMat : sandstoneMat;
      const cascadeStep = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.55, 2.2), cascadeStepMat);
      cascadeStep.position.set(54, -0.32 * c, 32 + c * 2.2);
      cascadeStep.castShadow = true;
      cascadeStep.receiveShadow = true;
      scene.add(cascadeStep);
    }

    // G. Animated Water Surface Inside Reservoir (Dark Reflective Water with 48x48 Vertex Grid)
    const waterGeo = new THREE.PlaneGeometry(resOuterW - 2.5, resOuterD - 2.5, 48, 48);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMesh = new THREE.Mesh(waterGeo, darkWaterMat);
    waterMesh.position.set(48, -2.5, 8); // Base water level
    scene.add(waterMesh);
    waterMeshRef.current = waterMesh;
    waterGeomRef.current = waterGeo;

    // Atmospheric Reservoir Mist Layer hovering right above water (Primary Volumetric Mist)
    const mistGeo1 = new THREE.PlaneGeometry(resOuterW - 2.5, resOuterD - 2.5, 16, 16);
    mistGeo1.rotateX(-Math.PI / 2);
    const mistMat1 = new THREE.MeshBasicMaterial({
      map: reservoirMistTex,
      transparent: true,
      opacity: 0.34,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mistMesh1 = new THREE.Mesh(mistGeo1, mistMat1);
    mistMesh1.position.set(48, -2.05, 8);
    scene.add(mistMesh1);
    waterMistMeshRef.current = mistMesh1;

    // Secondary Drifting Vapor Layer (adds multidimensional atmospheric depth)
    const mistGeo2 = new THREE.PlaneGeometry(resOuterW - 4.0, resOuterD - 4.0, 12, 12);
    mistGeo2.rotateX(-Math.PI / 2);
    const mistMat2 = new THREE.MeshBasicMaterial({
      map: hazeTex,
      transparent: true,
      opacity: 0.22,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const mistMesh2 = new THREE.Mesh(mistGeo2, mistMat2);
    mistMesh2.position.set(48, -1.75, 8);
    mistMesh2.rotation.y = 0.15;
    scene.add(mistMesh2);
    waterMistSecondaryRef.current = mistMesh2;

    // 10. Ancient Stone Braziers with Flickering Orange-Gold Firelight
    const braziersList: { light: THREE.PointLight; flame: THREE.Mesh; baseIntensity: number; phase: number }[] = [];

    const addAncientBrazier = (x: number, y: number, z: number, color = 0xff8e26, intensity = 2.4, distance = 24) => {
      const brazierGroup = new THREE.Group();

      const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.42, 0.85), limestoneMat);
      plinth.position.y = 0.21;
      plinth.castShadow = true;
      brazierGroup.add(plinth);

      const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.42, 0.65, 12), sandstoneMat);
      bowl.position.y = 0.72;
      bowl.castShadow = true;
      brazierGroup.add(bowl);

      const charcoal = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.5, 0.15, 12),
        new THREE.MeshStandardMaterial({
          color: 0x1f0a04,
          emissive: 0x992404,
          emissiveIntensity: 0.9,
          roughness: 0.92,
        })
      );
      charcoal.position.y = 1.02;
      brazierGroup.add(charcoal);

      const flameGeo = new THREE.PlaneGeometry(0.65, 1.15);
      const flameMat = new THREE.MeshBasicMaterial({
        map: brazierFlameTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const flame = new THREE.Mesh(flameGeo, flameMat);
      flame.position.y = 1.55;
      brazierGroup.add(flame);

      const flameCross = new THREE.Mesh(flameGeo, flameMat);
      flameCross.position.y = 1.55;
      flameCross.rotation.y = Math.PI / 2;
      brazierGroup.add(flameCross);

      brazierGroup.position.set(x, y, z);
      scene.add(brazierGroup);

      braziersList.push({
        light: null as any,
        flame,
        baseIntensity: intensity,
        phase: Math.random() * Math.PI * 2,
      });
    };

    // Braziers flanking Monumental North Gateway
    addAncientBrazier(-20.5, 4.2, -7.5, 0xff8e26, 2.6, 26);
    addAncientBrazier(-9.5, 4.2, -7.5, 0xff8e26, 2.6, 26);

    // Braziers flanking Monumental Steps of the Great Eastern Reservoir
    addAncientBrazier(35, 0.6, 5.5, 0xff9026, 2.8, 25);
    addAncientBrazier(35, 0.6, 10.5, 0xff9026, 2.8, 25);

    // Braziers stationed along the Reservoir Parapets
    addAncientBrazier(25.5, 0.6, -3.5, 0xff8c24, 2.5, 24);
    addAncientBrazier(25.5, 0.6, 19.5, 0xff8c24, 2.5, 24);
    addAncientBrazier(70.5, 0.6, 19.5, 0xff8c24, 2.5, 24);
    addAncientBrazier(70.5, 0.6, -3.5, 0xff8c24, 2.5, 24);

    // Brazier on Manhar Check-Dam crest
    addAncientBrazier(0, 4.4, -68, 0xff942c, 2.5, 26);

    // Brazier at Desilting Basin Observation Post
    addAncientBrazier(16, 2.8, -42, 0xff8a22, 2.2, 20);

    // Brazier at Sluice Gate Control Station
    addAncientBrazier(68.6, 2.8, 14.8, 0xff8820, 2.4, 22);

    // Brazier at Craft Workshop Quarter
    addAncientBrazier(42, 1.2, -22, 0xff8e24, 2.0, 22);

    braziersRef.current = braziersList;

    // 11. Authentic Harappan Archaeological Props & Excavation Features
    // A. Terracotta Storage Pithoi & Painted Pottery Jars
    const createPithos = (x: number, y: number, z: number, scale = 1) => {
      const potGroup = new THREE.Group();

      const body = new THREE.Mesh(new THREE.SphereGeometry(0.55 * scale, 16, 16), potteryMat);
      body.scale.set(1, 1.35, 1);
      body.position.y = 0.65 * scale;
      body.castShadow = true;
      potGroup.add(body);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.38 * scale, 0.28 * scale, 0.22 * scale, 16), potteryMat);
      rim.position.y = 1.35 * scale;
      rim.castShadow = true;
      potGroup.add(rim);

      const ringStand = new THREE.Mesh(new THREE.CylinderGeometry(0.42 * scale, 0.46 * scale, 0.16 * scale, 12), limestoneMat);
      ringStand.position.y = 0.08 * scale;
      ringStand.castShadow = true;
      potGroup.add(ringStand);

      potGroup.position.set(x, y, z);
      scene.add(potGroup);
    };

    createPithos(27, 0, -12, 1.1);
    createPithos(28.5, 0, -11.5, 0.85);
    createPithos(27.8, 0, -13, 0.7);
    createPithos(-12, 3.6, -5.8, 0.95);
    createPithos(-18, 3.6, -5.8, 0.9);
    createPithos(55, 0, -2, 1.2);

    // Perforated Cylindrical Vessels & Dish-on-Stand
    const createPerforatedJar = (x: number, y: number, z: number) => {
      const jar = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.22, 0.85, 14), potteryMat);
      jar.position.set(x, y + 0.42, z);
      jar.castShadow = true;
      scene.add(jar);
    };
    createPerforatedJar(29.2, 0, -11);
    createPerforatedJar(-10.5, 3.6, -5.8);

    const createDishOnStand = (x: number, y: number, z: number) => {
      const group = new THREE.Group();
      const base = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.32, 0.12, 16), potteryMat);
      base.position.y = 0.06;
      group.add(base);
      const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.48, 12), potteryMat);
      stem.position.y = 0.34;
      group.add(stem);
      const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.12, 0.14, 20), potteryMat);
      dish.position.y = 0.62;
      dish.castShadow = true;
      group.add(dish);
      group.position.set(x, y, z);
      scene.add(group);
    };
    createDishOnStand(26.2, 0, -12.5);
    createDishOnStand(-13.5, 3.6, -5.8);

    // B. Scientific Archaeological Excavation Trench with Stratigraphy balks
    const trenchMat = new THREE.MeshStandardMaterial({
      map: stratigraphyTex,
      roughness: 0.92,
      metalness: 0.02,
    });
    const trenchBalk = new THREE.Mesh(new THREE.BoxGeometry(6.5, 2.2, 4.5), trenchMat);
    trenchBalk.position.set(38, -0.9, -38);
    trenchBalk.receiveShadow = true;
    scene.add(trenchBalk);

    // Excavation Finds Sorting Table with Authentic Indus Artifacts
    const tableTop = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.08, 1.2), woodMat);
    tableTop.position.set(32, 0.85, -35);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    scene.add(tableTop);

    for (let leg = 0; leg < 4; leg++) {
      const lx = leg % 2 === 0 ? -1.05 : 1.05;
      const lz = leg < 2 ? -0.48 : 0.48;
      const tLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.85, 6), woodMat);
      tLeg.position.set(32 + lx, 0.42, -35 + lz);
      tLeg.castShadow = true;
      scene.add(tLeg);
    }

    // Authentic Carnelian Beads on Tray
    const carnelianMat = new THREE.MeshStandardMaterial({ color: 0xbf360c, roughness: 0.22, metalness: 0.35 });
    for (let cb = 0; cb < 7; cb++) {
      const bead = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.12, 8), carnelianMat);
      bead.rotation.x = Math.PI / 2;
      bead.position.set(31.6 + cb * 0.08, 0.92, -35.2 + (cb % 2) * 0.06);
      bead.castShadow = true;
      scene.add(bead);
    }

    // Indus Chert Cubical Weights (Binary ratio standard 1, 2, 4, 8...)
    const chertMat = new THREE.MeshStandardMaterial({ color: 0x8a7f72, roughness: 0.45, metalness: 0.08 });
    const weight1 = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), chertMat);
    weight1.position.set(32.4, 0.95, -35.2);
    weight1.castShadow = true;
    scene.add(weight1);

    const weight2 = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.08), chertMat);
    weight2.position.set(32.6, 0.93, -35.2);
    weight2.castShadow = true;
    scene.add(weight2);

    // Steatite Unicorn Seal Tablet Replica (Harappan glyptic hallmark)
    const sealMat = new THREE.MeshStandardMaterial({ color: 0xe8e2d5, roughness: 0.38, metalness: 0.12 });
    const sealTablet = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.04, 0.22), sealMat);
    sealTablet.position.set(32.1, 0.91, -34.9);
    sealTablet.castShadow = true;
    scene.add(sealTablet);

    // Field Magnifying Loupe
    const brassRimMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, roughness: 0.3, metalness: 0.75 });
    const loupe = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.015, 8, 16), brassRimMat);
    loupe.rotation.x = Math.PI / 2;
    loupe.position.set(32.1, 0.94, -34.9);
    scene.add(loupe);

    // Red-and-White Banded Surveyor Metric Ranging Rod
    const rodGeo = new THREE.CylinderGeometry(0.04, 0.04, 2.0, 8);
    const rodCanvas = document.createElement('canvas');
    rodCanvas.width = 32;
    rodCanvas.height = 128;
    const rctx = rodCanvas.getContext('2d');
    if (rctx) {
      rctx.fillStyle = '#f5f5f5';
      rctx.fillRect(0, 0, 32, 128);
      rctx.fillStyle = '#dc2626';
      rctx.fillRect(0, 0, 32, 32);
      rctx.fillRect(0, 64, 32, 32);
    }
    const rodMat = new THREE.MeshStandardMaterial({ map: new THREE.CanvasTexture(rodCanvas), roughness: 0.4 });
    const rangingRod = new THREE.Mesh(rodGeo, rodMat);
    rangingRod.position.set(35.5, 0.9, -38);
    rangingRod.rotation.z = -0.08;
    rangingRod.castShadow = true;
    scene.add(rangingRod);

    // Surveyor Tripod Stand
    const tripodMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5, metalness: 0.6 });
    const theodoliteHead = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.25, 8), tripodMat);
    theodoliteHead.position.set(34, 1.4, -36);
    scene.add(theodoliteHead);
    for (let leg = 0; leg < 3; leg++) {
      const ang = (leg * Math.PI * 2) / 3;
      const tripodLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.5, 6), tripodMat);
      tripodLeg.position.set(34 + Math.cos(ang) * 0.35, 0.7, -36 + Math.sin(ang) * 0.35);
      tripodLeg.rotation.x = Math.sin(ang) * 0.25;
      tripodLeg.rotation.z = -Math.cos(ang) * 0.25;
      scene.add(tripodLeg);
    }

    // Wooden Gravel Sieve Screen for Desilting
    const sieveFrame = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.2, 0.08), woodMat);
    sieveFrame.position.set(36.8, 0.6, -39.5);
    sieveFrame.rotation.x = -0.4;
    sieveFrame.castShadow = true;
    scene.add(sieveFrame);

    // 12. Desert Vegetation (Acacia nilotica, Khejri Trees & Desert Shrubs)
    const foliageMat = new THREE.MeshStandardMaterial({ color: 0x384224, roughness: 0.92 });
    const scrubMat = new THREE.MeshStandardMaterial({ color: 0x444d2c, roughness: 0.95 });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x22180e, roughness: 0.95 });

    // Desert scrub bushes banked near rocks and wall corners
    const scrubGeo = new THREE.DodecahedronGeometry(0.55, 1);
    for (let sc = 0; sc < 22; sc++) {
      const scx = (Math.sin(sc * 4.3) * 0.5 + 0.5) * 140 - 70;
      const scz = (Math.cos(sc * 3.7) * 0.5 + 0.5) * 140 - 70;
      if (scx > -30 && scx < 60 && scz > -10 && scz < 25) continue; // Keep reservoir/street clear
      const shrub = new THREE.Mesh(scrubGeo, scrubMat);
      shrub.scale.set(1.2 + Math.sin(sc) * 0.4, 0.7 + Math.cos(sc) * 0.3, 1.2 + Math.sin(sc * 2) * 0.4);
      shrub.position.set(scx, 0.35, scz);
      shrub.castShadow = true;
      scene.add(shrub);
    }

    const addAcaciaTree = (x: number, z: number, scale = 1) => {
      const treeGroup = new THREE.Group();

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.18 * scale, 0.32 * scale, 2.6 * scale, 8), trunkMat);
      trunk.position.y = 1.3 * scale;
      trunk.rotation.z = (Math.sin(x * z) * 0.15);
      trunk.castShadow = true;
      treeGroup.add(trunk);

      const branch1 = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * scale, 0.16 * scale, 1.6 * scale, 6), trunkMat);
      branch1.position.set(0.4 * scale, 2.3 * scale, 0);
      branch1.rotation.z = -0.55;
      branch1.castShadow = true;
      treeGroup.add(branch1);

      const branch2 = new THREE.Mesh(new THREE.CylinderGeometry(0.12 * scale, 0.16 * scale, 1.6 * scale, 6), trunkMat);
      branch2.position.set(-0.4 * scale, 2.2 * scale, 0);
      branch2.rotation.z = 0.55;
      branch2.castShadow = true;
      treeGroup.add(branch2);

      const canopy1 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.5 * scale, 1), foliageMat);
      canopy1.scale.set(1.4, 0.6, 1.4);
      canopy1.position.set(0.6 * scale, 2.8 * scale, 0);
      canopy1.castShadow = true;
      treeGroup.add(canopy1);

      const canopy2 = new THREE.Mesh(new THREE.DodecahedronGeometry(1.6 * scale, 1), foliageMat);
      canopy2.scale.set(1.5, 0.6, 1.5);
      canopy2.position.set(-0.5 * scale, 2.7 * scale, 0.3 * scale);
      canopy2.castShadow = true;
      treeGroup.add(canopy2);

      const canopyTop = new THREE.Mesh(new THREE.DodecahedronGeometry(1.3 * scale, 1), foliageMat);
      canopyTop.scale.set(1.3, 0.5, 1.3);
      canopyTop.position.set(0, 3.3 * scale, 0);
      canopyTop.castShadow = true;
      treeGroup.add(canopyTop);

      treeGroup.position.set(x, 0, z);
      scene.add(treeGroup);
    };

    addAcaciaTree(-25, -60, 1.25);
    addAcaciaTree(25, -74, 1.15);
    addAcaciaTree(72, -48, 1.35);
    addAcaciaTree(82, 22, 1.2);
    addAcaciaTree(-32, 48, 1.3);
    addAcaciaTree(22, 54, 1.0);
    addAcaciaTree(-8, -38, 0.9);
    addAcaciaTree(-50, -20, 1.1);

    // 13. Atmospheric Dust & Wind-blown Sand Particles (Motes Floating in Dusk Light)
    const particleCount = 850;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(particleCount * 3);
    for (let p = 0; p < particleCount * 3; p += 3) {
      dustPositions[p] = (Math.random() - 0.5) * 200;
      dustPositions[p + 1] = Math.random() * 26 + 0.5;
      dustPositions[p + 2] = (Math.random() - 0.5) * 200;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));

    const dustCanvas = document.createElement('canvas');
    dustCanvas.width = 32;
    dustCanvas.height = 32;
    const dctx = dustCanvas.getContext('2d');
    if (dctx) {
      const grad = dctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 205, 130, 1)');
      grad.addColorStop(0.35, 'rgba(220, 150, 75, 0.45)');
      grad.addColorStop(1, 'rgba(150, 90, 40, 0)');
      dctx.fillStyle = grad;
      dctx.fillRect(0, 0, 32, 32);
    }
    const dustParticleTex = new THREE.CanvasTexture(dustCanvas);

    const dustMat = new THREE.PointsMaterial({
      size: 0.85,
      map: dustParticleTex,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustPoints = new THREE.Points(dustGeo, dustMat);
    scene.add(dustPoints);
    dustParticlesRef.current = dustPoints;

    // 14. Authentic Archaeological Clue Discovery Sites & Physical Field Features
    // Replaces cartoon collectibles with authentic archaeological discoveries:
    // - Weathered sandstone datum blocks with dressed limestone capstones and polished brass survey medallions
    // - Archaeological excavation stakes, tied survey cords, and 10cm metric photo scales
    // - Ancient chiseled Harappan inscriptions, mason cut-lines, water-gauge notches, and stone artifacts
    // - Subtle warm golden archaeological marker lighting casting deep, raking shadows
    // - Focused volumetric light beams illuminating carved stone relief
    // - Localized floating golden dust motes swirling in the warm beam
    // - Projected archaeological survey compass rings with cardinal ticks and coordinate calibration
    const inscriptionTex = createArchaeologicalInscriptionTexture();
    const surveyDecalTex = createArchaeologicalSurveyDecalTexture();
    const clueDustTex = createDustParticleTexture();
    const clueBeamTex = createGoldenGlowBeamTexture();

    const inscriptionPlateMat = new THREE.MeshStandardMaterial({
      map: inscriptionTex,
      roughness: 0.76,
      metalness: 0.08,
    });

    const brassDatumMat = new THREE.MeshStandardMaterial({
      color: 0xdfaa55,
      roughness: 0.28,
      metalness: 0.88,
    });

    const photoScaleMat = new THREE.MeshStandardMaterial({
      color: 0xf2ebe1,
      roughness: 0.65,
      metalness: 0.04,
    });

    const photoScaleBlackMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.85,
      metalness: 0.02,
    });

    const ringsList: { ring: THREE.Mesh; id: string }[] = [];
    const visualsList: {
      id: string;
      evidenceId: string;
      ring: THREE.Mesh;
      light: THREE.PointLight;
      dustPoints: THREE.Points;
      beam?: THREE.Mesh;
      baseIntensity: number;
      initialDustPos: Float32Array;
    }[] = [];

    CLUE_LOCATIONS.forEach((clue, clueIdx) => {
      const clueGroup = new THREE.Group();
      clueGroup.position.set(clue.x, clue.y, clue.z);

      // A. Ground Archaeological Survey Compass Ring (Subterranean Projection)
      const surveyRingGeo = new THREE.PlaneGeometry(2.8, 2.8);
      surveyRingGeo.rotateX(-Math.PI / 2);
      const surveyRingMat = new THREE.MeshBasicMaterial({
        map: surveyDecalTex,
        transparent: true,
        opacity: 0.32,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const surveyRingMesh = new THREE.Mesh(surveyRingGeo, surveyRingMat);
      surveyRingMesh.position.set(0, 0.04, 0);
      clueGroup.add(surveyRingMesh);
      ringsList.push({ ring: surveyRingMesh, id: clue.id });

      // B. Archaeological Datum Base Block & Capstone
      const baseBlock = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.32, 0.85), sandstoneMat);
      baseBlock.position.set(0, 0.16, 0);
      baseBlock.castShadow = true;
      baseBlock.receiveShadow = true;
      clueGroup.add(baseBlock);

      const capstone = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.14, 0.68), limestoneMat);
      capstone.position.set(0, 0.39, 0);
      capstone.castShadow = true;
      capstone.receiveShadow = true;
      clueGroup.add(capstone);

      // Polished Brass Survey Datum Medallion
      const brassMedallion = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.025, 24), brassDatumMat);
      brassMedallion.position.set(0, 0.47, 0);
      brassMedallion.castShadow = true;
      clueGroup.add(brassMedallion);

      // C. Excavation Corner Pegs & Tied Field Survey Cord
      const stakeGeo = new THREE.CylinderGeometry(0.018, 0.018, 0.48, 8);
      const stakeOffsets = [
        [-0.58, -0.58],
        [0.58, -0.58],
        [0.58, 0.58],
        [-0.58, 0.58],
      ];

      stakeOffsets.forEach(([sx, sz]) => {
        const stake = new THREE.Mesh(stakeGeo, woodMat);
        stake.position.set(sx, 0.24, sz);
        stake.castShadow = true;
        clueGroup.add(stake);
      });

      // Archaeological Tied Field Cord (Connecting Stakes)
      const cordPoints = [
        new THREE.Vector3(-0.58, 0.38, -0.58),
        new THREE.Vector3(0.58, 0.38, -0.58),
        new THREE.Vector3(0.58, 0.38, 0.58),
        new THREE.Vector3(-0.58, 0.38, 0.58),
        new THREE.Vector3(-0.58, 0.38, -0.58),
      ];
      const cordGeo = new THREE.BufferGeometry().setFromPoints(cordPoints);
      const cordMat = new THREE.LineBasicMaterial({ color: 0xd4a373, transparent: true, opacity: 0.65 });
      const cordLine = new THREE.Line(cordGeo, cordMat);
      clueGroup.add(cordLine);

      // D. 10cm Segmented Archaeological Metric Photo Scale
      const scaleGroup = new THREE.Group();
      scaleGroup.position.set(0.48, 0.04, 0.52);
      scaleGroup.rotation.y = 0.35;
      for (let s = 0; s < 5; s++) {
        const segment = new THREE.Mesh(
          new THREE.BoxGeometry(0.095, 0.04, 0.04),
          s % 2 === 0 ? photoScaleMat : photoScaleBlackMat
        );
        segment.position.set((s - 2) * 0.095, 0.02, 0);
        segment.castShadow = true;
        scaleGroup.add(segment);
      }
      clueGroup.add(scaleGroup);

      // E. Custom Ancient Archaeological Architectural Feature & Markings per Clue
      if (clue.id === 'manhar_bund') {
        // Manhar Stream Bund: Heavy cyclopean retaining wall sample with water-flow relief marks
        const retainingBlock = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.95, 0.42), sandstoneMat);
        retainingBlock.position.set(0, 0.92, 0);
        retainingBlock.castShadow = true;
        retainingBlock.receiveShadow = true;
        clueGroup.add(retainingBlock);

        // Chiseled Harappan Water-Gradient Chevron Stone
        const chevronStone = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.6), inscriptionPlateMat);
        chevronStone.position.set(0, 0.95, 0.22);
        clueGroup.add(chevronStone);

        // Ancient Bronze Intake Survey Pin
        const intakePin = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.32, 12), brassDatumMat);
        intakePin.position.set(0.24, 0.62, 0.26);
        intakePin.rotation.x = 0.2;
        clueGroup.add(intakePin);
      } else if (clue.id === 'silt_chamber') {
        // Silt Chamber: Stratified sediment settling basin block with carved silt-level strata notches
        const siltBlock = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.1, 0.5), sandstoneMat);
        siltBlock.position.set(0, 1.0, 0);
        siltBlock.castShadow = true;
        clueGroup.add(siltBlock);

        // Stratified Sediment Inspection Tray
        const trayFrame = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.12, 0.35), woodMat);
        trayFrame.position.set(0, 0.55, 0.32);
        trayFrame.castShadow = true;
        clueGroup.add(trayFrame);

        // Stratified core sample inside tray
        const coreMat = new THREE.MeshStandardMaterial({ color: 0x8a623a, roughness: 0.95 });
        const core = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.48, 12), coreMat);
        core.rotation.z = Math.PI / 2;
        core.position.set(0, 0.62, 0.32);
        clueGroup.add(core);
      } else if (clue.id === 'eastern_reservoir') {
        // Eastern Reservoir: Monumental rock-cut reservoir stepped terrace block with Nilometer graduation marks
        const steppedBlock = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.25, 0.65), darkReservoirWallMat);
        steppedBlock.position.set(0, 1.05, 0);
        steppedBlock.castShadow = true;
        clueGroup.add(steppedBlock);

        // Carved Harappan Mason Quarry Monogram
        const monogram = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.7), inscriptionPlateMat);
        monogram.position.set(0, 1.1, 0.335);
        clueGroup.add(monogram);

        // Graduated Nilometer water gauge scale notches
        for (let g = 0; g < 7; g++) {
          const notch = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.02, 0.04), brassDatumMat);
          notch.position.set(-0.32, 0.65 + g * 0.14, 0.33);
          clueGroup.add(notch);
        }
      } else if (clue.id === 'stone_ghats') {
        // Monumental Steps & Aqueduct: Chiseled Harappan script plaque set in sandstone
        const steleBlock = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.3, 0.45), sandstoneMat);
        steleBlock.position.set(0, 1.1, 0);
        steleBlock.castShadow = true;
        clueGroup.add(steleBlock);

        // High-Relief Ancient Inscription Plaque
        const insPlate = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.72), inscriptionPlateMat);
        insPlate.position.set(0, 1.15, 0.235);
        clueGroup.add(insPlate);

        // Excavated Harappan copper/bronze stonemason chisel & hammerstone on wooden plank
        const toolPlank = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.05, 0.28), woodMat);
        toolPlank.position.set(0, 0.52, 0.32);
        toolPlank.castShadow = true;
        clueGroup.add(toolPlank);

        const copperChisel = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.24), brassDatumMat);
        copperChisel.position.set(-0.1, 0.57, 0.32);
        copperChisel.rotation.y = 0.25;
        clueGroup.add(copperChisel);

        const hammerStone = new THREE.Mesh(new THREE.DodecahedronGeometry(0.065), bedrockMat);
        hammerStone.position.set(0.12, 0.58, 0.32);
        clueGroup.add(hammerStone);
      } else if (clue.id === 'sluice_gate') {
        // Sluice Gate: Stone-cut vertical slotted piers with petrified timber fragments
        const pierLeft = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.35, 0.45), sandstoneMat);
        pierLeft.position.set(-0.25, 1.15, 0);
        pierLeft.castShadow = true;
        clueGroup.add(pierLeft);

        const pierRight = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.35, 0.45), sandstoneMat);
        pierRight.position.set(0.25, 1.15, 0);
        pierRight.castShadow = true;
        clueGroup.add(pierRight);

        // Vertical Sluice Board Slot & Petrified Harappan Timber Remnants
        const timberBoard = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.85, 0.12), woodMat);
        timberBoard.position.set(0, 0.9, 0);
        timberBoard.castShadow = true;
        clueGroup.add(timberBoard);

        // Bronze sluice gate alignment bolt
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.32, 12), brassDatumMat);
        bolt.rotation.z = Math.PI / 2;
        bolt.position.set(0, 1.25, 0);
        clueGroup.add(bolt);
      } else if (clue.id === 'signboard_inscription') {
        // Monumental Gateway: 10-character Harappan signboard mounted on weathered teakwood lintel
        const lintelBeam = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.58, 0.16), woodMat);
        lintelBeam.position.set(0, 1.2, 0);
        lintelBeam.castShadow = true;
        clueGroup.add(lintelBeam);

        // 10 Crystalline Gypsum Harappan Characters in White/Cream Bas-Relief
        const gypsumMat = new THREE.MeshStandardMaterial({
          color: 0xfcf9ee,
          roughness: 0.38,
          metalness: 0.15,
        });

        const signWidth = 1.6;
        const charSpacing = signWidth / 10;
        for (let c = 0; c < 10; c++) {
          const cx = -signWidth / 2 + c * charSpacing + charSpacing / 2;
          const glyphMesh = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.28, 0.035), gypsumMat);
          glyphMesh.position.set(cx, 1.2, 0.09);
          glyphMesh.castShadow = true;
          clueGroup.add(glyphMesh);

          // Horizontal glyph crossbars for Harappan look
          if (c % 2 === 0) {
            const bar = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.03, 0.04), gypsumMat);
            bar.position.set(cx, 1.28, 0.092);
            clueGroup.add(bar);
          }
        }
      }

      // G. Focused Volumetric Light Beam
      const beamGeo = new THREE.CylinderGeometry(0.12, 1.2, 3.2, 16, 1, true);
      const beamMat = new THREE.MeshBasicMaterial({
        map: clueBeamTex,
        transparent: true,
        opacity: 0.28,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const beamMesh = new THREE.Mesh(beamGeo, beamMat);
      beamMesh.position.set(0, 1.7, 0.1);
      beamMesh.rotation.z = (clueIdx % 2 === 0 ? 0.08 : -0.08);
      beamMesh.rotation.x = -0.06;
      clueGroup.add(beamMesh);

      // H. Localized Floating Golden Dust Particles (Airborne motes caught in the warm beam)
      const dustCount = 38;
      const dustGeo = new THREE.BufferGeometry();
      const dustPositions = new Float32Array(dustCount * 3);
      const initialPositions = new Float32Array(dustCount * 3);

      for (let p = 0; p < dustCount; p++) {
        const radius = Math.random() * 1.3;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const y = 0.2 + Math.random() * 2.4;
        const z = Math.sin(angle) * radius;

        dustPositions[p * 3] = x;
        dustPositions[p * 3 + 1] = y;
        dustPositions[p * 3 + 2] = z;

        initialPositions[p * 3] = x;
        initialPositions[p * 3 + 1] = y;
        initialPositions[p * 3 + 2] = z;
      }

      dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
      const dustMat = new THREE.PointsMaterial({
        map: clueDustTex,
        color: 0xffd99b,
        size: 0.18,
        transparent: true,
        opacity: 0.65,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const clueDustMesh = new THREE.Points(dustGeo, dustMat);
      clueGroup.add(clueDustMesh);

      scene.add(clueGroup);

      visualsList.push({
        id: clue.id,
        evidenceId: clue.evidenceId,
        ring: surveyRingMesh,
        light: null as any,
        dustPoints: clueDustMesh,
        beam: beamMesh,
        baseIntensity: 1.85,
        initialDustPos: initialPositions,
      });
    });

    beaconRingsRef.current = ringsList;
    clueVisualsRef.current = visualsList;

    // Target Movement Ring (kept hidden to ensure no debug/fake circular indicators appear)
    const targetRingGeo = new THREE.RingGeometry(0.7, 0.95, 24);
    targetRingGeo.rotateX(-Math.PI / 2);
    const targetRingMesh = new THREE.Mesh(
      targetRingGeo,
      new THREE.MeshBasicMaterial({ color: 0xffd9a8, transparent: true, opacity: 0.0, side: THREE.DoubleSide, visible: false })
    );
    scene.add(targetRingMesh);
    targetRingRef.current = targetRingMesh;

    // 15. AAA Realistic Humanoid Field Archaeologist Character Model (Faithfully matching reference photograph)
    const charGroup = new THREE.Group();
    charGroup.position.copy(playerPosRef.current);
    charGroup.rotation.y = playerRotRef.current;

    // High-readability weathered expedition PBR materials matching reference image
    const jacketFabricTex = createExplorerFabricTexture('#4a5438'); // Military/safari olive green canvas
    const pantsFabricTex = createExplorerFabricTexture('#272b31'); // Dark charcoal slate cargo trousers
    const backpackFabricTex = createExplorerFabricTexture('#3a422f'); // Heavy olive expedition canvas

    const jacketMat = new THREE.MeshStandardMaterial({ map: jacketFabricTex, color: 0x48523a, roughness: 0.68 });
    const shirtMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e4, roughness: 0.62 }); // Desert linen undershirt
    const pantsMat = new THREE.MeshStandardMaterial({ map: pantsFabricTex, color: 0x24282f, roughness: 0.80 });
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x221810, roughness: 0.60 }); // Dark weathered full-grain leather
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xdfad4b, roughness: 0.25, metalness: 0.85 }); // Vintage antique brass
    const leatherMat = new THREE.MeshStandardMaterial({ color: 0x2c1f14, roughness: 0.65 });
    const bootMat = new THREE.MeshStandardMaterial({ color: 0x1f1712, roughness: 0.70 });
    const bootSoleMat = new THREE.MeshStandardMaterial({ color: 0x0f0b08, roughness: 0.92 });
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xdf9c74, roughness: 0.50 }); // Sun-kissed skin tone
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x16100a, roughness: 0.75 }); // Dark espresso hair
    const ropeMat = new THREE.MeshStandardMaterial({ color: 0xc49d63, roughness: 0.86 }); // Natural twisted climbing rope
    const topMatMat = new THREE.MeshStandardMaterial({ color: 0x586550, roughness: 0.75 }); // Sage green rolled sleeping foam mat
    const bottomRollMat = new THREE.MeshStandardMaterial({ color: 0x8b8069, roughness: 0.78 }); // Khaki canvas rolled bedroll / map scroll
    const steelMat = new THREE.MeshStandardMaterial({ color: 0x9aa2a8, roughness: 0.35, metalness: 0.80 });
    const woodToolMat = new THREE.MeshStandardMaterial({ color: 0x784c26, roughness: 0.72 });
    const paperMat = new THREE.MeshStandardMaterial({ color: 0xfdfbf4, roughness: 0.35 });
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0x1a120c });

    // 1. Pelvis & Heavy Utility Expedition Belt
    const pelvisGroup = new THREE.Group();
    pelvisGroup.position.set(0, 0.82, 0);

    const pelvisMesh = new THREE.Mesh(new THREE.BoxGeometry(0.33, 0.16, 0.22), pantsMat);
    pelvisMesh.castShadow = true;
    pelvisMesh.receiveShadow = true;
    pelvisGroup.add(pelvisMesh);

    // Weathered Dark Leather Utility Belt
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.07, 0.24), beltMat);
    belt.position.y = 0.05;
    belt.castShadow = true;
    pelvisGroup.add(belt);

    // Antique Brass Rectangular Buckle
    const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.035), brassMat);
    buckle.position.set(0, 0.05, 0.125);
    buckle.castShadow = true;
    pelvisGroup.add(buckle);

    // Field Survey Canteen with fabric cross-strap on right hip (as in reference photo)
    const canteenGroup = new THREE.Group();
    canteenGroup.position.set(0.19, 0.03, -0.04);
    const canteenBody = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.14, 12), jacketMat);
    canteenBody.rotation.z = Math.PI / 2;
    canteenBody.castShadow = true;
    canteenGroup.add(canteenBody);

    const canteenCap = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.04, 8), brassMat);
    canteenCap.position.set(0.08, 0, 0);
    canteenCap.rotation.z = Math.PI / 2;
    canteenGroup.add(canteenCap);

    // Cross-strap webbing across canteen body
    const canteenStrap = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 0.09), beltMat);
    canteenGroup.add(canteenStrap);
    pelvisGroup.add(canteenGroup);

    // Large Antique Hanging Brass Pocket Compass (Prominently visible in reference image at left hip!)
    const hangingCompassGroup = new THREE.Group();
    hangingCompassGroup.position.set(-0.19, 0.02, 0.04);

    // Brass mounting ring / lanyard loop
    const compassRing = new THREE.Mesh(new THREE.TorusGeometry(0.028, 0.006, 8, 16), brassMat);
    compassRing.position.set(0, 0.06, 0);
    compassRing.castShadow = true;
    hangingCompassGroup.add(compassRing);

    // Compass round antique casing
    const compassCase = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.062, 0.022, 20), brassMat);
    compassCase.rotation.x = Math.PI / 2;
    compassCase.castShadow = true;
    hangingCompassGroup.add(compassCase);

    // Compass dial face with fine cardinal markers
    const compassFace = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.005, 20), paperMat);
    compassFace.rotation.x = Math.PI / 2;
    compassFace.position.z = 0.012;
    hangingCompassGroup.add(compassFace);

    // Compass needle
    const compassNeedle = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.07, 0.004), eyeMat);
    compassNeedle.position.z = 0.016;
    compassNeedle.rotation.z = 0.42;
    hangingCompassGroup.add(compassNeedle);

    pelvisGroup.add(hangingCompassGroup);

    // Utility Leather Pouch on right rear hip
    const utilityPouch = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.10, 0.06), beltMat);
    utilityPouch.position.set(0.11, 0.02, -0.11);
    utilityPouch.castShadow = true;
    pelvisGroup.add(utilityPouch);

    charGroup.add(pelvisGroup);

    // 2. Torso, Olive Explorer Jacket & Large Expedition Backpack
    const torsoGroup = new THREE.Group();

    // Abdomen with tucked desert linen shirt
    const abdomen = new THREE.Mesh(new THREE.BoxGeometry(0.31, 0.18, 0.20), shirtMat);
    abdomen.position.set(0, 0.98, 0);
    abdomen.castShadow = true;
    abdomen.receiveShadow = true;
    torsoGroup.add(abdomen);

    // Upper Chest & Shoulders
    const chest = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.28, 0.23), shirtMat);
    chest.position.set(0, 1.18, 0);
    chest.castShadow = true;
    chest.receiveShadow = true;
    torsoGroup.add(chest);

    // Olive Expedition Field Jacket Body (As in reference image)
    const jacket = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.36, 0.26), jacketMat);
    jacket.position.set(0, 1.12, 0);
    jacket.castShadow = true;
    jacket.receiveShadow = true;
    torsoGroup.add(jacket);

    // Front Storm Flap with seam
    const stormFlap = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.35, 0.015), jacketMat);
    stormFlap.position.set(0, 1.12, 0.138);
    torsoGroup.add(stormFlap);

    // Popped High Lapel Collar around Neck (Distinctive in reference photo)
    const collar = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.10, 0.29), jacketMat);
    collar.position.set(0, 1.34, 0);
    collar.castShadow = true;
    torsoGroup.add(collar);

    // Shoulder Epaulettes with brass snaps
    const epauletteL = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.02, 0.05), jacketMat);
    epauletteL.position.set(-0.20, 1.30, 0);
    torsoGroup.add(epauletteL);

    const epauletteR = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.02, 0.05), jacketMat);
    epauletteR.position.set(0.20, 1.30, 0);
    torsoGroup.add(epauletteR);

    // Lower Waist Cargo Flap Pockets
    const pocketBL = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.035), jacketMat);
    pocketBL.position.set(-0.12, 1.02, 0.14);
    torsoGroup.add(pocketBL);

    const pocketBR = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.11, 0.035), jacketMat);
    pocketBR.position.set(0.12, 1.02, 0.14);
    torsoGroup.add(pocketBR);

    // Large Expedition Field Backpack (Mounted on Back - Signature silhouette of reference image!)
    const backpackGroup = new THREE.Group();
    backpackGroup.position.set(0, 1.15, -0.20);

    // High-Capacity Olive Canvas & Leather Pack Body
    const packBody = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.45, 0.19), jacketMat);
    packBody.castShadow = true;
    backpackGroup.add(packBody);

    // Top Storm Flap Lid with buckle straps
    const packLid = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.09, 0.20), jacketMat);
    packLid.position.set(0, 0.22, 0);
    packLid.castShadow = true;
    backpackGroup.add(packLid);

    // Twin Vertical Leather Buckle Straps down back of pack
    for (let s = -1; s <= 1; s += 2) {
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.38, 0.02), beltMat);
      strap.position.set(s * 0.10, 0.02, -0.10);
      backpackGroup.add(strap);

      const bBuckle = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 0.015), brassMat);
      bBuckle.position.set(s * 0.10, 0.08, -0.11);
      backpackGroup.add(bBuckle);
    }

    // 1. TOP ROLLED SLEEPING MAT (Large cylindrical foam bedroll across top of backpack)
    const topBedrollGroup = new THREE.Group();
    topBedrollGroup.position.set(0, 0.28, -0.01);
    const sleepingMat = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.38, 16), topMatMat);
    sleepingMat.rotation.z = Math.PI / 2;
    sleepingMat.castShadow = true;
    topBedrollGroup.add(sleepingMat);

    // Twin leather retaining straps around top sleeping mat
    for (let s = -1; s <= 1; s += 2) {
      const mStrap = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.03, 16), beltMat);
      mStrap.rotation.z = Math.PI / 2;
      mStrap.position.set(s * 0.12, 0, 0);
      topBedrollGroup.add(mStrap);
    }
    backpackGroup.add(topBedrollGroup);

    // 2. BOTTOM ROLLED CANVAS BLANKET / SCROLL (Second bedroll strapped across bottom of backpack!)
    const bottomBedrollGroup = new THREE.Group();
    bottomBedrollGroup.position.set(0, -0.23, -0.02);
    const bottomRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.36, 16), bottomRollMat);
    bottomRoll.rotation.z = Math.PI / 2;
    bottomRoll.castShadow = true;
    bottomBedrollGroup.add(bottomRoll);

    for (let s = -1; s <= 1; s += 2) {
      const bStrap = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.065, 0.025, 16), beltMat);
      bStrap.rotation.z = Math.PI / 2;
      bStrap.position.set(s * 0.11, 0, 0);
      bottomBedrollGroup.add(bStrap);
    }
    backpackGroup.add(bottomBedrollGroup);

    // 3. COILED EXPEDITION CLIMBING ROPE (Hanging on left side of backpack, exactly as in reference photo)
    const ropeGroup = new THREE.Group();
    ropeGroup.position.set(-0.20, 0.04, 0);
    ropeGroup.rotation.y = Math.PI / 2;

    const coiledRope = new THREE.Mesh(new THREE.TorusGeometry(0.095, 0.03, 12, 24), ropeMat);
    coiledRope.castShadow = true;
    ropeGroup.add(coiledRope);

    // Middle rope bundle wrap
    const ropeWrap = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.10, 10), ropeMat);
    ropeWrap.castShadow = true;
    ropeGroup.add(ropeWrap);

    // Hanging loose rope end tail
    const ropeTail = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.012, 0.22, 8), ropeMat);
    ropeTail.position.set(0.04, -0.13, 0);
    ropeTail.rotation.z = -0.15;
    ropeTail.castShadow = true;
    ropeGroup.add(ropeTail);

    backpackGroup.add(ropeGroup);

    torsoGroup.add(backpackGroup);
    charGroup.add(torsoGroup);
    characterTorsoRef.current = torsoGroup;

    // 3. Anatomical Neck
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.075, 0.10, 12), skinMat);
    neck.position.set(0, 1.38, 0.01);
    neck.castShadow = true;
    charGroup.add(neck);

    // 4. Head & Sleek Low Bun Hair with Hairpin (Exactly matching reference photo!)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 1.54, 0);

    // Proportional Human Head & Jaw
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.22, 0.185), skinMat);
    head.position.y = 0;
    head.castShadow = true;
    headGroup.add(head);

    // Ears
    const leftEar = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.06, 0.035), skinMat);
    leftEar.position.set(-0.105, 0.01, 0.01);
    headGroup.add(leftEar);

    const rightEar = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.06, 0.035), skinMat);
    rightEar.position.set(0.105, 0.01, 0.01);
    headGroup.add(rightEar);

    // Sculpted Nose
    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.065, 0.04), skinMat);
    nose.position.set(0, 0, 0.11);
    headGroup.add(nose);

    // Eye sockets & Brow ridge
    const brow = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.025, 0.035), skinMat);
    brow.position.set(0, 0.045, 0.098);
    headGroup.add(brow);

    const leftEye = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.015, 0.01), eyeMat);
    leftEye.position.set(-0.045, 0.03, 0.10);
    headGroup.add(leftEye);

    const rightEye = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.015, 0.01), eyeMat);
    rightEye.position.set(0.045, 0.03, 0.10);
    headGroup.add(rightEye);

    // Hair swept back smoothly from crown and temples into a sleek low chignon
    const hairCrown = new THREE.Mesh(new THREE.BoxGeometry(0.205, 0.09, 0.19), hairMat);
    hairCrown.position.set(0, 0.095, -0.01);
    hairCrown.castShadow = true;
    headGroup.add(hairCrown);

    const hairBack = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.17, 0.08), hairMat);
    hairBack.position.set(0, 0.01, -0.075);
    hairBack.castShadow = true;
    headGroup.add(hairBack);

    // SLEEK LOW BUN (CHIGNON) sitting gracefully at the nape of the neck (as in reference image!)
    const bunGroup = new THREE.Group();
    bunGroup.position.set(0, 0.01, -0.12);

    // Main rounded hair bun
    const bunMesh = new THREE.Mesh(new THREE.SphereGeometry(0.062, 16, 14), hairMat);
    bunMesh.scale.set(1.15, 0.95, 0.85);
    bunMesh.castShadow = true;
    bunGroup.add(bunMesh);

    // Decorative wrapped hair ring around the bun base
    const bunWrap = new THREE.Mesh(new THREE.TorusGeometry(0.055, 0.02, 10, 20), hairMat);
    bunWrap.castShadow = true;
    bunGroup.add(bunWrap);

    // Antique Brass / Bone Hairpin (clasp) piercing horizontally through the low bun!
    const hairpin = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.004, 0.20, 8), brassMat);
    hairpin.rotation.z = Math.PI / 2 + 0.12;
    hairpin.position.set(0.01, 0.01, 0.03);
    hairpin.castShadow = true;
    bunGroup.add(hairpin);

    // Ornamental hairpin tip
    const hairpinTip = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 8), brassMat);
    hairpinTip.position.set(0.10, 0.02, 0.03);
    bunGroup.add(hairpinTip);

    headGroup.add(bunGroup);

    charGroup.add(headGroup);
    characterHeadRef.current = headGroup;

    // 5. Left Arm & Hand Holding Open Field Journal / Notebook (As in reference image!)
    const leftArmGroup = new THREE.Group();
    leftArmGroup.position.set(-0.25, 1.28, 0);

    // Upper arm
    const leftUpperArm = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.22, 0.10), jacketMat);
    leftUpperArm.position.set(0, -0.11, 0.02);
    leftUpperArm.rotation.x = -0.35;
    leftUpperArm.castShadow = true;
    leftArmGroup.add(leftUpperArm);

    // Forearm angled upward holding the journal
    const leftForearm = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.20, 0.085), skinMat);
    leftForearm.position.set(0, -0.26, 0.12);
    leftForearm.rotation.x = -1.05;
    leftForearm.castShadow = true;
    leftArmGroup.add(leftForearm);

    // Field Watch on left wrist
    const fieldWatch = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.025, 0.09), beltMat);
    fieldWatch.position.set(0, -0.32, 0.18);
    leftArmGroup.add(fieldWatch);

    // Left Hand holding the notebook
    const leftHand = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.085, 0.045), skinMat);
    leftHand.position.set(0, -0.36, 0.22);
    leftHand.rotation.x = -0.4;
    leftArmGroup.add(leftHand);

    // Archaeological Field Journal / Notebook held in hand
    const journalGroup = new THREE.Group();
    journalGroup.position.set(0.08, -0.34, 0.26);
    journalGroup.rotation.set(0.35, -0.15, -0.12);

    const journalCover = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.24, 0.02), leatherMat);
    journalCover.castShadow = true;
    journalGroup.add(journalCover);

    const journalPages = new THREE.Mesh(new THREE.BoxGeometry(0.165, 0.225, 0.015), paperMat);
    journalPages.position.set(0, 0, 0.008);
    journalPages.castShadow = true;
    journalGroup.add(journalPages);

    leftArmGroup.add(journalGroup);
    charGroup.add(leftArmGroup);

    // 6. Right Arm with Bicep Utility Pocket & Hand Holding Field Pen (Taking notes!)
    const rightArmGroup = new THREE.Group();
    rightArmGroup.position.set(0.25, 1.28, 0);

    // Upper arm with sleeve flap pocket (visible on right sleeve in reference photo!)
    const rightUpperArm = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.22, 0.10), jacketMat);
    rightUpperArm.position.set(0, -0.11, 0.02);
    rightUpperArm.rotation.x = -0.40;
    rightUpperArm.castShadow = true;
    rightArmGroup.add(rightUpperArm);

    // Sleeve utility pocket on right arm
    const sleevePocket = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.09, 0.08), jacketMat);
    sleevePocket.position.set(0.06, -0.11, 0.02);
    rightArmGroup.add(sleevePocket);

    // Forearm brought forward over the notebook
    const rightForearm = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.20, 0.085), skinMat);
    rightForearm.position.set(-0.06, -0.26, 0.12);
    rightForearm.rotation.set(-1.15, 0, 0.35);
    rightForearm.castShadow = true;
    rightArmGroup.add(rightForearm);

    // Right Hand poised to write
    const rightHand = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.04), skinMat);
    rightHand.position.set(-0.10, -0.34, 0.22);
    rightArmGroup.add(rightHand);

    // Field Stylus / Pen touching notebook
    const fieldPen = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.12, 8), brassMat);
    fieldPen.rotation.set(0.8, 0.3, -0.4);
    fieldPen.position.set(-0.09, -0.32, 0.24);
    fieldPen.castShadow = true;
    rightArmGroup.add(fieldPen);

    charGroup.add(rightArmGroup);
    characterArmsRef.current = { left: leftArmGroup, right: rightArmGroup };

    // 7. Left Leg, Shin, Cargo Pocket & Lugged Hiking Boot
    const leftLegGroup = new THREE.Group();
    leftLegGroup.position.set(-0.11, 0.74, 0);

    const leftThigh = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.32, 0.14), pantsMat);
    leftThigh.position.y = -0.16;
    leftThigh.castShadow = true;
    leftLegGroup.add(leftThigh);

    const leftCargoPocket = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.12, 0.10), pantsMat);
    leftCargoPocket.position.set(-0.075, -0.16, 0);
    leftLegGroup.add(leftCargoPocket);

    const leftShin = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.30, 0.125), pantsMat);
    leftShin.position.y = -0.45;
    leftShin.castShadow = true;
    leftLegGroup.add(leftShin);

    // High-Cut Rugged Hiking Boot with Lugged Rubber Sole
    const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.125, 0.13, 0.20), bootMat);
    leftBoot.position.set(0, -0.66, 0.03);
    leftBoot.castShadow = true;
    leftLegGroup.add(leftBoot);

    const leftSole = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.03, 0.21), bootSoleMat);
    leftSole.position.set(0, -0.73, 0.03);
    leftLegGroup.add(leftSole);

    charGroup.add(leftLegGroup);

    // 8. Right Leg with Thigh Compression Strap & Hiking Boot (As in reference image!)
    const rightLegGroup = new THREE.Group();
    rightLegGroup.position.set(0.11, 0.74, 0);

    const rightThigh = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.32, 0.14), pantsMat);
    rightThigh.position.y = -0.16;
    rightThigh.castShadow = true;
    rightLegGroup.add(rightThigh);

    // Thigh Compression Strap (distinctive horizontal strap across right thigh in reference image!)
    const thighStrap = new THREE.Mesh(new THREE.BoxGeometry(0.145, 0.03, 0.155), beltMat);
    thighStrap.position.set(0, -0.18, 0);
    rightLegGroup.add(thighStrap);

    const rightCargoPocket = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.12, 0.10), pantsMat);
    rightCargoPocket.position.set(0.075, -0.14, 0);
    rightLegGroup.add(rightCargoPocket);

    const rightShin = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.30, 0.125), pantsMat);
    rightShin.position.y = -0.45;
    rightShin.castShadow = true;
    rightLegGroup.add(rightShin);

    const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.125, 0.13, 0.20), bootMat);
    rightBoot.position.set(0, -0.66, 0.03);
    rightBoot.castShadow = true;
    rightLegGroup.add(rightBoot);

    const rightSole = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.03, 0.21), bootSoleMat);
    rightSole.position.set(0, -0.73, 0.03);
    rightLegGroup.add(rightSole);

    charGroup.add(rightLegGroup);
    characterLegsRef.current = { left: leftLegGroup, right: rightLegGroup };

    scene.add(charGroup);
    characterGroupRef.current = charGroup;

    // 16. Interaction Raycasting & Collision System
    const checkWallCollision = (x: number, z: number, radius = 0.85): boolean => {
      if (x < -92 || x > 92 || z < -92 || z > 92) return true;

      if (z > -82.5 - radius && z < -77.5 + radius && Math.abs(x) > 6.0) return true;
      if (z > 77.5 - radius && z < 82.5 + radius && Math.abs(x) > 6.0) return true;
      if (x > -82.5 - radius && x < -77.5 + radius && Math.abs(z) > 6.0) return true;
      if (x > 77.5 - radius && x < 82.5 + radius && Math.abs(z) > 6.0) return true;

      if (z > -18 - radius && z < -14 + radius && x > -36 && x < 6) return true;
      if (z > 40 - radius && z < 44 + radius && x > -36 && x < 6) return true;
      if (x > -38 - radius && x < -34 + radius && z > -16 && z < 42 && !(z > 10 && z < 16)) return true;
      if (x > 4 - radius && x < 8 + radius && z > -16 && z < 42 && !(z > 10 && z < 16)) return true;

      if (z > -70.5 - radius && z < -65.5 + radius && Math.abs(x) > 3.5 && Math.abs(x) < 24) return true;

      if (x > 32 - radius && x < 35 + radius && z > -8 && z < 20) return true;
      if (x > 32 && x < 64 && z > -9 - radius && z < -6 + radius) return true;
      if (x > 32 && x < 62 && z > 18 - radius && z < 21 + radius) return true;

      return false;
    };

    const handlePointerDown = (e: PointerEvent) => {
      soundManager.startAmbient();
      // Orbit camera on both right-click (button 2) and left-click drag
      isDraggingRef.current = true;
      lastMousePosRef.current = { x: e.clientX, y: e.clientY };
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (document.pointerLockElement === renderer.domElement) {
        const sensitivity = 0.0032;
        cameraAngleRef.current.theta -= e.movementX * sensitivity;
        cameraAngleRef.current.phi = Math.max(0.08, Math.min(Math.PI * 0.36, cameraAngleRef.current.phi + e.movementY * sensitivity));
      } else if (isDraggingRef.current) {
        const deltaX = e.clientX - lastMousePosRef.current.x;
        const deltaY = e.clientY - lastMousePosRef.current.y;
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };

        cameraAngleRef.current.theta -= deltaX * 0.004;
        cameraAngleRef.current.phi = Math.max(0.08, Math.min(Math.PI * 0.36, cameraAngleRef.current.phi + deltaY * 0.004));
      }
    };

    const handlePointerUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      // Smooth third-person follow zoom clamping (PUBG / Free Fire style: 1.8m to 5.2m)
      zoomDistRef.current = Math.max(1.8, Math.min(5.2, zoomDistRef.current + e.deltaY * 0.004));
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    domEl.addEventListener('wheel', handleWheel, { passive: false });
    domEl.addEventListener('contextmenu', handleContextMenu);

    // 17. Responsive Resize Observer
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect;
        if (w > 0 && h > 0) {
          camera.aspect = w / h;
          camera.updateProjectionMatrix();
          renderer.setSize(w, h);
        }
      }
    });
    resizeObserver.observe(containerRef.current);

    // 18. Animation Render Loop (60 FPS)
    let animationFrameId: number;
    let clock = new THREE.Clock();
    let walkPhase = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();

      // A. Player Movement & Physics
      let moveX = 0;
      let moveZ = 0;

      const k = keysRef.current;
      const isSprinting = !!(k['shift'] || k['shiftleft'] || k['shiftright']);
      const baseSpeed = isSprinting ? 18.0 : 10.5;
      const speed = baseSpeed * delta;

      if (k['w'] || k['arrowup'] || virtualMoveDirection === 'forward') moveZ += 1;
      if (k['s'] || k['arrowdown'] || virtualMoveDirection === 'backward') moveZ -= 1;
      if (k['a'] || k['arrowleft'] || virtualMoveDirection === 'left') moveX += 1;
      if (k['d'] || k['arrowright'] || virtualMoveDirection === 'right') moveX -= 1;

      // Jumping and gravity
      const isGrounded = playerPosRef.current.y <= 0.05;
      if ((k[' '] || k['space']) && isGrounded) {
        velocityYRef.current = 11.5;
        soundManager.playFootstep();
      }

      if (!isGrounded || velocityYRef.current > 0) {
        velocityYRef.current -= 30 * delta;
        playerPosRef.current.y += velocityYRef.current * delta;
      }
      if (playerPosRef.current.y < 0) {
        playerPosRef.current.y = 0;
        velocityYRef.current = 0;
      }

      let isMoving = false;

      // Handle Keyboard Movement relative to camera angle
      if (moveX !== 0 || moveZ !== 0) {
        targetMovePosRef.current = null;
        isMoving = true;

        const forward = new THREE.Vector3(-Math.sin(cameraAngleRef.current.theta), 0, -Math.cos(cameraAngleRef.current.theta));
        const right = new THREE.Vector3(Math.cos(cameraAngleRef.current.theta), 0, -Math.sin(cameraAngleRef.current.theta));

        const moveDir = new THREE.Vector3()
          .addScaledVector(forward, moveZ)
          .addScaledVector(right, -moveX)
          .normalize();

        const proposedX = playerPosRef.current.x + moveDir.x * speed;
        const proposedZ = playerPosRef.current.z + moveDir.z * speed;

        if (!checkWallCollision(proposedX, playerPosRef.current.z)) {
          playerPosRef.current.x = proposedX;
        }
        if (!checkWallCollision(playerPosRef.current.x, proposedZ)) {
          playerPosRef.current.z = proposedZ;
        }

        const targetRot = Math.atan2(moveDir.x, moveDir.z);
        const rotDiff = Math.atan2(Math.sin(targetRot - playerRotRef.current), Math.cos(targetRot - playerRotRef.current));
        playerRotRef.current += rotDiff * Math.min(1.0, delta * 15.0);
      } else if (targetMovePosRef.current) {
        const dist = playerPosRef.current.distanceTo(targetMovePosRef.current);
        if (dist > 0.6) {
          isMoving = true;
          const dir = new THREE.Vector3().subVectors(targetMovePosRef.current, playerPosRef.current).normalize();
          const proposedX = playerPosRef.current.x + dir.x * Math.min(speed, dist);
          const proposedZ = playerPosRef.current.z + dir.z * Math.min(speed, dist);

          if (!checkWallCollision(proposedX, playerPosRef.current.z)) {
            playerPosRef.current.x = proposedX;
          }
          if (!checkWallCollision(playerPosRef.current.x, proposedZ)) {
            playerPosRef.current.z = proposedZ;
          }

          const targetRot = Math.atan2(dir.x, dir.z);
          const rotDiff = Math.atan2(Math.sin(targetRot - playerRotRef.current), Math.cos(targetRot - playerRotRef.current));
          playerRotRef.current += rotDiff * Math.min(1.0, delta * 15.0);

          if (targetRingRef.current) {
            const mat = targetRingRef.current.material as THREE.MeshBasicMaterial;
            mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0.2, 0.05);
          }
        } else {
          targetMovePosRef.current = null;
          if (targetRingRef.current) {
            (targetRingRef.current.material as THREE.MeshBasicMaterial).opacity = 0;
          }
        }
      }

      // World bounds
      playerPosRef.current.x = Math.max(-95, Math.min(95, playerPosRef.current.x));
      playerPosRef.current.z = Math.max(-95, Math.min(95, playerPosRef.current.z));

      // Update Character Avatar Animation
      if (characterGroupRef.current) {
        characterGroupRef.current.position.set(playerPosRef.current.x, playerPosRef.current.y, playerPosRef.current.z);
        characterGroupRef.current.rotation.y = playerRotRef.current;

        // Walk cycle animation on legs and arms
        if (isMoving && characterLegsRef.current && characterArmsRef.current) {
          walkPhase += delta * 11;
          const legSwing = Math.sin(walkPhase) * 0.55;
          characterLegsRef.current.left.rotation.x = legSwing;
          characterLegsRef.current.right.rotation.x = -legSwing;

          // While moving, arms hold the field notebook with a subtle natural cadence
          characterArmsRef.current.left.rotation.x = -0.35 + Math.sin(walkPhase) * 0.08;
          characterArmsRef.current.right.rotation.x = -0.40 - Math.sin(walkPhase) * 0.08;
          characterGroupRef.current.position.y = playerPosRef.current.y + Math.abs(Math.sin(walkPhase * 2)) * 0.04;

          walkAudioTimerRef.current += delta;
          if (walkAudioTimerRef.current > 0.34) {
            soundManager.playFootstep();
            walkAudioTimerRef.current = 0;
          }
        } else if (characterLegsRef.current && characterArmsRef.current) {
          characterLegsRef.current.left.rotation.x = 0;
          characterLegsRef.current.right.rotation.x = 0;
          // Idle breathing motion
          const breath = Math.sin(time * 2.2) * 0.015;
          characterArmsRef.current.left.rotation.x = -0.35 + breath;
          characterArmsRef.current.right.rotation.x = -0.40 - breath;
          if (characterTorsoRef.current) {
            characterTorsoRef.current.scale.set(1.0 + breath * 0.3, 1.0 + breath * 0.2, 1.0 + breath * 0.4);
          }
          characterGroupRef.current.position.y = playerPosRef.current.y;
        }
      }

      // Location / Acoustic Zone detection
      const px = playerPosRef.current.x;
      const pz = playerPosRef.current.z;
      let detectedZone: CityZone = 'desert_outskirts';

      if (pz < -45) {
        detectedZone = 'stream_bund';
      } else if (px < 10 && pz > -15 && pz < 42) {
        detectedZone = 'citadel';
      } else if (px > 15 && pz > -12 && pz < 38) {
        detectedZone = 'reservoir';
      } else if (px > 15 && pz >= -45 && pz <= -10) {
        detectedZone = 'middle_town';
      } else {
        detectedZone = 'desert_outskirts';
      }

      if (detectedZone !== currentZoneRef.current) {
        currentZoneRef.current = detectedZone;
        soundManager.updatePlayerZone(detectedZone);
        if (onZoneChange) {
          onZoneChange(detectedZone);
        }
      }

      // B. Clue Proximity Check & Archaeological Clue Atmospherics Animation
      let closestClue: ClueLocation | null = null;
      let minDistance = 999;

      CLUE_LOCATIONS.forEach(clue => {
        const dist = playerPosRef.current.distanceTo(new THREE.Vector3(clue.x, clue.y, clue.z));
        if (dist < minDistance) {
          minDistance = dist;
          if (dist < 8.5) {
            closestClue = clue;
          }
        }
      });

      if (closestClue !== nearbyClueRef.current) {
        nearbyClueRef.current = closestClue;
        if (closestClue) {
          const isColl =
            collectedEvidenceIds.includes((closestClue as ClueLocation).id) ||
            collectedEvidenceIds.includes((closestClue as ClueLocation).evidenceId);
          onNearbyClueChange({
            id: (closestClue as ClueLocation).id,
            name: (closestClue as ClueLocation).name,
            type: (closestClue as ClueLocation).type,
            isCollected: isColl,
          });
        } else {
          onNearbyClueChange(null);
        }
      }

      // Animate Archaeological Clue Visuals: Floating Dust Motes, Warm Glowing Light, and Survey Compass Decals
      clueVisualsRef.current.forEach(cv => {
        const isNearby = nearbyClueRef.current?.id === cv.id;
        const clueLoc = CLUE_LOCATIONS.find(c => c.id === cv.id);
        const dist = clueLoc ? playerPosRef.current.distanceTo(new THREE.Vector3(clueLoc.x, clueLoc.y, clueLoc.z)) : 999;
        const isCollected = collectedEvidenceIds.includes(cv.id) || collectedEvidenceIds.includes(cv.evidenceId);

        // 1. Localized Golden Dust Particles Drifting in Warm Light Cone
        const dustAttr = cv.dustPoints.geometry.attributes.position;
        if (dustAttr) {
          const arr = dustAttr.array as Float32Array;
          const init = cv.initialDustPos;
          for (let p = 0; p < arr.length / 3; p++) {
            const t = time * 0.8 + p * 0.42;
            arr[p * 3] = init[p * 3] + Math.sin(t) * 0.14;
            // Upward drift wrapping continuously within 0.2m to 2.4m
            const yOffset = (time * 0.16 + p * 0.14) % 2.2;
            arr[p * 3 + 1] = 0.2 + yOffset;
            arr[p * 3 + 2] = init[p * 3 + 2] + Math.cos(t) * 0.14;
          }
          dustAttr.needsUpdate = true;
        }

        // 2. Warm Archaeological Marker Light Breathing / Respiration
        if (cv.light) {
          const flicker = Math.sin(time * 2.4 + (clueLoc?.x || 0)) * 0.14 + Math.cos(time * 3.6 + (clueLoc?.z || 0)) * 0.08;
          cv.light.intensity = cv.baseIntensity * (1.0 + flicker);
        }

        // 3. Volumetric Beam Opacity Modulation
        if (cv.beam) {
          const bMat = cv.beam.material as THREE.MeshBasicMaterial;
          bMat.opacity = 0.24 + Math.sin(time * 1.6 + (clueLoc?.x || 0)) * 0.08;
        }

        // 4. Ground Archaeological Survey Compass Ring Animation
        const ringMat = cv.ring.material as THREE.MeshBasicMaterial;
        cv.ring.rotation.z = time * 0.06; // Slow cardinal rotation of survey decal
        if (isNearby) {
          cv.ring.visible = true;
          const pulse = (Math.sin(time * 2.8) + 1) * 0.5;
          cv.ring.scale.setScalar(1.0 + pulse * 0.06);
          ringMat.opacity = isCollected ? 0.45 : (0.55 + pulse * 0.35);
        } else if (dist < 26) {
          // Atmospheric discovery cue at medium distance: soft mysterious presence
          cv.ring.visible = true;
          cv.ring.scale.setScalar(1.0);
          ringMat.opacity = isCollected ? 0.18 : 0.28;
        } else {
          cv.ring.visible = false;
        }
      });

      // C. Water Surface Ripples & Animated Flow (Realistic Liquid Dynamics & Wave Displacement)
      if (waterMeshRef.current) {
        const mat = waterMeshRef.current.material as THREE.MeshStandardMaterial;
        if (mat.normalMap) {
          mat.normalMap.offset.x = (time * 0.026) % 1;
          mat.normalMap.offset.y = (time * 0.015) % 1;
        }

        if (secondaryWaterNormalRef.current) {
          secondaryWaterNormalRef.current.offset.x = -(time * 0.021) % 1;
          secondaryWaterNormalRef.current.offset.y = (time * 0.018) % 1;
        }

        // Realistic subtle wave displacement on 48x48 reservoir grid
        if (waterGeomRef.current) {
          const posAttr = waterGeomRef.current.attributes.position;
          const waveSpeed = isWaterFlowing ? 2.4 : 1.35;
          const waveHeight = isWaterFlowing ? 0.046 : 0.022;
          for (let v = 0; v < posAttr.count; v++) {
            const vx = posAttr.getX(v);
            const vy = posAttr.getY(v);
            const wave1 = Math.sin(vx * 0.28 + time * waveSpeed) * waveHeight;
            const wave2 = Math.cos(vy * 0.32 + time * (waveSpeed * 0.8)) * (waveHeight * 0.75);
            const wave3 = Math.sin((vx + vy) * 0.18 + time * (waveSpeed * 1.2)) * (waveHeight * 0.4);
            posAttr.setZ(v, wave1 + wave2 + wave3);
          }
          posAttr.needsUpdate = true;
          waterGeomRef.current.computeVertexNormals();
        }

        if (isWaterFlowing) {
          waterMeshRef.current.position.y = THREE.MathUtils.lerp(waterMeshRef.current.position.y, -0.6, delta * 0.45);
          waterFlowTimerRef.current += delta;

          if (waterMistMeshRef.current) {
            waterMistMeshRef.current.position.y = waterMeshRef.current.position.y + 0.35;
          }
          if (waterMistSecondaryRef.current) {
            waterMistSecondaryRef.current.position.y = waterMeshRef.current.position.y + 0.65;
          }

          if (waterFlowTimerRef.current > 4.2 && !hasCompletedMissionRef.current) {
            hasCompletedMissionRef.current = true;
            if (onCompleteMission) {
              onCompleteMission('mission_1_water', 45);
            }
          }
        } else {
          waterMeshRef.current.position.y = -2.5 + Math.sin(time * 1.4) * 0.035;
          if (waterMistMeshRef.current) {
            waterMistMeshRef.current.position.y = waterMeshRef.current.position.y + 0.35;
          }
          if (waterMistSecondaryRef.current) {
            waterMistSecondaryRef.current.position.y = waterMeshRef.current.position.y + 0.65;
          }
        }
      }

      // Multidimensional atmospheric reservoir mist drift & breathing opacity
      if (waterMistMeshRef.current) {
        const mistMat1 = waterMistMeshRef.current.material as THREE.MeshBasicMaterial;
        mistMat1.opacity = 0.30 + Math.sin(time * 0.7) * 0.08;
        waterMistMeshRef.current.position.x = 48 + Math.sin(time * 0.1) * 1.4;
        waterMistMeshRef.current.position.z = 8 + Math.cos(time * 0.08) * 0.9;
      }
      if (waterMistSecondaryRef.current) {
        const mistMat2 = waterMistSecondaryRef.current.material as THREE.MeshBasicMaterial;
        mistMat2.opacity = 0.20 + Math.sin(time * 0.85 + 1.4) * 0.06;
        waterMistSecondaryRef.current.position.x = 48 + Math.cos(time * 0.07) * 1.8;
        waterMistSecondaryRef.current.position.z = 8 + Math.sin(time * 0.09) * 1.2;
      }

      // Animate Flickering Ancient Stone Braziers
      braziersRef.current.forEach(({ light, flame, baseIntensity, phase }) => {
        const flicker = Math.sin(time * 8.5 + phase) * 0.14 + Math.cos(time * 14.2 + phase * 2) * 0.08;
        if (light) light.intensity = baseIntensity * (1 + flicker);
        flame.scale.y = 1 + flicker * 0.7;
        flame.scale.x = 1 - flicker * 0.25;
      });

      // Animate Volumetric Ground Haze Sheets
      if (hazePlanesRef.current[0]) hazePlanesRef.current[0].position.x = Math.sin(time * 0.06) * 3.5;
      if (hazePlanesRef.current[1]) {
        hazePlanesRef.current[1].position.z = 15 + Math.cos(time * 0.05) * 2.5;
        (hazePlanesRef.current[1].material as THREE.MeshBasicMaterial).opacity = 0.24 + Math.sin(time * 0.35) * 0.04;
      }

      // Flowing water in conduits with subtle subterranean luminescence
      waterChannelMeshesRef.current.forEach((streamMesh, idx) => {
        const mat = streamMesh.material as THREE.MeshStandardMaterial;
        if (mat.normalMap) {
          mat.normalMap.offset.x = (time * 0.12 + idx * 0.3) % 1;
        }
        if (isWaterFlowing || collectedEvidenceIds.length >= 3) {
          mat.opacity = 0.92 + Math.sin(time * 6 + idx * 1.5) * 0.08;
          mat.emissiveIntensity = 0.65 + Math.sin(time * 4) * 0.15;
        } else {
          mat.opacity = 0.0;
          mat.emissiveIntensity = 0.0;
        }
      });

      // D. Atmospheric Dust Motes Gentle Drift
      if (dustParticlesRef.current) {
        const posAttr = dustParticlesRef.current.geometry.attributes.position;
        for (let p = 0; p < posAttr.count; p++) {
          let y = posAttr.getY(p) - delta * 0.55;
          if (y < 0.5) y = 26;
          posAttr.setY(p, y);

          let x = posAttr.getX(p) + Math.sin(time * 0.4 + p) * 0.015;
          posAttr.setX(p, x);
        }
        posAttr.needsUpdate = true;
      }

      // E. Camera Choreography (Preserving original camera behavior and controls)
      const p = playerPosRef.current;
      const zoomFactor = zoomLevel;

      if (cameraMode === 'third_person') {
        const dist = zoomDistRef.current * zoomFactor;
        const camHeight = Math.sin(cameraAngleRef.current.phi) * dist + 1.45;
        const horizontalDist = Math.cos(cameraAngleRef.current.phi) * dist;

        const targetX = p.x + Math.sin(cameraAngleRef.current.theta) * horizontalDist;
        const targetZ = p.z + Math.cos(cameraAngleRef.current.theta) * horizontalDist;
        const targetY = Math.max(0.35, p.y + camHeight);

        // Smooth camera follow without clipping (PUBG / Free Fire style)
        camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.18);
        camera.lookAt(p.x, p.y + 1.20, p.z);
      } else if (cameraMode === 'isometric') {
        const isoDist = 18 * zoomFactor;
        const targetX = p.x + isoDist * 0.7;
        const targetY = 14 * zoomFactor;
        const targetZ = p.z + isoDist * 0.7;

        camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.08);
        camera.lookAt(p.x, p.y + 1.0, p.z);
      } else if (cameraMode === 'drone') {
        const targetX = 40;
        const targetY = 75 * zoomFactor;
        const targetZ = 20;

        camera.position.lerp(new THREE.Vector3(targetX, targetY, targetZ), 0.05);
        camera.lookAt(35, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      soundManager.stopAmbient();
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      canvasEl.removeEventListener('webglcontextlost', handleContextLost);
      canvasEl.removeEventListener('webglcontextrestored', handleContextRestored);
      domEl.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      domEl.removeEventListener('contextmenu', handleContextMenu);
      renderer.dispose();
    };
  }, []);

  // Permanently lock lighting state to natural balanced daytime
  useEffect(() => {
    if (!sceneRef.current || !dirLightRef.current || !hemiLightRef.current || !ambLightRef.current) return;

    dirLightRef.current.color.setHex(0xfff5e4);
    dirLightRef.current.intensity = 1.08;
    dirLightRef.current.position.set(38, 70, 24);
    hemiLightRef.current.color.setHex(0x8ec4f7);
    hemiLightRef.current.groundColor.setHex(0x785d45);
    hemiLightRef.current.intensity = 0.42;
    ambLightRef.current.color.setHex(0xf5eee4);
    ambLightRef.current.intensity = 0.30;
    const daytimeSky = new THREE.Color('#78abdb');
    sceneRef.current.background = daytimeSky;
    if (sceneRef.current.fog) (sceneRef.current.fog as THREE.Fog).color.setHex(daytimeSky.getHex());
    if (skyMatRef.current) {
      skyMatRef.current.map = createNoonSkyTexture();
      skyMatRef.current.needsUpdate = true;
    }
  }, [timeOfDay]);

  // Handle Quick Focus Target Commands (Position player safely in open areas)
  useEffect(() => {
    if (!quickFocusTarget) return;

    if (quickFocusTarget === 'reservoir') {
      playerPosRef.current.set(16, 0, -10); // Elevated scenic viewpoint overlooking Great Eastern Reservoir
      playerRotRef.current = Math.PI * 0.72;
      cameraAngleRef.current = { theta: -Math.PI * 0.28, phi: 0.20 };
      zoomDistRef.current = 3.2;
      targetMovePosRef.current = null;
    } else if (quickFocusTarget === 'bund') {
      playerPosRef.current.set(0, 0, -56); // Safe open ground in front of Manhar check-dam
      playerRotRef.current = Math.PI;
      cameraAngleRef.current = { theta: 0, phi: 0.20 };
      zoomDistRef.current = 3.2;
      targetMovePosRef.current = null;
    } else if (quickFocusTarget === 'citadel') {
      playerPosRef.current.set(-15, 0, -18); // Open Ceremonial Plaza in front of Gateway
      playerRotRef.current = Math.PI * 0.95;
      cameraAngleRef.current = { theta: -Math.PI * 0.05, phi: 0.20 };
      zoomDistRef.current = 3.2;
      targetMovePosRef.current = null;
    } else if (quickFocusTarget === 'player') {
      cameraAngleRef.current = { theta: -Math.PI * 0.28, phi: 0.20 };
      zoomDistRef.current = 3.2;
    }
  }, [quickFocusTarget]);

  // Handle Camera Reset Trigger
  useEffect(() => {
    if (cameraResetTrigger > 0) {
      cameraAngleRef.current = { theta: -Math.PI * 0.28, phi: 0.20 };
      zoomDistRef.current = 3.2;
    }
  }, [cameraResetTrigger]);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[580px] bg-[#070a10] overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block cursor-grab active:cursor-grabbing outline-none" />
      {/* Cinematic Screen-Space Soft Radial Vignette */}
      <div 
        className="pointer-events-none absolute inset-0 z-[4]"
        style={{
          background: 'radial-gradient(circle at center, transparent 65%, rgba(12, 18, 28, 0.28) 100%)',
        }}
      />
    </div>
  );
};
