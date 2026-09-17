import React, { useState, MouseEvent, useRef } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import { Film, Sparkles, Compass, ArrowUpRight, ExternalLink, Shield, CheckCircle2, Send, X, Users, Activity, Play } from 'lucide-react';
import { SkiperButton } from '../lib/vibe-coder/skiper40';
import GlobalFooter from '../components/GlobalFooter';

export interface PortalCardItem {
  id: string;
  title: string;
  division: string;
  tagline: string;
  icon: React.ReactNode;
  specs: string[];
  externalUrl?: string;
  isModal?: boolean;
  onOpenModal?: () => void;
}

function KineticPortalCard({ card }: { card: PortalCardItem }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -((y - centerY) / centerY) * 10;
    const rotateY = ((x - centerX) / centerX) * 10;

    el.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
    el.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.setProperty('--rx', '0deg');
    el.style.setProperty('--ry', '0deg');
  };

  const handleClick = () => {
    if (card.isModal && card.onOpenModal) {
      card.onOpenModal();
    } else if (card.externalUrl) {
      window.open(card.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        transform: 'perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) translate3d(0, 0, 0)',
        willChange: 'transform',
      }}
      className="relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-[2px] border border-white/20 hover:border-[#0044FF] p-8 md:p-10 flex flex-col justify-between transition-all duration-300 cursor-pointer group shadow-[0_10px_35px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(0,68,255,0.4)]"
    >
      {/* Subtle white vector line tracing with Electric Metallic Navy Blue glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(450px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,68,255,0.25), transparent 55%)',
        }}
      />

      <div className="relative z-10">
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="p-4 rounded-xl bg-white/[0.06] border border-white/20 text-white group-hover:border-[#0044FF] group-hover:text-[#0044FF] group-hover:shadow-[0_0_20px_rgba(0,68,255,0.4)] transition-all">
            {card.icon}
          </div>
          <span className="font-mono text-xs text-[#94A3B8] tracking-widest uppercase drop-shadow-sm font-semibold">
            {card.division}
          </span>
        </div>

        <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-[#0044FF] transition-colors drop-shadow-md">
          {card.title}
        </h3>

        <p className="text-xs md:text-sm text-zinc-200 leading-relaxed mb-8 drop-shadow-sm font-medium">
          {card.tagline}
        </p>

        {/* Specs Badges */}
        <div className="flex flex-wrap gap-2 mb-8">
          {card.specs.map((spec) => (
            <span
              key={spec}
              className="font-mono text-[10px] text-white px-3 py-1 rounded-full bg-black/40 border border-white/20 backdrop-blur-sm"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer Action */}
      <div className="relative z-10 pt-6 border-t border-white/15 flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-[#0044FF] flex items-center gap-1.5 group-hover:underline tracking-wider drop-shadow-sm">
          {card.isModal ? 'LAUNCH INTERACTIVE PREVIEW' : 'DIRECT REDIRECT'}
          {card.isModal ? <ArrowUpRight className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
        </span>
        <span className="font-mono text-[10px] text-zinc-300 uppercase font-semibold">
          {card.isModal ? 'SECTOR PREVIEW' : 'HYPERLINK PORTAL'}
        </span>
      </div>
    </div>
  );
}

export default function PortalsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscriberName, setSubscriberName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const portals: PortalCardItem[] = [
    {
      id: 'UNDA_THA_RADAR_FILMZ',
      title: 'UNDA THA RADAR FILMZ',
      division: 'SECTOR 01 // CINEMA & AI SUITE',
      tagline: 'Interactive preview highlights showcasing AI filmmaking, cinematic slow-mo, and video editing suites from undatharadarfilmz.online.',
      icon: <Film className="w-6 h-6" />,
      specs: ['AI Filmmaking', 'Cinematic Slow-Mo', 'Editing Suites', 'Prisma Sync'],
      isModal: true,
      onOpenModal: () => setModalOpen(true),
    },
    {
      id: 'THA_VISUAL_LAB',
      title: 'THA VISUAL LAB',
      division: 'SECTOR 02 // 3D & MERCH STAGE',
      tagline: 'Direct hyperlink portal to the official e-commerce shop, apparel artifacts, and generative 3D visual lab.',
      icon: <Sparkles className="w-6 h-6" />,
      specs: ['quarterspoonmuzicc.shop', 'Apparel Drops', '3D VFX', 'Instant Redirect'],
      externalUrl: 'https://quarterspoonmuzicc.shop/#/',
    },
    {
      id: 'ON_THA_SPOT_CONSULTING',
      title: 'ON THA SPOT CONSULTING',
      division: 'SECTOR 03 // EXECUTIVE ADVISORY',
      tagline: 'Direct hyperlink portal taking clients straight to the tactical consulting desk, business audits, and strategy leases.',
      icon: <Compass className="w-6 h-6" />,
      specs: ['quarterspoonmuzicc.site', '10-Min Strategy', 'Executive Briefs', 'Instant Redirect'],
      externalUrl: 'https://quarterspoonmuzicc.site/',
    },
  ];

  const handleSyncSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSyncStatus(null);

    const cleanEmail = (subscriberEmail || '').trim().toLowerCase();
    if (!cleanEmail) {
      setSyncStatus('ERROR: Valid email address is required.');
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch('/api/submissions/dual-commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          name: (subscriberName || '').trim() || 'Film Subscriber',
          serviceType: 'UNDA_THA_RADAR_FILMZ',
          subjectLine: 'Unda Tha Radar Filmz Newsletter & Subscriber Sync',
          projectDetails: 'Live registration from /portals Unda Tha Radar Filmz sector preview modal.',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');

      setSyncStatus('CONFIRMED: Registered to Prisma PostgreSQL ledger and dispatched.');
      setSubscriberEmail('');
      setSubscriberName('');
    } catch (err: any) {
      setSyncStatus(`ERROR: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white font-sans selection:bg-[#0044FF] selection:text-white pt-28 bg-transparent">
      <Head>
        <title>Quarter Spoon Portals | The Network</title>
        <meta
          name="description"
          content="Official Quarter Spoon Network portals: Unda Tha Radar Filmz, Tha Visual Lab, and On Tha Spot Consulting."
        />
      </Head>

      {/* 100% BACKGROUND IMAGE OPACITY - ZERO DARK OVERLAYS OR DIMMING VIGNETTES */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-100"
        style={{
          backgroundImage: "url('/assets/LOGO%20POSTER%20QSE%20UMBRELLA.jpeg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* Hero Header */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-12 pb-16 text-center">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-[#0044FF] tracking-[0.25em] uppercase mb-4 px-4 py-1.5 rounded-full bg-black/60 border border-[#0044FF]/60 shadow-[0_0_20px_rgba(0,68,255,0.4)] backdrop-blur-sm">
          <Shield className="w-3.5 h-3.5" />
          <span>QUARTER SPOON PORTALS</span>
        </div>

        <h1 className="text-4xl md:text-7xl font-black uppercase text-white tracking-tight mb-6 drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]">
          THE NETWORK PORTALS
        </h1>

        <p className="max-w-2xl mx-auto text-sm md:text-base text-zinc-200 leading-relaxed font-medium drop-shadow-md">
          Explore the three active divisions of the Quarter Spoon Network. Experience interactive AI cinema previews, direct e-commerce shop access, and executive advisory.
        </p>
      </section>

      {/* 3D Kinetic Card Grid - Crystal-Clear Glassmorphic Cards on 100% Visible Background */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pb-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {portals.map((portal) => (
            <KineticPortalCard key={portal.id} card={portal} />
          ))}
        </div>
      </section>

      {/* Unda Tha Radar Filmz Interactive Preview Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-y-auto select-none">
          <div className="relative w-full max-w-4xl bg-[#05070F]/95 border border-[#0044FF]/50 rounded-2xl overflow-hidden shadow-[0_0_80px_rgba(0,68,255,0.4)] p-6 md:p-10 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-[#0B132B] border border-[#0044FF]/40 p-1 flex items-center justify-center">
                  <Image
                    src="/assets/QS%20NETWORK%201.png"
                    alt="Network Crest"
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">
                    UNDA THA RADAR FILMZ
                  </h3>
                  <span className="font-mono text-xs text-[#0044FF] font-bold">
                    OFFICIAL SITE: undatharadarfilmz.online
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="p-2.5 rounded-xl bg-black border border-white/20 text-white hover:text-[#0044FF] hover:border-[#0044FF] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Suite & Filmmaking Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="font-mono text-xs text-[#0044FF] font-bold">01 // AI SUITE</div>
                <h4 className="font-bold text-white uppercase text-sm">GEN-AI CINEMATOGRAPHY</h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Next-generation camera rigs, neural video expansion, and procedural VFX workflows.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="font-mono text-xs text-[#0044FF] font-bold">02 // SLOW-MO</div>
                <h4 className="font-bold text-white uppercase text-sm">ANALOG CADENCE</h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  High-speed optical flow interpolation, anamorphic flares, and 84 BPM cadence syncing.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                <div className="font-mono text-xs text-[#0044FF] font-bold">03 // SUITE EDITING</div>
                <h4 className="font-bold text-white uppercase text-sm">COLOR SCIENCE</h4>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Post-production mastering, HDR grading, and seamless edge delivery protocols.
                </p>
              </div>
            </div>

            {/* Real-time Subscriber Sync Form */}
            <div className="p-6 rounded-xl bg-[#0B132B]/50 border border-white/15 mb-8">
              <h4 className="font-mono text-xs text-[#0044FF] uppercase tracking-wider mb-2 font-bold flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>DIRECT SUBSCRIBER SYNC // POSTGRESQL + FORMSPREE DUAL-COMMIT</span>
              </h4>
              <p className="text-xs text-[#94A3B8] mb-4">
                Register directly to the Unda Tha Radar dispatch list. Data commits to the PostgreSQL ledger and alerts Mr Du Low.
              </p>

              <form onSubmit={handleSyncSubscriber} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Director / Client Name"
                  value={subscriberName}
                  onChange={(e) => setSubscriberName(e.target.value)}
                  className="flex-1 bg-black/70 border border-white/15 rounded-xl px-4 py-2.5 font-mono text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#0044FF]"
                />
                <input
                  type="email"
                  required
                  placeholder="official@email.com"
                  value={subscriberEmail}
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                  className="flex-1 bg-black/70 border border-white/15 rounded-xl px-4 py-2.5 font-mono text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#0044FF]"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl bg-[#0044FF] hover:bg-[#0033CC] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'SYNCING...' : 'SYNC LEDGER'}</span>
                </button>
              </form>

              {syncStatus && (
                <div
                  className={`mt-3 font-mono text-xs flex items-center gap-2 ${
                    syncStatus.startsWith('CONFIRMED') ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{syncStatus}</span>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
              <span className="font-mono text-xs text-[#94A3B8]">
                LOCATION: STOCKTON // MODESTO // BAY AREA
              </span>

              <div className="flex items-center gap-3">
                <a
                  href="https://undatharadarfilmz.online/#/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-[#0044FF] hover:bg-[#0033CC] text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors shadow-[0_0_20px_rgba(0,68,255,0.4)]"
                >
                  <span>LAUNCH FULL PRODUCTION SITE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-3 rounded-xl border border-white/15 hover:bg-white/10 text-white font-mono text-xs uppercase tracking-wider transition-colors"
                >
                  CLOSE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Footer */}
      <GlobalFooter />
    </div>
  );
}
