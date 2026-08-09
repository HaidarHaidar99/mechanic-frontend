import React from 'react';

export default function IconButton({
  icon: Icon,
  variant = 'secondary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  disabled = false,
  onClick,
  className = '',
  title = '',
  type = 'button',
  ...props
}) {
  const baseStyle = 'inline-flex items-center justify-center p-2 rounded-xl transition-all cursor-pointer select-none active:scale-95 border focus:outline-none shrink-0';

  const variants = {
    primary: 'bg-[var(--button-primary-bg)] border-transparent text-[var(--button-primary-text)] hover:bg-[var(--button-primary-hover)] active:scale-95',
    secondary: 'bg-[var(--button-secondary-bg)] border-[var(--button-secondary-border)] text-[var(--button-secondary-text)] hover:bg-[var(--button-secondary-hover)] active:scale-95',
    outline: 'bg-transparent border-[var(--border-strong)] text-[var(--text-primary)] hover:bg-[var(--surface-hover)]',
    ghost: 'bg-transparent border-transparent text-[var(--text-primary)] hover:bg-[var(--surface-hover)]',
    danger: 'bg-[var(--danger)] border-transparent text-white hover:bg-red-700 active:scale-95',
  };

  const disabledStyle = 'opacity-40 cursor-not-allowed active:scale-100 bg-[var(--button-disabled-bg)] text-[var(--button-disabled-text)] border-transparent';

  return (
    <button
      type={type}
      onClick={!disabled ? onClick : undefined}
      disabled={disabled}
      title={title}
      className={`
        ${baseStyle}
        ${disabled ? disabledStyle : variants[variant]}
        ${className}
      `}
      {...props}
    >
      <Icon className="w-4.5 h-4.5" />
    </button>
  );
}
