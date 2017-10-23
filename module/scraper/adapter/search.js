const cheerio = require('cheerio');
const URL = require('url');
const _ = require('lodash');
const s = require('sprintf-js');
const Abstract = require('scraper/adapter/abstract');

class Search extends Abstract {

  constructor(nightmare, config) {
    super(nightmare, config);

    //this.nightmare = nightmare;
    //this.config = config;
    //this.siteUrl = 'http://hotline.ua';
    //##this.searchUrl = config.url;
    this.$ = {};
    //this.helpers = [];
    this.currField = '';
  }

  async scan(searchable) {
    this.location = URL.parse(this.config.url);

    for (let key of searchable) {
      if (!_.isString(key)) {
        key = this.configHandler.process(key.name, key);
      }

      let searchKey = encodeURIComponent(key);

      console.log(this.config);
      console.log(searchKey);

        let response = await this.nightmare
          .goto(s.sprintf(this.config.url, searchKey))
          .wait()
          .evaluate(function () {
            return JSON.parse(document.body.innerText)
          });

      console.log('--------------***************----------------');
      console.log(response);

      if (!response.length) {
        continue;
      }

      // take only first element from response
      let url = this.location.href + response[0].url;
      return this.getFields(url);

    }

    return false;
  }
}

module.exports = Search;