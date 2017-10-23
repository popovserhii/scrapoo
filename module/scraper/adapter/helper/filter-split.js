const FilterAbstract = require('./filter-abstract');

class FilterSplit extends FilterAbstract {
  constructor(adapter) {
    super();
    this.adapter = adapter;
  }

  /**
   * @see https://stackoverflow.com/a/10003709
   * @param value
   * @param mark
   */
  filter(value, mark) {
    //console.log('filter', value, params);
    return value.split(mark);
  }
}

module.exports = FilterSplit;