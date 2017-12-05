const _ = require('lodash');
const FilterAbstract = require('./filter-abstract');

class FilterTrim extends FilterAbstract {

  /**
   * @param value
   */
  filter(value) {
    let chars = this.config.params[0]; // first argument

    let filtered = null;
    if (_.isArray(value)) {
      filtered = _.map(value, (val) => {
        return this.filter(val);
      });
    } else if (_.isString(value)) {
      filtered = _.trim(value, chars);
    }

    return filtered;
  }
}

module.exports = FilterTrim;