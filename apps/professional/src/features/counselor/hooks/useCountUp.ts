import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from './useReducedMotion';

export function useCountUp(target: number, duration = 0.4): number {
  const [displayValue, setDisplayValue] = useState<number>(target);
  const reducedMotion = useReducedMotion();
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayValue(target);
      return;
    }

    const obj = { value: 0 };
    tweenRef.current = gsap.to(obj, {
      value: target,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplayValue(Math.round(obj.value));
      }
    });

    return () => {
      tweenRef.current?.kill();
    };
  }, [target, duration, reducedMotion]);

  return displayValue;
}
