import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('renders blog title', () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'ReactTestingLibrary',
    url: 'https://Testing'
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText((content, element) => {
    return element.tagName.toLowerCase() === 'div' && content.includes('Component testing is done with react-testing-library')
  })
  screen.debug(element)

  expect(element).toBeDefined()
})

test('clicking the view button renders url, likes and the user', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'ReactTestingLibrary',
    url: 'https://Testing',
    likes: 5,
    user: {
      name: 'Test User'
    }
  }
  render(<Blog blog={blog} />)
  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  expect(screen.getByText(blog.url)).toBeInTheDocument()
  expect(screen.getByText(`${blog.likes} likes`)).toBeInTheDocument()
  expect(screen.getByText(blog.user.name)).toBeInTheDocument()
})

test('clicking the like button twice calls the event handler twice', async () => {
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'ReactTestingLibrary',
    url: 'https://Testing',
    likes: 5,
    user: {
      name: 'Test User'
    }
  }
  const handleLike = vi.fn()

  render(<Blog blog={blog} handleLike={handleLike} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)
  expect(handleLike).toHaveBeenCalledTimes(2)
})

test('calls createBlog with the right details when a new blog is created', async () => {
  const createBlog = vi.fn()

  render(<BlogForm createBlog={createBlog} />)

  const user = userEvent.setup()

  const titleInput = screen.getByLabelText('Title:')
  const authorInput = screen.getByLabelText('Author:')
  const urlInput = screen.getByLabelText('URL:')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'Testing title')
  await user.type(authorInput, 'Testing author')
  await user.type(urlInput, 'https://testing.com')
  await user.click(createButton)

  expect(createBlog).toHaveBeenCalledTimes(1)
  expect(createBlog).toHaveBeenCalledWith({
    title: 'Testing title',
    author: 'Testing author',
    url: 'https://testing.com'
  })
})