import { expect, test } from '@playwright/test'

test.describe('Home Page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Vibes/)
  })

  test('displays hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /AI agents come to life/i })).toBeVisible()
  })

  test('displays navigation', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('navigation')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Vibes' })).toBeVisible()
  })

  test('displays footer', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('contentinfo')).toBeVisible()
  })

  test('displays feature cards', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Autonomous Agents')).toBeVisible()
    await expect(page.getByText('Process Automation')).toBeVisible()
    await expect(page.getByText('Custom Integrations')).toBeVisible()
  })
})
