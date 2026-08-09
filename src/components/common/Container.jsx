import React from 'react';

export default function Container({
  children,
  className = '',
  clean = false,
  ...props
}) {
  return (
    <div
      className={`
        w-full max-w-7xl mx-auto
        ${clean ? '' : 'px-4 sm:px-6 lg:px-8'}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}
