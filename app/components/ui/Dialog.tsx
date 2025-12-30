import * as DialogPrimitive from '@radix-ui/react-dialog';
import type { ReactNode } from 'react';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ariaLabel?: string;
  children: ReactNode;
  contentClassName?: string;
}

export default function Dialog({
  open,
  onOpenChange,
  ariaLabel,
  children,
  contentClassName = '',
}: DialogProps) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.5)] backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          aria-label={ariaLabel}
          className={`fixed left-1/2 top-1/2 z-50 max-h-[90vh] max-w-[768px] -translate-x-1/2 -translate-y-1/2 overflow-auto border-t-3 border-main-orange border-b bg-neutral-50 p-6 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] w-[90vw] sm:w-auto ${contentClassName}`}
        >
          <DialogPrimitive.Close className="absolute right-4 top-4 text-neutral-500 hover:text-neutral-700">
            <span className="material-symbols-outlined text-2xl">close</span>
          </DialogPrimitive.Close>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
