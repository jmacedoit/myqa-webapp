
/*
 * Module dependencies.
 */

import config from 'config';
import koaApp from './koa-app';
import logger from 'src/logger';

/*
 * Dump node warnings and errors.
 */

process.on('warning', error => logger.warn(error.stack));

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`Unhandled Rejection at: ${promise} Reason: ${reason}`);
  // eslint-disable-next-line no-extra-parens
  logger.error((reason as any).stack);
});

/*
 * Start server.
 */

logger.info('Web app initialized!');
logger.info(`Settings: ${JSON.stringify(config, null, 2)}`);

koaApp().then(koaApp => koaApp.listen(config.get('server.port')));

logger.info(`Now listening to port ${config.get('server.port')}`);
