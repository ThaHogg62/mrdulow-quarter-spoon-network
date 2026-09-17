import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, ArrowDown, Disc, Shield, ExternalLink } from 'lucide-react';
import { Liveline } from 'liveline';

type PlaybackMode = 'idle' | 'playing';

export const ScrollStorytellingSection: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number>(0);
  const rawProgressRef = useRef(0);
  const smoothProgressRef = useRef(0);

  const [displayProgress, setDisplayProgress] = useState(0);
  const [playbackMode, setPlaybackMode] = useState<PlaybackMode>('idle');
  const [fadeOpacity, setFadeOpacity] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [vuLevels, setVuLevels] = useState({ left: 78, right: 72 });

  // 84 BPM G-Funk cadence VU simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const base = 55 + Math.random() * 40;
      setVuLevels({
        left: Math.min(100, Math.floor(base + Math.random() * 8)),
        right: Math.min(100, Math.floor(base - Math.random() * 6)),
      });
    }, 357);
    return () => clearInterval(interval);
  }, []);

  // Pure native scroll driver — no GSAP, no overflow manipulation.
  // Outer section is 600vh. We track how far user has scrolled through it (0->1).
  // rAF loop lerps smoothly toward the raw value each frame.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const computeProgress = () => {
      const rect = section.getBoundingClientRect();
      const scrollableHeight = section.offsetHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;
      const scrolled = -rect.top;
      rawProgressRef.current = Math.min(1, Math.max(0, scrolled / scrollableHeight));
    };

    const animate = () => {
      const diff = rawProgressRef.current - smoothProgressRef.current;
      if (Math.abs(diff) > 0.0001) {
        smoothProgressRef.current += diff * 0.12;
        setDisplayProgress(smoothProgressRef.current);
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', computeProgress, { passive: true });
    computeProgress();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', computeProgress);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const t = videoRef.current.currentTime;
    setCurrentTime(t);
    if (t < 0.08) {
      setFadeOpacity(0);
    } else if (t >= 10.0) {
      setFadeOpacity(1);
      window.location.href = 'https://www.youtube.com/@SeenYouScream';
    } else {
      setFadeOpacity(Math.min(1, Math.max(0, (t - 0.08) / (10.0 - 0.08))));
    }
  };

  const handleVideoEnded = () => {
    setFadeOpacity(1);
    window.location.href = 'https://www.youtube.com/@SeenYouScream';
  };

  const handleEnterNetwork = () => {
    setPlaybackMode('playing');
    setFadeOpacity(0);
    setCurrentTime(0);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {
          window.location.href = 'https://www.youtube.com/@SeenYouScream';
        });
      }
    }, 60);
  };

  const p = displayProgress;
  const isFullView = p >= 0.95;
  const sideBoxesOpacity = Math.max(0, 1 - p * 2.5);
  const instructionOpacity = Math.max(0, 1 - p * 2.2);

  const startW = 'min(360px, calc(100vw - 32px))';
  const startH = 'min(640px, calc(100vh - 120px))';
  const pf = p.toFixed(4);
  const cardWidth  = p >= 0.99 ? '100vw' : `calc(${startW} + (100vw - ${startW}) * ${pf})`;
  const cardHeight = p >= 0.99 ? '100vh' : `calc(${startH} + (100vh - ${startH}) * ${pf})`;
  const cardRadius = p >= 0.99 ? '0px'   : `calc(20px * ${(1 - p).toFixed(4)})`;

  return (
    <section
      id="storytelling-section"
      ref={sectionRef}
      className="relative w-full select-none"
      style={{ height: '600vh' }}
    >
      {/* Sticky inner viewport panel */}
      <div className="sticky top-0 w-full h-screen bg-[#000000] text-white overflow-hidden flex items-center justify-center">
        {/* Ambient atmosphere */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#000000] via-[#0B132B]/30 to-[#000000] pointer-events-none" />

        {/* Left editorial telemetry boxes */}
        <div
          style={{ opacity: sideBoxesOpacity, pointerEvents: p > 0.35 ? 'none' : 'auto' }}
          className="absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 z-20 hidden xl:flex flex-col max-w-sm gap-4 text-left"
        >
          <div>
            <span className="font-mono text-[11px] text-[#0044FF] tracking-[0.25em] uppercase block mb-1 font-bold">
              ACT I // ANALOG CUTSCENE
            </span>
            <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-tight">
              84 BPM <br />G FUNK CADENCE
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-[#05070F]/90 border border-white/15 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.8)]">
            <div className="flex items-center justify-between font-mono text-[11px] text-[#94A3B8] mb-2.5 pb-2 border-b border-white/10">
              <span className="flex items-center gap-2 text-white font-bold">
                <Disc className="w-3.5 h-3.5 text-[#0044FF] animate-spin" />
                <span>JVC MK-IV AUTO-REVERSE</span>
              </span>
              <span className="text-[#0044FF] font-bold">40Hz MOOG</span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed mb-3">
              Analog cassette head telemetry and 40Hz Moog sub-bass acoustics bathed in warm tungsten key light.
            </p>
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-[#94A3B8] w-3">L</span>
                <div className="flex-1 h-1.5 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#0033CC] via-[#0044FF] to-white transition-all duration-150" style={{ width: `${vuLevels.left}%` }} />
                </div>
                <span className="font-mono text-[9px] text-[#0044FF] w-6 text-right">{vuLevels.left}%</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[9px] text-[#94A3B8] w-3">R</span>
                <div className="flex-1 h-1.5 bg-black rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#0033CC] via-[#0044FF] to-white transition-all duration-150" style={{ width: `${vuLevels.right}%` }} />
                </div>
                <span className="font-mono text-[9px] text-[#0044FF] w-6 text-right">{vuLevels.right}%</span>
              </div>
            </div>
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
              Spatial Cartesian coordinates and high-bitrate video stream specs. Zero character bleed.
            </p>
          </div>
        </div>

        {/* CENTER: CUTSCENE.jpeg expanding card 9:16 -> 16:9 */}
        <div
          style={{
            width: cardWidth,
            height: cardHeight,
            borderRadius: cardRadius,
            maxWidth: p >= 0.99 ? '100vw' : '100%',
            maxHeight: p >= 0.99 ? '100vh' : '100%',
          }}
          className="relative bg-[#05070F] border border-white/20 overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.95)]"
        >
          {/* CUTSCENE image */}
          <div
            style={{ opacity: playbackMode === 'playing' ? 0 : 1, pointerEvents: playbackMode === 'playing' ? 'none' : 'auto' }}
            className="relative w-full h-full overflow-hidden transition-opacity duration-300"
          >
            <Image
              src="/assets/CUTSCENE.jpeg"
              alt="Quarter Spoon Cutscene"
              fill
              priority
              className="object-cover object-center z-0"
            />

            {/* Scroll instruction prompt */}
            <div
              style={{ opacity: isFullView ? 0 : instructionOpacity, pointerEvents: isFullView ? 'none' : 'auto', transition: 'opacity 0.2s ease' }}
              className="absolute bottom-6 inset-x-0 z-30 flex items-center justify-center"
            >
              <div className="px-5 py-2.5 rounded-full bg-black/85 border border-[#0044FF]/60 shadow-[0_0_25px_rgba(0,68,255,0.4)] backdrop-blur-md flex items-center gap-2 animate-pulse">
                <span className="font-mono text-[11px] font-bold text-white uppercase tracking-wider">
                  SCROLL DOWN TO EXPAND &amp; ENTER THE NETWORK
                </span>
                <ArrowDown className="w-3.5 h-3.5 text-[#0044FF] animate-bounce" />
              </div>
            </div>

            {/* CTA: ENTER THE NETWORK — appears at full expansion */}
            <div
              style={{
                opacity: isFullView ? 1 : 0,
                pointerEvents: isFullView ? 'auto' : 'none',
                transform: isFullView ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.92)',
                transition: 'opacity 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.4s cubic-bezier(0.16,1,0.3,1)',
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

          {/* VIDEO PLAYBACK LAYER */}
          <div
            style={{ opacity: playbackMode === 'playing' ? 1 : 0, pointerEvents: playbackMode === 'playing' ? 'auto' : 'none' }}
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
            <div
              className="absolute inset-0 bg-[#000000] pointer-events-none z-10 transition-opacity duration-75"
              style={{ opacity: fadeOpacity }}
            />
            <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between px-4 py-2.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                <span className="font-mono text-[11px] text-white font-bold tracking-widest">QS UMBRELLA CUT SCENE</span>
              </div>
              <span className="font-mono text-[11px] text-[#94A3B8]">
                {String(Math.floor(currentTime / 60)).padStart(2, '0')}:{String(Math.floor(currentTime % 60)).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Right progress indicator */}
        <div
          style={{ opacity: sideBoxesOpacity }}
          className="absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-3"
        >
          <div className="h-32 w-0.5 bg-white/10 rounded-full overflow-hidden">
            <div className="w-full bg-[#0044FF] rounded-full" style={{ height: `${Math.round(p * 100)}%` }} />
          </div>
          <div className="font-mono text-[10px] text-white/40">{Math.round(p * 100)}%</div>
        </div>
      </div>
    </section>
  );
};

export default ScrollStorytellingSection;
