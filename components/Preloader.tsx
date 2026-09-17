import React, { useState, useEffect } from 'react';
import { Terminal, Shield, Cpu } from 'lucide-react';

interface PreloaderProps {
  onComplete?: () => void;
}

export const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [bootStep, setBootStep] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const bootLogs = [
    'NETLIFY_EDGE_RUNTIME: OPTIMIZED',
    'OLED_VECTOR_COORDINATES: [-0.45, 0.62, 0.10] LOCKED',
    'PRISMA_POSTGRES_LEDGER: VERIFIED',
    '84 BPM G-FUNK CADENCE: SYNCED',
    'INITIALIZING THE QUARTER SPOON NETWORK',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsFinished(true);
            onComplete?.();
          }, 350);
          return 100;
        }
        const next = prev + Math.floor(Math.random() * 15) + 8;
        return next > 100 ? 100 : next;
      });
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    if (progress > 20 && bootStep < 1) setBootStep(1);
    if (progress > 45 && bootStep < 2) setBootStep(2);
    if (progress > 70 && bootStep < 3) setBootStep(3);
    if (progress > 90 && bootStep < 4) setBootStep(4);
  }, [progress, bootStep]);

  return (
    <div
      style={{
        opacity: isFinished ? 0 : 1,
        pointerEvents: isFinished ? 'none' : 'auto',
        visibility: isFinished ? 'hidden' : 'visible',
        transition: 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.6s ease',
      }}
      className="fixed inset-0 z-[9999] bg-[#000000] flex flex-col items-center justify-center p-6 select-none"
    >
      {/* Subtle Cyber Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg bg-[#05070F] border border-white/15 rounded-2xl p-6 md:p-8 shadow-[0_0_80px_rgba(0,68,255,0.25)]">
        {/* Terminal Header */}
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-[#0044FF] animate-pulse" />
            <span className="font-mono text-xs font-bold text-white tracking-widest uppercase">
              QSE // SYSTEM BOOT
            </span>
          </div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#94A3B8]">
            <Cpu className="w-3.5 h-3.5 text-[#0044FF]" />
            <span>NODE V24.0.0</span>
          </div>
        </div>

        {/* Console Boot Sequence Output */}
        <div className="space-y-2 mb-6 font-mono text-xs min-h-[110px]">
          {bootLogs.slice(0, bootStep + 1).map((log, idx) => (
            <div
              key={log}
              className={`flex items-center gap-2 ${
                idx === bootStep ? 'text-white font-bold' : 'text-[#94A3B8]'
              }`}
            >
              <span className="text-[#0044FF]">›</span>
              <span>{log}</span>
              {idx === bootStep && progress < 100 && (
                <span className="inline-block w-1.5 h-3 bg-[#0044FF] animate-pulse ml-1" />
              )}
            </div>
          ))}
        </div>

        {/* Progress Vector Line in Electric Metallic Navy Blue */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-[#94A3B8]">INITIALIZING ENGINE...</span>
            <span className="text-[#0044FF] font-bold">{progress}%</span>
          </div>

          <div className="w-full h-1.5 bg-[#0B132B] rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#0033CC] to-[#0044FF] rounded-full transition-all duration-150 ease-out shadow-[0_0_15px_#0044FF]"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Bottom Secure Node Stamp */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between font-mono text-[10px] text-[#94A3B8]">
          <span className="flex items-center gap-1.5">
            <Shield className="w-3 h-3 text-[#0044FF]" />
            <span>NETLIFY EDGE VERIFIED</span>
          </span>
          <span className="text-zinc-500">QUARTER SPOON NETWORK</span>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
