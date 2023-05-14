
/*
 * Module dependencies.
 */

import { pagesRouter } from './router';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import config from 'src/config';
import koaLogger from 'koa-logger';
import logger from 'src/logger';
import mount from 'koa-mount';
import path from 'path';
import serve from 'koa-static';

/*
 * Export `app`.
 */

export default async () => {
  const app = new Koa();

  app.use(koaLogger({
    transporter: value => {
      logger.log({ level: 'http', message: value });
    }
  }));
  app.use(bodyParser());
  app.use(
    mount(
      '/dist/client',
      serve(
        path.join(process.cwd(), 'dist', 'client'),
        { maxage: config.server.staticMaxAge }
      )
    )
  );

  app.use(pagesRouter.routes());
  app.use(pagesRouter.allowedMethods());

  return await Promise.resolve(app);
};
