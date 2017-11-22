//const cheerio = require('cheerio');
let FilterAbstract = require('./filter-abstract');

class FilterMinus extends FilterAbstract {
  constructor(adapter) {
    super();
    this.source = adapter;
  }

  filter(value) {
    let subtract = parseInt(this.config.params[0]);
    if (value > subtract) {
      value = value - subtract;
    }

    return value;
  }
}

module.exports = FilterMinus;