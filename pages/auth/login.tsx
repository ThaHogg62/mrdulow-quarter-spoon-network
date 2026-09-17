import React, { useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Shield, Lock, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const cleanEmail = (email || '').trim().toLowerCase();
    if (!cleanEmail) {
      setError('Authorized director email is required.');
      setLoading(false);
      return;
    }

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: cleanEmail,
        password,
      });

      if (res?.error) {
        setError(res.error || 'Authentication rejected.');
      } else if (res?.ok) {
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err?.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>DIRECTOR ACCESS // QUARTER SPOON NETWORK</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <main className="min-h-screen bg-[#000000] text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[500px] h-[500px] rounded-full bg-[#0044FF]/10 blur-[140px]" />
        </div>

        <div className="relative z-10 max-w-md w-full bg-[#0B132B]/80 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(0,68,255,0.2)]">
          {/* Brand Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/20">
                <Image
                  src="/assets/QS%20NETWORK%201.png"
                  alt="Quarter Spoon Network Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <span className="block font-mono text-xs text-[#0044FF] tracking-widest uppercase font-bold">
                  QUARTER SPOON
                </span>
                <span className="block font-mono text-[10px] text-[#94A3B8] tracking-wider uppercase">
                  SECURITY PROTOCOL
                </span>
              </div>
            </div>
            <div className="p-2 rounded-lg bg-black/40 border border-white/10">
              <Shield className="w-4 h-4 text-[#0044FF]" />
            </div>
          </div>

          <div className="text-center space-y-1 mb-6">
            <h1 className="text-xl font-black uppercase tracking-wider text-white">
              DIRECTOR AUTHENTICATION
            </h1>
            <p className="text-xs text-[#94A3B8] font-mono">
              Restricted to authorized Quarter Spoon administrators.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 flex items-start gap-2.5 text-xs text-red-300 font-mono">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider mb-2">
                AUTHORIZED DIRECTOR EMAIL
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="qse6209@gmail.com"
                className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 font-mono text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0044FF] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#94A3B8] uppercase tracking-wider mb-2">
                ACCESS KEY / PASSWORD
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black/60 border border-white/15 rounded-xl px-4 py-3 font-mono text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[#0044FF] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-[#0044FF] hover:bg-[#0033CC] text-white font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(0,68,255,0.4)] disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span className="animate-pulse">VERIFYING CLEARANCE...</span>
              ) : (
                <>
                  <span>INITIALIZE SESSION</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center space-y-2 font-mono text-[11px] text-[#94A3B8]">
            <p>
              HARD-LOCKED: <span className="text-[#0044FF]">qse6209@gmail.com</span> // <span className="text-[#0044FF]">mrdulow12@gmail.com</span>
            </p>
            <p className="text-[10px] text-zinc-500">
              Breaches trigger automated incident payloads to executive dispatch.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 font-mono text-xs text-[#94A3B8] hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>RETURN TO MAIN PORTAL</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
