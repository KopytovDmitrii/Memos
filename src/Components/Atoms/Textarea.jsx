import React, { forwardRef } from 'react';
import './Textarea.css';

const Textarea = forwardRef(({ value, onChange, placeholder, className = '' }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`textarea ${className}`}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  );
});

Textarea.displayName = 'Textarea';

export default Textarea; 