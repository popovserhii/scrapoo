const FilterAbstract = require('./filter-abstract');
const _ = require('lodash');

class FilterFlatten extends FilterAbstract {

  /**
   * Get object property value
   * @param value
   */
  filter(value) {
    //console.log('FilterShift', value);

    if (_.isString(value)) {
      return value;
    } else {
      return _.flatten(value) ;
    }
  }
}

module.exports = FilterFlatten;