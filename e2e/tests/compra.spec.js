import { test, expect } from '@playwright/test';
import { emailUnico } from './util.js';

test('catálogo → carrinho → checkout → pedido criado', async ({ page }) => {
  await page.goto('/pecas');
  const adicionar = page.getByRole('button', { name: 'Adicionar ao carrinho' }).first();
  await expect(adicionar).toBeEnabled();
  await adicionar.click();
  await expect(page.getByRole('link', { name: /Carrinho com 1 itens/ })).toBeVisible();

  // Recarregar não perde o carrinho (localStorage).
  await page.reload();
  await page.getByRole('link', { name: /Carrinho com 1 itens/ }).click();
  await expect(page).toHaveURL(/\/carrinho$/);

  await page.getByRole('button', { name: 'Aumentar' }).click();
  await expect(page.getByText(/2 itens/)).toBeVisible();

  await page.getByRole('link', { name: /Finalizar pedido/ }).click();
  await page.getByLabel('Nome').fill('Maria E2E');
  await page.getByLabel('E-mail').fill(emailUnico('maria'));
  await page.getByLabel('Telefone / WhatsApp').fill('66999990000');
  await page.getByRole('button', { name: /Confirmar pedido/ }).click();

  await expect(page).toHaveURL(/\/pedido\/CM-[2-9A-Z]{6}$/);
  await expect(page.getByRole('heading', { name: 'Pedido recebido' })).toBeVisible();
  await expect(page.getByText(/CM-[2-9A-Z]{6}/)).toBeVisible();

  // Carrinho foi esvaziado depois do pedido.
  await expect(page.getByRole('link', { name: /Carrinho com 0 itens/ })).toBeVisible();
});
