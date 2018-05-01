const _ = require('lodash');
const cheerio = require('cheerio');
const Abstract = require('scraper/source/abstract');
const URL = require('url');
const PrepareBaseUrl = require('scraper/adapter/helper/prepare-base-url');

class Hierarchy extends Abstract {

  async start() {
    this.location = URL.parse(this.config.source.path);
    this.baseUrlHelper = new PrepareBaseUrl().setConfig('location', this.location);

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

  async _scan(url, sourceConfig) {
    //let response = await this._getResponse(url);
    //let $ = cheerio.load(response);

    let $ = await this._getResponse(url);

    if (_.has(sourceConfig, 'pagination')) {
      await this._scanIterable(url, sourceConfig);
    } else if (_.isPlainObject(sourceConfig.group)) {
      // Тут дістаємо не тільки урл, а всі поля які перераховані у fields. Щоб добитись цілісності, можна у fields
      // додати поле __url, потім в цикклі вибирати це поле і робити новий запит даних. Після того як дані отримані
      // можна робити об'єднання з даними із поточної ітерації
      let urls = $(sourceConfig.group.context).map((i, element) => {
        let elm = $(element);
        let href = elm.find(sourceConfig.group.selector).attr('href');
        return this.baseUrlHelper.prepare(href);
        //this._scanUrl(url);

        //return this.baseUrlHelper.prepare($(elm).attr('href'));
      }).get();

      for (let url of urls) {
        await this._scan(url, sourceConfig.group.source);
      }
    }

    if (_.has(sourceConfig, 'selector')) {
      let selectors = _.castArray(sourceConfig.selector);

      let startUrls = [];
      _.each(selectors, selector => {
        $(selector).each((i, element) => {
          startUrls.push(this.baseUrlHelper.prepare($(element).attr('href')));
        });
      });
      //let startUrls = [];
      /*let startUrls = selectors.map(selector => {
        $(selector).each((i, element) => {
          return this.baseUrlHelper.prepare($(element).attr('href'));
        });
      });*/


      //startUrls = ['https://www.supermarketcy.com.cy/saltses-dressings-soypes'];
      for (let i = 0; i < startUrls.length; i++) {
        //if (this.config.source.options && this.config.source.options.iterate) {
        if (_.has(sourceConfig, 'pagination')) {
          await this._scanIterable(startUrls[i], sourceConfig);
        } else {
          //await this._scan(startUrls[i], sourceConfig);
          await this._scan(startUrls[i], sourceConfig.source);
        }
      }
    } /*else if (_.has(sourceConfig, 'source')) {
      await this._scan(sourceConfig.source);
    }*/

    if (_.has(sourceConfig, 'fields')) {
      let crawlerConfig = {
        "name": "default",
        "group": {
          "selector": "body",
          "fields": sourceConfig.fields
        }
      };

      let crawler = /*this._crawler =*/ this.getCrawler(crawlerConfig);
      let fields = await crawler.getFields($.html());

      for (let f = 0; f < fields.length; f++) {
        let handled = this.preprocessor.process(_.merge({}, this.row, fields[f]));
        await this.getOutput().send(handled);
      }
    }
  }

  async _scanIterable(url, config) {
    let sourceConfig = _.assign({}, config);
    delete sourceConfig.pagination;

    await this._scan(url, sourceConfig);

    let nextUrl = await this.getNextPage(url, config.pagination);
    while (nextUrl) {
      await this._scan(nextUrl, sourceConfig);
      nextUrl = await this.getNextPage(nextUrl, config.pagination);
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
        next = this._nextUrl = this.baseUrlHelper.prepare(next);
      }
    }

    return next;
  }

  async _getResponse(url) {
    let response = await this.browser
      .goto(url)
      //.wait()
      .evaluate(function () {
        return document.body.innerHTML
      });

    return this.$ = cheerio.load(response);
  }

  async _prepareFields() {
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

module.exports = Hierarchy;