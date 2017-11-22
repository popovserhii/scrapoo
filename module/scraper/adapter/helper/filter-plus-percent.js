//const cheerio = require('cheerio');
let FilterAbstract = require('./filter-abstract');

class FilterPlusPercent extends FilterAbstract {
  constructor(adapter) {
    super();
    this.source = adapter;
  }

  filter(value) {
    let percent = this.config.params[0];
    value = value + (value * (percent / 100));

    return value;
    //value = value.replace(',','.').replace(' ','');
    //value = value.replace( /[^\d\.]*/g, '');
    //return parseFloat(value); // 1739.12
  }
}

module.exports = FilterPlusPercent;