const _ = require('lodash');

let ManageMixin = (SuperClass) => class extends SuperClass {
  /**
   * @todo Use mixin
   * @param name
   * @param task
   */
  manageConfig(name, task) {
    let local = this.config[task];
    if (!local.default) {
      local.default = {};
    }

    let defaultConfig = _.get(this.config, `default.${name}`);
    if (defaultConfig) {
      this.config[task] = _.merge({}, defaultConfig, local);
    }

    //let pool = _.get(this.config, `${task}.pool`);
    let pool = _.get(this.config, `${task}.pool`);
    if (pool) {
      //let pool = this.config[task].source.pool;
      //let defaultConfig = _.has(this.config, `default.${pool}.scraper`) ? _.get(this.config, `default.${pool}.scraper`) : {};
      let defaultConfig = _.get(this.config, `default.pool.${pool}.${name}`);
      if (defaultConfig) {
        this.config[task] = _.merge({}, defaultConfig, local);
      }
    }

    let subDefault = _.get(this.config, `default.pool.${pool}`);
    if (subDefault) {
      _.each(subDefault, (subConfig, subName) => {
        if (subName !== name) {
          if (!local.default[subName]) {
            local.default[subName] = {};
          }
          _.merge(local.default[subName], subConfig);
        }
      });
    }

    return local;
  }
};

module.exports = ManageMixin;