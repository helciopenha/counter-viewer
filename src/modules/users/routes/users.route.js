const { Router } = require('express')
const UsersController = require('../controllers/UsersController.js')

const usersRouter = Router()
const usersController = new UsersController()

usersRouter.get('/:userId', usersController.findById.bind(usersController))
usersRouter.get('/', usersController.list.bind(usersController))
usersRouter.post('/', usersController.create.bind(usersController))

module.exports = usersRouter