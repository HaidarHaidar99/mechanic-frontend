import React from 'react';

export default function Skeleton({
  variant = 'text', // 'text' | 'rect' | 'circle'
  width = '100%',
  height,
  className = '',
  ...props
}) {
  const styles = {
    text: 'h-3 rounded-lg',
    rect: 'rounded-xl',
    circle: 'rounded-full',
  };

  const defaultHeights = {
    text: '12px',
    rect: '100px',
    circle: '40px',
  };

  return (
    <div
      className={`bg-[var(--border-strong)] animate-pulse ${styles[variant]} ${className}`}
      style={{
        width,
        height: height || defaultHeights[variant],
      }}
      {...props}
    />
  );
}
