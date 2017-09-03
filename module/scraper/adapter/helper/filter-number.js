const cheerio = require('cheerio');
let FilterAbstract = require('./filter-abstract');

class FilterNumber extends FilterAbstract {
  constructor(adapter) {
    super();
    this.adapter = adapter;
  }

  /**
   * @see https://stackoverflow.com/a/10003709
   * @param value
   */
  filter(value) {
    //console.log('filter', value);
    // return only first set of number
    return value.match(/\d+/)[0];
  }
}

module.exports = FilterNumber;