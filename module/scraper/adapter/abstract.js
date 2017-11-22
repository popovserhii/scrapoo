const cheerio = require('cheerio');
const URL = require('url');
const _ = require('lodash');
//const s = require('sprintf-js');
//const ConfigHandler = require('scraper/config-handler');
const Entities = require('html-entities').Html5Entities;

const entities = new Entities();

class Abstract {
  constructor(nightmare, configHandler, config) {
    this._nightmare = nightmare;
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

  get nightmare() {
    return this._nightmare;
  }

  get config() {
    return this._config;
  }

  get configHandler() {
    //if (!this._configHandler) {
      //this._configHandler = new ConfigHandler();

      //console.log('module/scraper/adapter/abstract.js', this.nightmare.url());

      this._configHandler.getHelper('base-url', 'prepare').setConfig('location', this.location);
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

    this.location = URL.parse(searchable);

    let response = await this.nightmare
      .goto(searchable)
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

  async getFields(response) {
    let $ = this.$ = cheerio.load(response);


    let fields = $(this.config.group.selector).map((i, element) => {
      let group = $(element);
      //for (let name in this.config.fields) {
      //console.log(group.attr('class'));

      let fields = {};
      for (let name in this.config.group.fields) {
        this.currField = name;
        let fieldConfig = this.currFieldConfig;
        //let field = this.config.group.fields[name];

        fields[name] = this.getValue(group.find(fieldConfig.selector));

        //console.log('fields[name]', fields[name], name, fieldConfig.selector/*, group.find(fieldConfig.selector)*/);


        //fields[name] = this._processFilters(fields[name], this.currFieldConfig);
        //fields[name] = this._processPrepare(fields[name], this.currFieldConfig);

        fields[name] = this.configHandler.process(fields[name], this.currFieldConfig);

        this.currField = '';
      }

      return fields;
    }).get();

    return fields;
  }



  getValue(elm) {
    let fieldConfig = this.currFieldConfig;
    let val = undefined;

    //console.log(elm.length);

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
}

module.exports = Abstract;