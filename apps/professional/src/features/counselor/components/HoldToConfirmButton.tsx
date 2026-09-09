import React from 'react';
import { useHoldToConfirm } from '../hooks/useHoldToConfirm';

interface HoldToConfirmButtonProps {
  onConfirm: () => void;
  disabled?: boolean;
  isPending?: boolean;
  label?: string;
}

export function HoldToConfirmButton({
  onConfirm,
  disabled = false,
  isPending = false,
  label = 'Press & Hold to Escalate'
}: HoldToConfirmButtonProps) {
  const { progress, isHolding, announced, handlers } = useHoldToConfirm({
    onConfirm,
    holdDuration: 1500
  });

  const radius = 8;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  return (
    <div>
      <button
        type="button"
        className={`hold-confirm-button ${isHolding ? 'is-holding' : ''}`}
        disabled={disabled || isPending}
        aria-valuenow={Math.round(progress * 100)}
        aria-valuemin={0}
        aria-valuemax={100}
        role="progressbar"
        aria-label="Hold to confirm escalation to supervisor"
        {...handlers}
      >
        <svg className="hold-ring-svg" viewBox="0 0 20 20" aria-hidden="true">
          <circle className="hold-ring-bg" cx="10" cy="10" r={radius} fill="none" />
          <circle
            className="hold-ring-fill"
            cx="10"
            cy="10"
            r={radius}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <span>
          {isPending
            ? 'Escalating...'
            : isHolding
            ? `Holding (${Math.round(progress * 100)}%)`
            : label}
        </span>
      </button>

      {/* Screen Reader Live Region for Announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        {announced}
      </div>
    </div>
  );
}
