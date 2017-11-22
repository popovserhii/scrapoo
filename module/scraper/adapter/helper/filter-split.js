const _ = require('lodash');
const FilterAbstract = require('./filter-abstract');

class FilterSplit extends FilterAbstract {

  /**
   * @see https://stackoverflow.com/a/10003709
   * @param value
   * @param mark
   */
  filter(value) {
    let mark = this.config.params[0];
    if (!value) {
      value = [];
    } else if (_.isString(value)) {
      value = value.split(mark);
    } else if (_.isArray(value)) {
      value = _.map(value, (val) => {
        return this.filter(val, mark);
      });
    }

    return value;
    //console.log('filter', value, params);
  }
}

module.exports = FilterSplit;