const _ = require('lodash');
const config = require(process.cwd() + '/config'); // @todo Improve logic for getting general config. Maybe use cache on required() level

class ConfigHandler {

  constructor(variably/*,source*/) {
    this._variably = variably;
    //this._source = this._variably.process('$source');
    this.helpers = {};
  }

  get variably() {
    return this._variably;
  }

  /**
   * @deprecated
   */
  //get source() {
  //  return this._source;
  //}


  process(value, fieldConfig) {
    value = this.processFilters(value, fieldConfig);
    value = this.processPrepare(value, fieldConfig);

    return value;
  }

  processFilters(value, fieldConfig) {
    if (fieldConfig['__filter'] !== undefined) {
      for (let i = 0; i < fieldConfig['__filter'].length; i++) {
        let filter = this._parseHelperName(fieldConfig['__filter'][i]);
        //value = this.getHelper(filter.name, 'filter').setConfig('params', ).filter(value, ...filter.params);
        value = this.getHelper(filter.name, 'filter').setConfig('params', filter.params).filter(value);
      }
    }

    return value;
  }

  processPrepare(value, fieldConfig) {
    if (fieldConfig['__prepare'] !== undefined) {
      for (let i = 0; i < fieldConfig['__prepare'].length; i++) {
        let prepare = this._parseHelperName(fieldConfig['__prepare'][i]);
        value = this.getHelper(prepare.name, 'prepare').setConfig('params', prepare.params).prepare(value);
      }
    }

    return value;
  }

  _parseHelperName(helper) {
    let parsed = {};
    if (_.isPlainObject(helper)) {
      parsed = helper;
    } else if (-1 !== helper.indexOf(':')) { // helper name with params
      let name = helper.substr(0, helper.indexOf(':'));
      let params = helper.substr(helper.indexOf(':') + 1) || '';
      parsed.name = name;
      parsed.params = params.split(',');
    } else {
      parsed = {name: helper, params: []};
    }

    parsed.params = parsed.params.map((param) => {
      return this.variably.process(param.trim());
    });

    return parsed;
  }

  getHelper(name, pool) {
    let key = pool + '-' + name;
    if (this.helpers && this.helpers[key] !== undefined) {
      return this.helpers[key];
    }

    //let config = _.merge((this.config.default || {}), (this.config[this.source.config.pool] || {}), this.config[key]);
    //let config = (this.source && _.has(this.source.config, `helper.${key}`)) ? this.source.config.helper[key] : {};
    let configPool = this.variably.get('config').pool;
    let configPath = `default.${configPool}.helper.${key}`;
    let subConfig = (_.has(config, configPath)) ? _.get(config, configPath) : {};

    let HelperClass = require('scraper/adapter/helper/' + key);
    return this.helpers[key] = new HelperClass(this.variably, subConfig);
  }
}

module.exports = ConfigHandler;