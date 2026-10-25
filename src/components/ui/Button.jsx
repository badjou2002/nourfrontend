import React from 'react';

const variants = {
  primary: 'btn-primary',
  teal: 'btn-teal',
  terracotta: 'btn-terracotta',
  outline: 'btn-outline',
  ghost: 'btn-ghost',
};

const sizes = {
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
};

export default function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  return (
    <button className={`btn ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`} {...props}>
      {children}
    </button>
  );
}
