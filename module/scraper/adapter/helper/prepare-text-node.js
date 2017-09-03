const cheerio = require('cheerio');
const PrepareAbstract = require('./prepare-abstract');

class PrepareTextNode extends PrepareAbstract {
  constructor(adapter) {
    super();
    this.adapter = adapter;
  }

  prepare(value) {
    let $ = cheerio.load(value);
    //console.log(relative);
    return $.root().clone().children().remove().end().text();
  }
}

module.exports = PrepareTextNode;