import type { Category, Product } from '../models/types';

/**
 * PRÁCTICA 2 — Capa de datos.
 * Carta de la cafetería. Cada producto declara su categoría, lo que permite
 * que el filtro lateral y el buscador trabajen sobre una única fuente de datos.
 */

const IMG_ESPRESSO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAxS7jguWm0paCAWtu-WRpUH1y2i6aPhR5M4JAgwqp1Vns_TChhyzbzQUDZ4hV7wnYU9-7fA1QT_IzEwJOe7Jt3mcNA1vxcv0PvcusJARGqdloppmi-3awrgaigvewnovDX1W0FN9m5K4Vt0JKCYDaT8dhWs9EQMU-xBXUlR_H9uWFOBAhv3XosRn0pPlYdEkWWqtg29WNHWzf1CWKbH7mPYWoY1ZjfKnMj2zHRefTfY_BPpRDv397VuA';
const IMG_LATTE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDCiHh9jA4Cd-lFRpdYqHZw35Iq0UISYsVDMZWWdkXxWgQ4FxKbrEdfVVdylAGc3LImrk_f_TN1uHoVBPNnYge6Rq8GruDterIqPzJT7ZtyGVmXmZe9UJ3ocbppkpar5TDlG6cDyEWVKTWEY-5wGu5JNSEtWVss_fc_Wcrf-Z6W_9BIGzc21d_jmeebx4hqsiSYeF-zEDt2l9AlsZ2LlmyUTocnVQbt8IJ4ES8m5bJ18AqHCv9XCreGwA';
const IMG_CAPPUCCINO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC5XduItZXm51gjpspUPpInas4to6t0KbvC5eOGqw-9tcbQosf5e0vHcBr14_i0F_Aqsu_D8bwEQiGhfA2dHZAmf9i43hVX1B7_bED2hsT2CH1X4SHQjoTeKWuCYiMr7ZyeoDcqJ2Ncyj_kzQDJzoY-M2bmz1eLfTh5GQouOzODg_3RleJM0rBObWZ4EYHHg_5xQ7_X6i-LTHqhBntfmHK2IwhP8cQG4kgNjchevDgvDwbk4DM6lipcqw';
const IMG_AMERICANO =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAI6RKg2FmDiYCTD_Ax4nOekjOLpgfbGTFG0BGAodT7MPgJGgpq8MzlVGgn_0oAO3VZhme6ciydq0nqjVxgZlRqFi2qXUjv7su9ggx-H7iC_U90iNK73U5dIDxTRc3bs_qnpKRLAsXOE_sia4c_5LqWQHs9dxtf28ZjA0V04ZrDSYYzapa6z5YEM59BubtbEd1JFRRgkZJ2BFKm-JJ8INdSHZAzFQ8HRdy8EJrR1mQty-uLqVgf2S1xUA';

export const CATEGORIES: Category[] = [
  { id: 'coffee', name: 'Café', icon: 'coffee' },
  { id: 'tea', name: 'Té e infusiones', icon: 'emoji_food_beverage' },
  { id: 'pastry', name: 'Pastelería', icon: 'bakery_dining' },
  { id: 'sandwich', name: 'Sándwiches', icon: 'lunch_dining' },
  { id: 'cold', name: 'Bebidas frías', icon: 'local_drink' }
];

export const MENU: Product[] = [
  // --- Café ---
  {
    id: 'c1',
    name: 'Espresso',
    description: 'Shot intenso y aromático de tueste medio.',
    price: 3.5,
    category: 'coffee',
    image: IMG_ESPRESSO,
    popular: true
  },
  {
    id: 'c2',
    name: 'Café Latte',
    description: 'Espresso suave con leche vaporizada.',
    price: 4.75,
    category: 'coffee',
    image: IMG_LATTE
  },
  {
    id: 'c3',
    name: 'Cappuccino',
    description: 'Partes iguales de espresso, leche y espuma.',
    price: 4.5,
    category: 'coffee',
    image: IMG_CAPPUCCINO,
    popular: true
  },
  {
    id: 'c4',
    name: 'Americano',
    description: 'Espresso diluido con agua caliente.',
    price: 3.75,
    category: 'coffee',
    image: IMG_AMERICANO
  },
  {
    id: 'c5',
    name: 'Mocha Blanco',
    description: 'Chocolate blanco, espresso y crema batida.',
    price: 5.25,
    category: 'coffee',
    image: IMG_ESPRESSO
  },
  {
    id: 'c6',
    name: 'Flat White',
    description: 'Doble ristretto con microespuma sedosa.',
    price: 4.9,
    category: 'coffee',
    image: IMG_LATTE,
    available: false
  },

  // --- Té e infusiones ---
  {
    id: 't1',
    name: 'Té Verde Matcha',
    description: 'Matcha ceremonial batido con leche templada.',
    price: 4.6,
    category: 'tea',
    image: IMG_CAPPUCCINO
  },
  {
    id: 't2',
    name: 'Chai Latte',
    description: 'Té negro especiado con canela y cardamomo.',
    price: 4.25,
    category: 'tea',
    image: IMG_LATTE,
    popular: true
  },
  {
    id: 't3',
    name: 'Infusión de Manzanilla',
    description: 'Manzanilla en hebras, sin teína.',
    price: 3.2,
    category: 'tea',
    image: IMG_AMERICANO
  },

  // --- Pastelería ---
  {
    id: 'p1',
    name: 'Croissant de Mantequilla',
    description: 'Hojaldre clásico recién horneado.',
    price: 3.5,
    category: 'pastry',
    image: IMG_CAPPUCCINO
  },
  {
    id: 'p2',
    name: 'Muffin de Arándanos',
    description: 'Esponjoso, con arándanos frescos.',
    price: 2.5,
    category: 'pastry',
    image: IMG_LATTE
  },
  {
    id: 'p3',
    name: 'Tarta de Zanahoria',
    description: 'Porción con frosting de queso crema.',
    price: 4.2,
    category: 'pastry',
    image: IMG_ESPRESSO,
    popular: true
  },

  // --- Sándwiches ---
  {
    id: 's1',
    name: 'Sándwich de Pavo',
    description: 'Pan integral, pavo ahumado, queso y vegetales.',
    price: 5.5,
    category: 'sandwich',
    image: IMG_AMERICANO
  },
  {
    id: 's2',
    name: 'Bagel de Salmón',
    description: 'Salmón curado, queso crema y eneldo.',
    price: 6.9,
    category: 'sandwich',
    image: IMG_CAPPUCCINO
  },
  {
    id: 's3',
    name: 'Panini Caprese',
    description: 'Mozzarella, tomate y albahaca a la plancha.',
    price: 5.95,
    category: 'sandwich',
    image: IMG_LATTE
  },

  // --- Bebidas frías ---
  {
    id: 'f1',
    name: 'Cold Brew',
    description: 'Extracción en frío durante 18 horas.',
    price: 4.4,
    category: 'cold',
    image: IMG_AMERICANO,
    popular: true
  },
  {
    id: 'f2',
    name: 'Limonada de Menta',
    description: 'Limón exprimido, menta fresca y soda.',
    price: 3.9,
    category: 'cold',
    image: IMG_ESPRESSO
  },
  {
    id: 'f3',
    name: 'Frappé de Caramelo',
    description: 'Café batido con hielo, caramelo y nata.',
    price: 5.6,
    category: 'cold',
    image: IMG_LATTE
  }
];

/**
 * Filtra la carta por categoría y texto de búsqueda.
 * Con `categoryId` en null se buscan productos de todas las categorías.
 */
export function filterMenu(
  products: Product[],
  categoryId: string | null,
  search: string
): Product[] {
  const term = search.trim().toLowerCase();

  return products.filter((product) => {
    const matchesCategory = categoryId === null || product.category === categoryId;
    const matchesSearch =
      term === '' ||
      product.name.toLowerCase().includes(term) ||
      product.description.toLowerCase().includes(term);

    return matchesCategory && matchesSearch;
  });
}

/** Número de productos por categoría, para los contadores del menú lateral. */
export function countByCategory(products: Product[]): Record<string, number> {
  return products.reduce<Record<string, number>>((counts, product) => {
    counts[product.category] = (counts[product.category] ?? 0) + 1;
    return counts;
  }, {});
}
