import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

// Cyber Input Component
interface CyberInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  label?: string;
  error?: string;
}

export const CyberInput = React.forwardRef<HTMLInputElement, CyberInputProps>(
  ({ className, icon: Icon, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="text-sm font-semibold text-cyan-300 uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full px-4 py-3 bg-slate-900/50 backdrop-blur-sm border-2 border-cyan-500/30 rounded-xl',
              'text-white placeholder:text-cyan-100/30',
              'focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)]',
              'transition-all duration-300',
              'hover:border-cyan-400/50',
              Icon && 'pl-12',
              error && 'border-red-500/50 focus:border-red-400',
              className
            )}
            {...props}
          />
          {/* Glow effect on focus */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 via-cyan-500/0 to-cyan-500/0 opacity-0 focus-within:opacity-20 transition-opacity pointer-events-none blur-xl" />
        </div>
        {error && (
          <p className="text-sm text-red-400 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);

CyberInput.displayName = 'CyberInput';

// Cyber Textarea Component
interface CyberTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const CyberTextarea = React.forwardRef<HTMLTextAreaElement, CyberTextareaProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="text-sm font-semibold text-cyan-300 uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            ref={ref}
            className={cn(
              'w-full px-4 py-3 bg-slate-900/50 backdrop-blur-sm border-2 border-cyan-500/30 rounded-xl',
              'text-white placeholder:text-cyan-100/30',
              'focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)]',
              'transition-all duration-300',
              'hover:border-cyan-400/50',
              'resize-none',
              error && 'border-red-500/50 focus:border-red-400',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-400 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);

CyberTextarea.displayName = 'CyberTextarea';

// Cyber Select Component
interface CyberSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: LucideIcon;
}

export const CyberSelect = React.forwardRef<HTMLSelectElement, CyberSelectProps>(
  ({ className, label, error, icon: Icon, children, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="text-sm font-semibold text-cyan-300 uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <select
            ref={ref}
            className={cn(
              'w-full px-4 py-3 bg-slate-900/50 backdrop-blur-sm border-2 border-cyan-500/30 rounded-xl',
              'text-white',
              'focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(6,182,212,0.3)]',
              'transition-all duration-300',
              'hover:border-cyan-400/50',
              'appearance-none cursor-pointer',
              Icon && 'pl-12',
              error && 'border-red-500/50 focus:border-red-400',
              className
            )}
            {...props}
          >
            {children}
          </select>
          {/* Custom dropdown arrow */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 pointer-events-none">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {error && (
          <p className="text-sm text-red-400 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);

CyberSelect.displayName = 'CyberSelect';

// Cyber Checkbox Component
interface CyberCheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const CyberCheckbox = React.forwardRef<HTMLInputElement, CyberCheckboxProps>(
  ({ className, label, id, ...props }, ref) => {
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={cn(
              'w-5 h-5 appearance-none bg-slate-900/50 border-2 border-cyan-500/30 rounded cursor-pointer',
              'checked:bg-gradient-to-br checked:from-cyan-500 checked:to-blue-600 checked:border-cyan-400',
              'focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:ring-offset-2 focus:ring-offset-slate-900',
              'transition-all duration-200',
              'hover:border-cyan-400/50',
              className
            )}
            {...props}
          />
          {/* Checkmark */}
          <svg
            className="absolute inset-0 w-5 h-5 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        {label && (
          <label 
            htmlFor={checkboxId}
            className="text-sm text-cyan-100 cursor-pointer hover:text-cyan-300 transition-colors"
          >
            {label}
          </label>
        )}
      </div>
    );
  }
);

CyberCheckbox.displayName = 'CyberCheckbox';

// Cyber Form Container
interface CyberFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const CyberForm = React.forwardRef<HTMLFormElement, CyberFormProps>(
  ({ title, description, children, className, ...props }, ref) => {
    return (
      <form
        ref={ref}
        className={cn('space-y-6', className)}
        {...props}
      >
        {(title || description) && (
          <div className="space-y-2 mb-8">
            {title && (
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-cyan-100/70">{description}</p>
            )}
          </div>
        )}
        {children}
      </form>
    );
  }
);

CyberForm.displayName = 'CyberForm';
