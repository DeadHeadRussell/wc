import {join} from 'path';

import sqlite3 from 'sqlite3';

import ChaptersStore from './chapters';
import ComicsStore from './comics';

export function createStores(dataPath) {
  let db = new sqlite3.Database(join(dataPath, 'data.db'));
  return {
    db, 
    chapters: new ChaptersStore(db),
    comics: new ComicsStore(db)
  };
}

