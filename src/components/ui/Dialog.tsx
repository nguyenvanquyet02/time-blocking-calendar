import React, { useEffect, useRef } from 'react';

interface DialogProps {
  /** Whether the dialog is open */
  open: boolean;
  /** Called when the user clicks the backdrop or presses Escape */
  onClose: () => void;
  /** Dialog title shown in the header */
  title?: string;
  /** Optional subtitle / description below the title */
  subtitle?: string;
  /** Header color scheme */
  headerVariant?: 'default' | 'blue' | 'red' | 'amber';
  /** Max width of the dialog panel */
  maxWidth?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

const headerVariantClasses = {
  default: 'bg-gray-800',
  blue: 'bg-gradient-to-r from-blue-600 to-blue-500',
  red: 'bg-gradient-to-r from-red-600 to-red-500',
  amber: 'bg-amber-400',
};

const Dialog: React.FC<DialogProps> = ({
  open,
  onClose,
  title,
  subtitle,
  headerVariant = 'blue',
  maxWidth = 'md',
  children,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  // Prevent body scroll while dialog is open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        className={`bg-white rounded-2xl shadow-2xl w-full ${maxWidthClasses[maxWidth]} overflow-hidden`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
      >
        {/* Header */}
        {title && (
          <div className={`${headerVariantClasses[headerVariant]} px-6 py-4 flex items-center justify-between`}>
            <div>
              <h2 id="dialog-title" className="text-white font-semibold text-base leading-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-white/70 text-xs mt-0.5">{subtitle}</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Đóng dialog"
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors flex-shrink-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Body */}
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
};

export default Dialog;
