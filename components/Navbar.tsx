import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Phone, Mail, ExternalLink, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface NavItem {
  name: string;
  href: string;
  isExternal?: boolean;
}

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();

  const navLinks: NavItem[] = [
    { name: 'HOME', href: '/' },
    { name: 'PORTALS', href: '/portals' },
    { name: 'CONSULTING', href: 'https://quarterspoonmuzicc.site/', isExternal: true },
    { name: 'VISUAL LAB', href: 'https://quarterspoonmuzicc.shop/#/', isExternal: true },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const isActive = (href: string) => {
    if (href === '/') return router.pathname === '/';
    return router.pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-black/95 backdrop-blur-md border-b border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.9)]'
          : 'bg-black/80 backdrop-blur-sm border-b border-white/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
        {/* Top-Left Logo & Brand Tag (Symmetrically aligned with 24px / px-6 padding) */}
        <Link href="/" className="flex items-center gap-4 group">
          {/* Logo Source: QS NETWORK 1.png - Scale H: 48px - 56px */}
          <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[#0B132B] border border-white/20 p-1 flex items-center justify-center group-hover:border-[#0044FF] group-hover:shadow-[0_0_25px_rgba(0,68,255,0.4)] transition-all duration-300">
            <Image
              src="/assets/QS%20NETWORK%201.png"
              alt="Quarter Spoon Network Logo"
              width={52}
              height={52}
              className="object-contain"
              priority
            />
          </div>

          <div className="flex flex-col">
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-[#94A3B8] group-hover:text-white transition-colors">
              QUARTER SPOON // THE NETWORK
            </span>
            <span className="font-mono text-[10px] text-[#0044FF] font-bold tracking-widest uppercase mt-0.5">
              PURE SPACE NOIR // v7.0
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Tabs (Enlarged, uniform, crisp, highly legible: text-base / 16px, font-semibold) */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => {
            const active = !link.isExternal && isActive(link.href);
            return link.isExternal ? (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-base font-semibold tracking-wider text-[#94A3B8] hover:text-white uppercase transition-all duration-200 flex items-center gap-1.5 py-2 px-3 rounded-lg hover:bg-white/[0.04] border border-transparent hover:border-[#0044FF]/40"
              >
                <span>{link.name}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#0044FF]" />
              </a>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className={`font-mono text-base font-semibold tracking-wider uppercase transition-all duration-200 py-2 px-4 rounded-lg border ${
                  active
                    ? 'text-white border-[#0044FF] bg-[#0044FF]/15 shadow-[0_0_20px_rgba(0,68,255,0.35)]'
                    : 'text-[#94A3B8] border-transparent hover:text-white hover:border-[#0044FF]/40 hover:bg-white/[0.04]'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Direct Contact Pill */}
        <div className="hidden lg:flex items-center gap-4">
          <a
            href="tel:2093419608"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 bg-[#0B132B]/80 font-mono text-xs font-bold text-white hover:border-[#0044FF] hover:text-[#0044FF] hover:shadow-[0_0_20px_rgba(0,68,255,0.3)] transition-all"
          >
            <Phone className="w-3.5 h-3.5 text-[#0044FF]" />
            <span>(209) 341-9608</span>
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation drawer"
          className="lg:hidden p-3 rounded-xl bg-[#0B132B] border border-white/20 text-white hover:text-[#0044FF] hover:border-[#0044FF] transition-all focus:outline-none"
        >
          {isOpen ? <X className="w-6 h-6 text-[#0044FF]" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Touch Slide-Over Drawer with Passive Touch Passthrough */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100vh - 6rem)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ touchAction: 'pan-y' }}
            className="lg:hidden fixed inset-x-0 top-24 bottom-0 bg-[#000000] border-t border-white/15 overflow-y-auto px-6 py-8 flex flex-col justify-between"
          >
            {/* Nav Links Stack */}
            <div className="flex flex-col gap-4 pt-2">
              <div className="font-mono text-xs text-[#0044FF] tracking-widest uppercase mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>QUARTER SPOON // DIRECTORY</span>
              </div>

              {navLinks.map((link) => {
                const active = !link.isExternal && isActive(link.href);
                return link.isExternal ? (
                  <a
                    key={link.name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center justify-between p-4 rounded-xl bg-[#0B132B]/60 border border-white/10 font-mono text-lg font-bold text-white hover:border-[#0044FF] transition-all"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-4 h-4 text-[#0044FF]" />
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between p-4 rounded-xl font-mono text-lg font-bold border transition-all ${
                      active
                        ? 'bg-[#0044FF]/20 border-[#0044FF] text-white shadow-[0_0_20px_rgba(0,68,255,0.3)]'
                        : 'bg-[#0B132B]/60 border-white/10 text-white hover:border-[#0044FF]'
                    }`}
                  >
                    <span>{link.name}</span>
                    <span className="font-mono text-xs text-[#0044FF]">&gt;</span>
                  </Link>
                );
              })}
            </div>

            {/* Mobile Contact Block */}
            <div className="pt-8 border-t border-white/10 flex flex-col gap-3">
              <a
                href="tel:2093419608"
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#0B132B] border border-white/20 font-mono text-xs font-bold text-white hover:border-[#0044FF] transition-all"
              >
                <Phone className="w-4 h-4 text-[#0044FF]" />
                <span>CONTACT (209) 341-9608</span>
              </a>
              <a
                href="mailto:mrdulow12@gmail.com"
                className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-black border border-white/15 font-mono text-xs text-[#94A3B8] hover:text-white transition-all"
              >
                <Mail className="w-4 h-4 text-[#0044FF]" />
                <span>mrdulow12@gmail.com</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
