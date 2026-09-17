import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, ArrowDown, Disc, Shield, ExternalLink } from 'lucide-react';
import { Liveline } from 'liveline';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

type PlaybackMode = 'idle' | 'playing';

export const ScrollStorytellingSection: React.FC = () => {
  const outerSectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [virtualProgress, setVirtualProgress] = useState<number>(0);
  const [interpolatedProgress, setInterpolatedProgress] = useState<number>(0);
  const [isVirtualActive, setIsVirtualActive] = useState<boolean>(false);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('idle');
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [fadeOpacity, setFadeOpacity] = useState<number>(0);
  const [vuLevels, setVuLevels] = useState({ left: 78, right: 72 });

  const progressRef = useRef<number>(0);
  const isVirtualActiveRef = useRef<boolean>(false);
  const animProgressObj = useRef({ value: 0 });

  // Synchronize refs with state for asynchronous event handlers
  useEffect(() => {
    progressRef.current = virtualProgress;
  }, [virtualProgress]);

  useEffect(() => {
    isVirtualActiveRef.current = isVirtualActive;
  }, [isVirtualActive]);

  // 84 BPM G-Funk cadence simulation for audio telemetry
  useEffect(() => {
    const bpmInterval = setInterval(() => {
      const base = 55 + Math.random() * 40;
      setVuLevels({
        left: Math.min(100, Math.floor(base + Math.random() * 8)),
        right: Math.min(100, Math.floor(base - Math.random() * 6)),
      });
    }, 357);

    return () => clearInterval(bpmInterval);
  }, []);

  // 1. GSAP ScrollTrigger Viewport Pinning
  // IMPORTANT: Pin the INNER stageRef, NOT the outerSectionRef root element
  // This preserves React's top-level DOM hierarchy and prevents 'insertBefore' reconciliation errors
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const outer = outerSectionRef.current;
    const stage = stageRef.current;
    if (!outer || !stage) return;

    const st = ScrollTrigger.create({
      trigger: outer,
      pin: stage,
      pinType: 'fixed',
      start: 'top top',
      end: '+=1800',
      scrub: 0.5,
      anticipatePin: 1,
      onEnter: () => {
        setIsVirtualActive(true);
        isVirtualActiveRef.current = true;
        document.body.style.overflow = 'hidden';
      },
      onEnterBack: () => {
        setIsVirtualActive(true);
        isVirtualActiveRef.current = true;
        document.body.style.overflow = 'hidden';
      },
      onLeaveBack: () => {
        setIsVirtualActive(false);
        isVirtualActiveRef.current = false;
        document.body.style.overflow = '';
      },
    });

    return () => {
      st.kill();
      document.body.style.overflow = '';
    };
  }, []);

  // 2. Virtual Scroll Drive: wheel and touch delta drive virtualProgress (0.0 to 1.0)
  // window.scrollY does NOT advance while the expansion sequence is active
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (!isVirtualActiveRef.current) return;

      // If user scrolls up and progress is already at 0, allow scrolling back up to Hero
      if (e.deltaY < 0 && progressRef.current <= 0.001) {
        document.body.style.overflow = '';
        setIsVirtualActive(false);
        isVirtualActiveRef.current = false;
        window.scrollBy({ top: -120, behavior: 'smooth' });
        return;
      }

      // Lock document scroll and consume delta
      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY > 0 ? 0.045 : -0.045;
      const next = Math.min(1, Math.max(0, progressRef.current + delta));

      setVirtualProgress(next);
      progressRef.current = next;

      gsap.to(animProgressObj.current, {
        value: next,
        duration: 0.35,
        ease: 'power2.out',
        onUpdate: () => {
          setInterpolatedProgress(animProgressObj.current.value);
        },
      });
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isVirtualActiveRef.current) return;

      const currentY = e.touches[0].clientY;
      const deltaY = touchStartY - currentY;
      touchStartY = currentY;

      // Scroll up release
      if (deltaY < 0 && progressRef.current <= 0.001) {
        document.body.style.overflow = '';
        setIsVirtualActive(false);
        isVirtualActiveRef.current = false;
        window.scrollBy({ top: -120, behavior: 'smooth' });
        return;
      }

      if (Math.abs(deltaY) > 1) {
        e.preventDefault();
        const delta = deltaY > 0 ? 0.05 : -0.05;
        const next = Math.min(1, Math.max(0, progressRef.current + delta));

        setVirtualProgress(next);
        progressRef.current = next;

        gsap.to(animProgressObj.current, {
          value: next,
          duration: 0.35,
          ease: 'power2.out',
          onUpdate: () => {
            setInterpolatedProgress(animProgressObj.current.value);
          },
        });
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      document.body.style.overflow = '';
    };
  }, []);

  // Video playback time update: linear fade-to-black from t = 0.08s to t = 10.0s
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const t = videoRef.current.currentTime;
    setCurrentTime(t);

    if (t < 0.08) {
      setFadeOpacity(0);
    } else if (t >= 10.0) {
      setFadeOpacity(1);
      document.body.style.overflow = '';
      window.location.href = 'https://www.youtube.com/@SeenYouScream';
    } else {
      const progress = (t - 0.08) / (10.0 - 0.08);
      setFadeOpacity(Math.min(1, Math.max(0, progress)));
    }
  };

  const handleVideoEnded = () => {
    setFadeOpacity(1);
    document.body.style.overflow = '';
    window.location.href = 'https://www.youtube.com/@SeenYouScream';
  };

  const handleEnterNetwork = () => {
    setPlaybackMode('playing');
    setFadeOpacity(0);
    setCurrentTime(0);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch((err) => {
          console.warn('Video auto-playback blocked, redirecting directly to YouTube:', err);
          document.body.style.overflow = '';
          window.location.href = 'https://www.youtube.com/@SeenYouScream';
        });
      }
    }, 60);
  };

  const isFullView = interpolatedProgress >= 0.98;
  const sideBoxesOpacity = Math.max(0, 1 - interpolatedProgress * 2.5);
  const instructionOpacity = Math.max(0, 1 - interpolatedProgress * 2.2);

  return (
    <section
      id="storytelling-section"
      ref={outerSectionRef}
      className="relative w-full h-screen bg-[#000000] text-white select-none overflow-hidden"
    >
      {/* Ambient background atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#0B132B]/30 to-[#000000] pointer-events-none" />

      {/* Pinned Stage Container (Pinned by GSAP ScrollTrigger) */}
      <div
        ref={stageRef}
        className="relative w-full h-full flex items-center justify-center px-4 md:px-8 overflow-hidden z-20"
      >
        {/* REPOSITIONED EDITORIAL & TELEMETRY BOXES */}
        {/* Placement: Positioned on the left side, directly UNDER the text line: '84 BPM G FUNK CADENCE' */}
        <div
          style={{
            opacity: sideBoxesOpacity,
            pointerEvents: interpolatedProgress > 0.35 ? 'none' : 'auto',
          }}
          className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col max-w-sm gap-4 text-left transition-opacity duration-150"
        >
          {/* Editorial Headline */}
          <div>
            <span className="font-mono text-[11px] text-[#0044FF] tracking-[0.25em] uppercase block mb-1 font-bold">
              ACT I // ANALOG CUTSCENE
            </span>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-tight">
              84 BPM <br />
              G FUNK CADENCE
            </h2>
          </div>

          {/* BOX 1: Directly UNDER '84 BPM G FUNK CADENCE' */}
          {/* Content: Analog cassette head telemetry and 40Hz Moog sub-bass acoustics */}
          <div className="p-4 rounded-xl bg-[#05070F]/90 border border-white/15 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between font-mono text-[11px] text-[#94A3B8] mb-2.5 pb-2 border-b border-white/10">
              <span className="flex items-center gap-2 text-white font-bold">
                <Disc className="w-3.5 h-3.5 text-[#0044FF] animate-spin" />
                <span>JVC MK-IV AUTO-REVERSE</span>
              </span>
              <span className="text-[#0044FF] font-bold">40Hz MOOG</span>
            </div>

            <p className="text-[11px] text-[#94A3B8] leading-relaxed mb-3">
              Analog cassette head telemetry and 40Hz Moog sub-bass acoustics bathed in warm tungsten key light. Pure analog resonance.
            </p>

            {/* Bouncing VU Meters at 84 BPM */}
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-[#94A3B8] w-3">L</span>
                <div className="flex-1 h-1.5 bg-black rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-[#0033CC] via-[#0044FF] to-white transition-all duration-150"
                    style={{ width: `${vuLevels.left}%` }}
                  />
                </div>
                <span className="font-mono text-[9px] text-[#0044FF] w-6 text-right">
                  {vuLevels.left}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-[#94A3B8] w-3">R</span>
                <div className="flex-1 h-1.5 bg-black rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-[#0033CC] via-[#0044FF] to-white transition-all duration-150"
                    style={{ width: `${vuLevels.right}%` }}
                  />
                </div>
                <span className="font-mono text-[9px] text-[#0044FF] w-6 text-right">
                  {vuLevels.right}%
                </span>
              </div>
            </div>

            {/* Liveline Waveform */}
            <div className="w-full h-8 bg-black/80 rounded border border-white/5 mt-2.5 overflow-hidden">
              <Liveline
                value={vuLevels.left}
                data={[
                  { time: 1, value: vuLevels.left },
                  { time: 2, value: vuLevels.right },
                  { time: 3, value: Math.round(vuLevels.left * 0.9) },
                  { time: 4, value: Math.round(vuLevels.right * 1.05) },
                ]}
                color="#0044FF"
                badge={false}
                grid={false}
              />
            </div>
          </div>

          {/* BOX 2: Directly UNDER Box 1 */}
          {/* Content: Spatial Cartesian coordinates and high-bitrate video stream specs */}
          <div className="p-4 rounded-xl bg-[#05070F]/90 border border-white/15 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between font-mono text-[10px] text-[#94A3B8] mb-2 pb-1.5 border-b border-white/10">
              <span className="flex items-center gap-1.5 text-white font-bold">
                <Shield className="w-3.5 h-3.5 text-[#0044FF]" />
                <span>SPATIAL VECTOR LOCK</span>
              </span>
              <span className="text-[#0044FF] font-bold">300 FRAMES</span>
            </div>

            <div className="bg-black/60 rounded px-2.5 py-1.5 border border-white/10 mb-2 font-mono text-[11px] text-white">
              OLED COORD: <span className="text-[#0044FF]">[-0.45, 0.62, 0.10]</span>
            </div>

            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Spatial Cartesian coordinates and high-bitrate video stream specs. Vector-locked typography with zero character morphing or character bleed.
            </p>
          </div>
        </div>

        {/* CENTER IMAGE CONTAINER: CUTSCENE.jpeg */}
        {/* Dynamic expansion from 9:16 portrait ratio (360x640) to full 16:9 viewport scale (100vw x 100vh) */}
        <div
          style={{
            width: interpolatedProgress >= 0.99
              ? '100vw'
              : `calc(min(360px, calc(100vw - 32px)) + (100vw - min(360px, calc(100vw - 32px))) * ${interpolatedProgress})`,
            height: interpolatedProgress >= 0.99
              ? '100vh'
              : `calc(min(640px, calc(100vh - 120px)) + (100vh - min(640px, calc(100vh - 120px))) * ${interpolatedProgress})`,
            borderRadius: interpolatedProgress >= 0.99
              ? '0px'
              : `calc(20px * (1 - ${interpolatedProgress}))`,
            maxWidth: interpolatedProgress >= 0.99 ? '100vw' : '100%',
            maxHeight: interpolatedProgress >= 0.99 ? '100vh' : '100%',
          }}
          className="relative bg-[#05070F] border border-white/20 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.95)] flex items-center justify-center transition-[border-radius] duration-150"
        >
          {/* STATIC CUTSCENE IMAGE LAYER - ALWAYS MOUNTED */}
          <div
            style={{
              opacity: playbackMode === 'playing' ? 0 : 1,
              pointerEvents: playbackMode === 'playing' ? 'none' : 'auto',
            }}
            className="relative w-full h-full overflow-hidden transition-opacity duration-300"
          >
            {/* 100% CLEAN, UNOBSTRUCTED CUTSCENE.jpeg - ZERO OVERLAY BOXES */}
            <Image
              src="/assets/CUTSCENE.jpeg"
              alt="Quarter Spoon Cutscene"
              fill
              priority
              className="object-cover object-center z-0 opacity-100"
            />

            {/* USER SCROLL INSTRUCTION - CSS OPACITY CONTROLLED */}
            <div
              style={{
                opacity: isFullView ? 0 : instructionOpacity,
                pointerEvents: isFullView ? 'none' : 'auto',
                transition: 'opacity 0.2s ease',
              }}
              className="absolute bottom-6 inset-x-0 z-30 flex flex-col items-center justify-center"
            >
              <div className="px-5 py-2.5 rounded-full bg-black/85 border border-[#0044FF]/60 shadow-[0_0_25px_rgba(0,68,255,0.4)] backdrop-blur-md flex items-center gap-2 animate-pulse">
                <span className="font-mono text-[11px] font-bold text-white uppercase tracking-wider">
                  SCROLL DOWN TO REVEAL FULL VIEW &amp; ENTER THE NETWORK
                </span>
                <ArrowDown className="w-3.5 h-3.5 text-[#0044FF] animate-bounce" />
              </div>
            </div>

            {/* 3. CTA BUTTON: ENTER THE NETWORK - STABLE CSS TRANSITION */}
            <div
              style={{
                opacity: isFullView ? 1 : 0,
                pointerEvents: isFullView ? 'auto' : 'none',
                transform: isFullView ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.92)',
                transition: 'opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1), transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              className="absolute bottom-8 left-8 md:left-12 z-30 flex items-center gap-4"
            >
              <button
                type="button"
                onClick={handleEnterNetwork}
                className="px-8 py-4 rounded-xl bg-[#0044FF] text-white font-mono font-black text-sm uppercase tracking-widest flex items-center gap-3 hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_40px_rgba(0,68,255,0.7)] cursor-pointer group border border-white/20"
              >
                <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                <span>ENTER THE NETWORK</span>
              </button>

              <a
                href="https://www.youtube.com/@SeenYouScream"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-5 py-4 rounded-xl bg-black/80 border border-white/20 text-[#94A3B8] font-mono text-xs uppercase tracking-wider hover:text-white hover:border-[#0044FF] transition-all"
              >
                <span>DIRECT STREAM</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#0044FF]" />
              </a>
            </div>
          </div>

          {/* PLAYBACK MODE: QS UMBRELLA CUT SCENE.mp4 - STABLE CSS MOUNT */}
          <div
            style={{
              opacity: playbackMode === 'playing' ? 1 : 0,
              pointerEvents: playbackMode === 'playing' ? 'auto' : 'none',
            }}
            className="absolute inset-0 z-40 bg-black transition-opacity duration-300"
          >
            <video
              ref={videoRef}
              src="/assets/QS%20UMBRELLA%20CUT%20SCENE.mp4"
              poster="/assets/CUTSCENE.jpeg"
              playsInline
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Exact Linear Fade-to-Black Transition from t = 0.08s to t = 10.0s */}
            <div
              className="absolute inset-0 bg-[#000000] pointer-events-none z-10 transition-opacity duration-75"
              style={{ opacity: fadeOpacity }}
            />

            {/* Top Stream Status */}
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between px-4 py-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="font-mono text-xs text-white tracking-widest uppercase">
                  QS CUT SCENE // TIMELINE: {currentTime.toFixed(2)}s / 10.0s
                </span>
              </div>

              <a
                href="https://www.youtube.com/@SeenYouScream"
                className="font-mono text-[11px] text-[#0044FF] hover:underline flex items-center gap-1"
              >
                <span>SKIP TO YOUTUBE</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollStorytellingSection;
