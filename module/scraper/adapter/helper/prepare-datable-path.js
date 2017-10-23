const _ = require('lodash');
const path = require('path');
const dateFormat = require('dateformat');
const PrepareAbstract = require('./prepare-abstract');

/**
 * Convert array to flat structure
 */
class PrepareDatablePath extends PrepareAbstract {
  constructor(adapter) {
    super();
    this.adapter = adapter;
  }

  prepare(filePath, ext = null) {
      let parsed = path.parse(filePath);
      let now = new Date();
      let date = dateFormat(now, 'dd-mm-yyyy_h.MM.ssTT');

      return path.format({
        root: '/ignored',
        dir: parsed.dir,
        name: parsed.name + '_' + date,
        ext: ext || parsed.ext
      });
  }
}

module.exports = PrepareDatablePath;