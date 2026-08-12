import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/svelte';
import CartSummary from './components/CartSummary.svelte';
import CategoryNav from './components/CategoryNav.svelte';
import ProductCard from './components/ProductCard.svelte';
import { CATEGORIES, MENU, countByCategory, filterMenu } from './data/menu';
import { Order } from './models/Order.svelte';
import type { Product } from './models/types';

const COFFEE: Product = {
  id: 'c1',
  name: 'Espresso',
  description: 'Shot intenso',
  price: 3.5,
  category: 'coffee'
};

const SOLD_OUT: Product = {
  ...COFFEE,
  id: 'c6',
  name: 'Flat White',
  image: 'https://example.test/flat-white.jpg',
  available: false
};

const noop = () => {};

function buildOrder(entries: [Product, number][] = []): Order {
  const order = new Order();
  for (const [product, quantity] of entries) order.add(product, quantity);
  return order;
}

describe('PRÁCTICA 2 — Filtrado de la carta', () => {
  it('filtra por categoría', () => {
    const coffees = filterMenu(MENU, 'coffee', '');

    expect(coffees.length).toBeGreaterThan(0);
    expect(coffees.every((product) => product.category === 'coffee')).toBe(true);
  });

  it('devuelve toda la carta cuando no hay categoría', () => {
    expect(filterMenu(MENU, null, '')).toHaveLength(MENU.length);
  });

  it('busca por nombre y por descripción, ignorando mayúsculas', () => {
    expect(filterMenu(MENU, null, 'ESPRESSO').some((p) => p.name === 'Espresso')).toBe(true);
    expect(filterMenu(MENU, null, 'arándanos').length).toBeGreaterThan(0);
  });

  it('combina categoría y búsqueda', () => {
    expect(filterMenu(MENU, 'pastry', 'espresso')).toHaveLength(0);
  });

  it('cuenta los productos de cada categoría', () => {
    const counts = countByCategory(MENU);
    const sum = Object.values(counts).reduce((total, value) => total + value, 0);

    expect(sum).toBe(MENU.length);
    expect(counts.coffee).toBe(MENU.filter((p) => p.category === 'coffee').length);
  });
});

describe('PRÁCTICA 2 — Componente ProductCard', () => {
  it('muestra el nombre y el precio formateado', () => {
    render(ProductCard, {
      props: { product: COFFEE, quantity: 0, onAdd: noop, onSetQuantity: noop }
    });

    expect(screen.getByText('Espresso')).toBeInTheDocument();
    expect(screen.getByText('$3.50')).toBeInTheDocument();
  });

  it('EVENTO CLICK: avisa al añadir el producto', async () => {
    const onAdd = vi.fn();
    render(ProductCard, { props: { product: COFFEE, quantity: 0, onAdd, onSetQuantity: noop } });

    await fireEvent.click(screen.getByLabelText('Añadir Espresso al pedido'));

    expect(onAdd).toHaveBeenCalledWith(COFFEE);
  });

  it('cambia el botón por el selector de cantidad cuando ya está en el pedido', () => {
    render(ProductCard, { props: { product: COFFEE, quantity: 2, onAdd: noop, onSetQuantity: noop } });

    expect(screen.queryByLabelText('Añadir Espresso al pedido')).not.toBeInTheDocument();
    expect(screen.getByLabelText('cantidad de Espresso')).toHaveValue(2);
  });

  it('EVENTO CLICK en el selector: comunica la nueva cantidad', async () => {
    const onSetQuantity = vi.fn();
    render(ProductCard, { props: { product: COFFEE, quantity: 2, onAdd: noop, onSetQuantity } });

    await fireEvent.click(screen.getByLabelText('Aumentar cantidad de Espresso'));
    expect(onSetQuantity).toHaveBeenCalledWith('c1', 3);

    await fireEvent.click(screen.getByLabelText('Disminuir cantidad de Espresso'));
    expect(onSetQuantity).toHaveBeenCalledWith('c1', 1);
  });

  it('EVENTO CHANGE: acota la cantidad escrita a mano al máximo permitido', async () => {
    const onSetQuantity = vi.fn();
    render(ProductCard, { props: { product: COFFEE, quantity: 2, onAdd: noop, onSetQuantity } });

    const input = screen.getByLabelText('cantidad de Espresso');
    await fireEvent.change(input, { target: { value: '999' } });

    expect(onSetQuantity).toHaveBeenCalledWith('c1', 20);
  });

  it('señala los productos agotados y no ofrece añadirlos', () => {
    render(ProductCard, {
      props: { product: SOLD_OUT, quantity: 0, onAdd: noop, onSetQuantity: noop }
    });

    expect(screen.getByText('Agotado')).toBeInTheDocument();
    expect(screen.getByText('No disponible')).toBeInTheDocument();
    expect(screen.queryByLabelText(/^Añadir/)).not.toBeInTheDocument();
  });
});

describe('PRÁCTICA 2 — Componente CategoryNav', () => {
  it('EVENTO CLICK: comunica la categoría elegida', async () => {
    const onSelect = vi.fn();
    render(CategoryNav, {
      props: {
        categories: CATEGORIES,
        selectedId: null,
        counts: countByCategory(MENU),
        totalCount: MENU.length,
        onSelect
      }
    });

    await fireEvent.click(screen.getByText('Pastelería'));
    expect(onSelect).toHaveBeenCalledWith('pastry');

    await fireEvent.click(screen.getByText('Toda la carta'));
    expect(onSelect).toHaveBeenCalledWith(null);
  });
});

describe('PRÁCTICA 2 — Componente CartSummary', () => {
  const handlers = {
    onSetQuantity: noop,
    onSetNote: noop,
    onRemove: noop,
    onServiceModeChange: noop,
    onClear: noop,
    onCheckout: noop
  };

  it('muestra el estado vacío sin productos', () => {
    render(CartSummary, { props: { order: buildOrder(), ...handlers } });

    expect(screen.getByText('Aún no hay productos')).toBeInTheDocument();
    expect(screen.getByText('Procesar pedido').closest('button')).toBeDisabled();
  });

  it('detalla las líneas y calcula el total automáticamente', () => {
    // 2 × 3.50 = 7.00 → impuesto 0.56 → total 7.56
    render(CartSummary, { props: { order: buildOrder([[COFFEE, 2]]), ...handlers } });

    expect(screen.getByText('Espresso')).toBeInTheDocument();
    expect(screen.getByText('$3.50 × 2')).toBeInTheDocument();
    // $7.00 aparece dos veces: importe de la línea y subtotal del pedido.
    expect(screen.getAllByText('$7.00')).toHaveLength(2);
    expect(screen.getByText('Subtotal (2 artículos)')).toBeInTheDocument();
    expect(screen.getByText('$0.56')).toBeInTheDocument();
    expect(screen.getByText('$7.56')).toBeInTheDocument();
  });

  it('muestra el descuento al superar el umbral', () => {
    // 10 × 3.50 = 35.00 → descuento 3.50
    render(CartSummary, { props: { order: buildOrder([[COFFEE, 10]]), ...handlers } });

    expect(screen.getByText('Descuento por volumen (10 %)')).toBeInTheDocument();
    expect(screen.getByText('−$3.50')).toBeInTheDocument();
    expect(screen.getByText('$34.02')).toBeInTheDocument();
  });

  it('EVENTO CLICK: procesa el pedido', async () => {
    const onCheckout = vi.fn();
    render(CartSummary, {
      props: { order: buildOrder([[COFFEE, 1]]), ...handlers, onCheckout }
    });

    await fireEvent.click(screen.getByText('Procesar pedido'));
    expect(onCheckout).toHaveBeenCalledTimes(1);
  });

  it('EVENTO INPUT: comunica la nota escrita para una línea', async () => {
    const onSetNote = vi.fn();
    render(CartSummary, {
      props: { order: buildOrder([[COFFEE, 1]]), ...handlers, onSetNote }
    });

    await fireEvent.input(screen.getByLabelText('Nota para Espresso'), {
      target: { value: 'sin azúcar' }
    });

    expect(onSetNote).toHaveBeenCalledWith('c1', 'sin azúcar');
  });

  it('EVENTO CLICK: cambia la modalidad de servicio', async () => {
    const onServiceModeChange = vi.fn();
    render(CartSummary, {
      props: { order: buildOrder([[COFFEE, 1]]), ...handlers, onServiceModeChange }
    });

    await fireEvent.click(screen.getByText('Para llevar'));
    expect(onServiceModeChange).toHaveBeenCalledWith('takeaway');
  });
});
