const fs = require('fs');
const d3 = require('d3-dsv');
const _ = require('lodash');
const cheerio = require('cheerio');
const useragent = require('random-useragent');
const Abstract = require('scraper/source/abstract');
const URL = require('url');
const PrepareBaseUrl = require('scraper/adapter/helper/prepare-base-url');

class Site extends Abstract{
  constructor(nightmare, config) {
    super(nightmare, config);

    this.searchKeys = [];
  }

  async start() {
    this.location = URL.parse(config.source.path);
    this.baseUrlHelper = new PrepareBaseUrl().setConfig('location', this.location);
    let siteName = this.config.source.path;

    //console.log(siteName);
    //console.log(this.config);

    let response = await this.nightmare
      .goto(siteName)
      .wait()
      .evaluate(function () {
        return document.body.innerHTML
      });

    let $ = this.$ = cheerio.load(response);

    let selectors = _.castArray(this.config.source.selector);

    let startUrls = [];
    _.each(selectors, selector => {
      $(selector).each((i, element) => {
        startUrls.push(this.baseUrlHelper.prepare($(element).attr('href')));
      });
    });

    //console.log(selectors);
    //console.log(startUrls);

    //startUrls = ['https://www.supermarketcy.com.cy/saltses-dressings-soypes'];
    for (let i = 0; i < startUrls.length; i++) {
      if (this.config.source.options && this.config.source.options.iterate) {
        await this._scanIterable(startUrls[i]);
      } else {
        await this._scanUrls(startUrls[i]);
      }
    }
  }

  async _scanIterable(url) {
    let options = this.config.source.options;

     let urls = await this.nightmare
        .goto(url)
        .wait()
        .evaluate(iterate => {
          return Array.from(document.querySelectorAll(iterate)).map(a => {
            return a.href;
          });
        }, options.iterate);

    for (let i = 0; i < urls.length; i++) {
      await this._scanUrls(urls[i]);
    }
  }

  async _scanUrls(url) {
    if (!url) {
      return false;
    }

    let nextUrl = false;
    if (await this.nextPageExist()) {
      nextUrl = this._nextUrl;
    }

    this.nightmare.useragent(useragent.getRandom());
    await this.process(url);

    if (nextUrl) {
      if (!this.config.source.options || !this.config.source.options.iterate) {
        this.config.source.options.iterate = '.pager .pager__item--last a';
      }
      await this._scanIterable(nextUrl);
    }
  }

  async prepareFields() {
    let response = await this.nightmare
      .evaluate(function () {
        return document.body.innerHTML
      });

    let $ = cheerio.load(response);

    let dynamicFields = _.has(this.config, 'source.options.dynamicFields')
      ? this.config.source.options.dynamicFields
      : {};

      for (let name in dynamicFields) {
        this._row[name] = $(dynamicFields[name].selector).text();
      }
  }
}

module.exports = Site;