const _ = require('lodash');
//const mix = require('mixwith').mix;
//const ConfigManageMixin = require('scraper/configure/manage-mixin');

class Configer/* extends mix(Object).with(ConfigManageMixin)*/ {
  constructor(config) {
    //super();
    this._globalConfig = config;
  }

  manageConfig(path, target = null) {
    let config = _.get(this._globalConfig, path);
    if (!config) {
      return false;
    }

    let local = target ? config[target] : config;
    if (!local.default) {
      local.default = {};
    }

    let name = path.split('.').pop();

    // merge global default configs
    let ignore = _.get(this._globalConfig, 'configer.ignoreGlobalMerge') || [];
    _.each(this._globalConfig.default, (subConfig, subName) => {
      if (!_.includes(ignore, subName)) {
        if (!local.default[subName]) {
          local.default[subName] = {};
        }
        _.merge(local.default[subName], subConfig);
      }
    });

    // merge default configs by name
    let defaultConfig = _.get(this._globalConfig, `default.${name}`);
    if (defaultConfig) {
      config[target] = _.merge({}, defaultConfig, local);
    }

    // merge default by pool
    let pool = _.get(config, `${target}.pool`);
    if (pool) {
      let defaultConfig = _.get(this._globalConfig, `default.pool.${pool}.${name}`);
      if (defaultConfig) {
        config[target] = _.merge({}, defaultConfig, local);
      }

      let subDefault = _.get(this._globalConfig, `default.pool.${pool}`);
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
    }

    return local;
  }
}

Configer.default = Configer;
module.exports = Configer;