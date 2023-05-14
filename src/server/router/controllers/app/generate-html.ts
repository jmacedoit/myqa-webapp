
/*
 * Module dependencies.
 */

import { HelmetData } from 'react-helmet';
import config from 'config';
import fs from 'fs';
import logger from 'src/logger';
import path from 'path';

/*
 * Get manifest.
 */

let manifestContent = { assets: {} };

try {
  const manifestPath = path.join(process.cwd(), 'dist', 'client', 'asset-map.json');

  manifestContent = JSON.parse(fs.readFileSync(manifestPath).toString()); // eslint-disable-line no-sync
} catch (error) {
  logger.error(`Error loading manifest.`);
}

/*
 * Generate html.
 */

export default function generateHtml(markup: string, helmetData: HelmetData, styleTags: string) {
  return `
    <!doctype html>

    <html ${helmetData.htmlAttributes.toString()}>
      <head>
        ${helmetData.title.toString()}
        ${helmetData.meta.toString()}
        ${helmetData.link.toString()}

        ${styleTags}
      </head>

      <body ${helmetData.bodyAttributes.toString()}>
        <div id="root">
          ${markup}
        </div>

        <script id="config">
          var _config = ${JSON.stringify(config)}
        </script>

        <script src="${manifestContent.assets['src/ui/index.tsx']}"></script>
      </body>
    </html>
  `;
}
