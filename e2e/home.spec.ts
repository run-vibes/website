import { expect, test } from '@playwright/test'

test.describe('Home Page', () => {
  test('has correct title', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Vibes/)
  })

  test('displays hero section with main CTA', async ({ page }) => {
    await page.goto('/')

    await expect(
      page.getByRole('heading', { name: /the studio where ai agents come to life/i }),
    ).toBeVisible()

    await expect(page.getByRole('link', { name: /let's talk/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /see our services/i })).toBeVisible()
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

  test('displays services overview section', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /what we do/i })).toBeVisible()

    // Check service cards
    await expect(page.getByText(/agent development/i).first()).toBeVisible()
    await expect(page.getByText(/ai strategy/i).first()).toBeVisible()
  })

  test('displays how we work section', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByRole('heading', { name: /how we work/i })).toBeVisible()
    await expect(page.getByText(/discover/i)).toBeVisible()
    await expect(page.getByText(/design/i).first()).toBeVisible()
    await expect(page.getByText(/deliver/i)).toBeVisible()
  })

  test('CTA navigates to contact page', async ({ page }) => {
    await page.goto('/')

    await page
      .getByRole('link', { name: /let's talk/i })
      .first()
      .click()

    await expect(page).toHaveURL('/contact')
  })

  test('services CTA navigates to services page', async ({ page }) => {
    await page.goto('/')

    await page.getByRole('link', { name: /see our services/i }).click()

    await expect(page).toHaveURL('/services')
  })
})
