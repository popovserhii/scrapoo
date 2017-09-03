const cheerio = require('cheerio');
const URL = require('url');
const _ = require('lodash');
const s = require('sprintf-js');

class Abstract {
  constructor(nightmare, config) {
    this._nightmare = nightmare;
    this._config = config || {};
    this.helpers = {};

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

        //console.log('fields[name]', fields[name], name, fieldConfig.selector, group.find(fieldConfig.selector));


        fields[name] = this._processFilters(fields[name]);
        /*if (fieldConfig['__filter'] !== undefined) {
          for (let i = 0; i < fieldConfig['__filter'].length; i++) {
            let filter = fieldConfig['__filter'][i];
            //console.log(fieldConfig.selector);
            //console.log(fields[name]);
            fields[name] = this.getHelper(filter, 'filter').filter(fields[name]);
          }
        }*/

        fields[name] = this._processPrepare(fields[name]);
        /*if (fieldConfig['__prepare'] !== undefined) {
          for (let i = 0; i < fieldConfig['__prepare'].length; i++) {
            let prepare = fieldConfig['__prepare'][i];
            fields[name] = this.getHelper(prepare, 'prepare').prepare(fields[name]);
          }
        }*/

        this.currField = '';
      }

      return fields;
    }).get();

    return fields;
  }

  _processFilters(value) {
    let fieldConfig = this.currFieldConfig;
    if (fieldConfig['__filter'] !== undefined) {
      for (let i = 0; i < fieldConfig['__filter'].length; i++) {
        let filter = fieldConfig['__filter'][i];
        //console.log(fieldConfig.selector);
        //console.log(filter);
        //console.log('_processFilters', value);
        value = this.getHelper(filter, 'filter').filter(value);
      }
    }

    return value;
  }

  _processPrepare(value) {
    let fieldConfig = this.currFieldConfig;
    if (fieldConfig['__prepare'] !== undefined) {
      for (let i = 0; i < fieldConfig['__prepare'].length; i++) {
        let prepare = fieldConfig['__prepare'][i];
        value = this.getHelper(prepare, 'prepare').prepare(value);
      }
    }

    return value;
  }

  getValue(elm) {
    let fieldConfig = this.currFieldConfig;
    let val = undefined;

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

  _getOutputAs(elm, type) {
    return ('html' === type)
      ? this.$.html(elm).replace(/>\s+</g, '><').replace(/\s\s+/g, ' ') // @toto Improve regexp
      : elm.text().trim();
  }

  getHelper(name, pool) {
    let key = pool + '-' + name;
    if (this.helpers[key] !== undefined) {
      return this.helpers[key];
    }

    //let config = this.config;
    //let helperClass = key;
    //if (this.helpers[pool][name] !== undefined) {
    //  helperClass = this.helpers[pool][name];
    //} else if (config['helpers'][pool][name] !== undefined) {
    //if (config.fields[pool][name] !== undefined) {
    //  helperClass += config.fields[pool][name];
    //} else {
    //  throw new Error(s.sprintf('Import helper [%s:%s] not exists', pool, name));
    //}

    let HelperClass = require('./helper/' + key);
    return this.helpers[key] = new HelperClass(this);
  }
}

module.exports = Abstract;