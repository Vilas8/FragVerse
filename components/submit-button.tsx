'use client';

import { CyberButton } from '@/components/ui/cyber-button';
import { type ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

type Props = ComponentProps<typeof CyberButton> & {
  pendingText?: string;
};

export function SubmitButton({
  children,
  pendingText = 'Submitting...',
  variant = 'primary',
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <CyberButton 
      type="submit" 
      aria-disabled={pending} 
      disabled={pending}
      variant={variant}
      fullWidth
      {...props}
    >
      {pending ? (
        <div className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          {pendingText}
        </div>
      ) : (
        children
      )}
    </CyberButton>
  );
}
