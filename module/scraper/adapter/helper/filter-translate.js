const FilterAbstract = require('./filter-abstract');

const Translate = require('google-translate-api');

class FilterTranslate extends FilterAbstract {

  async filter(value) {
    let translated = await Translate(value, {from: this.config.from, to: this.config.to});
    return translated.text;
  }
}

module.exports = FilterTranslate;