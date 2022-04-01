const { Router } = require('express')
const users = require('../modules/users/routes/users.routes.js')
const counts = require('../modules/count-viewer/routes/count.routes.js')

const routes = Router()

routes.use('/users', users)
routes.use('/count-viewer', counts)

routes.use((request, response, next) => {
  return response.status(404).json({
    error: 'Not Found'
  })
})

module.exports = routes