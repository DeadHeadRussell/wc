import {extname} from 'path';

import {Router} from 'express';

import {getTemplatePath} from '../template';
import createAdminRouter from './admin';
import {createRouteConfigs} from './comics';
import NotFoundError from './notFoundError';

export function createRouter(config) {
  let router = Router();

  let comicRoutes = createRouteConfigs(config.get('comics'));
  let routes = config.get('routes');

  comicRoutes.forEach(parseRoute);
  routes.forEach(parseRoute);

  router.use('/admin', createAdminRouter(config.get('admin'), config.get('imagePath')));
  router.use((req, res, next) => next(new NotFoundError()));

  router.use((err, req, res, next) => {
    let status = err.status || 500;
    let locals = {message: err.message, stack: err.stack};
    if (status != 404) {
      console.error('ERROR', status, err.message);
    }

    res.status(status);
    res.render(config.get('errorTemplates')[status], locals);
  });

  return router;

  function parseRoute(route) {
    if (!route.url) {
      throw new Error('Route must have a `url` property');
    }

    if (!route.router && !route.template) {
      throw new Error('Route must specify a `router` or `template` property');
    }

    if (route.router) {
      router.get(route.url, route.router);
    } else {
      router.get(route.url, serveTemplate);
    }

    function serveTemplate(req, res, next) {
      let locals = req.templateLocals || {};
      res.render(route.template, locals);
    }
  }
}

