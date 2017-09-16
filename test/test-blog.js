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
      })
  })
})
