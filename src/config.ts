
/*
 * Browser/Node config uniformization.
 */

function validateAndTypeConfig(rawConfig: any) {
  return {
    serviceName: rawConfig.serviceName as string,
    backend: {
      baseUri: rawConfig.backend.baseUri as string,
      restApiPrefix: rawConfig.backend.restApiPrefix as string
    },
    fetch: {
      crossOriginCredentials: rawConfig.fetch.crossOriginCredentials === 'true' || rawConfig.fetch.crossOriginCredentials === true
    },
    development: {
      justServer: rawConfig.development.justServer === 'true' || rawConfig.development.justServer === true,
      justClient: rawConfig.development.justClient === 'true' || rawConfig.development.justClient === true
    },
    logger: {
      datePattern: rawConfig.logger.datePattern as string,
      format: rawConfig.logger.format as string,
      level: rawConfig.logger.level as string,
      maxFiles: rawConfig.logger.maxFiles as string,
      maxSize: rawConfig.logger.maxSize as string,
      zippedArchive: rawConfig.logger.zippedArchive === 'true' || rawConfig.logger.zippedArchive === true
    },
    server: {
      port: parseInt(rawConfig.server.port, 10),
      staticMaxAge: parseInt(rawConfig.server.staticMaxAge, 10)
    },
    routing: {
      appBasename: rawConfig.routing.appBasename as string
    }
  };
}

let windowConfig = {};
let config: ReturnType<typeof validateAndTypeConfig>;

if (typeof window === 'undefined') {
  // On server
  const rawConfig = require('config');

  config = validateAndTypeConfig(rawConfig);
} else {
  // @ts-ignore
  windowConfig = window._config; // eslint-disable-line no-underscore-dangle

  if (windowConfig === undefined) {
    // Developing with client only mode
    const developmentConfig = require('../config/default.js');

    developmentConfig.development.justClient = true;
    developmentConfig.fetch.crossOriginCredentials = true;

    config = validateAndTypeConfig(developmentConfig);
  } else {
    config = validateAndTypeConfig(windowConfig);
  }
}

/*
 * Export `config`.
 */

export default config;
