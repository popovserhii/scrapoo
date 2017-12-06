const FilterAbstract = require('./filter-abstract');

const Translate = require('google-translate-api');

class FilterTranslate extends FilterAbstract {

    async filter(value) {
        let translated = await Translate(value, {to: 'ru'});

        return translated.text;
    }
//все

 /* filter(value) {

      return Translate(value, {to: 'ru'}).then(this.res);

  }

  res(value) {
      return value.text;
  }*/
}

module.exports = FilterTranslate;