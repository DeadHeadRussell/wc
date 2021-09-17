import NotFoundError from './notFoundError';

export function createRouteConfigs(options) {
  if (!canServeComic(options)) {
    throw new Error('Must provide a `comicRouter` or `comicTemplate`');
  }

  let routes = [];
  routes.push({url: options.comicUrl, router: getComic});
  if (options.comicRouter) {
    routes.push({url: optins.comicUrl, router: options.comicRouter});
  } else {
    routes.push({url: options.comicUrl, template: options.comicTemplate});
  }

  if (canServeChapter(options)) {
    routes.push({url: options.chapterUrl, router: getChapter});
    if (options.chapterRouter) {
      routes.push({url: options.chapterUrl, router: options.chapterRouter});
    } else {
      routes.push({url: options.chapterUrl, template: options.chapterTemplate});
    }
  }

  return routes;
}

function canServeComic(options) {
  return options && (
    typeof options.comicRouter == 'function' ||
    typeof options.comicTemplate == 'string'
  );
}

function canServeChapter(options) {
  return options && (
    typeof options.chapterRouter == 'function' ||
    typeof options.chapterTemplate == 'string'
  );
}

function getComic(req, res, next) {
  getComicId(req)
    .then(id => req.stores.comics.get(id))
    .then(comic => req.templateLocals.comic = comic)
    .then(comic => {
      if (!comic) {
        throw new NotFoundError('comic');
      }
      return req.stores.chapters.get(comic.chapter);
    })
    .then(chapter => req.templateLocals.chapter = chapter)
    .then(() => next())
    .catch(next);
}

function getChapter(req, res, next) {
  getChapterId(req)
    .then(id => req.stores.chapters.get(id))
    .then(chapter => req.templateLocals.chapter = chapter)
    .then(chapter => {
      if (!chapter) {
        throw new NotFoundError('chapter');
      }
      return req.stores.comics.getAll({chapter: chapter.id});
    })
    .then(comics => req.templateLocals.comics = comics)
    .then(() => next())
    .catch(next);
}

function getComicId(req) {
  if (req.params.id) {
    return Promise.resolve(req.params.id);
  }

  return req.stores.comics.getAll()
    .then(comics => {
      if (comics.length == 0) {
        return null;
      }
      return comics.sort((a, b) => b.id - a.id)[0].id;
    });
}

function getChapterId(req) {
  if (req.params.id) {
    return Promise.resolve(req.params.id);
  }

  return req.stores.chapters.getAll()
    .then(chapters => {
      if (chapters.length == 0) {
        return null;
      }

      chapters.sort((a, b) => b.id - a.id)[0].id;
    });
}

