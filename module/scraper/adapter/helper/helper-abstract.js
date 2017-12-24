const _ = require('lodash');

class HelperAbstract {
  constructor(variably = {}, config = {}) {
    this.variably = variably;

    // define getter for default config
    this.stashConfig = (undefined === this.defaultConfig)
      ? config
      : _.merge({}, this.defaultConfig, config);

    // @see https://stackoverflow.com/a/34073743/1335142
    this.config = {... this.stashConfig};
  }

  resetConfig() {
    this.config = {... this.stashConfig};

    return this;
  }

  mergeConfig(config) {
    //this.config = _.merge(this.config, config);
    _.merge(this.config, config);

    return this;
  }

  setConfig(key, value) {
    this.config[key] = value;

    return this;
  }

  getConfig(key) {
    return this.config.hasOwnProperty(key)
      ? this.config[key]
      : this.config;
  }
}

module.exports = HelperAbstract;