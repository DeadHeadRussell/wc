import {createStores} from '../stores/db';

export default function(dataPath) {
  let stores = createStores(dataPath);

  return function(req, res, next) {
    req.stores = stores;
    next();
  };
}

