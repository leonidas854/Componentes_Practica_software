import { describe, it, expect } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import CartSummary from './CartSummary.svelte';

describe('Cafe Module - CartSummary Component', () => {
  const mockItems = [
    { 
      product: { id: 'p1', name: 'Café', description: 'desc', price: 2.0 }, 
      quantity: 2 
    },
    { 
      product: { id: 'p2', name: 'Pan', description: 'desc', price: 1.5 }, 
      quantity: 1 
    }
  ];

  it('renders cart items and total correctly', () => {
    // 2 * 2.0 + 1 * 1.5 = 5.5
    render(CartSummary, { 
      props: {
        items: mockItems,
        total: 5.5,
        onClearCart: () => {},
        onCheckout: () => {}
      }
    });

    // Check if items render
    expect(screen.getByText('Café')).toBeInTheDocument();
    expect(screen.getByText('x2')).toBeInTheDocument();
    expect(screen.getByText('Pan')).toBeInTheDocument();
    expect(screen.getByText('x1')).toBeInTheDocument();

    // Check if total is formatted correctly
    expect(screen.getByText('$5.50')).toBeInTheDocument();
  });

  it('shows empty state when no items', () => {
    render(CartSummary, { 
      props: {
        items: [],
        total: 0,
        onClearCart: () => {},
        onCheckout: () => {}
      }
    });

    expect(screen.getByText('No has agregado ningún producto todavía.')).toBeInTheDocument();
    expect(screen.getByText('$0.00')).toBeInTheDocument();
  });

  it('calls onCheckout when button is clicked', async () => {
    let checkedOut = false;
    
    render(CartSummary, { 
      props: {
        items: mockItems,
        total: 5.5,
        onClearCart: () => {},
        onCheckout: () => {
          checkedOut = true;
        }
      }
    });

    const checkoutBtn = screen.getByText('Procesar Pedido');
    await fireEvent.click(checkoutBtn);

    expect(checkedOut).toBe(true);
  });
});
