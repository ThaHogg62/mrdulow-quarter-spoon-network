import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, Send, X, Shield, CheckCircle2 } from 'lucide-react';
import { SkiperButton } from '@skiper-ui/skiper40';

export const GlobalFooter: React.FC = () => {
  const [emailModalOpen, setEmailModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);

    try {
      const res = await fetch('/api/submissions/dual-commit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          serviceType: 'ON_THA_SPOT_CONSULTING',
          subjectLine: `Direct Footer Inquiry from ${formData.name || 'Client'}`,
          projectDetails: formData.message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to dispatch inquiry.');
      }

      setSubmitResult({
        success: true,
        message: 'Message dispatched to Mr Du Low executive desk.',
      });
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => {
        setEmailModalOpen(false);
        setSubmitResult(null);
      }, 2000);
    } catch (err: any) {
      setSubmitResult({
        success: false,
        message: err.message || 'Submission failed. Check your official email address.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <footer className="relative z-30 border-t border-white/15 py-12 px-6 bg-[#000000] text-center font-mono text-xs text-[#94A3B8] select-none">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Bottom-Left Logo: TOP LEFT LOGO.jpeg */}
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-xl bg-[#0B132B] border border-white/20 p-1 flex items-center justify-center group-hover:border-[#0044FF] group-hover:shadow-[0_0_25px_rgba(0,68,255,0.4)] transition-all">
                <Image
                  src="/assets/TOP%20LEFT%20LOGO.jpeg"
                  alt="Quarter Spoon Official Logo"
                  width={44}
                  height={44}
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="text-left flex flex-col">
                <span className="font-bold text-white tracking-wider text-sm group-hover:text-[#0044FF] transition-colors">
                  QUARTER SPOON NETWORK
                </span>
                <span className="text-[10px] text-[#94A3B8]">
                  &copy; {new Date().getFullYear()} ALL RIGHTS RESERVED
                </span>
              </div>
            </Link>
          </div>

          {/* Contact Info Bar */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            {/* Phone Block: Electric Metallic Navy Blue Phone Icon */}
            <a
              href="tel:2093419608"
              className="flex items-center gap-2.5 text-white hover:text-[#0044FF] transition-colors group"
            >
              <div className="p-2 rounded-lg bg-[#0B132B] border border-white/10 group-hover:border-[#0044FF] transition-colors">
                <Phone className="w-4 h-4 text-[#0044FF]" />
              </div>
              <span className="font-semibold tracking-wider">CONTACT (209) 341-9608</span>
            </a>

            {/* Email Block: Electric Metallic Navy Blue Email Icon */}
            <button
              type="button"
              onClick={() => setEmailModalOpen(true)}
              className="flex items-center gap-2.5 text-white hover:text-[#0044FF] transition-colors group cursor-pointer"
            >
              <div className="p-2 rounded-lg bg-[#0B132B] border border-white/10 group-hover:border-[#0044FF] transition-colors">
                <Mail className="w-4 h-4 text-[#0044FF]" />
              </div>
              <span className="font-semibold tracking-wider">email mrdulow12@gmail.com</span>
            </button>

            {/* Admin Lock Status Link */}
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-1.5 border border-[#0044FF]/40 px-3 py-1 rounded-full bg-[#0044FF]/10 hover:bg-[#0044FF]/20 text-[10px] text-[#0044FF] font-bold transition-all"
            >
              <Shield className="w-3 h-3 text-[#0044FF]" />
              <span>ADMIN LOCK: ACTIVE</span>
            </Link>
          </div>
        </div>
      </footer>

      {/* Sleek Interactive Email Modal Popup Window addressed to mrdulow12@gmail.com */}
      {emailModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
          <div className="relative w-full max-w-lg bg-[#05070F] border border-[#0044FF]/40 rounded-2xl p-6 md:p-8 shadow-[0_0_80px_rgba(0,68,255,0.35)]">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#0B132B] border border-[#0044FF]/50 shadow-[0_0_15px_rgba(0,68,255,0.3)]">
                  <Mail className="w-5 h-5 text-[#0044FF]" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base uppercase tracking-wider">
                    DIRECT DISPATCH
                  </h3>
                  <span className="font-mono text-xs text-[#0044FF]">
                    TO: mrdulow12@gmail.com
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEmailModalOpen(false)}
                className="p-2 rounded-lg bg-black border border-white/20 text-white hover:text-[#0044FF] hover:border-[#0044FF] transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitResult && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
                  submitResult.success
                    ? 'bg-[#0044FF]/15 border border-[#0044FF] text-white'
                    : 'bg-red-500/15 border border-red-500/40 text-red-200'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-[#0044FF] flex-shrink-0" />
                <span>{submitResult.message}</span>
              </div>
            )}

            <form onSubmit={handleSendEmail} className="flex flex-col gap-4">
              <div>
                <label className="block font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1">
                  Full Name / Entity *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Quentin S. Edwards"
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/15 text-white font-mono text-xs focus:border-[#0044FF] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1">
                  Official Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="client@enterprise.com"
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/15 text-white font-mono text-xs focus:border-[#0044FF] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block font-mono text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1">
                  Custom Message / Executive Request *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Draft your direct brief for Mr Du Low..."
                  className="w-full px-4 py-3 rounded-xl bg-black border border-white/15 text-white font-mono text-xs focus:border-[#0044FF] focus:outline-none transition-colors leading-relaxed"
                />
              </div>

              <SkiperButton
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-xl bg-[#0044FF] text-white font-mono font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,68,255,0.4)]"
                glowColor="#0044FF"
              >
                {submitting ? (
                  <span>TRANSMITTING...</span>
                ) : (
                  <>
                    <span>DISPATCH TO MR DU LOW</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </SkiperButton>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalFooter;
