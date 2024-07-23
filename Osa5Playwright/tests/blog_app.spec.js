const { test, describe, expect, beforeEach } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http:localhost:3003/api/testing/reset')
    await request.post('http://localhost:5173/api/users', {
      data: {
        name: 'Testikäyttäjä',
        username: 'testaaja',
        password: 'salainen',
      },
    })

    await page.goto('http://localhost:5173')
  })

  test('login form is shown', async ({ page }) => {
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with right username and password', async ({ page }) => {
      await page.getByTestId('username').fill('testaaja')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
  
      await expect(page.getByText('wrong credentials')).not.toBeVisible()
      await expect(page.getByText('Testikäyttäjä logged in')).toBeVisible()
    })

    test('login fails with wrong password', async ({ page }) => {
      await page.getByTestId('username').fill('testaaja')
      await page.getByTestId('password').fill('wrong')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Wrong username or password')).toBeVisible()
      await expect(page.getByText('Testikäyttäjä logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByTestId('username').fill('testaaja')
      await page.getByTestId('password').fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByTestId('Title').fill('a blog created by playwright')
      await page.getByTestId('Author').fill('Playwright')
      await page.getByTestId('URL').fill('http://playwright')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('A new blog a blog created by playwright by Playwright added')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
        await page.waitForSelector('text=view')
        const viewButtons = await page.getByRole('button', { name: 'view' }).elementHandles()
        if (viewButtons.length === 0) {
          throw new Error('No view buttons found')
        }
        await viewButtons[viewButtons.length - 1].click()
        await page.getByRole('button', { name: 'like' }).click()
        await expect(page.getByText('Liked a blog created by playwright')).toBeVisible()
      })

      test('a blog can be deleted', async ({ page }) => {
        await page.waitForSelector('text=view')
        await page.getByRole('button').last().click()
      
        page.once('dialog', async dialog => {
          expect(dialog.type()).toBe('confirm')
          expect(dialog.message()).toBe('Are you sure you want to delete this blog?')
          await dialog.accept()
        })
        await page.getByRole('button', { name: 'delete' }).click()
        await expect(page.getByText('Blog removed successfully')).toBeVisible()
      })

      test('Only the user who has added the blog can see the delete button for it', async ({ page }) => {
        await page.waitForSelector('text=view')
        const viewButtons = await page.getByRole('button', { name: 'view' }).elementHandles()
        if (viewButtons.length === 0) {
          throw new Error('No view buttons found')
        }
        await viewButtons[viewButtons.length - 1].click()

        /* This test user needs to add a blog so that there is even a one blog that this user has added */
        await expect(page.getByText('delete')).toBeVisible()
      })
  })
})