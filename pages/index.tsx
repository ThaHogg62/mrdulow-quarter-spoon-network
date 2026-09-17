import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowRight, Shield, Sparkles, ExternalLink } from 'lucide-react';
import PixelTrail from '@fancy/pixel-trail';
import Preloader from '../components/Preloader';
import GlobalFooter from '../components/GlobalFooter';

// Dynamic client-side imports for 3D and scroll components to prevent SSR hydration mismatches
const ScriptHeroSection = dynamic(
  () => import('../components/ScriptHeroSection'),
  {
    ssr: false,
    loading: () => (
      <div className="relative w-full h-screen bg-black flex items-center justify-center">
        <img src="/HOME PAGE.jpeg" alt="Quarter Spoon Network" className="w-full h-full object-contain" />
      </div>
    ),
  }
);

const ScrollStorytellingSection = dynamic(
  () => import('../components/ScrollStorytellingSection'),
  { ssr: false }
);

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[#000000] text-white font-sans selection:bg-[#0044FF] selection:text-white overflow-x-hidden">
      <Head>
        <title>Quarter Spoon Network | Pure Space Noir</title>
        <meta
          name="description"
          content="Quarter Spoon Network umbrella platform directed by Mr Du Low. Unified multimedia empire and executive infrastructure."
        />
      </Head>

      {/* Preloader Splash Terminal Boot Sequence */}
      <Preloader />

      {/* Physics Pixel Trail Canvas in Electric Metallic Navy Blue */}
      <PixelTrail
        particleSize={3.5}
        trailColors={['#0044FF', '#0033CC', '#FFFFFF', '#0B132B']}
        maxParticles={80}
        decayRate={0.02}
      />

      {/* 1. HERO SECTION (FLORIA 3D Canvas + 260px Spotlight Mask) */}
      <ScriptHeroSection />

      {/* 2. STICKY SCROLL STORYTELLING SECTION (CUTSCENE.jpeg 9:16 -> 16:9 Pinned Expansion) */}
      <ScrollStorytellingSection />

      {/* 3. HOME PAGE BOTTOM SECTION - 100% VISIBLE BACKGROUND IMAGE, ZERO OBSCURING SHADE */}
      <section className="relative z-20 w-full min-h-[85vh] flex items-center justify-center py-28 px-6 overflow-hidden border-t border-white/10 bg-transparent">
        {/* Background Image: LOGO POSTER QSE UMBRELLA.jpeg at 100% Opacity */}
        <div
          className="absolute inset-0 pointer-events-none z-0 opacity-100"
          style={{
            backgroundImage: "url('/assets/LOGO%20POSTER%20QSE%20UMBRELLA.jpeg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Editorial Content Container */}
        <div className="relative z-20 max-w-5xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 font-mono text-xs text-[#0044FF] tracking-[0.25em] uppercase mb-6 px-4 py-1.5 rounded-full bg-[#05070F]/90 border border-[#0044FF]/50 shadow-[0_0_25px_rgba(0,68,255,0.35)] backdrop-blur-md">
            <Shield className="w-3.5 h-3.5" />
            <span>QUARTER SPOON NETWORK // SECTOR DIRECTORY</span>
          </div>

          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase text-white tracking-tight leading-none mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
            EXPLORE THE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#E2E8F0] to-[#0044FF]">
              3 PRODUCTION PORTALS
            </span>
          </h2>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-[#94A3B8] leading-relaxed mb-10 drop-shadow-md">
            Step into the dedicated Quarter Spoon Portals. Connect with Unda Tha Radar Filmz AI Suite, shop apparel drops at Tha Visual Lab, or reserve a consulting brief on the spot.
          </p>

          {/* Direct CTA Link to /portals */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href="/portals"
              className="px-9 py-4 rounded-xl bg-[#0044FF] text-white font-mono font-bold text-sm tracking-wider uppercase flex items-center gap-3 hover:bg-white hover:text-black transition-all duration-300 shadow-[0_0_35px_rgba(0,68,255,0.6)] group border border-white/20"
            >
              <span>ACCESS QUARTER SPOON PORTALS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="https://quarterspoonmuzicc.shop/#/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-7 py-4 rounded-xl bg-black/80 border border-white/20 text-[#94A3B8] hover:text-white hover:border-[#0044FF] font-mono text-xs uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <span>VISIT SHOP</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#0044FF]" />
            </a>
          </div>
        </div>
      </section>

      {/* Global Footer */}
      <GlobalFooter />
    </div>
  );
}
