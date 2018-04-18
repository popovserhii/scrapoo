const _ = require('lodash');
const cheerio = require('cheerio');
const PrepareAbstract = require('./prepare-abstract');

class PrepareUnwrap extends PrepareAbstract {

  prepare(value) {
    let selector = _.get(this.config.params, '0', 'a') ; // first argument

    let $ = cheerio.load(value);

    $(selector).each(function () {
      $(this).replaceWith($(this).html());
    });

    return $('body').html();
  }

}

module.exports = PrepareUnwrap;