const FilterAbstract = require('./filter-abstract');
const _ = require('lodash');

class FilterGet extends FilterAbstract {

  /**
   * Get object property value
   */
  filter(value) {
    //console.log('FilterShift', value);
    let param = this.config.params[0];
    if (_.isString(value)) {
      return value;
    } else {
      return _.get(value, param) ;
    }
  }
}

module.exports = FilterGet;