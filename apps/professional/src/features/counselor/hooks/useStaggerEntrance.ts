import { type Variants } from 'motion/react';
import { useReducedMotion } from './useReducedMotion';

export function useStaggerEntrance(staggerDelay = 0.04) {
  const reducedMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reducedMotion ? 0 : staggerDelay
      }
    }
  };

  const itemVariants: Variants = {
    hidden: reducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: reducedMotion ? 0 : 0.2,
        ease: [0.16, 1, 0.3, 1] as const
      }
    }
  };

  return { containerVariants, itemVariants, reducedMotion };
}
