import React from 'react';
import Button from './Button';

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionText,
  onActionClick,
  actionLink: LinkComponent, // If passing a Router Link
  actionTo, // Router Link target
  className = '',
}) {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 sm:p-12 border border-dashed border-[var(--border-strong)] rounded-3xl bg-[var(--surface-elevated)]/30 animate-fade-in ${className}`}>
      {Icon && (
        <div className="p-4 bg-[var(--surface-hover)] text-[var(--accent)] rounded-2xl mb-4 animate-pulse">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-base font-extrabold uppercase tracking-widest text-[var(--text-primary)] font-heading mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-xs text-[var(--text-secondary)] max-w-sm mb-6 leading-relaxed">
          {description}
        </p>
      )}
      {actionText && (
        <>
          {LinkComponent && actionTo ? (
            <LinkComponent
              to={actionTo}
              className="inline-flex items-center justify-center font-heading font-bold uppercase tracking-wider text-[11px] rounded-xl px-5 py-2.5 bg-[var(--button-primary-bg)] text-[var(--button-primary-text)] hover:bg-[var(--button-primary-hover)] transition-all cursor-pointer shadow-md active:scale-98"
            >
              {actionText}
            </LinkComponent>
          ) : (
            <Button variant="primary" onClick={onActionClick}>
              {actionText}
            </Button>
          )}
        </>
      )}
    </div>
  );
}
