import render from 'consolidate';
import express from 'express';

import Config from './config';
import * as middleware from './middleware';
import * as routes from './routes';

export function startServer(options) {
  let config = new Config(options);

  let app = express();
  app.engine('html', render.swig);
  app.set('config', config);
  app.set('views', './');
  app.use(middleware.createRouter(config));
  app.use(routes.createRouter(config));
  app.listen(config.get('port'));
  return app;
}

