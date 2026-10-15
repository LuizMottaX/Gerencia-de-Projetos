import { test, expect } from '@playwright/test';
import { emailUnico, proximoDiaUtil } from './util.js';

test('escolher serviço → ver horários livres → agendar → confirmação', async ({ page }) => {
  await page.goto('/servicos');
  await page
    .getByRole('article')
    .filter({ hasText: 'Revisão dos Freios' })
    .getByRole('link', { name: 'Agendar' })
    .click();
  await expect(page).toHaveURL(/\/agendar\/revisao-freios$/);

  await page.getByLabel('Dia').fill(proximoDiaUtil());
  const horarios = page.getByRole('radio');
  await expect(horarios.first()).toBeVisible();
  const horario = horarios.last(); // o último do dia tende a estar livre
  const hora = await horario.innerText();
  await horario.click();
  await expect(horario).toHaveAttribute('aria-checked', 'true');

  await page.getByLabel('Nome').fill('Carlos E2E');
  await page.getByLabel('E-mail').fill(emailUnico('carlos'));
  await page.getByLabel('Telefone / WhatsApp').fill('66999991111');
  await page.getByLabel('Veículo').fill('Gol 2020, ABC-1234');
  await page.getByRole('button', { name: `Confirmar agendamento às ${hora}` }).click();

  await expect(page).toHaveURL(/\/agendamento\/AG-[2-9A-Z]{6}$/);
  await expect(page.getByRole('heading', { name: 'Agendamento solicitado' })).toBeVisible();
  await expect(page.getByText(`às ${hora}`)).toBeVisible();
});
