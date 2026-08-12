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
    expect(screen.getByText('Pan')).toBeInTheDocument();

    // Check if subtotal is shown (the total passed as prop becomes subtotal)
    expect(screen.getByText('$5.50')).toBeInTheDocument();
    
    // Check grand total (subtotal + 8% tax = 5.50 + 0.44 = 5.94)
    expect(screen.getByText('$5.94')).toBeInTheDocument();
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
    // Grand total should be $0.00 (use getAllByText since subtotal/tax/total all show $0.00)
    const zeroElements = screen.getAllByText('$0.00');
    expect(zeroElements.length).toBeGreaterThanOrEqual(1);
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
