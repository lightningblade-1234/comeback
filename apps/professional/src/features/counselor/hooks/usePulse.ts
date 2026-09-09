import { useState, useCallback } from 'react';
import { useReducedMotion } from './useReducedMotion';

export function usePulse() {
  const [isPulsing, setIsPulsing] = useState(false);
  const reducedMotion = useReducedMotion();

  const trigger = useCallback(() => {
    setIsPulsing(true);
    const timer = setTimeout(() => {
      setIsPulsing(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const pulseStyle = isPulsing
    ? reducedMotion
      ? { opacity: 0.6 }
      : { transform: 'scale(1.04)', transition: 'transform 150ms ease-out, opacity 150ms ease-out' }
    : { transform: 'scale(1)', transition: 'transform 150ms ease-out, opacity 150ms ease-out' };

  return { isPulsing, trigger, pulseStyle };
}
