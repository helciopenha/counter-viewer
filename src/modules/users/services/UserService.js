const AWS = require('aws-sdk')
const AppError = require('../../../errors/AppError.js')
const { randomUUID } = require('crypto')
const bcrypt = require('bcryptjs')

class UsersService {
  constructor() {
    this.usersTable = process.env.USERS_TABLE
    this.dynamoDbClient = new AWS.DynamoDB.DocumentClient()
  }

  async findById(id) {
    const params = {
      TableName: this.usersTable,
      Key: {
        userId: id
      }
    }

    try {
      // const { Item } = await this.dynamoDbClient.get(params).promise()
      const user = await this.dynamoDbClient.get(params).promise()

      const userIsEmpty = Object.keys(user).length === 0
      if(userIsEmpty) return undefined

      return user.Item

    } catch(error) {
      console.log(error);
      throw new AppError(error, 500)
    }
  }

  async findByUsername(username) {
    const params = {
      TableName: this.usersTable,
      FilterExpression: 'username = :username',
      ExpressionAttributeValues: {
        ":username": username
      }
    }

    try {
      const { Items, Count } = await this.dynamoDbClient.scan(params).promise()
      const users = Items

      if(!users) return undefined

      return users

    } catch(error) {
      console.log(error)
      throw new AppError(error, 500)
    }
  }

  async findByEmail(email) {
    const params = {
      TableName: this.usersTable,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ":email": email
      }
    }

    try {
      const { Items } = await this.dynamoDbClient.scan(params).promise()
      const users = Items

      if(!users) return undefined

      return users

    } catch(error) {
      console.log(error)
      throw new AppError(error, 500)
    }
  }

  // list all users
  async list() {
    const params = {
      TableName: this.usersTable,
      FilterExpression: 'userId <> :email',
      ExpressionAttributeValues: {
        ":email": null
      }
    }

    try {
      const { Items } = await this.dynamoDbClient.scan(params).promise()
      const users = Items

      if(!users) return undefined

      return users

    } catch(error) {
      console.log(error)
      throw new AppError(error, 500)
    }
  }

  async create(user) {
    const id = randomUUID()
    const passwordEncrypted = await bcrypt.hash(user.password, 8)

    const usersFoundByUsername = await this.findByUsername(user.username)
    // is found by username?
    if(usersFoundByUsername.length) throw new AppError('username already exists', 400)

    const usersFoundByEmail = await this.findByEmail(user.email)
    // is found by email?
    if(usersFoundByEmail.length) throw new AppError('email already exists', 400)
  
    const params = {
      TableName: this.usersTable,
      Item: {
        userId: id,
        ...user,
        password: passwordEncrypted,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
    };
  
    try {
      await this.dynamoDbClient.put(params).promise();
      const user = params.Item
      return user
    } catch (error) {
      console.log(error);
      throw new AppError(error, 500)
    }
  }
}

module.exports = UsersService