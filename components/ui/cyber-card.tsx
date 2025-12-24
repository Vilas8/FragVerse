import React from 'react';
import { cn } from '@/lib/utils';

interface CyberCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'cyan' | 'purple' | 'pink' | 'gold';
  glow?: boolean;
  glass?: boolean;
  hover?: boolean;
  children: React.ReactNode;
}

export const CyberCard = React.forwardRef<HTMLDivElement, CyberCardProps>(
  (
    {
      variant = 'default',
      glow = false,
      glass = true,
      hover = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'relative rounded-2xl border transition-all duration-300';

    const variantStyles = {
      default: 'bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50',
      cyan: 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30',
      purple: 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30',
      pink: 'bg-gradient-to-br from-pink-500/10 to-rose-500/10 border-pink-500/30',
      gold: 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30',
    };

    const glowStyles = {
      default: '',
      cyan: 'shadow-[0_0_20px_rgba(6,182,212,0.2)]',
      purple: 'shadow-[0_0_20px_rgba(168,85,247,0.2)]',
      pink: 'shadow-[0_0_20px_rgba(236,72,153,0.2)]',
      gold: 'shadow-[0_0_20px_rgba(234,179,8,0.2)]',
    };

    const hoverStyles = hover
      ? {
          default: 'hover:border-slate-600/70 hover:scale-[1.02]',
          cyan: 'hover:border-cyan-400/50 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(6,182,212,0.3)]',
          purple: 'hover:border-purple-400/50 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]',
          pink: 'hover:border-pink-400/50 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(236,72,153,0.3)]',
          gold: 'hover:border-yellow-400/50 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(234,179,8,0.3)]',
        }
      : {};

    return (
      <div
        ref={ref}
        className={cn(
          baseStyles,
          variantStyles[variant],
          glow && glowStyles[variant],
          hover && hoverStyles[variant],
          glass && 'backdrop-blur-sm',
          className
        )}
        {...props}
      >
        {/* Hover overlay gradient */}
        {hover && (
          <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/0 rounded-2xl transition-all pointer-events-none" />
        )}
        
        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    );
  }
);

CyberCard.displayName = 'CyberCard';

// Card Header Component
interface CyberCardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CyberCardHeader = React.forwardRef<HTMLDivElement, CyberCardHeaderProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 pb-4', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CyberCardHeader.displayName = 'CyberCardHeader';

// Card Title Component
interface CyberCardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  glow?: boolean;
}

export const CyberCardTitle = React.forwardRef<HTMLHeadingElement, CyberCardTitleProps>(
  ({ className, children, glow = false, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(
        'text-2xl font-bold text-white',
        glow && 'text-glow',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  )
);

CyberCardTitle.displayName = 'CyberCardTitle';

// Card Content Component
interface CyberCardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CyberCardContent = React.forwardRef<HTMLDivElement, CyberCardContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 pt-0', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CyberCardContent.displayName = 'CyberCardContent';

// Card Footer Component
interface CyberCardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CyberCardFooter = React.forwardRef<HTMLDivElement, CyberCardFooterProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('p-6 pt-4 border-t border-white/10', className)}
      {...props}
    >
      {children}
    </div>
  )
);

CyberCardFooter.displayName = 'CyberCardFooter';

// Badge Component for Cards
interface CyberBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'purple' | 'pink' | 'green' | 'red' | 'gold';
  children: React.ReactNode;
}

export const CyberBadge = React.forwardRef<HTMLSpanElement, CyberBadgeProps>(
  ({ variant = 'cyan', className, children, ...props }, ref) => {
    const variantStyles = {
      cyan: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50',
      purple: 'bg-purple-500/20 text-purple-300 border-purple-500/50',
      pink: 'bg-pink-500/20 text-pink-300 border-pink-500/50',
      green: 'bg-green-500/20 text-green-300 border-green-500/50',
      red: 'bg-red-500/20 text-red-300 border-red-500/50',
      gold: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-sm',
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

CyberBadge.displayName = 'CyberBadge';
