import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import CircularButton from './CircularButton';

describe('CircularButton', () => {
  const defaultProps = {
    src: '/img/test-icon.svg',
    alt: 'Test button',
    onClick: vi.fn()
  };

  it('renders with default props', () => {
    render(<CircularButton {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('circular-button', 'circular-button--medium', 'circular-button--secondary');
  });

  it('renders with custom size', () => {
    render(<CircularButton {...defaultProps} size="large" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('circular-button--large');
  });

  it('renders with custom variant', () => {
    render(<CircularButton {...defaultProps} variant="primary" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('circular-button--primary');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<CircularButton {...defaultProps} onClick={onClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<CircularButton {...defaultProps} disabled={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('circular-button');
  });

  it('renders icon with correct props', () => {
    render(<CircularButton {...defaultProps} />);
    
    const icon = screen.getByAltText('Test button');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', '/img/test-icon.svg');
    expect(icon).toHaveClass('circular-button__icon');
  });

  it('applies custom className', () => {
    render(<CircularButton {...defaultProps} className="custom-class" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
}); 