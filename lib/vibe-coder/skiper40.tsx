import React, { useRef, useState, MouseEvent, ReactNode } from 'react';
import { motion, useSpring, useMotionValue, HTMLMotionProps } from 'framer-motion';

export interface SkiperButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  magneticPull?: number;
  glowColor?: string;
  onClick?: () => void;
}

export const SkiperButton: React.FC<SkiperButtonProps> = ({
  children,
  className = '',
  magneticPull = 0.35,
  glowColor = '#0044FF',
  onClick,
  ...props
}) => {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = (e.clientX - centerX) * magneticPull;
    const distanceY = (e.clientY - centerY) * magneticPull;
    x.set(distanceX);
    y.set(distanceY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center font-mono text-xs uppercase tracking-widest transition-colors duration-300 ${className}`}
      {...(props as any)}
    >
      {isHovered && (
        <span
          className="absolute inset-0 rounded-lg pointer-events-none blur-md opacity-40 transition-opacity duration-300"
          style={{ background: glowColor }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
};

export interface SkiperCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
}

export const SkiperCard: React.FC<SkiperCardProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`relative rounded-xl border border-white/10 bg-[#0B132B]/40 backdrop-blur-md ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default {
  SkiperButton,
  SkiperCard,
};
