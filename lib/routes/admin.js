import fs from 'fs';
import {join} from 'path';

import bluebird from 'bluebird';
import {Router} from 'express';
import multer from 'multer';

import {getTemplatePath} from '../template';

bluebird.promisifyAll(fs);

export default function(admin, imagePath) {
  let router = Router();

  fs.mkdir(join(imagePath, 'comics'), err => {
    if (err && err.code != 'EEXIST') {
      console.error('Could not create comic images folder', err);
      process.exit(-1);
    }
  });

  router.get('/', (req, res) => res.render(getTemplatePath('adminPanel')));

  router.post('/comic', multer({}).single('image'), (req, res, next) => {
    req.body.chapter = parseInt(req.body.chapter, 10);
    req.body.date = Date.now();
    req.stores.comics.create(req.body)
      .then(id => fs.writeFileAsync(join(imagePath, 'comics', id.toString()), req.file.buffer))
      .then(() => res.end())
      .catch(next);
  });

  router.post('/chapter', (req, res, next) => {
    req.body.date = Date.now();
    req.stores.chapters.create(req.body)
      .then(id => res.json({id}))
      .catch(next);
  });

  router.get('/comics', (req, res, next) => {
    req.stores.comics.getAll()
      .then(comics => res.json({comics}))
      .catch(next);
  });

  router.get('/chapters', (req, res, next) => {
    req.stores.chapters.getAll()
      .then(chapters => res.json({chapters}))
      .catch(next);
  });

  return router;
}

