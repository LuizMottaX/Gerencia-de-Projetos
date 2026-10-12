import { test, expect } from '@playwright/test';
import { ADMIN } from '../playwright.config.js';

async function entrar(page) {
  await page.goto('/admin');
  await expect(page).toHaveURL(/\/admin\/login$/); // sem token, o guard manda pro login
  await page.getByLabel('E-mail').fill(ADMIN.email);
  await page.getByLabel('Senha').fill(ADMIN.senha);
  await page.getByRole('button', { name: 'Entrar no Painel' }).click();
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
}

test('senha errada mostra erro e não entra', async ({ page }) => {
  await page.goto('/admin/login');
  await page.getByLabel('E-mail').fill(ADMIN.email);
  await page.getByLabel('Senha').fill('senha-errada');
  await page.getByRole('button', { name: 'Entrar no Painel' }).click();
  await expect(page.getByText('Credenciais inválidas')).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test('login admin → editar um produto → mudança aparece no site', async ({ page }) => {
  await entrar(page);

  await page.goto('/admin/produtos');
  await page.getByRole('link', { name: 'Editar Filtro de Óleo' }).click();
  const estoque = String(20 + Math.floor(Math.random() * 50));
  await page.getByLabel('Estoque').fill(estoque);
  await page.getByRole('button', { name: 'Salvar' }).click();

  await expect(page).toHaveURL(/\/admin\/produtos$/);
  await expect(
    page.getByRole('row').filter({ hasText: 'Filtro de Óleo' }).getByText(estoque, { exact: true }),
  ).toBeVisible();

  await page.goto('/pecas/filtro-oleo');
  await expect(page.getByText(`${estoque} em estoque`)).toBeVisible();
});

test('sair do painel volta ao login e bloqueia o acesso', async ({ page }) => {
  await entrar(page);
  const menu = page.getByRole('button', { name: 'Abrir menu do painel' });
  if (await menu.isVisible()) await menu.click(); // no celular o menu do painel fica recolhido
  await page.getByRole('button', { name: 'Sair do painel' }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  await page.goto('/admin/pedidos');
  await expect(page).toHaveURL(/\/admin\/login$/);
});
