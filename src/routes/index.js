const { Router } = require('express')
const users = require('../modules/users/routes/users.route.js')

const routes = Router()

routes.use('/users', users)

module.exports = routes