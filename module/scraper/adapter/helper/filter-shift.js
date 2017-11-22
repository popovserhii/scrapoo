const FilterAbstract = require('./filter-abstract');
const _ = require('lodash');

class FilterShift extends FilterAbstract {
  constructor(adapter) {
    super();
    this.source = adapter;
  }

  /**
   * @see https://stackoverflow.com/a/10003709
   * @param value
   */
  filter(value) {
    //console.log('FilterShift', value);

    if (_.isArray(value)) {
      return value.shift();
    } else {
      return value;
    }
  }
}

module.exports = FilterShift;