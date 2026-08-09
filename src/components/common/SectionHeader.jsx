import React from 'react';

export default function SectionHeader({
  title,
  subtitle,
  category,
  align = 'left', // 'left' | 'center'
  className = '',
  ...props
}) {
  const alignments = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
  };

  return (
    <div className={`flex flex-col gap-1.5 ${alignments[align]} ${className}`} {...props}>
      {category && (
        <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest block font-heading">
          {category}
        </span>
      )}
      <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[var(--text-primary)] font-heading">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
