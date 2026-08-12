import { expect, test } from '@playwright/test';

test('dashboard page has expected layout and links', async ({ page }) => {
	await page.goto('/');
	await expect(page.locator('h1.title')).toHaveText('Sistema Multipropósito');
	
	// Check links
	const cinemaLink = page.locator('h2', { hasText: 'Cine' });
	await expect(cinemaLink).toBeVisible();
});

test('cinema module can select a seat', async ({ page }) => {
	await page.goto('/cinema');
	
	// Ensure header is visible
	await expect(page.locator('h1.title')).toHaveText('Cine Center - Venta de Entradas');
	
	// Click an available seat (SVG button that is not disabled)
	const availableSeat = page.locator('button.seat:not([disabled])').first();
	await availableSeat.click();
	
	// Confirm total updates to $10.00
	const totalSpan = page.locator('.total-amount');
	await expect(totalSpan).toHaveText('$10.00');
});
