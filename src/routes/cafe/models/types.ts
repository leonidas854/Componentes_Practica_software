/**
 * PRÁCTICA 2 — Registro de pedidos de la cafetería.
 * Capa de modelo: contratos de datos del dominio.
 */

export type CategoryId = 'coffee' | 'tea' | 'pastry' | 'sandwich' | 'cold';

/** Modalidad del pedido; "para llevar" no aplica propina sugerida. */
export type ServiceMode = 'dine-in' | 'takeaway';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: CategoryId;
  image?: string;
  popular?: boolean;
  /** Producto agotado: se muestra pero no se puede pedir. */
  available?: boolean;
}

/** Línea del pedido: producto, cantidad y nota opcional para cocina. */
export interface OrderLine {
  product: Product;
  quantity: number;
  note: string;
}

/** Resultado del cálculo de importes del pedido. */
export interface OrderTotals {
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  itemCount: number;
}
