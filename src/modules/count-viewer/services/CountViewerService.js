const countapi = require('countapi-js')

class CountViewerService {
  static async create() {

    const count = await countapi.create({
      key: 'penha',
      namespace: 'helcio',
      enable_reset: true
    }).catch(error => {
      console.log('>> error', error)
    })

    return count
  }

  static async increment() {
    return countapi.hit('helcio', 'penha')
  }

  static async get() {
    return countapi.get('helcio', 'penha')
  }
}

module.exports = CountViewerService