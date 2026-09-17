import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ShieldAlert, Lock, ArrowLeft, KeyRound } from 'lucide-react';

export default function ForbiddenPage() {
  const router = useRouter();
  const { unauthorized, target } = router.query;

  return (
    <>
      <Head>
        <title>403 FORBIDDEN // QUARTER SPOON SECURITY PROTOCOL</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen bg-[#000000] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Deep Blue Glow Aura */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-96 h-96 rounded-full bg-[#0044FF]/10 blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-lg w-full bg-[#0B132B]/80 border border-red-500/40 rounded-2xl p-8 backdrop-blur-xl shadow-[0_0_50px_rgba(0,68,255,0.2)]">
          {/* Top Status Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2 text-red-400 font-mono text-xs uppercase tracking-widest">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>SECURITY BREACH INTERCEPTED</span>
            </div>
            <span className="font-mono text-xs text-[#94A3B8]">HTTP 403</span>
          </div>

          {/* Central Warning Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center justify-center">
              <Lock className="w-10 h-10 text-red-400" />
            </div>
          </div>

          {/* Incident Message */}
          <div className="text-center space-y-3 mb-8">
            <h1 className="text-2xl font-black uppercase tracking-wider text-white">
              ACCESS CLEARANCE DENIED
            </h1>
            <p className="text-sm text-[#94A3B8] font-mono leading-relaxed">
              This tactical terminal is hard-locked to authorized Quarter Spoon Directors only.
            </p>

            <div className="mt-4 p-4 rounded-xl bg-black/60 border border-white/10 font-mono text-xs text-left space-y-1.5">
              <div className="text-[#94A3B8]">
                TARGET ROUTE: <span className="text-white">{target || '/admin/dashboard'}</span>
              </div>
              <div className="text-[#94A3B8]">
                SESSION IDENTITY: <span className="text-red-400">{unauthorized || 'UNAUTHENTICATED GUEST'}</span>
              </div>
              <div className="text-[#94A3B8]">
                AUTHORIZED ACCOUNTS:
                <div className="text-[#0044FF] font-semibold mt-1">
                  • qse6209@gmail.com<br />
                  • mrdulow12@gmail.com
                </div>
              </div>
              <div className="text-[11px] text-amber-400/90 pt-2 border-t border-white/10 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                SECURITY LOG DISPATCHED TO MR DU LOW
              </div>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono uppercase tracking-widest text-[#94A3B8] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>RETURN TO BASE</span>
            </Link>

            <Link
              href="/auth/login"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#0044FF] hover:bg-[#0033CC] text-xs font-mono uppercase tracking-widest text-white font-bold transition-colors shadow-[0_0_20px_rgba(0,68,255,0.4)]"
            >
              <KeyRound className="w-4 h-4" />
              <span>DIRECTOR LOGIN</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
