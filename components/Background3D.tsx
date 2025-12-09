import React, { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useWarp } from './WarpContext';

// ------------------------------------
// SETTINGS
// ------------------------------------
const ROTATION_SPEED_X = 0.001;
const ROTATION_SPEED_Y = 0.0005;
// ------------------------------------

// ==========================================
// 1. INTRO ASTEROID (Standard Rock)
// ==========================================
const IntroAsteroid = ({ onComplete }: { onComplete: () => void }) => {
  const ref = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  
  const scale = useMemo(() => [1 + Math.random() * 0.4, 1 + Math.random() * 0.4, 1 + Math.random() * 0.4] as [number, number, number], []);
  const initialPos = useMemo(() => new THREE.Vector3((Math.random()-0.5)*viewport.width*0.5, (Math.random()-0.5)*viewport.height*0.5, -60), [viewport]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.5;
    ref.current.rotation.y += delta * 0.5;
    ref.current.position.z += 10 * delta; 
    if (ref.current.position.z > 5) onComplete();
  });

  return (
    <mesh ref={ref} position={initialPos} scale={scale}>
      <dodecahedronGeometry args={[1.5, 1]} /> 
      <meshStandardMaterial color="#707070" roughness={0.8} flatShading />
    </mesh>
  );
};

// ==========================================
// 2. FLOATING ASTEROID (3 VARIATIONS)
// ==========================================
const FloatingAsteroid = ({ onComplete }: { onComplete: () => void }) => {
  const ref = useRef<THREE.Mesh>(null);
  const { viewport, camera } = useThree();

  // --- VARIATION LOGIC ---
  // 0: Standard Rocky (Dodecahedron, Grey)
  // 1: Ice/Crystal Shard (Icosahedron, Light Blueish-Grey)
  // 2: Iron/Metallic Ore (Octahedron, Darker)
  const type = useMemo(() => Math.floor(Math.random() * 3), []);

  const asteroidConfig = useMemo(() => {
    const randomScale = 0.8 + Math.random() * 0.5;
    switch(type) {
        case 1: // Ice Shard
            return { color: "#aaccdd", roughness: 0.4, metalness: 0.1, geometry: "icosahedron", scale: [randomScale * 0.8, randomScale * 1.5, randomScale * 0.8] };
        case 2: // Metallic
            return { color: "#555566", roughness: 0.7, metalness: 0.6, geometry: "octahedron", scale: [randomScale, randomScale, randomScale] };
        default: // Rock
            return { color: "#888888", roughness: 0.9, metalness: 0.1, geometry: "dodecahedron", scale: [randomScale, randomScale, randomScale] };
    }
  }, [type]);

  // Movement Logic (Side to Side)
  const movement = useMemo(() => {
    const zDepth = -20;
    const distance = camera.position.z - zDepth;
    const vFov = (camera as THREE.PerspectiveCamera).fov * (Math.PI / 180);
    const visibleHeight = 2 * Math.tan(vFov / 2) * distance;
    const visibleWidth = visibleHeight * viewport.aspect;

    const xBuffer = visibleWidth / 2 + 5;
    const yBuffer = visibleHeight / 2 + 5;
    const side = Math.floor(Math.random() * 4);
    
    let startPos = new THREE.Vector3();
    let velocity = new THREE.Vector3();
    const speed = 2 + Math.random() * 2; 

    switch(side) {
        case 0: // Left -> Right
            startPos.set(-xBuffer, (Math.random()-0.5) * visibleHeight, zDepth);
            velocity.set(speed, (Math.random()-0.5), 0);
            break;
        case 1: // Right -> Left
            startPos.set(xBuffer, (Math.random()-0.5) * visibleHeight, zDepth);
            velocity.set(-speed, (Math.random()-0.5), 0);
            break;
        case 2: // Top -> Bottom
            startPos.set((Math.random()-0.5) * visibleWidth, yBuffer, zDepth);
            velocity.set((Math.random()-0.5), -speed, 0);
            break;
        case 3: // Bottom -> Top
            startPos.set((Math.random()-0.5) * visibleWidth, -yBuffer, zDepth);
            velocity.set((Math.random()-0.5), speed, 0);
            break;
    }
    return { startPos, velocity, rotSpeed: { x: Math.random(), y: Math.random() }, limit: Math.max(xBuffer, yBuffer) + 5 };
  }, [viewport, camera]);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.position.addScaledVector(movement.velocity, delta);
    ref.current.rotation.x += movement.rotSpeed.x * delta;
    ref.current.rotation.y += movement.rotSpeed.y * delta;

    if (Math.abs(ref.current.position.x) > movement.limit || Math.abs(ref.current.position.y) > movement.limit) {
        onComplete();
    }
  });

  return (
    <mesh ref={ref} position={movement.startPos} scale={asteroidConfig.scale as [number, number, number]}>
      
      {/* RENDER GEOMETRY BASED ON TYPE */}
      {type === 0 && <dodecahedronGeometry args={[1.2, 1]} />} {/* Rounded Rock */}
      {type === 1 && <icosahedronGeometry args={[1.0, 0]} />}  {/* Jagged Shard */}
      {type === 2 && <octahedronGeometry args={[1.0, 0]} />}   {/* Blocky Ore */}

      <meshStandardMaterial 
        color={asteroidConfig.color} 
        roughness={asteroidConfig.roughness} 
        metalness={asteroidConfig.metalness} 
        flatShading={true} 
      />
    </mesh>
  );
};

// ==========================================
// 3. MANAGER
// ==========================================
const AsteroidManager = () => {
    const [phase, setPhase] = useState<'intro' | 'waiting' | 'floating'>('intro');
    const [spawnKey, setSpawnKey] = useState(0); 

    useEffect(() => {
        if (phase === 'waiting') {
            const delay = 4000 + Math.random() * 4000;
            const timer = setTimeout(() => {
                setSpawnKey(k => k + 1);
                setPhase('floating');
            }, delay);
            return () => clearTimeout(timer);
        }
    }, [phase]);

    return (
        <>
            <ambientLight intensity={0.5} />
            <directionalLight position={[15, 10, 5]} intensity={1.5} color="#ffddee" />
            <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#445566" />

            {phase === 'intro' && <IntroAsteroid onComplete={() => setPhase('waiting')} />}
            {phase === 'floating' && <FloatingAsteroid key={spawnKey} onComplete={() => setPhase('waiting')} />}
        </>
    );
};

// ==========================================
// 4. STAR FIELD (With Warp Color Shift)
// ==========================================
const StarField = (props: any) => {
  const ref = useRef<THREE.Points>(null);
  const { mouse, viewport } = useThree();
  const { isWarping } = useWarp();
  const speedRef = useRef(0);
  
  // Color reference for interpolation
  const colorRef = useRef(new THREE.Color("white"));

  const count = 5000;
  const [positions, initialColors] = useMemo(() => {
    const posArray = new Float32Array(count * 3);
    const colArray = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = 2 * Math.PI * Math.random();
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 20 + Math.random() * 25;
      posArray[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      posArray[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      posArray[i * 3 + 2] = r * Math.cos(phi);
      colArray[i * 3] = 1; colArray[i * 3 + 1] = 1; colArray[i * 3 + 2] = 1;
    }
    return [posArray, colArray];
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;
    
    // --- 1. ROTATION ---
    ref.current.rotation.x -= ROTATION_SPEED_X;
    ref.current.rotation.y -= ROTATION_SPEED_Y;

    // --- 2. WARP SPEED ---
    const targetSpeed = isWarping ? 50.0 : 0; 
    speedRef.current = THREE.MathUtils.lerp(speedRef.current, targetSpeed, 0.05);

    // --- 3. COLOR SHIFT (SICK IDEA) ---
    // Target Color: Cyan (#00ffff) when warping, White (#ffffff) when idle
    const targetColor = isWarping ? new THREE.Color("#00ffff") : new THREE.Color("#ffffff");
    colorRef.current.lerp(targetColor, 0.05);
    
    // Apply color to material (We access material as an array or single object)
    if (ref.current.material instanceof THREE.Material) {
        // @ts-ignore
        (ref.current.material as THREE.PointsMaterial).color.copy(colorRef.current);
    }

    // --- 4. MOVEMENT ---
    if (speedRef.current > 0.1) {
        const positions = ref.current.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < count; i++) {
            positions[i * 3 + 2] += speedRef.current * delta;
            if (positions[i * 3 + 2] > -1) {
                positions[i * 3 + 2] = -50; 
                positions[i * 3] = (Math.random() - 0.5) * 400; 
                positions[i * 3 + 1] = (Math.random() - 0.5) * 400; 
            }
        }
        ref.current.geometry.attributes.position.needsUpdate = true;
    }

    // --- 5. PARALLAX ---
    if (!isWarping) {
        const x = (mouse.x * viewport.width) / 50;
        const y = (mouse.y * viewport.height) / 50;
        ref.current.rotation.x += y * 0.001;
        ref.current.rotation.y += x * 0.001;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={positions} colors={initialColors} stride={3} frustumCulled={false}>
        {/* Removed vertexColors so we can tint the whole material uniformly for the warp effect */}
        <PointMaterial
          transparent
          color="#ffffff" 
          size={0.1}
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