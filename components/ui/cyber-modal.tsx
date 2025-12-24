import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { CyberButton } from './cyber-button';

interface CyberModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'cyan' | 'purple' | 'pink' | 'default';
}

export const CyberModal: React.FC<CyberModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'lg',
  variant = 'cyan',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-[95vw]',
  };

  const variantColors = {
    cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    pink: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
    default: 'from-slate-700/20 to-slate-600/20 border-slate-600/30',
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in-0"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className={cn(
            'relative w-full pointer-events-auto',
            'bg-gradient-to-br backdrop-blur-xl border-2 rounded-2xl shadow-2xl',
            'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4',
            'max-h-[90vh] overflow-hidden flex flex-col',
            sizeClasses[size],
            variantColors[variant]
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-slate-950/95" />
          
          {/* Glow effect */}
          {variant !== 'default' && (
            <div
              className={cn(
                'absolute inset-0 opacity-20',
                variant === 'cyan' && 'bg-gradient-to-br from-cyan-500/30 via-transparent to-blue-500/30',
                variant === 'purple' && 'bg-gradient-to-br from-purple-500/30 via-transparent to-pink-500/30',
                variant === 'pink' && 'bg-gradient-to-br from-pink-500/30 via-transparent to-rose-500/30'
              )}
            />
          )}

          {/* Header */}
          {(title || description) && (
            <div className="relative p-6 pb-4 border-b border-white/10">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {title && (
                    <h2
                      className={cn(
                        'text-2xl font-black mb-1',
                        variant === 'cyan' && 'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent',
                        variant === 'purple' && 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent',
                        variant === 'pink' && 'bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent',
                        variant === 'default' && 'text-white'
                      )}
                    >
                      {title}
                    </h2>
                  )}
                  {description && (
                    <p className="text-sm text-cyan-100/60">{description}</p>
                  )}
                </div>
                <CyberButton
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="ml-4 flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </CyberButton>
              </div>
            </div>
          )}

          {/* Content */}
          <div className="relative flex-1 overflow-y-auto p-6">
            {children}
          </div>

          {/* Decorative bottom glow */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 h-px',
              variant === 'cyan' && 'bg-gradient-to-r from-transparent via-cyan-500 to-transparent',
              variant === 'purple' && 'bg-gradient-to-r from-transparent via-purple-500 to-transparent',
              variant === 'pink' && 'bg-gradient-to-r from-transparent via-pink-500 to-transparent'
            )}
          />
        </div>
      </div>
    </>
  );
};

// Modal Footer Component
interface CyberModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CyberModalFooter: React.FC<CyberModalFooterProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'relative flex items-center justify-end gap-3 p-6 pt-4 border-t border-white/10',
        className
      )}
    >
      {children}
    </div>
  );
};
