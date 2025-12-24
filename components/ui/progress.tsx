import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number; // Value should be between 0 and 100
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({ value, className }) => {
  const percentage = Math.min(Math.max(value, 0), 100); // Ensure value is between 0 and 100

  return (
    <div className={cn(
      "relative w-full h-2 bg-slate-700/30 dark:bg-slate-800/50 rounded-full overflow-hidden border border-cyan-500/20",
      className
    )}>
      <div
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(6,182,212,0.5)]"
        style={{ width: `${percentage}%` }}
      >
        {/* Animated shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      </div>
    </div>
  );
};

export default Progress;
