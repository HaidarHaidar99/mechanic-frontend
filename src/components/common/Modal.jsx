import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import IconButton from './IconButton';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // 'sm' | 'md' | 'lg' | 'xl'
  className = '',
  ...props
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-3xl',
    xl: 'max-w-5xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm transition-opacity">
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`
          w-full bg-[var(--surface)] border border-[var(--border)] rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh] animate-scale-up
          ${sizes[size]}
          ${className}
        `}
        {...props}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          {title ? (
            <h2 className="text-sm font-extrabold uppercase tracking-widest text-[var(--text-primary)] font-heading">
              {title}
            </h2>
          ) : <div />}
          <IconButton
            icon={X}
            variant="ghost"
            onClick={onClose}
            aria-label="Close modal"
            className="hover:bg-[var(--surface-hover)]"
          />
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
