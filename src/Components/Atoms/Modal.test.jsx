import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Modal from './Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    title: 'Test Modal',
    message: 'Are you sure you want to delete this item?',
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    onClose: vi.fn()
  };

  it('renders when isOpen is true', () => {
    render(<Modal {...defaultProps} />);
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Test Modal')).not.toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    render(<Modal {...defaultProps} onConfirm={onConfirm} />);
    
    const confirmButton = screen.getByText('Удалить');
    fireEvent.click(confirmButton);
    
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();
    render(<Modal {...defaultProps} onCancel={onCancel} />);
    
    const cancelButton = screen.getByText('Отмена');
    fireEvent.click(cancelButton);
    
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when overlay is clicked', () => {
    const onClose = vi.fn();
    render(<Modal {...defaultProps} onClose={onClose} />);
    
    const overlay = screen.getByRole('button', { name: 'Отмена' }).parentElement.parentElement.parentElement;
    fireEvent.click(overlay);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('shows custom text for buttons', () => {
    render(<Modal 
      {...defaultProps} 
      confirmText="Delete Item"
      cancelText="Keep Item"
    />);
    
    expect(screen.getByText('Delete Item')).toBeInTheDocument();
    expect(screen.getByText('Keep Item')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    render(<Modal {...defaultProps} isLoading={true} />);
    
    expect(screen.getByText('Удаление...')).toBeInTheDocument();
    expect(screen.getByText('Удаление...')).toBeDisabled();
  });

  it('uses default title when not provided', () => {
    render(<Modal {...defaultProps} title={undefined} />);
    
    expect(screen.getByText('Подтверждение')).toBeInTheDocument();
  });
}); 