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
    this.location = URL.parse(this.config.url.path);

    //console.log('module/scraper/adapter/search.js', searchable);
    for (let key of searchable) {
      //console.log('module/scraper/adapter/search.js:key', key);
      //console.log(typeof key);

      if (!_.isString(key) && !_.isNumber(key)) {
        key = this.configHandler.process(key.name, key);
      }
      //console.log('module/scraper/adapter/search.js:key:after', key);


      let searchKey = encodeURIComponent(key);
      let searchUrl = s.sprintf(this.config.url.path, searchKey);


      //console.log('module/scraper/adapter/search.js', this.config);

      let response = await this.nightmare
        .goto(searchUrl)
        .wait()
        .evaluate(function () {
          //return JSON.parse(document.body.innerText)
          return document.body.innerHTML
        });

      //console.log('--------------***************----------------');
      //console.log(response);

      if (!response.length) {
        continue;
      }

      let $ = this.$ = cheerio.load(response);
      let href = $(this.config.url.selector).attr('href');

      // take only first element from response
      let url = this.location.protocol + "//" + this.location.host + href;

      //console.log(this.config.url.selector, url);

      response = await this.nightmare
        .goto(url)
        .wait()
        .evaluate(function () {
          return document.body.innerHTML
        });

      //console.log(response);

      if (!response.length) {
        return null;
      }

      return this.getFields(response);

    }

    return false;
  }
}

module.exports = Search;