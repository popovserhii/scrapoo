const FilterAbstract = require('./filter-abstract');
const _ = require('lodash');

class FilterUniq extends FilterAbstract {

  /**
   * Get object property value
   * @param value
   */
  filter(value) {
    //console.log('FilterShift', value);

    if (_.isString(value)) {
      return value;
    } else {
      return _.uniq(value) ;
    }
  }
}

module.exports = FilterUniq;