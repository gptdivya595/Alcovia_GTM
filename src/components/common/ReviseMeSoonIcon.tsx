import React from 'react';

interface ReviseMeSoonIconProps {
  className?: string;
}

/**
 * Custom 'Revise Me Soon' Icon.
 * Features a circular revision return loop around a ticking clock with urgency alarm ears,
 * explicitly signifying spaced repetition test revision that is due soon.
 */
export const ReviseMeSoonIcon: React.FC<ReviseMeSoonIconProps> = ({
  className = 'w-4 h-4',
}) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-label="Revise Me Soon Icon"
    >
      {/* Central clock face representing upcoming exam time */}
      <circle cx="12" cy="13" r="7.5" />
      {/* Clock hands pointing to the hour */}
      <polyline points="12 9.5 12 13 14.5 14.5" />
      {/* Top curved revision arrow showing return/retrieval cycle */}
      <path d="M6 5.5A9 9 0 0 1 18 5.5" />
      <polyline points="14.5 5.5 18 5.5 18 9" />
      {/* Urgency ticks / Alarm ears */}
      <line x1="3" y1="5" x2="4.5" y2="6.5" />
      <line x1="21" y1="5" x2="19.5" y2="6.5" />
    </svg>
  );
};
