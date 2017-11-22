const _ = require('lodash');

class HelperAbstract {
  constructor(source = {}, config = {}) {
    this.source = source;

    // define getter for default config
    this.config = (undefined === this.defaultConfig)
      ? config
      : _.merge(this.defaultConfig, config);
  }

  mergeConfig(config) {
    this.config = _.merge(this.config, config);

    return this;
  }

  setConfig(key, value) {
    this.config[key] = value;

    return this;
  }

  getConfig(key) {
    return this.config.hasOwnProperty(key)
      ? this.config[key]
      : false;
  }
}

module.exports = HelperAbstract;