const _ = require('lodash');
const cheerio = require('cheerio');
const useragent = require('random-useragent');
const Abstract = require('scraper/source/abstract');
const URL = require('url');
const PrepareBaseUrl = require('scraper/adapter/helper/prepare-base-url');

class Hierarchy extends Abstract {

  async start() {
    this._baseUrlHelper = new PrepareBaseUrl();
    //this.location = URL.parse(this.config.source.path);

    await this._scan(this.config.source.path, this.config.source);

    // @todo Remove this. It is quick realization for price-list
    if (_.isFunction(this.getOutput()._persist)) {
      await this.getOutput()._persist(this.config.source.name);
    }
    // @todo Remove this. It is quick realization for price-list
    if (_.isFunction(this.getOutput()._save)) {
      await this.getOutput()._save();
    }
  }

  get baseUrlHelper() {
    if (this._baseUrlHelper._hasLocation()) {
      return this._baseUrlHelper;
    }
    return this._baseUrlHelper.setConfig('location', this.location);
  }

  async _scan(url, sourceConfig) {
    let $ = (url === _.get(this.location, 'href'))
      ? this.$
      : await this._getResponse(url);

    if (_.has(sourceConfig, 'iterate')) {
      await this._scanIterable(url, sourceConfig);
    } else if (_.has(sourceConfig, 'group')) {
      let groupConfig = sourceConfig.group;
      let specFields = $(groupConfig.context).map((i, element) => {
        let elm = $(element);
        let href = elm.find(groupConfig.selector).attr('href').trim();
        let fields = { href: this.baseUrlHelper.prepare(href) };
        if (_.has(groupConfig, 'fields')) {
          fields.html = elm.html();
        }
        return fields;
      }).get();

      for (let field of specFields) {
        if (_.has(groupConfig, 'fields')) {
          let fields = await this._getFields(field.html, groupConfig.fields);
          _.assign(this.row, fields);
        }
        await this._scan(field.href, groupConfig.source);
      }
    } else if (_.has(sourceConfig, 'selector')) {
      let selectors = _.castArray(sourceConfig.selector);
      let startUrls = [];
      _.each(selectors, selector => {
        $(selector).each((i, element) => {
          startUrls.push(this.baseUrlHelper.prepare($(element).attr('href').trim()));
        });
      });

      if (_.has(sourceConfig, 'fields')) {
        let fields = await this._getFields($.html(), sourceConfig.fields);
        _.assign(this.row, fields);
      }
      for (let i = 0; i < startUrls.length; i++) {
        await this._scan(startUrls[i], sourceConfig.source);
      }
    } else if (_.has(sourceConfig, 'fields')) { // Last element in hierarchy. Write data to file repeat cycle
      let fields = await this._getFields($.html(), sourceConfig.fields);
      _.assign(this.row, fields);
      await this.process(url);

      //await this.getOutput().send(handled);
      //this.config.crawler = _.castArray(this._createCrawlerConfig(sourceConfig.fields));

      //this.config.crawler = this._createCrawlerConfig(sourceConfig.fields);
      //await this.process(url);
    }
  }

  async _scanIterable(url, config) {
    let sourceConfig = _.assign({}, config);
    delete sourceConfig.iterate;

    await this._scan(url, sourceConfig);

    let nextUrl = await this.getNextPage(url, config.iterate);
    while (nextUrl) {
      await this._scan(nextUrl, sourceConfig);
      nextUrl = await this.getNextPage(nextUrl, config.iterate);
    }
  }

  async getNextPage(url, pageConfig) {
    let browserUrl = await this.browser.evaluate(() => window.location.href);
    let $ = (url === browserUrl)
      ? this.$
      : await this._getResponse(url);

    let next = false;
    if (_.has(pageConfig, 'classic.nextPage')) {
      next = $(pageConfig.classic.nextPage).attr('href');
      if (next && next.length > 0) {
        next = /*this._nextUrl =*/ this.baseUrlHelper.prepare(next.trim());
      }
    }

    return next;
  }

  async _getResponse(url) {
    //await this.browser;

    let response = await this.browser
      .setUserAgent(useragent.getRandom())
      .goto(url)
      .evaluate(function () {
        return document.body.innerHTML
      });

    let browserUrl = await this.browser.evaluate(() => window.location.href);
    this.location = URL.parse(browserUrl);

    return this.$ = cheerio.load(response);
  }

  _createCrawlerConfig(fieldsConfig, context = 'body') {
    return {
      "name": "default",
      "group": {
        "selector": context,
        "fields": fieldsConfig
      }
    };
  }

  async _getFields(html, fieldsConfig, context = 'body') {
    let crawlerConfig = this._createCrawlerConfig(fieldsConfig, context);

    let crawler = /*this._crawler =*/ this.getCrawler(crawlerConfig);
    let fields = await crawler.getFields(html);

    return fields.shift();
  }
}

module.exports = Hierarchy;