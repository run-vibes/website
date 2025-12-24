import { expect, test } from '@playwright/test'

test.describe('Contact Page', () => {
  test('displays chat interface', async ({ page }) => {
    await page.goto('/contact')

    // Check heading
    await expect(page.getByRole('heading', { name: /let's talk/i })).toBeVisible()

    // Check welcome message
    await expect(page.getByText(/what are you looking to build/i)).toBeVisible()

    // Check input and send button
    await expect(page.getByPlaceholder(/type a message/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /send/i })).toBeVisible()
  })

  test('can toggle to fallback form', async ({ page }) => {
    await page.goto('/contact')

    // Click to show form
    await page.getByText(/prefer a traditional form/i).click()

    // Check form fields appear
    await expect(page.getByLabel(/name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/company/i)).toBeVisible()
  })

  test('send button is disabled when input is empty', async ({ page }) => {
    await page.goto('/contact')

    const sendButton = page.getByRole('button', { name: /send/i })
    await expect(sendButton).toBeDisabled()
  })

  test('displays contact info section', async ({ page }) => {
    await page.goto('/contact')

    await expect(page.getByText(/other ways to reach us/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /hello@vibes\.run/i })).toBeVisible()
  })
})
