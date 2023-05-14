
/*
 * Module dependencies.
 */

import { Helmet } from 'react-helmet';
import { KoaContext } from 'src/server/router/types';
import { Next } from 'koa';
import { ServerStyleSheet } from 'styled-components';
import { StaticRouter } from 'react-router-dom/server';
import App from 'src/ui/components/app';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import config from 'config';
import generateHtml from './generate-html';
import logger from 'src/logger';

/*
 * Get configurations controller.
 */

export function getPage(ctx: KoaContext, next: Next) {
  const sheet = new ServerStyleSheet();

  try {
    const context: { url?: string } = {};
    const renderedApp = ReactDOMServer.renderToString(sheet.collectStyles(
      <StaticRouter
        basename={config.get('routing.appBasename')}
        location={ctx.url}
      >
        <App />
      </StaticRouter>
    ));

    const styleTags = sheet.getStyleTags();
    const helmetData = Helmet.renderStatic();

    if (context.url) {
      ctx.status = 301;
      ctx.redirect(context.url);
    } else {
      ctx.body = generateHtml(renderedApp, helmetData, styleTags);
    }
  } catch (error) {
    logger.error(error.stack);
  } finally {
    sheet.seal();
  }

  return next();
}
