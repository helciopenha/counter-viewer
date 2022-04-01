const express = require('express')
const res = require('express/lib/response')
const serverless = require('serverless-http')

const routes = require('./src/routes/index.js')

const app = express()

app.use(express.json())
app.use(routes)

app.use((request, response, next) => {
  return response.status(404).json({
    error: 'Not Found'
  })
})

module.exports.handler = serverless(app)