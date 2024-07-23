const loginWith = async (page, username, password)  => {
    await page.getByTestId('username').fill(username)
    await page.getByTestId('password').fill(password)
    await page.getByRole('button', { name: 'login' }).click()
  }
  
  const createBlog = async (page, content) => {
    await page.getByRole('button', { name: 'new blog' }).click()
    await page.getByTestId('Title').fill('a blog created by playwright')
    await page.getByTestId('Author').fill('Playwright')
    await page.getByTestId('URL').fill('http://playwright')
    await page.getByRole('button', { name: 'create' }).click()
    await page.getByText(content).waitFor()
  }
  
  export { loginWith, createBlog }