import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import Button from './Button.svelte';

describe('Button Component', () => {
  it('renders correctly with default props', () => {
    const { getByRole } = render(Button);
    const button = getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn', 'btn-primary');
    expect(button).not.toBeDisabled();
  });

  it('applies variant class', () => {
    const { getByRole } = render(Button, { variant: 'danger' });
    const button = getByRole('button');
    expect(button).toHaveClass('btn-danger');
  });

  it('calls onclick handler when clicked', async () => {
    const handleClick = vi.fn();
    const { getByRole } = render(Button, { onclick: handleClick });
    const button = getByRole('button');
    
    await fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const { getByRole } = render(Button, { disabled: true });
    const button = getByRole('button');
    expect(button).toBeDisabled();
  });
});
