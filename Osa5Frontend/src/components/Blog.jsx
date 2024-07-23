import React, { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showDeleteButton = currentUser && blog.user && currentUser.username === blog.user.username

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      {visible && (
        <div>
          <p>{blog.url}</p>
          <p>
            {blog.likes} likes <button onClick={() => handleLike(blog.id)}>like</button>
          </p>
          <p>{blog.user && blog.user.name}</p>
          {showDeleteButton && <button onClick={() => handleDelete(blog.id)}>delete</button>}
        </div>
      )}
    </div>
  )
}

export default Blog