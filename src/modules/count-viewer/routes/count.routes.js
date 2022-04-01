const { Router } = require('express')
const CountViewerService  = require('../services/CountViewerService.js')

const countRouter = Router()

async function creatCount() {
  const create = await CountViewerService.create()
  console.log('>> create', create)
}
creatCount()

// get count viewer
countRouter.get('/', async (request, response) => {
  try {
    const viewers = await CountViewerService.get()
    console.log('>> viewers', viewers)

    response.json(viewers)

  } catch(error) {
    console.log('>> error', error)
    response.json(error)
  }
})

// increments
countRouter.post('/', async (request, response) => {
  try {
    const increment = await CountViewerService.increment()
    console.log('>> increment', increment)

    response.json(increment)

  } catch(error) {
    console.log('>> error', error)
    response.json(error)
  }
})

module.exports = countRouter