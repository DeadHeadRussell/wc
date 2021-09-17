import ExtendableError from 'es6-error';

export default class NotFoundError extends ExtendableError {
  constructor(type) {
    type = type || 'page';
    type = type[0].toUpperCase() + type.substr(1);
    super(`${type} not found`);
  }

  get status() {
    return 404;
  }
}

