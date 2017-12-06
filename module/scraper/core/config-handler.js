const _ = require('lodash');

class ConfigHandler {

  constructor(variably) {
    this._variably = variably;
    this.helpers = {};
  }

  get variably() {
    return this._variably;
  }

  get globalConfig() {
    if (!this._globalConfig) {
      this._globalConfig = require(process.cwd() + '/config');
    }

    return this._globalConfig;
  }

  async process(value, fieldConfig) {
    value = await this.processFilters(value, fieldConfig);
    value = await this.processPrepare(value, fieldConfig);

    return value;
  }

  processFilters(value, fieldConfig) {
    if (fieldConfig['__filter'] !== undefined) {
      for (let i = 0; i < fieldConfig['__filter'].length; i++) {
        let filter = this._parseHelperName(fieldConfig['__filter'][i]);
        value = this.getHelper(filter.name, 'filter')
          .mergeConfig(filter.config)
          .setConfig('params', filter.params)
          .filter(value);
      }
    }

    return value;
  }

  processPrepare(value, fieldConfig) {
    if (fieldConfig['__prepare'] !== undefined) {
      for (let i = 0; i < fieldConfig['__prepare'].length; i++) {
        let prepare = this._parseHelperName(fieldConfig['__prepare'][i]);
        value = this.getHelper(prepare.name, 'prepare')
          .mergeConfig(prepare.config)
          .setConfig('params', prepare.params)
          .prepare(value);
      }
    }

    return value;
  }

  _parseHelperName(helper) {
    let parsed = {name: null, config: {}, params: []};
    if (_.isPlainObject(helper)) {
      _.merge(parsed, helper);
    } else if (-1 !== helper.indexOf(':')) { // helper name with params
      let name = helper.substr(0, helper.indexOf(':'));
      let params = helper.substr(helper.indexOf(':') + 1) || '';
      parsed.name = name;
      parsed.params = params.split(',');
    } else {
      parsed.name = helper;
    }

    parsed.params = parsed.params.map((param) => {
      return this.variably.process(_.isString(param) ? param.trim() : param);
    });

    return parsed;
  }

  getHelper(name, pool) {
    let key = pool + '-' + name;

    // Text below isn't actual at that moment!
    // Now helpers caching is disable such as any helper can has different configuration on local level.
    // If leave this possibility here we can retrieve unexpected behavior
    // when config from different places will be merged in on helper

    if (this.helpers && this.helpers[key] !== undefined) {
      this.helpers[key].resetConfig();
      return this.helpers[key];
    }

    let HelperClass = require('scraper/adapter/helper/' + key);
    return this.helpers[key] = new HelperClass(this.variably, this.getHelperConfig(key));
  }

  getHelperConfig(name) {
    if (!_.has(this._defaultConfig, name)) {
      if (!this._defaultConfig) {
        this._defaultConfig = {};
      }

      let config = this.variably.get('config');
      let configPool = config ? config.pool : '';
      let defaultConfigPath = `default.pool.${configPool}.helper.${name}`;
      this._defaultConfig[name] = (_.has(this.globalConfig, defaultConfigPath)) ? _.get(this.globalConfig, defaultConfigPath) : {};
    }

    return this._defaultConfig[name];
  }
}

module.exports = ConfigHandler;