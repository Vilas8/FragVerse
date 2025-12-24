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
    const baseStyles =
      'relative rounded-2xl border transition-all duration-300';

    // Background + border are now suitable for light AND dark themes.
    const variantStyles: Record<NonNullable<CyberCardProps['variant']>, string> =
      {
        default:
          // dark card
          'bg-gradient-to-br from-slate-900/90 to-slate-800/90 border-slate-700/50 text-slate-100',
        cyan:
          // light gradient by default, dark when parent has .dark
          'bg-gradient-to-br from-sky-50 via-cyan-50 to-purple-50 border-cyan-200 text-slate-900 ' +
          'dark:from-cyan-500/10 dark:via-slate-900 dark:to-blue-500/10 dark:border-cyan-500/30 dark:text-slate-100',
        purple:
          'bg-gradient-to-br from-purple-50 via-pink-50 to-slate-50 border-purple-200 text-slate-900 ' +
          'dark:from-purple-500/10 dark:via-slate-900 dark:to-pink-500/10 dark:border-purple-500/30 dark:text-slate-100',
        pink:
          'bg-gradient-to-br from-pink-50 via-rose-50 to-slate-50 border-pink-200 text-slate-900 ' +
          'dark:from-pink-500/10 dark:via-slate-900 dark:to-rose-500/10 dark:border-pink-500/30 dark:text-slate-100',
        gold:
          'bg-gradient-to-br from-amber-50 via-yellow-50 to-slate-50 border-amber-200 text-slate-900 ' +
          'dark:from-yellow-500/10 dark:via-slate-900 dark:to-orange-500/10 dark:border-yellow-500/30 dark:text-slate-100',
      };

    const glowStyles = {
      default: '',
      cyan: 'shadow-[0_0_20px_rgba(6,182,212,0.2)] dark:shadow-[0_0_20px_rgba(6,182,212,0.25)]',
      purple:
        'shadow-[0_0_20px_rgba(168,85,247,0.18)] dark:shadow-[0_0_20px_rgba(168,85,247,0.25)]',
      pink: 'shadow-[0_0_20px_rgba(236,72,153,0.18)] dark:shadow-[0_0_20px_rgba(236,72,153,0.25)]',
      gold: 'shadow-[0_0_20px_rgba(234,179,8,0.18)] dark:shadow-[0_0_20px_rgba(234,179,8,0.25)]',
    };

    const hoverStyles = hover
      ? {
          default:
            'hover:border-slate-600/70 hover:scale-[1.02]',
          cyan: 'hover:border-cyan-400/60 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(6,182,212,0.25)]',
          purple:
            'hover:border-purple-400/60 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.25)]',
          pink: 'hover:border-pink-400/60 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(236,72,153,0.25)]',
          gold: 'hover:border-yellow-400/60 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(234,179,8,0.25)]',
        }
      : {};

    return (
      <div
        ref={ref}
        className={cn(
          'group',
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
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 to-white/0 group-hover:from-white/5 group-hover:to-white/0 transition-all pointer-events-none" />
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

export const CyberCardHeader = React.forwardRef<
  HTMLDivElement,
  CyberCardHeaderProps
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pb-4', className)} {...props}>
    {children}
  </div>
));

CyberCardHeader.displayName = 'CyberCardHeader';

// Card Title Component
interface CyberCardTitleProps extends
  React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  glow?: boolean;
}

export const CyberCardTitle = React.forwardRef<
  HTMLHeadingElement,
  CyberCardTitleProps
>(({ className, children, glow = false, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      // default to dark text in light mode, white in dark mode
      'text-2xl font-bold text-slate-900 dark:text-white',
      glow && 'text-glow',
      className
    )}
    {...props}
  >
    {children}
  </h3>
));

CyberCardTitle.displayName = 'CyberCardTitle';

// Card Content Component
interface CyberCardContentProps extends
  React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CyberCardContent = React.forwardRef<
  HTMLDivElement,
  CyberCardContentProps
>(({ className, children, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props}>
    {children}
  </div>
));

CyberCardContent.displayName = 'CyberCardContent';

// Card Footer Component
interface CyberCardFooterProps extends
  React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const CyberCardFooter = React.forwardRef<
  HTMLDivElement,
  CyberCardFooterProps
>(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'p-6 pt-4 border-t border-slate-200/60 dark:border-white/10',
      className
    )}
    {...props}
  >
    {children}
  </div>
));

CyberCardFooter.displayName = 'CyberCardFooter';

// Badge Component for Cards
interface CyberBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'cyan' | 'purple' | 'pink' | 'green' | 'red' | 'gold';
  children: React.ReactNode;
}

export const CyberBadge = React.forwardRef<HTMLSpanElement, CyberBadgeProps>(
  ({ variant = 'cyan', className, children, ...props }, ref) => {
    // lighter backgrounds + darker text in light mode; neon in dark mode
    const variantStyles: Record<NonNullable<CyberBadgeProps['variant']>, string> =
      {
        cyan:
          'bg-cyan-100 text-slate-800 border-cyan-300 ' +
          'dark:bg-cyan-500/20 dark:text-cyan-300 dark:border-cyan-500/50',
        purple:
          'bg-purple-100 text-slate-800 border-purple-300 ' +
          'dark:bg-purple-500/20 dark:text-purple-300 dark:border-purple-500/50',
        pink:
          'bg-pink-100 text-slate-800 border-pink-300 ' +
          'dark:bg-pink-500/20 dark:text-pink-300 dark:border-pink-500/50',
        green:
          'bg-emerald-100 text-slate-800 border-emerald-300 ' +
          'dark:bg-green-500/20 dark:text-green-300 dark:border-green-500/50',
        red:
          'bg-rose-100 text-slate-800 border-rose-300 ' +
          'dark:bg-red-500/20 dark:text-red-300 dark:border-red-500/50',
        gold:
          'bg-amber-100 text-slate-800 border-amber-300 ' +
          'dark:bg-yellow-500/20 dark:text-yellow-300 dark:border-yellow-500/50',
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
