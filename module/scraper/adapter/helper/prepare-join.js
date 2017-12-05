const _ = require('lodash');
let PrepareAbstract = require('./prepare-abstract');

class PrepareJoin extends PrepareAbstract {

  prepare(relative) {
    let sep = this.config.params[0] || '';
    relative = _.castArray(relative);
    //if (!_.isArray(relative)) {
    //  relative = [relative];
    //}
    return relative.join(sep);
  }
}

module.exports = PrepareJoin;