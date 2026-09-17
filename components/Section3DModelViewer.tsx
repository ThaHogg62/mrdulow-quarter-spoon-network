import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls, MeshRefractionMaterial } from '@react-three/drei';
import * as THREE from 'three';
import WebGLFallbackBoundary, { checkWebGLSupport } from './WebGLFallbackBoundary';

export type MiniSiteAssetType =
  | 'camera_rig'
  | 'glass_prism'
  | 'tactical_tablet'
  | 'apparel_rail'
  | 'chrome_cassette';

// 1. 3D Cybernetic Anamorphic Camera Rig Asset (Unda Tha Radar Filmz)
function CameraRigModel() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.4;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.8) * 0.08;
    }
  });

  return (
    <group ref={group}>
      {/* Camera Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.4, 0.9, 1.2]} />
        <meshStandardMaterial color="#0B132B" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Anamorphic Cylinder Lens */}
      <mesh position={[0, 0, 0.85]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.42, 0.48, 0.8, 32]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Blue Lens Glass Element */}
      <mesh position={[0, 0, 1.26]}>
        <circleGeometry args={[0.38, 32]} />
        <meshStandardMaterial
          color="#0044FF"
          emissive="#0044FF"
          emissiveIntensity={1.8}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Top Handle & Cybernetic Rigging Rails */}
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[0.3, 0.15, 1.1]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.9} roughness={0.15} />
      </mesh>
      {/* Side Monitor Screen */}
      <mesh position={[-0.85, 0.1, 0.2]} rotation={[0, -0.4, 0]}>
        <boxGeometry args={[0.08, 0.6, 0.8]} />
        <meshStandardMaterial color="#0044FF" emissive="#0044FF" emissiveIntensity={0.6} />
      </mesh>
    </group>
  );
}

// 2. 3D Refractive Glass Prism & Wireframe (Tha Visual Lab)
function GlassPrismModel() {
  const prismRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (prismRef.current) {
      prismRef.current.rotation.y += delta * 0.6;
      prismRef.current.rotation.z += delta * 0.3;
    }
    if (wireframeRef.current) {
      wireframeRef.current.rotation.y -= delta * 0.4;
      wireframeRef.current.rotation.x += delta * 0.3;
    }
  });

  return (
    <group>
      {/* Central Prism Icosahedron */}
      <mesh ref={prismRef}>
        <icosahedronGeometry args={[1, 0]} />
        <meshPhysicalMaterial
          color="#94A3B8"
          transmission={0.92}
          opacity={1}
          transparent
          roughness={0.05}
          ior={1.7}
          metalness={0.1}
          thickness={1.5}
        />
      </mesh>
      {/* Exterior Electric-Blue Wireframe Cage */}
      <mesh ref={wireframeRef}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial
          color="#0044FF"
          wireframe
          emissive="#0044FF"
          emissiveIntensity={1.4}
        />
      </mesh>
    </group>
  );
}

// 3. 3D Tactical Glass Tablet & 10-Min Lease Slot Lock (On Tha Spot Consulting)
function TacticalTabletModel() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.25;
      group.current.rotation.x = 0.2 + Math.cos(state.clock.elapsedTime * 0.5) * 0.08;
    }
  });

  return (
    <group ref={group}>
      {/* Tablet Chasis */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 1.2, 0.08]} />
        <meshStandardMaterial color="#0B132B" metalness={0.95} roughness={0.15} />
      </mesh>
      {/* Glowing Tactical HUD Screen */}
      <mesh position={[0, 0, 0.045]}>
        <planeGeometry args={[1.65, 1.05]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#0044FF"
          emissiveIntensity={0.4}
          roughness={0.2}
        />
      </mesh>
      {/* Holographic Lock Ring */}
      <mesh position={[0, 0, 0.18]} rotation={[0, 0, 0]}>
        <ringGeometry args={[0.25, 0.3, 32]} />
        <meshStandardMaterial
          color="#0044FF"
          emissive="#0044FF"
          emissiveIntensity={2.5}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Metallic Chrome Edges */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.84, 1.24, 0.04]} />
        <meshStandardMaterial color="#94A3B8" metalness={1} roughness={0.05} />
      </mesh>
    </group>
  );
}

// 4. 3D Anodized Apparel Rail & Chrome Seal (Off Tha Grid Custom Teez)
function ApparelRailModel() {
  const group = useRef<THREE.Group>(null);
  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={group}>
      {/* Apparel Hanger Bar */}
      <mesh position={[0, 0.6, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 1.8, 16]} />
        <meshStandardMaterial color="#94A3B8" metalness={0.95} roughness={0.1} />
      </mesh>
      {/* Streetwear Silhouette / Shirt Form */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.1, 1.1, 0.2]} />
        <meshStandardMaterial color="#000000" roughness={0.6} metalness={0.2} />
      </mesh>
      {/* Anodized Chrome Seal Emblem */}
      <mesh position={[0, 0.1, 0.11]}>
        <circleGeometry args={[0.22, 32]} />
        <meshStandardMaterial
          color="#94A3B8"
          metalness={1}
          roughness={0.08}
          emissive="#0044FF"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

// 5. 3D Chrome Cassette Audio Core (Tha Hoggz Muzicc Stow)
function ChromeCassetteModel() {
  const group = useRef<THREE.Group>(null);
  const leftSpool = useRef<THREE.Mesh>(null);
  const rightSpool = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (group.current) {
      group.current.rotation.y += delta * 0.45;
      group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.1;
    }
    if (leftSpool.current && rightSpool.current) {
      leftSpool.current.rotation.z += delta * 2.5;
      rightSpool.current.rotation.z += delta * 2.5;
    }
  });

  return (
    <group ref={group}>
      {/* Cassette Outer Shell */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1.7, 1.1, 0.18]} />
        <meshStandardMaterial
          color="#0B132B"
          metalness={0.92}
          roughness={0.15}
        />
      </mesh>
      {/* Chrome Tape Window */}
      <mesh position={[0, -0.05, 0.01]}>
        <boxGeometry args={[1.1, 0.5, 0.2]} />
        <meshStandardMaterial
          color="#94A3B8"
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.7}
        />
      </mesh>
      {/* Left Tape Spool */}
      <mesh ref={leftSpool} position={[-0.35, -0.05, 0.05]}>
        <torusGeometry args={[0.15, 0.03, 16, 24]} />
        <meshStandardMaterial color="#0044FF" emissive="#0044FF" emissiveIntensity={1.8} />
      </mesh>
      {/* Right Tape Spool */}
      <mesh ref={rightSpool} position={[0.35, -0.05, 0.05]}>
        <torusGeometry args={[0.15, 0.03, 16, 24]} />
        <meshStandardMaterial color="#0044FF" emissive="#0044FF" emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
}

export interface Section3DModelViewerProps {
  assetType: MiniSiteAssetType;
  className?: string;
}

export const Section3DModelViewer: React.FC<Section3DModelViewerProps> = ({
  assetType,
  className = 'w-full h-64',
}) => {
  const [mounted, setMounted] = useState(false);
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
    setWebGLSupported(checkWebGLSupport());
  }, []);

  if (!mounted) {
    return (
      <div className={`flex items-center justify-center bg-[#0B132B]/30 border border-white/10 rounded-xl ${className}`}>
        <span className="font-mono text-xs text-[#94A3B8] animate-pulse">LOADING 3D ASSET...</span>
      </div>
    );
  }

  const renderAsset = () => {
    switch (assetType) {
      case 'camera_rig':
        return <CameraRigModel />;
      case 'glass_prism':
        return <GlassPrismModel />;
      case 'tactical_tablet':
        return <TacticalTabletModel />;
      case 'apparel_rail':
        return <ApparelRailModel />;
      case 'chrome_cassette':
        return <ChromeCassetteModel />;
      default:
        return <CameraRigModel />;
    }
  };

  return (
    <div className={`relative rounded-xl overflow-hidden bg-[#000000] border border-white/10 ${className}`}>
      <WebGLFallbackBoundary fallbackImageSrc="/assets/LOGO%20POSTER%20QSE%20UMBRELLA.jpeg">
        {mounted && webGLSupported && (
          <Canvas
            camera={{ position: [0, 0, 3], fov: 45 }}
            gl={{
              antialias: true,
              alpha: true,
              powerPreference: 'default',
              failIfMajorPerformanceCaveat: false,
              preserveDrawingBuffer: false,
            }}
            onCreated={({ gl }) => {
              gl.domElement.addEventListener('webglcontextlost', (e) => {
                e.preventDefault();
                console.warn('WebGL Context Lost in Section3DModelViewer. Triggering restoration...');
              });
            }}
          >
            <ambientLight intensity={0.4} />
            <directionalLight position={[4, 5, 4]} intensity={1.5} color="#FFFFFF" />
            <pointLight position={[-3, -2, -2]} intensity={2} color="#0044FF" />
            <pointLight position={[2, 3, -1]} intensity={1.2} color="#94A3B8" />
            <Float speed={1.8} rotationIntensity={0.25} floatIntensity={0.35}>
              {renderAsset()}
            </Float>
            <OrbitControls enableZoom={false} autoRotate={false} />
          </Canvas>
        )}
      </WebGLFallbackBoundary>
    </div>
  );
};

export default Section3DModelViewer;
