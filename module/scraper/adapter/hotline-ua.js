const cheerio = require('cheerio');
let URL = require('url');
let _ = require('lodash');
let s = require('sprintf-js');


class HotlineUa {
  constructor(nightmare, config) {
    this.nightmare = nightmare;
    this.config = config;
    this.siteUrl = 'http://hotline.ua';
    this.searchUrl = 'http://hotline.ua/sr/autocomplete/?term=%s';
    this.$ = {};
    this.helpers = [];
    this.currField = '';
  }

  get currFieldConfig() {
    return this.config.fields[this.currField];
  }


  async scan(searchable) {
    for (let key of searchable) {
      let searchKey = encodeURIComponent(key);

      let response = await this.nightmare
        .goto(s.sprintf(this.searchUrl, searchKey))
        //.goto('http://hotline.ua/sr/autocomplete/?term=MPXQ2')
        .wait()
        .evaluate(function () {
          return JSON.parse(document.body.innerText)
        });

      console.log(searchKey);

      if (!response.length) {
        continue;
      }

      // take only first element from response
      let url = this.siteUrl + response[0].url;
      return this.getFields(url);
    }

    return false;
  }

  async getFields(url) {
    this.location = URL.parse(url);
    let body = await this.nightmare
      .goto(url)
      .wait()
      .evaluate(function () {
        return document.body.innerHTML;
      });

    let $ = this.$ = cheerio.load(body);

    let fields = {};
    for (let name in this.config.fields) {
      this.currField = name;
      let fieldConfig = this.currFieldConfig;
      fields[name] = $(fieldConfig.selector).map((i, element) => {
        let elm = $(element);
        let val = this.getValue(elm);

        //console.log(val);

        return val;
      }).get();

      //console.log(fields[name]);
      //_.each(fields, (val, name) => {
        if (fieldConfig['__filter'] !== undefined) {
          for (let i = 0; i < fieldConfig['__filter'].length; i++) {
            let filter = fieldConfig['__filter'][i];
            fields[name] = this.getHelper(filter, 'filter').prepare(fields[name]);
          }
        }

        if (fieldConfig['__prepare'] !== undefined) {
          for (let i = 0; i < fieldConfig['__prepare'].length; i++) {
            let prepare = fieldConfig['__prepare'][i];
            fields[name] = this.getHelper(prepare, 'prepare').prepare(fields[name]);
          }
        }
      //});

      this.currField = '';
    }

    return fields;
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

module.exports = HotlineUa;