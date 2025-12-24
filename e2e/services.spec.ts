import { expect, test } from '@playwright/test'

test.describe('Services Page', () => {
  test('displays all four services', async ({ page }) => {
    await page.goto('/services')

    // Check main heading
    await expect(page.getByRole('heading', { name: /what we do/i })).toBeVisible()

    // Check all service sections
    await expect(page.getByRole('heading', { name: /agent development/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /ai strategy/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /product development/i })).toBeVisible()
    await expect(page.getByRole('heading', { name: /workshops/i })).toBeVisible()
  })

  test('service sections have CTAs', async ({ page }) => {
    await page.goto('/services')

    // Check CTA buttons exist
    const ctaButtons = page.getByRole('link', { name: /discuss your project/i })
    await expect(ctaButtons.first()).toBeVisible()
  })

  test('can navigate to contact from CTA', async ({ page }) => {
    await page.goto('/services')

    // Click first CTA
    await page.getByRole('link', { name: /discuss your project/i }).first().click()

    // Should navigate to contact
    await expect(page).toHaveURL('/contact')
  })

  test('final CTA section is visible', async ({ page }) => {
    await page.goto('/services')

    // Scroll to bottom
    await page.getByRole('heading', { name: /ready to get started/i }).scrollIntoViewIfNeeded()

    await expect(page.getByRole('heading', { name: /ready to get started/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /start a conversation/i })).toBeVisible()
  })
})
