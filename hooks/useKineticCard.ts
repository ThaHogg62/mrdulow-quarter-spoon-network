import { MouseEvent, useRef, useCallback } from 'react';

interface UseKineticCardOptions {
  maxTiltDegrees?: number;
  glowColor?: string;
  neonColor?: string;
}

export const useKineticCard = <T extends HTMLElement = HTMLDivElement>(
  options: number | UseKineticCardOptions = 12
) => {
  const maxTiltDegrees = typeof options === 'number' ? options : (options.maxTiltDegrees ?? 12);
  const customGlow = typeof options === 'object' ? options.glowColor : undefined;
  const customNeon = typeof options === 'object' ? options.neonColor : undefined;

  const cardRef = useRef<T>(null);

  const handleMouseMove = useCallback(
    (e: MouseEvent<T>) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;

      const rotateX = -percentY * maxTiltDegrees;
      const rotateY = percentX * maxTiltDegrees;
      const moveX = percentX * 8;
      const moveY = percentY * 8;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
      card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
      card.style.setProperty('--mx', `${moveX.toFixed(2)}px`);
      card.style.setProperty('--my', `${moveY.toFixed(2)}px`);

      if (customGlow) {
        card.style.setProperty('--card-glow', customGlow);
      }
      if (customNeon) {
        card.style.setProperty('--card-neon', customNeon);
      }
    },
    [maxTiltDegrees, customGlow, customNeon]
  );

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;

    card.style.setProperty('--rx', '0deg');
    card.style.setProperty('--ry', '0deg');
    card.style.setProperty('--mx', '0px');
    card.style.setProperty('--my', '0px');
  }, []);

  return {
    cardRef,
    handleMouseMove,
    handleMouseLeave,
    cardProps: {
      ref: cardRef,
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
    },
  };
};

export default useKineticCard;
