const _ = require('lodash');
const PrepareAbstract = require('./prepare-abstract');

class PrepareFindMerge extends PrepareAbstract {

  prepare(value) {
    let find = this.config.params[0];
    let merge = this.config.params[1];

    find = this.parseJson(find);
    merge = this.parseJson(merge);
    _.merge(_.find(value, find), merge);

    return value;
  }

  parseJson(json) {
    if (_.isString(json)) {
      console.log(json);
      json = eval('('+ json +')');
    }
     return json;
  }
}

module.exports = PrepareFindMerge;