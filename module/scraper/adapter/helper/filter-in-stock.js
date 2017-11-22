const _ = require('lodash');
const FilterAbstract = require('./filter-abstract');

class FilterInStock extends FilterAbstract {

  /**
   * @see https://stackoverflow.com/a/10003709
   * @param value
   */
  filter(value) {
    let mapped = null;
    if (_.has(this.config, `map.${value}`)) {
      mapped = _.get(this.config, `map.${value}`);
    } else {
      mapped = _.get(this.config, 'map.__default') || 0; // by default is not in stock
    }

    return mapped;
  }
}

module.exports = FilterInStock;