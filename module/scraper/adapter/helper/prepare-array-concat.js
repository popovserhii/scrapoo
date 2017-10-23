let PrepareAbstract = require('./prepare-abstract');
let _ = require('lodash');

/**
 * Convert array to flat structure
 */
class PrepareArrayConcat extends PrepareAbstract {
  constructor(adapter) {
    super();
    this.adapter = adapter;
  }

  prepare(relative) {
    if (typeof relative === 'string') {
      relative = [relative];
    }

    return _.concat(...relative);
  }
}

module.exports = PrepareArrayConcat;