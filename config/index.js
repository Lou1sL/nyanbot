const DevelopmentConfig = require('./dev.js')
const ProductionConfig = require('./prod.js')

console.log(`process.env.NODE_ENV = ${process.env.NODE_ENV || 'development'}`)

switch (process.env.NODE_ENV) {
  case 'production':
    module.exports = global.config = new ProductionConfig()
    break
  case 'development':
  default:
    module.exports = global.config = new DevelopmentConfig()
    break
}

module.exports = global.config = config
