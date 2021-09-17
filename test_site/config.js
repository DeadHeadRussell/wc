export default {
  dataPath: './data',
  log: 'dev',
  routes: [{
    url: '/',
    template: './templates/index.jade'
  }, {
    url: '/about',
    template: './templates/about.jade'
  }],
  static: './static'
};

