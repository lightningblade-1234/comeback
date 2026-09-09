import { useState, useRef, useCallback, useEffect } from 'react';

interface UseHoldToConfirmOptions {
  onConfirm: () => void;
  holdDuration?: number; // ms
}

export function useHoldToConfirm({ onConfirm, holdDuration = 1500 }: UseHoldToConfirmOptions) {
  const [progress, setProgress] = useState(0); // 0 to 1
  const [isHolding, setIsHolding] = useState(false);
  const [announced, setAnnounced] = useState<string>('');

  const startTimeRef = useRef<number | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const confirmedRef = useRef(false);

  const reset = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    startTimeRef.current = null;
    setProgress(0);
    setIsHolding(false);
    confirmedRef.current = false;
  }, []);

  const startHolding = useCallback(() => {
    if (confirmedRef.current) return;
    setIsHolding(true);
    startTimeRef.current = performance.now();
    setAnnounced('Escalation hold started');

    const update = (now: number) => {
      if (!startTimeRef.current) return;
      const elapsed = now - startTimeRef.current;
      const currentProgress = Math.min(1, elapsed / holdDuration);

      setProgress(currentProgress);

      if (currentProgress >= 0.5 && currentProgress < 0.6) {
        setAnnounced('Hold 50 percent complete');
      }

      if (currentProgress >= 1) {
        confirmedRef.current = true;
        setAnnounced('Escalation confirmed');
        setIsHolding(false);
        onConfirm();
      } else {
        animFrameRef.current = requestAnimationFrame(update);
      }
    };

    animFrameRef.current = requestAnimationFrame(update);
  }, [holdDuration, onConfirm]);

  const stopHolding = useCallback(() => {
    if (confirmedRef.current) return;
    if (isHolding) {
      setAnnounced('Hold cancelled');
    }
    reset();
  }, [isHolding, reset]);

  // Handle keyboard events
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (!isHolding && !confirmedRef.current) {
          e.preventDefault();
          startHolding();
        }
      }
    },
    [isHolding, startHolding]
  );

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        stopHolding();
      }
    },
    [stopHolding]
  );

  useEffect(() => {
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, []);

  return {
    progress,
    isHolding,
    announced,
    handlers: {
      onPointerDown: startHolding,
      onPointerUp: stopHolding,
      onPointerLeave: stopHolding,
      onKeyDown: handleKeyDown,
      onKeyUp: handleKeyUp
    },
    reset
  };
}
