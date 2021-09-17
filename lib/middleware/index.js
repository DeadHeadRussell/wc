import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import lessMiddleware from 'less-middleware';
import logger from 'morgan';
import autoReap from 'multer-autoreap';
import sassMiddleware from 'node-sass-middleware';

import dbMiddleware from './dbMiddleware';
import templateLocals from './templateLocals';

export function createRouter(config) {
  let router = express.Router();

  router.use(logger(config.get('log')));
  router.use(compression(config.get('compression')));
  config.get('static').forEach(path => {
    router.use(sassMiddleware({src: path}));
    router.use(lessMiddleware(path));
    router.use(express.static(path));
  });
  router.use('/images', express.static(config.get('imagePath')));
  router.use(bodyParser.json(config.get('parsers')));
  router.use(bodyParser.urlencoded(config.get('parsers')));
  router.use(dbMiddleware(config.get('dataPath')));
  router.use(templateLocals);

  return router;
}

