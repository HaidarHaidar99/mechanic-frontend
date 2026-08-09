import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyle = 'inline-flex items-center justify-center font-heading font-bold uppercase tracking-wider text-xs rounded-xl transition-all cursor-pointer select-none active:scale-98 border focus:outline-none';

  const variants = {
    primary: 'bg-[var(--button-primary-bg)] border-transparent text-[var(--button-primary-text)] hover:bg-[var(--button-primary-hover)] active:bg-[var(--accent-active)]',
    secondary: 'bg-[var(--button-secondary-bg)] border-[var(--button-secondary-border)] text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-hover)] active:bg-[var(--surface-hover)]',
    outline: 'bg-transparent border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)]',
    ghost: 'bg-transparent border-transparent text-[var(--text-primary)] hover:bg-[var(--surface-hover)] hover:text-[var(--text-primary)]',
    danger: 'bg-[var(--danger)] border-transparent text-white hover:bg-red-700 active:bg-red-800',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-5 py-2.5 text-[11px]',
    lg: 'px-7 py-3.5 text-xs',
  };

  const disabledStyle = 'opacity-55 cursor-not-allowed active:scale-100 bg-[var(--button-disabled-bg)] text-[var(--button-disabled-text)] border-transparent hover:bg-[var(--button-disabled-bg)]';

  return (
    <button
      type={type}
      onClick={!disabled && !loading ? onClick : undefined}
      disabled={disabled || loading}
      className={`
        ${baseStyle}
        ${disabled || loading ? disabledStyle : variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {!loading && Icon && <Icon className="w-3.5 h-3.5 -ml-0.5 mr-2 shrink-0" />}
      <span>{children}</span>
    </button>
  );
}
