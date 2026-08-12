import { expect, test } from '@playwright/test';

/**
 * Pruebas end-to-end de los tres módulos de la práctica.
 * Se ejecutan con `npm run test:e2e` sobre la compilación de producción.
 */

test('el índice enlaza con los tres módulos', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Tres aplicaciones');
  await expect(page.getByRole('link', { name: /Cine Center/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /Capresso/ })).toBeVisible();
  await expect(page.getByRole('link', { name: /MeetSpace/ })).toBeVisible();
});

test('PRÁCTICA 1: seleccionar butacas actualiza el total', async ({ page }) => {
  await page.goto('/cinema');

  const total = page.locator('.grand-amount');
  await expect(total).toHaveText('$0.00');

  // La primera función cuesta $12.00 la butaca estándar; el cargo por servicio es del 5 %.
  const firstFreeSeat = page.locator('button.seat-btn.available').first();
  await firstFreeSeat.click();

  await expect(total).not.toHaveText('$0.00');
  await expect(page.locator('.line-item')).toHaveCount(1);

  // Al quitar la butaca el pedido vuelve a cero.
  await page.locator('.line-remove').first().click();
  await expect(total).toHaveText('$0.00');
});

test('PRÁCTICA 1: cambiar de película cambia la cartelera', async ({ page }) => {
  await page.goto('/cinema');

  await page.getByRole('button', { name: /Puente a Ninguna Parte/ }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Puente a Ninguna Parte');
});

test('PRÁCTICA 2: añadir productos calcula el total automáticamente', async ({ page }) => {
  await page.goto('/cafe');

  await expect(page.getByText('Aún no hay productos')).toBeVisible();

  // Espresso cuesta $3.50 → impuesto del 8 % → $3.78
  await page.getByLabel('Añadir Espresso al pedido').click();

  await expect(page.locator('.grand-amount')).toHaveText('$3.78');
  await expect(page.getByText('$3.50 × 1')).toBeVisible();
});

test('PRÁCTICA 2: el filtro por categoría acota la carta', async ({ page }) => {
  await page.goto('/cafe');

  await page.getByRole('button', { name: /Pastelería/ }).click();

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Pastelería');
  await expect(page.getByText('Croissant de Mantequilla')).toBeVisible();
  await expect(page.getByText('Espresso')).toHaveCount(0);
});

test('PRÁCTICA 2: el buscador filtra en vivo', async ({ page }) => {
  await page.goto('/cafe');

  await page.getByPlaceholder('Buscar producto…').fill('mocha');

  await expect(page.getByText('Mocha Blanco')).toBeVisible();
  await expect(page.getByText('Americano')).toHaveCount(0);
});

test('PRÁCTICA 3: reservar una sala evita las colisiones', async ({ page }) => {
  await page.goto('/meetings');

  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Salas de reuniones');

  // Abre el formulario desde el primer tramo libre de la primera sala.
  await page.getByRole('button', { name: /^Reservar de/ }).first().click();

  await page.getByLabel(/Título de la reunión/).fill('Reunión de prueba');
  await page.getByLabel(/^Organiza/).fill('Equipo QA');
  await page.getByRole('button', { name: 'Confirmar reserva' }).click();

  await expect(page.getByText('Reserva confirmada')).toBeVisible();
  await expect(page.getByText('Reunión de prueba')).toHaveCount(2); // agenda + barra horaria
});

test('PRÁCTICA 3: el formulario rechaza los datos incompletos', async ({ page }) => {
  await page.goto('/meetings');

  await page.getByRole('button', { name: /^Reservar de/ }).first().click();
  await page.getByRole('button', { name: 'Confirmar reserva' }).click();

  await expect(page.getByText('El título debe tener al menos 3 caracteres.')).toBeVisible();
});
