const express = require('express')
const router = express.Router()

const bodyParser = require('body-parser')
const jsonParser = bodyParser.json()

const {BlogPosts} = require('./models')

// add some sample blog posts
BlogPosts.create(
  'Blog Post #1',
  'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'John Knotts'
)
BlogPosts.create(
  'Post Number Two',
  'Some more lorem ipsum bananas dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Mario'
)

// respond with JSON of all blog posts
router.get('/', (req, res) => {
  res.json(BlogPosts.get())
})

// when new blog post added, ensure has required fields. if not,
// log error and return 400 status code with helpful message.
// if okay, add new post, and return it with a status 201.
router.post('/', jsonParser, (req, res) => {
  // ensure `title`, `content`, and `author` are in request body
  const requiredFields = ['title', 'content', 'author']
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i]
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message)
      return res.status(400).send(message)
    }
  }
  const post = BlogPosts.create(req.body.title, req.body.content, req.body.author)
  res.status(201).json(post)
})

module.exports = router
