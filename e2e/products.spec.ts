import { expect, test } from '@playwright/test'

test.describe('Products Pages', () => {
  test('products index displays both products', async ({ page }) => {
    await page.goto('/products')

    await expect(page.getByRole('heading', { name: "What We're Building" })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Vibes', level: 3 })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Volt', level: 3 })).toBeVisible()
    await expect(page.getByText('Available')).toBeVisible()
    await expect(page.getByText('Coming Soon')).toBeVisible()
  })

  test('can navigate to Vibes product page', async ({ page }) => {
    await page.goto('/products')

    await page
      .getByRole('link', { name: /learn more/i })
      .first()
      .click()
    await expect(page).toHaveURL('/products/vibes')
    await expect(page.getByRole('heading', { name: 'Vibes', level: 1 })).toBeVisible()
  })

  test('Vibes page shows install command', async ({ page }) => {
    await page.goto('/products/vibes')

    await expect(page.getByText('curl -sSf https://vibes.run/install | sh')).toBeVisible()
    await expect(page.getByRole('link', { name: /star on github/i })).toBeVisible()
  })

  test('can navigate to Volt teaser page', async ({ page }) => {
    await page.goto('/products')

    await page
      .getByRole('link', { name: /learn more/i })
      .last()
      .click()
    await expect(page).toHaveURL('/products/volt')
    await expect(page.getByRole('heading', { name: 'Volt', level: 1 })).toBeVisible()
  })

  test('Volt page shows waitlist form', async ({ page }) => {
    await page.goto('/products/volt')

    await expect(page.getByText('Coming Soon')).toBeVisible()
    await expect(page.getByPlaceholder(/email/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /get early access/i })).toBeVisible()
  })

  test('navbar has Products link', async ({ page }) => {
    await page.goto('/')

    const productsLink = page.getByRole('link', { name: 'Products', exact: true })
    await expect(productsLink).toBeVisible()
    await productsLink.click()
    await expect(page).toHaveURL('/products')
  })
})
