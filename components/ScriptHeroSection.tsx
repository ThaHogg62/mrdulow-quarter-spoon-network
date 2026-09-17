import React, { useRef, useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { ArrowRight, Sparkles, Shield } from 'lucide-react';
import { SkiperButton } from '../lib/vibe-coder/skiper40';
import WebGLFallbackBoundary from './WebGLFallbackBoundary';

/**
 * Procedural embroidered 'Q.S.N.' texture generator
 * Renders high-resolution white embroidered lettering with tactical glow
 */
function useQsnEmbroideredTexture() {
  return useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, 512, 256);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 110px "Courier New", monospace, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Embroidered stitching glow effect
      ctx.shadowColor = 'rgba(0, 68, 255, 0.9)';
      ctx.shadowBlur = 14;
      ctx.fillText('Q.S.N.', 256, 128);
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

// 3D Creature wearing Navy Blue Fitted Cap with 'Q.S.N.' embroidered in white on front (NO halo)
function CreatureCreature({ mousePos }: { mousePos: { x: number; y: number } }) {
  const headRef = useRef<THREE.Group>(null);
  const leftEyeRef = useRef<THREE.Mesh>(null);
  const rightEyeRef = useRef<THREE.Mesh>(null);
  const leftPupilRef = useRef<THREE.Mesh>(null);
  const rightPupilRef = useRef<THREE.Mesh>(null);

  const qsnTexture = useQsnEmbroideredTexture();

  useFrame((state, delta) => {
    // Smooth 60/120 FPS damping tracking toward normalized cursor coordinates
    const targetRotX = -mousePos.y * 0.45;
    const targetRotY = mousePos.x * 0.55;

    if (headRef.current) {
      headRef.current.rotation.x = THREE.MathUtils.damp(headRef.current.rotation.x, targetRotX, 4, delta);
      headRef.current.rotation.y = THREE.MathUtils.damp(headRef.current.rotation.y, targetRotY, 4, delta);
      headRef.current.position.y = THREE.MathUtils.damp(
        headRef.current.position.y,
        Math.sin(state.clock.elapsedTime * 1.5) * 0.08,
        3,
        delta
      );
    }

    // Dynamic eye / pupil tracking with amplified responsive damping
    const eyeRotX = -mousePos.y * 0.75;
    const eyeRotY = mousePos.x * 0.85;

    if (leftEyeRef.current) {
      leftEyeRef.current.rotation.x = THREE.MathUtils.damp(leftEyeRef.current.rotation.x, eyeRotX, 8, delta);
      leftEyeRef.current.rotation.y = THREE.MathUtils.damp(leftEyeRef.current.rotation.y, eyeRotY, 8, delta);
    }
    if (rightEyeRef.current) {
      rightEyeRef.current.rotation.x = THREE.MathUtils.damp(rightEyeRef.current.rotation.x, eyeRotX, 8, delta);
      rightEyeRef.current.rotation.y = THREE.MathUtils.damp(rightEyeRef.current.rotation.y, eyeRotY, 8, delta);
    }

    if (leftPupilRef.current) {
      leftPupilRef.current.position.x = THREE.MathUtils.damp(leftPupilRef.current.position.x, mousePos.x * 0.06 - 0.28, 9, delta);
      leftPupilRef.current.position.y = THREE.MathUtils.damp(leftPupilRef.current.position.y, mousePos.y * 0.06 + 0.15, 9, delta);
    }
    if (rightPupilRef.current) {
      rightPupilRef.current.position.x = THREE.MathUtils.damp(rightPupilRef.current.position.x, mousePos.x * 0.06 + 0.28, 9, delta);
      rightPupilRef.current.position.y = THREE.MathUtils.damp(rightPupilRef.current.position.y, mousePos.y * 0.06 + 0.15, 9, delta);
    }
  });

  return (
    <group ref={headRef} position={[0, 0, 0]}>
      {/* Creature Skull / Body Structure - Polished Midnight Noir */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#0F172A"
          metalness={0.88}
          roughness={0.2}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* NAVY BLUE FITTED CAP - CROWN / DOME */}
      <mesh position={[0, 0.24, -0.04]} rotation={[-0.1, 0, 0]}>
        <sphereGeometry args={[1.045, 64, 32, 0, Math.PI * 2, 0, Math.PI * 0.52]} />
        <meshStandardMaterial
          color="#0A265E"
          roughness={0.55}
          metalness={0.25}
        />
      </mesh>

      {/* NAVY BLUE FITTED CAP - FLAT BRIM / VISOR */}
      <mesh position={[0, 0.38, 0.96]} rotation={[0.22, 0, 0]}>
        <boxGeometry args={[1.2, 0.045, 0.68]} />
        <meshStandardMaterial
          color="#071D47"
          roughness={0.5}
          metalness={0.3}
        />
      </mesh>

      {/* NAVY BLUE FITTED CAP - TOP BUTTON (SQUATCHEE) */}
      <mesh position={[0, 1.28, -0.14]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#0A265E" roughness={0.4} metalness={0.3} />
      </mesh>

      {/* WHITE 'Q.S.N.' EMBROIDERED FRONT PANEL */}
      {qsnTexture && (
        <mesh position={[0, 0.74, 0.8]} rotation={[-0.18, 0, 0]}>
          <planeGeometry args={[0.82, 0.4]} />
          <meshBasicMaterial
            map={qsnTexture}
            transparent
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Cybernetic Visor / Eye Sockets */}
      <mesh position={[0, 0.15, 0.82]}>
        <boxGeometry args={[1.05, 0.42, 0.2]} />
        <meshStandardMaterial color="#000000" roughness={0.1} metalness={0.9} />
      </mesh>

      {/* Left Eye Globe */}
      <mesh ref={leftEyeRef} position={[-0.28, 0.15, 0.88]}>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.05} roughness={0.15} />
      </mesh>
      {/* Left Pupil (Electric Glowing Navy Blue Core) */}
      <mesh ref={leftPupilRef} position={[-0.28, 0.15, 1.02]}>
        <sphereGeometry args={[0.075, 32, 32]} />
        <meshStandardMaterial
          color="#0044FF"
          emissive="#0044FF"
          emissiveIntensity={3.8}
          toneMapped={false}
        />
      </mesh>

      {/* Right Eye Globe */}
      <mesh ref={rightEyeRef} position={[0.28, 0.15, 0.88]}>
        <sphereGeometry args={[0.16, 32, 32]} />
        <meshStandardMaterial color="#FFFFFF" metalness={0.05} roughness={0.15} />
      </mesh>
      {/* Right Pupil (Electric Glowing Navy Blue Core) */}
      <mesh ref={rightPupilRef} position={[0.28, 0.15, 1.02]}>
        <sphereGeometry args={[0.075, 32, 32]} />
        <meshStandardMaterial
          color="#0044FF"
          emissive="#0044FF"
          emissiveIntensity={3.8}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export const ScriptHeroSection: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [rawMouse, setRawMouse] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);

    const handleMouseMove = (e: MouseEvent) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      setMousePos({ x: normX, y: normY });
      setRawMouse({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (!isClient) {
    return (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <img src="/HOME PAGE.jpeg" alt="Quarter Spoon Network Hero" className="w-full h-full object-contain" />
      </div>
    );
  }

  return (
    <section className="relative w-full min-h-screen text-white flex flex-col justify-between overflow-hidden px-6 md:px-12 pt-28 md:pt-32 pb-16 select-none bg-transparent">
      {/* High-Resolution Symmetrical HOME PAGE.jpeg Background Layer - Soft Atmospheric Noir */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-35 transition-opacity duration-700"
        style={{
          backgroundImage: "url('/assets/HOME%20PAGE.jpeg')",
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* 260px Soft-Feathered Glowing Radial-Gradient Spotlight Reveal Mask */}
      <div
        className="spotlight-reveal-mask fixed inset-0 z-20 pointer-events-none transition-transform duration-75 ease-out"
        style={{
          ['--mouse-x' as any]: `${rawMouse.x}px`,
          ['--mouse-y' as any]: `${rawMouse.y}px`,
        }}
      />

      {/* Subtle Electric Ambient Accents */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B132B]/20 to-black/85 pointer-events-none z-10" />

      {/* Header Top Sub-Bar */}
      <div className="relative z-30 flex items-center justify-between w-full max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg border border-white/20 bg-[#0B132B]/80 backdrop-blur-md flex items-center justify-center font-mono font-bold text-xs text-[#0044FF] shadow-[0_0_15px_rgba(0,68,255,0.3)]">
            QS
          </div>
          <span className="font-mono text-xs tracking-widest text-white uppercase drop-shadow-md">
            QUARTER SPOON // CREATURE ENGINE
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 font-mono text-[11px] text-white border border-white/20 px-3.5 py-1.5 rounded-full bg-[#0B132B]/80 backdrop-blur-md shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#0044FF] animate-pulse" />
            <span>60/120 FPS EYE TRACKING ACTIVE</span>
          </div>
        </div>
      </div>

      {/* 3D Canvas Center Stage - WebGL Context Guarded with Fallback Boundary */}
      <div className="relative z-20 w-full h-[54vh] min-h-[420px] max-h-[620px] flex items-center justify-center my-auto">
        <WebGLFallbackBoundary fallbackImage="/HOME PAGE.jpeg" fallbackImageSrc="/HOME PAGE.jpeg">
          {isClient && (
            <Canvas
              camera={{ position: [0, 0, 3.2], fov: 45 }}
              className="w-full h-full"
              style={{ background: 'transparent' }}
              gl={{
                alpha: true,
                antialias: true,
                powerPreference: 'high-performance',
                failIfMajorPerformanceCaveat: false,
                preserveDrawingBuffer: false,
              }}
              onCreated={({ gl }) => {
                gl.domElement.addEventListener('webglcontextlost', (e) => {
                  e.preventDefault();
                  console.warn('WebGL Context Lost. Attempting restoration...');
                });
              }}
            >
              <ambientLight intensity={1.4} />
              <directionalLight position={[0, 4, 5]} intensity={2.5} color="#FFFFFF" />
              <directionalLight position={[-4, 2, 4]} intensity={1.8} color="#94A3B8" />
              <pointLight position={[3, 2, 2]} intensity={2.4} color="#0044FF" />
              <pointLight position={[-3, -1, 2]} intensity={2.2} color="#0033CC" />
              <pointLight position={[0, 0, 3.5]} intensity={1.8} color="#0044FF" />
              <Float speed={1.8} rotationIntensity={0.15} floatIntensity={0.25}>
                <CreatureCreature mousePos={mousePos} />
              </Float>
              <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 2.5} />
            </Canvas>
          )}
        </WebGLFallbackBoundary>
      </div>

      {/* Headline & Asymmetric Editorial Typography */}
      <div className="relative z-30 w-full max-w-7xl mx-auto flex flex-col md:flex-row items-end justify-between gap-8 pb-4">
        <div className="max-w-3xl text-left">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#0044FF] tracking-widest uppercase mb-3 px-3.5 py-1 rounded-full bg-black/75 border border-[#0044FF]/40 backdrop-blur-md shadow-[0_0_20px_rgba(0,68,255,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-[#0044FF]" />
            <span>WE GOT U COVERED</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter text-white uppercase leading-none mb-4 drop-shadow-[0_4px_30px_rgba(0,68,255,0.4)]">
            QUARTER <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E2E8F0] to-[#0044FF]">
              SPOON
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-white font-bold tracking-tight mb-2 flex items-center gap-2 drop-shadow-md">
            <span>WE GOT U COVERED</span>
            <span className="text-[#0044FF] font-mono text-xs border border-[#0044FF]/40 px-2 py-0.5 rounded bg-[#0B132B]/80 font-bold">
              OFFICIAL UMBRELLA
            </span>
          </p>

          <p className="text-sm md:text-base text-[#E2E8F0] font-normal leading-relaxed max-w-xl drop-shadow-sm">
            Enter a world where creatures come alive. An immersive world of curious creatures, magical places, and stories waiting to be discovered.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <SkiperButton
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0044FF] text-white font-black hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(0,68,255,0.5)] tracking-widest text-xs border border-white/20"
            glowColor="#0044FF"
            onClick={() => {
              const el = document.getElementById('storytelling-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <span>OPEN THE UMBRELLA</span>
            <ArrowRight className="w-4 h-4" />
          </SkiperButton>

          <Link
            href="/portals"
            className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/25 bg-[#0B132B]/90 backdrop-blur-md text-white hover:border-[#0044FF] hover:text-[#0044FF] transition-all font-bold tracking-widest text-xs shadow-lg flex items-center justify-center gap-2"
          >
            <span>ELEVATE YOUR BUSINESS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ScriptHeroSection;
