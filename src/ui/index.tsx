
/*
 * Module dependencies.
 */

import { BrowserRouter } from 'react-router-dom';
import App from 'src/ui/components/app';
import React from 'react';
import ReactDOM from 'react-dom';
import config from 'src/config';

/*
 * Render dom.
 */

ReactDOM.render(
  <BrowserRouter basename={config.routing.appBasename}>
    <App />
  </BrowserRouter>,
  document.getElementById('root')
);

/*
 * Hot reload.
 */

if (module.hot) {
  module.hot.accept();
}
