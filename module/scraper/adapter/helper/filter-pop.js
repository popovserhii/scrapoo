const FilterAbstract = require('./filter-abstract');

class FilterPop extends FilterAbstract {
  constructor(adapter) {
    super();
    this.source = adapter;
  }

  /**
   * @see https://stackoverflow.com/a/10003709
   * @param value
   */
  filter(value) {
    //console.log('filter', value, params);
    return value.pop();
  }
}

module.exports = FilterPop;