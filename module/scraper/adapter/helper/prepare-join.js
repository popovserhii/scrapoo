let PrepareAbstract = require('./prepare-abstract');

class PrepareJoin extends PrepareAbstract {

  prepare(relative) {
    let sep = this.config.params[0] || '';
    if (typeof relative === 'string') {
      relative = [relative];
    }
    return relative.join(sep);
  }
}

module.exports = PrepareJoin;