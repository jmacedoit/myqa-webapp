
/*
 * Module dependencies.
 */

import { ParameterizedContext } from 'koa';
import Router from 'koa-router';

/*
 * Koa.
 */

export type KoaContext = ParameterizedContext<any, Router.IRouterParamContext<any, {}>> & {
  language: string
};
