const _ = require('lodash');
const cheerio = require('cheerio');
const useragent = require('random-useragent');
const URL = require('url');
const Entities = require('html-entities').Html5Entities;

const entities = new Entities();

class Abstract {
  constructor(browser, configHandler, config) {
    this._browser = browser;
    this._config = config || {};
    this._configHandler = configHandler;

    if (new.target === Abstract) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }
    // or maybe test typeof this.method === undefined

    /**
     * Start scan process
     *
     * @return self
     */
    if (this.start === 'function') {
      throw new TypeError('Must override method "start()"');
    }
  }

  get browser() {
    return this._browser;
  }

  get config() {
    return this._config;
  }

  get configHandler() {
    //if (!this._configHandler) {
      //this._configHandler = new ConfigHandler();

      //console.log('module/scraper/adapter/abstract.js', this.nightmare.url());

      this._configHandler.getHelper('base-url', 'prepare').stashConfig['location'] = this.location;
    //}

    return this._configHandler;
  }

  get currFieldConfig() {
    if (this.config.group) {
      return this.config.group.fields[this.currField];
    }
    return this.config.fields[this.currField];
  }

  get currUrl() {
    return this.location.href;
  }

  setConfig(config) {
    this._config = config;

    return this;
  }

  getConfig() {
    return this._config;
  }

  async scan(searchable) {
    //console.log('module/scraper/adapter/abstract.js', searchable);
    if (_.isArray(searchable)) { // @todo if need iterate over array then you should to filter only url links in array because can be any value
      searchable = searchable.shift();
    }
    let expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
    let regex = new RegExp(expression);
    if (!searchable.match(regex)) {
      return;
    }

    let response = await this._getResponse(searchable);

    /*let browserUrl = await this.browser.evaluate(() => window.location.href);
    let response = (searchable === browserUrl)
      ? this.$
      : await this._getResponse(url);

    let $ = (url === _.get(this.location, 'href'))
      ? this.$
      : await this._getResponse(url);*/


    if (!response.length) {
      return null;
    }

    return this.getFields(response);
  }

  async getFields(response) {
    //let $ = this.$ = cheerio.load(response);

    let $ = _.isString(response)
      ? cheerio.load(response)
      : response;

    let i = 0;
    let fields = $(this.config.group.selector).map((i, element) => {
      let group = $(element);
      let fields = {};
      for (let name in this.config.group.fields) {
        this.currField = name;
        let fieldConfig = this.currFieldConfig;
        let selector = _.isString(fieldConfig) ? fieldConfig : fieldConfig.selector;
        fields[name] = this.getValue(group.find(selector));
        fields[name] = this.configHandler.process(fields[name], fieldConfig);

        this.currField = '';
      }

      return fields;
    }).get();

    return fields;
  }

  getValue(elm) {
    let fieldConfig = this.currFieldConfig;
    let val = undefined;
    if (elm.length > 1) {
      let values = [];
      elm.each((i, e) => {
        values.push(this.getValue(this.$(e)));
      });

      return values;
    } else {
      _.each(fieldConfig.__output, (name, key) => {
        if ('attr' === key) {
          val = elm.attr(name);
        } else if ('as' === key) {
          val = this._getOutputAs(elm, name);
        }
      });

      if (undefined === val) {
        val = this._getOutputAs(elm, 'text');
      }

      return val;
    }
  }

  _getOutputAs(elm, type) {
    return ('html' === type)
      ? entities.decode(this.$.html(elm).replace(/>\s+</g, '><').replace(/\s\s+/g, ' ')) // @toto Improve regexp
      : elm.text().trim();
  }

  async _getResponse(url) {
    let browserUrl = await this.browser.evaluate(() => window.location.href);
    let response = (url === browserUrl)
      ? await this.browser.evaluate(() => document.body.innerHTML)
      : await this.browser
        .setUserAgent(useragent.getRandom())
        .goto(url)
        .evaluate(() => document.body.innerHTML);

    /*let response = await this.browser
      .setUserAgent(useragent.getRandom())
      .goto(url)
      .evaluate(function () {
        return document.body.innerHTML
      });*/

    //browserUrl = await this.browser.evaluate(() => window.location.href);
    this.location = URL.parse(url);

    return this.$ = cheerio.load(response);
  }
}

module.exports = Abstract;