
/*
 * Module dependencies.
 */

import { getPage } from './controllers/app';
import Router from 'koa-router';

/*
 * Configure pages router.
 */

export const pagesRouter = new Router();

pagesRouter.get('/*', getPage);
