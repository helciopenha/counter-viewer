const AWS = require('aws-sdk')
const Joi = require('joi')
const UsersService = require('../services/UserService.js')
const IUserWithoutPassword = require('../entities/userWithoutPassword.js')

class UsersController {
  constructor() {
    this.usersTable = process.env.USERS_TABLE
    this.dynamoDbClient = new AWS.DynamoDB.DocumentClient()
  }

  async findById(request, response) {
    try {
      const userId = request.params.userId
      if(userId) {
        const userService = new UsersService()
        
        const user = await userService.findById(userId)

        if(user){
          const userWithoutPassword = new IUserWithoutPassword(user)
          response.json(userWithoutPassword)
        } else {
          // user not found
          response.status(204).end()
        }
      }
    } catch(error) {
      console.log(error);
      response.status(error.statusCode).json({
        error: error.message
      });
    }
  }

  // list all users
  async list(request, response) {
    try {
      const userService = new UsersService()
      
      const users = await userService.list()

      if(users.length){
        // remove password for all users
        users.forEach(user => delete user.password)

        response.json(users)
      } else {
        // user not found
        response.status(204).end()
      }
    } catch(error) {
      console.log(error);
      response.status(error.statusCode).json({
        error: error.message
      });
    }
  }

  async create(request, response) {
    try {
      const body = request.body
      
      const schemaUser = Joi.object({
        name: Joi.string().max(100).min(2).required(),
        username: Joi.string().alphanum().min(3).max(30).required(),
        password: Joi.string()
          .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
        email: Joi.string().email({
          minDomainSegments: 2,
          tlds: {
            allow: ['com', 'net', 'br']
          }
        })
      })

      const { error, value } = await schemaUser.validate(body)
      
      if(error) {
        response.status(422).json({
          error: error.message
        })
        return
      }

      const userService = new UsersService()
  
      const user = await userService.create(value)
      console.log('>> user', user)

      response.json(user)
    } catch(error) {
      console.log('>> err controller');
      return response.status(error.statusCode).json({ error: error.message });
    }
  }
}

module.exports = UsersController