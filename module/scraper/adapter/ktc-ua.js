const cheerio = require('cheerio');
const URL = require('url');
const _ = require('lodash');
const s = require('sprintf-js');
const Abstract = require('scraper/adapter/abstract');

class KtcUa extends Abstract {

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
      let searchKey = encodeURIComponent(key);

      //console.log(this.config);
      //console.log(searchKey);

      let response = await this.nightmare
        .goto(s.sprintf(this.config.url, searchKey))
        .wait()
        .evaluate(function () {
          //return JSON.parse(document.body.innerText)
          return document.body.innerHTML
        });

      let $ = this.$ = cheerio.load(response);
      let href = $('.ptoductBlock').first().find('.linkItem').attr('href');
      //console.log(href);

      if (!href || !href.length) {
        continue;
      }

      // take only first element from response
      //let url = this.location.href + href;
      let url = this.location.protocol + "//" + this.location.host + href;

      let wait = Math.floor(Math.random() * (8 - 2 + 1)) + 2; // dynamic wait: 2-8 seconds
      let body = await this.nightmare
        .goto(url)
        .wait(wait * 1000)
        .evaluate(function () {
          return document.body.innerHTML;
        });

      return this.getFields(body);
    }

    return false;
  }
}

module.exports = KtcUa;