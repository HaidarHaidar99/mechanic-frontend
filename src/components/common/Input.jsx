import React from 'react';

export default function Input({
  label,
  id,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  required = false,
  error = '',
  className = '',
  icon: Icon,
  dir,
  ...props
}) {
  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-[10px] font-black text-[var(--text-secondary)] uppercase tracking-widest block font-heading">
          {label} {required && <span className="text-[var(--danger)]">*</span>}
        </label>
      )}
      <div className="relative w-full">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[var(--text-muted)]">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          dir={dir}
          className={`
            block w-full py-2.5 px-3.5 bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--input-border)] rounded-xl text-xs placeholder-[var(--input-placeholder)] transition-all font-sans focus:outline-none focus:border-[var(--input-focus)] focus:ring-4 focus:ring-[var(--input-focus)]/10
            ${Icon ? 'pl-10' : ''}
            ${error ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/10' : ''}
          `}
          {...props}
        />
      </div>
      {error && <span className="text-[10px] font-bold text-[var(--danger)] mt-0.5">{error}</span>}
    </div>
  );
}
