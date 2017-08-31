const cheerio = require('cheerio');
let FilterAbstract = require('./filter-abstract');

class FilterTextNode extends FilterAbstract {
  constructor(adapter) {
    super();
    this.adapter = adapter;
  }

  filter(value) {
    let $ = cheerio.load(value);
    value = $('body').children().clone().children().remove().end().text();

    return value;
  }
}

module.exports = FilterTextNode;