import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  it('renders with default text', () => {
    render(<Loader />);
    expect(screen.getByText('Загрузка...')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    render(<Loader text="Custom loading text" />);
    expect(screen.getByText('Custom loading text')).toBeInTheDocument();
  });

  it('has loader element', () => {
    render(<Loader />);
    expect(screen.getByText('Загрузка...').previousElementSibling).toHaveClass('loader');
  });
}); 