const FilterAbstract = require('./filter-abstract');
const _ = require('lodash');

class FilterUnshift extends FilterAbstract {

  /**
   * @see https://stackoverflow.com/a/10003709
   * @param value
   */
  filter(value) {
    //console.log('FilterShift', value);
    let first = this.config.params[0];
    value = _.castArray(value);
    //if (_.isArray(value)) {
      value.unshift(first);
    //}
    return value;
  }
}

module.exports = FilterUnshift;