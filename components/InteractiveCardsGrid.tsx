import React, { useState, MouseEvent, useRef } from 'react';
import Image from 'next/image';
import { Film, Sparkles, Compass, ArrowUpRight, ExternalLink, Shield, CheckCircle2, Send, X, Users } from 'lucide-react';
import { SkiperButton } from '../lib/vibe-coder/skiper40';

export interface InteractiveCardProps {
  id: string;
  title: string;
  division: string;
  tagline: string;
  badgeImage?: string;
  icon: React.ReactNode;
  specs: string[];
  externalUrl?: string;
  isModal?: boolean;
  onOpenModal?: () => void;
}

function KineticPortalCard({ card }: { card: InteractiveCardProps }) {
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
      className="relative overflow-hidden rounded-2xl bg-white/[0.03] backdrop-blur-[2px] border border-white/20 hover:border-[#0044FF] p-8 flex flex-col justify-between transition-all duration-300 cursor-pointer group shadow-[0_10px_35px_rgba(0,0,0,0.5)] hover:shadow-[0_0_50px_rgba(0,68,255,0.35)]"
    >
      {/* Mouse-following thin vector line tracing border */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(0,68,255,0.25), transparent 45%)',
        }}
      />

      <div>
        {/* Top Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="p-3.5 rounded-xl bg-white/[0.06] border border-white/20 text-white group-hover:border-[#0044FF] group-hover:text-[#0044FF] transition-all shadow-md">
            {card.icon}
          </div>
          <span className="font-mono text-[10px] text-[#94A3B8] tracking-widest uppercase font-semibold">
            {card.division}
          </span>
        </div>

        {card.badgeImage && (
          <div className="mb-4 relative w-16 h-16 rounded-full overflow-hidden border border-white/20 shadow-[0_0_15px_rgba(0,68,255,0.25)]">
            <Image
              src={card.badgeImage}
              alt={`${card.title} Badge`}
              fill
              className="object-cover"
            />
          </div>
        )}

        <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-3 group-hover:text-[#0044FF] transition-colors drop-shadow-sm">
          {card.title}
        </h3>

        <p className="text-xs text-[#94A3B8] leading-relaxed mb-6">
          {card.tagline}
        </p>

        {/* Specs Pill Badges */}
        <div className="flex flex-wrap gap-2 mb-6">
          {card.specs.map((spec) => (
            <span
              key={spec}
              className="font-mono text-[9px] text-white px-2.5 py-1 rounded bg-black/70 border border-white/10"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer Action */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between">
        <span className="font-mono text-xs text-[#0044FF] font-bold flex items-center gap-1.5 group-hover:underline tracking-wide">
          {card.isModal ? 'OPEN INTERACTIVE PREVIEW' : 'ACCESS DIRECT PORTAL'}
          {card.isModal ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ExternalLink className="w-3.5 h-3.5" />}
        </span>
        <span className="font-mono text-[9px] text-[#94A3B8]">
          {card.isModal ? 'PREVIEW MODAL' : 'EXTERNAL REDIRECT'}
        </span>
      </div>
    </div>
  );
}

export const InteractiveCardsGrid: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscriberName, setSubscriberName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Exactly 3 Active Portals
  const portals: InteractiveCardProps[] = [
    {
      id: 'unda_filmz',
      title: 'Unda Tha Radar Filmz',
      division: 'PORTAL 01 // CINEMA',
      tagline: 'Interactive preview modal with highlights from undatharadarfilmz.online and live real-time admin subscriber table sync.',
      badgeImage: '/assets/QS%20NETWORK%201.png',
      icon: <Film className="w-6 h-6" />,
      specs: ['Live Highlights', 'Subscriber Sync', 'Independent Cinema'],
      isModal: true,
      onOpenModal: () => setModalOpen(true),
    },
    {
      id: 'visual_lab',
      title: 'Tha Visual Lab',
      division: 'PORTAL 02 // E-COMMERCE',
      tagline: 'Direct hyperlink card redirecting directly to official quarterspoonmuzicc.shop.',
      icon: <Sparkles className="w-6 h-6" />,
      specs: ['quarterspoonmuzicc.shop', 'Merch & 3D Art', 'Instant Redirect'],
      externalUrl: 'https://quarterspoonmuzicc.shop/#/',
    },
    {
      id: 'on_tha_spot',
      title: 'On Tha Spot Consulting',
      division: 'PORTAL 03 // ADVISORY',
      tagline: 'Direct hyperlink card redirecting directly to official quarterspoonmuzicc.site.',
      icon: <Compass className="w-6 h-6" />,
      specs: ['quarterspoonmuzicc.site', 'Executive Advisory', 'Instant Redirect'],
      externalUrl: 'https://quarterspoonmuzicc.site/',
    },
  ];

  const handleSyncSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSyncStatus(null);

    try {
      const res = await fetch('/api/submissions/dual-commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: subscriberEmail,
          name: subscriberName || 'Film Subscriber',
          serviceType: 'UNDA_THA_RADAR_FILMZ',
          subjectLine: 'Unda Tha Radar Filmz Newsletter Sync',
          projectDetails: 'User opted into live real-time Unda Tha Radar Filmz subscriber network.',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');

      setSyncStatus('Live sync confirmed: Subscriber registered to PostgreSQL ledger and dispatched.');
      setSubscriberEmail('');
      setSubscriberName('');
    } catch (err: any) {
      setSyncStatus(`Sync error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* 3 Active Portals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {portals.map((portal) => (
          <KineticPortalCard key={portal.id} card={portal} />
        ))}
      </div>

      {/* Unda Tha Radar Filmz Interactive Preview Modal & Live Subscriber Table Sync */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-8 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-[#0B132B] border border-[#0044FF]/40 rounded-2xl overflow-hidden shadow-2xl p-6 md:p-10 my-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-[#0044FF]/40">
                  <Image
                    src="/assets/QS%20NETWORK%201.png"
                    alt="Badge"
                    fill
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">
                    Unda Tha Radar Filmz
                  </h3>
                  <span className="font-mono text-[10px] text-[#0044FF] uppercase font-bold">
                    OFFICIAL SITE: undatharadarfilmz.online
                  </span>
                </div>
              </div>

              <button
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-lg bg-black/60 border border-white/20 text-white hover:text-[#0044FF] hover:border-[#0044FF] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Broadcast Card */}
              <div className="p-4 rounded-xl bg-black/60 border border-white/10 flex flex-col gap-3">
                <div className="relative w-full h-44 rounded-lg overflow-hidden border border-white/10">
                  <Image
                    src="/assets/YOUTUBE%20NAIL.png"
                    alt="YouTube Broadcast"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white uppercase">
                    Featured YouTube Broadcast
                  </span>
                  <a
                    href="https://www.youtube.com/@SeenYouScream"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#0044FF] font-mono text-[10px] flex items-center gap-1 hover:underline font-bold"
                  >
                    <span>@SeenYouScream</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Direct Site Link & Highlights */}
              <div className="flex flex-col justify-between p-5 rounded-xl bg-black/60 border border-white/10">
                <div>
                  <span className="font-mono text-[10px] text-[#0044FF] tracking-widest uppercase block mb-1 font-bold">
                    PRODUCTION SYNOPSIS
                  </span>
                  <h4 className="text-lg font-bold text-white uppercase mb-2">
                    Raw Cinematic Storytelling
                  </h4>
                  <p className="text-xs text-[#94A3B8] leading-relaxed mb-4">
                    Unda Tha Radar Filmz captures independent cinema, high-contrast visual narratives, and uncut documentary filmmaking.
                  </p>

                  <div className="space-y-1.5 font-mono text-xs text-[#E2E8F0] mb-4">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0044FF]" />
                      <span>Anamorphic 2.39:1 Cinema Optics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0044FF]" />
                      <span>Scene of Screams Broadcast Suite</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0044FF]" />
                      <span>PostgreSQL Live Subscriber Ledger</span>
                    </div>
                  </div>
                </div>

                <a
                  href="https://undatharadarfilmz.online/#/home"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-lg bg-[#0044FF] text-white font-mono text-xs font-bold flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-all shadow-[0_0_20px_rgba(0,68,255,0.4)]"
                >
                  <span>LAUNCH UNDATHARADARFILMZ.ONLINE</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Live Real-Time Admin Subscriber Table Sync */}
            <div className="p-5 rounded-xl bg-black/80 border border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-[#0044FF]" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Live Real-Time Subscriber Sync
                </span>
              </div>

              {syncStatus && (
                <div className="mb-3 p-2.5 rounded bg-[#0B132B] border border-[#0044FF]/40 text-xs font-mono text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#0044FF]" />
                  <span>{syncStatus}</span>
                </div>
              )}

              <form onSubmit={handleSyncSubscriber} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Subscriber Name"
                  value={subscriberName}
                  onChange={(e) => setSubscriberName(e.target.value)}
                  className="px-4 py-2.5 rounded bg-black border border-white/20 text-white font-mono text-xs focus:border-[#0044FF] focus:outline-none flex-1"
                />
                <input
                  type="email"
                  required
                  placeholder="subscriber@email.com"
                  value={subscriberEmail}
                  onChange={(e) => setSubscriberEmail(e.target.value)}
                  className="px-4 py-2.5 rounded bg-black border border-white/20 text-white font-mono text-xs focus:border-[#0044FF] focus:outline-none flex-1"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded bg-[#0044FF] text-white font-mono text-xs font-bold hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,68,255,0.4)]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{submitting ? 'SYNCING...' : 'SYNC LEDGER'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveCardsGrid;
