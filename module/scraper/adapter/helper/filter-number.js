const _ = require('lodash');
let FilterAbstract = require('./filter-abstract');

class FilterNumber extends FilterAbstract {
  constructor(adapter) {
    super();
    this.source = adapter;
  }

  /**
   * @see https://stackoverflow.com/a/10003709
   * @param value
   */
  filter(value) {
    //console.log('module/scraper/adapter/helper/filter-number.js', value);
    // return only first set of number
    let number = 0;
    if (_.isString(value)) {
      let match = value.match(/\d+/);
      if (match) {
        number = match[0];
      }
    }

    return number;
  }
}

module.exports = FilterNumber;