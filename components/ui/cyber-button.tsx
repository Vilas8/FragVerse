import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glow';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      fullWidth = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'group relative font-bold transition-all duration-300 rounded-xl overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed';

    const sizeStyles = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
      xl: 'px-10 py-5 text-xl',
    };

    const variantStyles = {
      primary: 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] border border-cyan-400/30',
      secondary: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border-2 border-purple-500/50 text-white hover:bg-purple-500/30 hover:border-purple-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]',
      danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:scale-105 hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] border border-red-400/30',
      ghost: 'bg-white/5 backdrop-blur-sm border border-white/10 text-white hover:bg-white/10 hover:border-white/20',
      glow: 'bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white hover:scale-110 hover:shadow-[0_0_50px_rgba(6,182,212,0.6)] border border-transparent',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {/* Hover overlay */}
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
        {variant === 'glow' && (
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}

        {/* Content */}
        <span className="relative flex items-center justify-center gap-2">
          {Icon && iconPosition === 'left' && <Icon className="w-5 h-5" />}
          {children}
          {Icon && iconPosition === 'right' && <Icon className="w-5 h-5" />}
        </span>
      </button>
    );
  }
);

CyberButton.displayName = 'CyberButton';

// Preset button styles for common use cases
export const CyberButtonPresets = {
  Primary: (props: Omit<CyberButtonProps, 'variant'>) => (
    <CyberButton variant="primary" {...props} />
  ),
  Secondary: (props: Omit<CyberButtonProps, 'variant'>) => (
    <CyberButton variant="secondary" {...props} />
  ),
  Danger: (props: Omit<CyberButtonProps, 'variant'>) => (
    <CyberButton variant="danger" {...props} />
  ),
  Ghost: (props: Omit<CyberButtonProps, 'variant'>) => (
    <CyberButton variant="ghost" {...props} />
  ),
  Glow: (props: Omit<CyberButtonProps, 'variant'>) => (
    <CyberButton variant="glow" {...props} />
  ),
};
