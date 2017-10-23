const cheerio = require('cheerio');
const _ = require('lodash');
let FilterAbstract = require('./filter-abstract');

class FilterPrice extends FilterAbstract {
  constructor(adapter) {
    super();
    this.adapter = adapter;
  }

  filter(value) {
    //console.log(value);
    if (_.isString(value)) {
      value = value.replace(',', '.').replace(' ', '');
      value = value.replace(/[^\d\.]*/g, '');
    }
    return parseFloat(value); // 1739.12
  }
}

module.exports = FilterPrice;