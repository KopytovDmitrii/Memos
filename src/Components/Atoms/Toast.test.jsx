import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Toast from './Toast';

describe('Toast', () => {
  it('renders with message', () => {
    const onClose = vi.fn();
    render(<Toast message="Test error message" onClose={onClose} />);
    
    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Toast message="Test message" onClose={onClose} />);
    
    fireEvent.click(screen.getByText('×'));
    expect(onClose).toHaveBeenCalled();
  });

  it('applies correct CSS class based on type', () => {
    const onClose = vi.fn();
    const { rerender } = render(<Toast message="Test" onClose={onClose} type="error" />);
    
    expect(screen.getByText('Test').parentElement).toHaveClass('toast', 'error');
    
    rerender(<Toast message="Test" onClose={onClose} type="success" />);
    expect(screen.getByText('Test').parentElement).toHaveClass('toast', 'success');
  });

  it('auto-closes after duration', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Toast message="Test" onClose={onClose} duration={1000} />);
    
    vi.advanceTimersByTime(1000);
    expect(onClose).toHaveBeenCalled();
    
    vi.useRealTimers();
  });
}); 