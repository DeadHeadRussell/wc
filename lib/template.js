import {join} from 'path';

let templatePath = join(__dirname, 'templates');
export function getTemplatePath(name) {
  if (!name) {
    return templatePath;
  }
  return join(templatePath, name + '.jade');
}

