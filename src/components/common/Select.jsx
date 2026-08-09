import React from 'react';

export default function Select({
  label,
  id,
  value,
  onChange,
  required = false,
  options = [], // [{ value: '...', label: '...' }]
  className = '',
  error = '',
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
      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        dir={dir}
        className={`
          block w-full py-2.5 px-3.5 bg-[var(--input-bg)] text-[var(--input-text)] border border-[var(--input-border)] rounded-xl text-xs transition-all font-sans focus:outline-none focus:border-[var(--input-focus)] focus:ring-4 focus:ring-[var(--input-focus)]/10 cursor-pointer
          ${error ? 'border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/10' : ''}
        `}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-[var(--surface)] text-[var(--text-primary)]">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-[10px] font-bold text-[var(--danger)] mt-0.5">{error}</span>}
    </div>
  );
}
