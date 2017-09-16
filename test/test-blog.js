const chai = require('chai')
const chaiHttp = require('chai-http')

const {app, runServer, closeServer} = require('../server')

const should = chai.should()

chai.use(chaiHttp)

describe('Blog', function () {
  before(function () {
    return runServer()
  })

  after(function () {
    return closeServer()
  })

  it('should list all posts on GET', function () {
    return chai.request(app)
      .get('/blog-post')
      .then(function (res) {
        res.should.have.status(200)
        res.should.be.json
        res.body.should.be.a('array')

        res.body.length.should.be.at.least(1)

        res.body.forEach(function (post) {
          post.should.be.a('object')
          post.should.include.keys('id', 'title', 'content', 'author')
        })
      })
  })

  it('should add a post on POST', function () {
    const newPost = {
      title: 'Blog Post from Test',
      content: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Nostrum praesentium eaque iste facere, consectetur obcaecati consequuntur minima excepturi nihil accusamus. Laborum vero, inventore veniam esse eos tempore odio vel dolorem!',
      author: 'Johnny Test'
    }

    return chai.request(app)
      .post('/blog-post')
      .send(newPost)
      .then(function (res) {
        res.should.have.status(201)
        res.should.be.json
        res.body.should.be.a('object')
        res.body.should.include.keys('id', 'title', 'content', 'author')
        res.body.id.should.not.be.null
      })
  })
})
