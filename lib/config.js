import {mkdir} from 'fs';
import {join} from 'path';

import {setupDb} from './stores/db';
import {getTemplatePath} from './template';

const defaultValues = {
  admin: {
    username: 'admin',
    password: 'guest'
  },
  comics: {
    comicUrl: '/comics(/:id)?',
    comicTemplate: getTemplatePath('comic'),
    chapterUrl: '/chapter(/:id)?',
    chapterTemplate: getTemplatePath('chapter')
  },
  errorTemplates: {
    404: getTemplatePath('404'),
    500: getTemplatePath('500')
  },
  compression: {},
  dataPath: null,
  imagePath: null,
  log: 'combined',
  parsers: {extended: false, limit: '50mb'},
  port: 8000,
  routes: [],
  static: []
};

export default class Config {
  constructor(values) {
    this.values = Object.assign({}, defaultValues, values);

    if (!this.values.dataPath) {
      throw new Error('`dataPath` must be provided');
    }

    mkdir(this.values.dataPath, err => {
      if (err && err.code != 'EEXIST') {
        console.error('Could not create data folder', err);
        process.exit(-1);
      }
    });

    if (!this.values.imagePath) {
      this.values.imagePath = join(this.values.dataPath, 'images');
    }

    mkdir(this.values.imagePath, err => {
      if (err && err.code != 'EEXIST') {
        console.error('Could not create image folder', err);
        process.exit(-1);
      }
    });

    if (!Array.isArray(this.values.routes)) {
      this.values.routes = [this.values.routes];
    }

    if (!Array.isArray(this.values.static)) {
      this.values.static = [this.values.static];
    }
    this.values.static.push(join(__dirname, 'static'));
  }

  get(name) {
    return this.values[name];
  }
}

