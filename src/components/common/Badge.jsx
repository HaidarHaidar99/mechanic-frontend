import React from 'react';

export default function Badge({
  children,
  variant = 'neutral', // 'neutral' | 'primary' | 'success' | 'warning' | 'danger'
  className = '',
  icon: Icon,
  ...props
}) {
  const variants = {
    neutral: 'bg-[var(--surface-hover)] text-[var(--text-secondary)] border-[var(--border)]',
    primary: 'bg-[var(--accent)]/10 text-[var(--accent)] border-[var(--accent)]/20',
    success: 'bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20',
    warning: 'bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20',
    danger: 'bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border select-none font-heading
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {Icon && <Icon className="w-2.5 h-2.5 shrink-0" />}
      <span>{children}</span>
    </span>
  );
}
