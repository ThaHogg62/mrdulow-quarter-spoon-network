import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Menu, X, Phone, Mail, ExternalLink, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface NavLinkItem {
  name: string;
  href: string;
  isExternal?: boolean;
}

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navLinks: NavLinkItem[] = [
    { name: 'Unda Tha Radar', href: '/#unda-tha-radar' },
    { name: 'Tha Visual Lab', href: 'https://quarterspoonmuzicc.shop/#/', isExternal: true },
    { name: 'On Tha Spot', href: 'https://quarterspoonmuzicc.site/', isExternal: true },
    { name: 'Off Tha Grid', href: '/#off-tha-grid' },
    { name: 'The Network', href: '/#the-network' },
  ];

  // Detect scroll for dynamic background darkening
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/95 backdrop-blur-md border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-black/80 backdrop-blur-sm border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Symmetrical Left Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-lg bg-[#0B132B] border border-white/15 overflow-hidden flex items-center justify-center p-0.5 group-hover:border-[#0044FF] transition-colors">
            <Image
              src="/assets/TOP%20LEFT%20LOGO.jpeg"
              alt="Quarter Spoon Network Logo"
              width={38}
              height={38}
              className="object-cover rounded"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-mono font-black text-sm tracking-wider text-white group-hover:text-[#0044FF] transition-colors">
              Q.S.N
            </span>
            <span className="font-mono text-[9px] text-[#94A3B8] tracking-widest uppercase">
              QUARTER SPOON UMBRELLA
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isExternal = link.isExternal || link.href.startsWith('http');
            return isExternal ? (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-[#94A3B8] hover:text-white uppercase tracking-widest flex items-center gap-1 transition-colors duration-200"
              >
                <span>{link.name}</span>
                <ExternalLink className="w-3 h-3 text-[#0044FF] opacity-70" />
              </a>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="font-mono text-xs text-[#94A3B8] hover:text-white uppercase tracking-widest transition-colors duration-200"
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Quick Contact Pill */}
        <div className="hidden md:flex items-center gap-4">
          <a
            href="tel:2093419608"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-[#0B132B]/80 font-mono text-xs text-white hover:border-[#0044FF] hover:text-[#0044FF] transition-all"
          >
            <Phone className="w-3 h-3 text-[#0044FF]" />
            <span>(209) 341-9608</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation drawer"
          className="md:hidden p-2.5 rounded-lg bg-[#0B132B] border border-white/20 text-white hover:text-[#0044FF] hover:border-[#0044FF] transition-colors focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6 text-[#0044FF]" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Touch Slide-Over Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: '100vh' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ touchAction: 'pan-y' }}
            className="md:hidden fixed inset-x-0 top-20 bottom-0 bg-[#000000] border-t border-white/10 overflow-y-auto px-6 py-8 flex flex-col justify-between"
          >
            {/* Nav Links Stack */}
            <div className="flex flex-col gap-5 pt-2">
              <div className="font-mono text-[10px] text-[#0044FF] tracking-widest uppercase mb-1 flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                <span>QUARTER SPOON UMBRELLA DIRECTORY</span>
              </div>

              {navLinks.map((link) => {
                const isExternal = link.isExternal || link.href.startsWith('http');
                return isExternal ? (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4 hover:text-[#0044FF] flex items-center justify-between transition-colors"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-4 h-4 text-[#0044FF]" />
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-bold text-white uppercase tracking-widest border-b border-white/10 pb-4 hover:text-[#0044FF] flex items-center justify-between transition-colors"
                  >
                    <span>{link.name}</span>
                    <span className="font-mono text-xs text-[#94A3B8]">→</span>
                  </Link>
                );
              })}
            </div>

            {/* Direct Executive Contact Drawer Footer */}
            <div className="mt-8 pt-6 border-t border-white/10 bg-[#0B132B]/50 p-5 rounded-xl flex flex-col gap-3 font-mono text-xs">
              <span className="text-[10px] text-[#94A3B8] uppercase tracking-wider block">
                DIRECT EXECUTIVE CONTACT // MR DU LOW
              </span>

              <a
                href="tel:2093419608"
                className="flex items-center gap-2.5 text-white hover:text-[#0044FF] transition-colors py-1"
              >
                <Phone className="w-4 h-4 text-[#0044FF]" />
                <span className="font-bold">☎ (209) 341-9608</span>
              </a>

              <a
                href="mailto:mrdulow12@gmail.com"
                className="flex items-center gap-2.5 text-white hover:text-[#0044FF] transition-colors py-1"
              >
                <Mail className="w-4 h-4 text-[#0044FF]" />
                <span className="font-bold">✉ mrdulow12@gmail.com</span>
              </a>

              <div className="pt-2 text-[10px] text-[#94A3B8] border-t border-white/5 flex items-center justify-between">
                <span>STOCKTON // MODESTO // BAY AREA</span>
                <span className="text-[#0044FF]">NETLIFY EDGE</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
