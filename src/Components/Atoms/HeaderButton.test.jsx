import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import HeaderButton from './HeaderButton';

describe('HeaderButton', () => {
  const defaultProps = {
    onClick: vi.fn(),
    children: 'Test Button'
  };

  it('renders with default props', () => {
    render(<HeaderButton {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('header-button', 'header-button--primary');
    expect(screen.getByText('Test Button')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(<HeaderButton {...defaultProps} iconSrc="/img/test-icon.svg" iconAlt="Test icon" />);
    
    const icon = screen.getByAltText('Test icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', '/img/test-icon.svg');
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<HeaderButton {...defaultProps} onClick={onClick} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<HeaderButton {...defaultProps} disabled={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  it('shows loading state', () => {
    render(<HeaderButton {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveClass('header-button--saving');
  });

  it('applies custom className', () => {
    render(<HeaderButton {...defaultProps} className="custom-class" />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });
}); 