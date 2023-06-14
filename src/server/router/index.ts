
/*
 * Module dependencies.
 */

import { KoaContext } from './types';
import { getPage } from './controllers/app';
import Router from 'koa-router';

/*
 * Configure pages router.
 */

export const pagesRouter = new Router();

pagesRouter.get('/health', (ctx: KoaContext) => {
  ctx.body = 'OK';
});

pagesRouter.get('/', (ctx: KoaContext) => {
  ctx.redirect('/app');
});

pagesRouter.get('/*', getPage);
