
/*
 * Export default configuration.
 */

module.exports = {
  serviceName: 'myqa-webapp',
  backend: {
    baseUri: 'http://localhost:7100',
    restApiPrefix: '/api'
  },
  fetch: {
    crossOriginCredentials: false
  },
  development: {
    justClient: false,
    justServer: false
  },
  logger: {
    datePattern: 'YYYY-MM-DD',
    format: 'text',
    level: 'debug',
    maxFiles: '30d',
    maxSize: '20m',
    zippedArchive: 'false'
  },
  server: {
    port: 1234,
    staticMaxAge: 1000 * 60 * 60 * 24 // 1 day
  },
  routing: {
    appBasename: '/app'
  },
  recaptcha: {
    key: null
  }
}
