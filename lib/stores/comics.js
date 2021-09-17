import Store from './store';

export default class ComicsStore extends Store {
  get name() {
    return 'comics';
  }
  
  get columns() {
    return [
      'title TEXT',
      'chapter',
      'description TEXT',
      'date INTEGER',
      'tags TEXT'
    ];
  }
  
  get foreignKeys() {
    return ['chapter'];
  }
}

