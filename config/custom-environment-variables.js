
/*
 * Export custom environment variables configuration.
 */

module.exports = {
  serviceName: 'SERVICE_NAME',
  backend: {
    baseUri: 'BACKEND_BASE_URI',
    restApiPrefix: 'BACKEND_REST_API_PREFIX'
  },
  fetch: {
    crossOriginCredentials: 'FETCH_CROSS_ORIGIN_CREDENTIALS'
  },
  development: {
    justClient: 'DEVELOPMENT_JUST_CLIENT',
    justServer: 'DEVELOPMENT_JUST_SERVER'
  },
  logger: {
    datePattern: 'LOGGER_DATE_PATTERN',
    format: 'LOGGER_FORMAT',
    level: 'LOGGER_LEVEL',
    maxFiles: 'LOGGER_MAX_FILES',
    maxSize: 'LOGGER_MAX_SIZE',
    zippedArchive: 'LOGGER_ZIPPED_ARCHIVE'
  },
  server: {
    port: 'SERVER_PORT',
    staticMaxAge: 'SERVER_STATIC_MAX_AGE' // This will be in milliseconds. Consider storing the amount of milliseconds directly.
  },
  routing: {
    appBasename: 'ROUTING_APP_BASENAME'
  },
  recaptcha: {
    key: 'RECAPTCHA_KEY'
  }
};
