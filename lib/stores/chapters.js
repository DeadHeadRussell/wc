import Store from './store';

export default class ChaptersStore extends Store {
  get name() {
    return 'chapters';
  }

  get columns() {
    return [
      'title TEXT',
      'description TEXT',
      'date INTEGER',
      'tags TEXT'
    ];
  }

  get foreignKeys() {
    return null;
  }
}

