import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useWarp } from './WarpContext';

// ------------------------------------
// SETTINGS
// ------------------------------------
const ROTATION_SPEED_X = 0.001;
const ROTATION_SPEED_Y = 0.0005;

// ==========================================
// 1. PROCEDURAL ROCK GEOMETRY (Smoother, Non-Pointy)
// ==========================================
function useRockGeometry() {
  return useMemo(() => {
    // Detail = 1 adds more faces (smoother, less blocky).
    // Detail = 0 would be very sharp/low-poly.
    const geometry = new THREE.DodecahedronGeometry(1, 1);
    
    const positionAttribute = geometry.attributes.position;
    const vertex = new THREE.Vector3();
    
    for (let i = 0; i < positionAttribute.count; i++) {
      vertex.fromBufferAttribute(positionAttribute, i);
      
      // Gentle distortion (0.2 range) to make it lumpy but NOT pointy
      const distortion = (Math.random() - 0.5) * 0.2; 
      vertex.normalize().multiplyScalar(1 + distortion);
      
      positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
    }

    geometry.computeVertexNormals();
    return geometry;
  }, []);
}

// ==========================================
// 2. INTRO ASTEROID (Deep Space -> Camera)
// ==========================================
const IntroAsteroid = ({ onComplete }: { onComplete: () => void }) => {
  const ref = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const geometry = useRockGeometry();

  // Random Uneven Scale (Potato Shape)
  const scale = useMemo(() => [
      1.2 + Math.random() * 0.3, 
      1.0 + Math.random() * 0.3, 
      1.1 + Math.random() * 0.3
  ] as [number, number, number], []);

  const initialPos = useMemo(() => new THREE.Vector3(
      (Math.random() - 0.5) * viewport.width * 0.5,
      (Math.random() - 0.5) * viewport.height * 0.5, 
      -60 
  ), [viewport]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.5;
    ref.current.rotation.y += delta * 0.5;
    ref.current.position.z += 10 * delta; 

    if (ref.current.position.z > 5) {
      onComplete();
    }
  });

  return (
    <mesh ref={ref} position={initialPos} scale={scale} geometry={geometry}>
      <meshStandardMaterial color="#707070" roughness={0.8} flatShading />
    </mesh>
  );
};

// ==========================================
// 3. FLOATING ASTEROID (Restored Movement Logic)
// ==========================================
const FloatingAsteroid = ({ onComplete }: { onComplete: () => void }) => {
  const ref = useRef<THREE.Mesh>(null);
  const { viewport, camera, gl } = useThree();
  const geometry = useRockGeometry();

  // --- SHAPE: Uneven, Lumpy Rock ---
  const scale = useMemo(() => [
    1.0 + Math.random() * 0.5, // Random width
    0.8 + Math.random() * 0.5, // Random height
    0.9 + Math.random() * 0.5  // Random depth
  ] as [number, number, number], []);

  // --- PHYSICS STATE ---
  const velocity = useRef(new THREE.Vector3());
  const rotSpeed = useRef({ x: 0, y: 0 });
  const hasBeenHit = useRef(false);

  // --- SPAWN LOGIC (Restored "Old Way") ---
  const spawnData = useMemo(() => {
    const zDepth = -20;
    // Calculate visible screen size at this depth
    const vFov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    const height = 2 * Math.tan(vFov / 2) * (camera.position.z - zDepth);
    const width = height * viewport.aspect;
    
    // Spawn fully off-screen
    const xBuffer = width / 2 + 5;
    const yBuffer = height / 2 + 5;
    const side = Math.floor(Math.random() * 4);
    
    let startPos = new THREE.Vector3();
    let initialVel = new THREE.Vector3();
    const speed = 2 + Math.random() * 2; 

    switch(side) {
        case 0: // Left -> Right
            startPos.set(-xBuffer, (Math.random()-0.5)*height, zDepth);
            initialVel.set(speed, (Math.random()-0.5), 0);
            break;
        case 1: // Right -> Left
            startPos.set(xBuffer, (Math.random()-0.5)*height, zDepth);
            initialVel.set(-speed, (Math.random()-0.5), 0);
            break;
        case 2: // Top -> Bottom
            startPos.set((Math.random()-0.5)*width, yBuffer, zDepth);
            initialVel.set((Math.random()-0.5), -speed, 0);
            break;
        case 3: // Bottom -> Top
            startPos.set((Math.random()-0.5)*width, -yBuffer, zDepth);
            initialVel.set((Math.random()-0.5), speed, 0);
            break;
    }

    return { startPos, initialVel, limit: Math.max(xBuffer, yBuffer) + 10 };
  }, [viewport, camera]);

  // Apply initial physics once on mount
  useEffect(() => {
    if (ref.current) {
        ref.current.position.copy(spawnData.startPos);
        velocity.current.copy(spawnData.initialVel);
        rotSpeed.current = { 
            x: (Math.random() - 0.5) * 1, 
            y: (Math.random() - 0.5) * 1 
        };
    }
  }, [spawnData]);

  // --- INTERACTION: Deflect ---
  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    hasBeenHit.current = true;

    // Kick it away with random rotation
    velocity.current.set(
        (Math.random() - 0.5) * 15, 
        (Math.random() - 0.5) * 15, 
        -10 - Math.random() * 10
    );
    rotSpeed.current.x = (Math.random() - 0.5) * 10;
    rotSpeed.current.y = (Math.random() - 0.5) * 10;
    
    gl.domElement.style.cursor = 'auto';
  };

  useFrame((state, delta) => {
    if (!ref.current) return;

    // Move
    ref.current.position.addScaledVector(velocity.current, delta);
    
    // Rotate
    ref.current.rotation.x += rotSpeed.current.x * delta;
    ref.current.rotation.y += rotSpeed.current.y * delta;

    // Check Bounds
    const limit = hasBeenHit.current ? 60 : spawnData.limit;
    if (Math.abs(ref.current.position.x) > limit || 
        Math.abs(ref.current.position.y) > limit || 
        ref.current.position.z < -100) {
        onComplete();
    }
  });

  return (
    <mesh 
        ref={ref} 
        scale={scale}
        geometry={geometry}
        onClick={handleClick}
        onPointerOver={() => { gl.domElement.style.cursor = 'grab'; }}
        onPointerOut={() => { gl.domElement.style.cursor = 'auto'; }}
    >
      <meshStandardMaterial 
        color="#777777" 
        roughness={0.9} 
        metalness={0.1} 
        flatShading={true} 
      />
    </mesh>
  );
};

// ==========================================
// 4. MANAGER (Intro -> Wait -> Float -> Wait)
// ==========================================
const AsteroidManager = () => {
    const [phase, setPhase] = useState<'intro' | 'waiting' | 'floating'>('intro');
    const [spawnKey, setSpawnKey] = useState(0); 

    useEffect(() => {
        if (phase === 'waiting') {
            const delay = 3000 + Math.random() * 3000;
            const timer = setTimeout(() => {
                setSpawnKey(k => k + 1);
                setPhase('floating');
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    return (
        <>
            <ambientLight intensity={0.4} />
            <directionalLight position={[15, 10, 5]} intensity={1.5} color="#ffffff" />
            <directionalLight position={[-10, -5, -5]} intensity={0.5} color="#444466" />

            {phase === 'intro' && <IntroAsteroid onComplete={() => setPhase('waiting')} />}
            {phase === 'floating' && <FloatingAsteroid key={spawnKey} onComplete={() => setPhase('waiting')} />}
        </>
    );
};

// ==========================================
// 5. STAR FIELD
// ==========================================
const StarField = (props: any) => {
  const ref = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();
  const { isWarping } = useWarp();
  const speedRef = useRef(0);
  const colorRef = useRef(new THREE.Color("white"));
  const wasWarping = useRef(false);

  const count = 5000;
  const SPHERE_R_MIN = 20;
  const SPHERE_R_MAX = 45;

  // Generate initial spherical positions
  const [positions, initialPositions, initialColors] = useMemo(() => {
    const posArray = new Float32Array(count * 3);
    const initPosArray = new Float32Array(count * 3);
    const colArray = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = SPHERE_R_MIN + Math.random() * (SPHERE_R_MAX - SPHERE_R_MIN);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      posArray[i * 3] = x;
      posArray[i * 3 + 1] = y;
      posArray[i * 3 + 2] = z;
      // Store original positions for reset
      initPosArray[i * 3] = x;
      initPosArray[i * 3 + 1] = y;
      initPosArray[i * 3 + 2] = z;
      colArray[i * 3] = 1; colArray[i * 3 + 1] = 1; colArray[i * 3 + 2] = 1;
    }
    return [posArray, initPosArray, colArray];
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // Gentle ambient rotation
    ref.current.rotation.x -= ROTATION_SPEED_X;
    ref.current.rotation.y -= ROTATION_SPEED_Y;

    // Smooth speed transition
    const targetSpeed = isWarping ? 80.0 : 0; 
    speedRef.current = THREE.MathUtils.lerp(speedRef.current, targetSpeed, isWarping ? 0.08 : 0.03);

    // Smooth color transition
    const targetColor = isWarping ? new THREE.Color("#00ffff") : new THREE.Color("#ffffff");
    colorRef.current.lerp(targetColor, 0.05);
    
    if (ref.current.material instanceof THREE.Material) {
        // @ts-ignore
        (ref.current.material as THREE.PointsMaterial).color.copy(colorRef.current);
    }

    const posArr = ref.current.geometry.attributes.position.array as Float32Array;

    // During warp: move stars toward the camera (positive Z) and recycle them behind
    if (speedRef.current > 0.1) {
        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            // Move star toward camera along Z
            posArr[iz] += speedRef.current * delta;

            // When star passes the camera, respawn it far behind with
            // a spread that matches a cylindrical tunnel (not a flat plane)
            if (posArr[iz] > 10) {
                const angle = Math.random() * Math.PI * 2;
                const radius = 2 + Math.random() * 40;
                posArr[ix] = Math.cos(angle) * radius;
                posArr[iy] = Math.sin(angle) * radius;
                posArr[iz] = -40 - Math.random() * 20;
            }
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
        wasWarping.current = true;
    }
    // After warp ends: smoothly restore stars to their original spherical positions
    else if (wasWarping.current) {
        let restored = 0;
        for (let i = 0; i < count; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;
            
            posArr[ix] = THREE.MathUtils.lerp(posArr[ix], initialPositions[ix], 0.02);
            posArr[iy] = THREE.MathUtils.lerp(posArr[iy], initialPositions[iy], 0.02);
            posArr[iz] = THREE.MathUtils.lerp(posArr[iz], initialPositions[iz], 0.02);

            // Check if star is close enough to its original position
            const dx = posArr[ix] - initialPositions[ix];
            const dy = posArr[iy] - initialPositions[iy];
            const dz = posArr[iz] - initialPositions[iz];
            if (dx * dx + dy * dy + dz * dz < 0.5) restored++;
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
        // Once most stars are back, stop updating
        if (restored > count * 0.95) {
            wasWarping.current = false;
        }
    }

    // Mouse parallax (only when not warping)
    if (!isWarping) {
        const x = (mouse.x * viewport.width) / 50;
        const y = (mouse.y * viewport.height) / 50;
        ref.current.rotation.x += y * 0.001;
        ref.current.rotation.y += x * 0.001;
    }
  });

  return (
    <group>
      <Points ref={ref} positions={positions} colors={initialColors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#ffffff" 
          size={0.08}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
};

const Background3D = () => {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 1], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
        raycaster={{ params: {
          Points: { threshold: 0.5 },
          Mesh: undefined,
          Line: {
            threshold: 0
          },
          LOD: undefined,
          Sprite: undefined
        } }}
      >
        <color attach="background" args={['#000000']} />
        <StarField />
        <AsteroidManager />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />
    </div>
  );
};

export default Background3D;