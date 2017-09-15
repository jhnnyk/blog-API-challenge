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

router.use(jsonParser)

// respond with JSON of all blog posts
router.get('/', (req, res) => {
  res.json(BlogPosts.get())
})

// when new blog post added, ensure has required fields. if not,
// log error and return 400 status code with helpful message.
// if okay, add new post, and return it with a status 201.
router.post('/', (req, res) => {
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

// delete post by ID
router.delete('/:id', (req, res) => {
  BlogPosts.delete(req.params.id)
  console.log(`Deleted blog post \`${req.params.id}\``)
  res.status(204).end()
})

// handle PUT request to update blog post
router.put('/:id', (req, res) => {
  // check for required fields
  const requiredFields = ['title', 'content', 'author']
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i]
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message)
      return res.status(400).send(message)
    }
  }
  // check that IDs match
  if (req.params.id !== req.body.id) {
    const message = `Request path id (${req.params.id}) and 
                request body id (${req.body.id}) must match`
    console.error(message)
    return res.status(400).send(message)
  }
  // update post
  console.log(`Updating blog post item \`${req.params.id}\``)
  const updatedPost = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  })
  res.status(204).end()
})

module.exports = router
