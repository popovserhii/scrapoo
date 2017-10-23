class ConfigHandler {

  constructor() {
    this.helpers = {};
  }

  process(value, fieldConfig) {
    value = this.processFilters(value, fieldConfig);
    value = this.processPrepare(value, fieldConfig);

    return value;
  }

  processFilters(value, fieldConfig) {
    //let fieldConfig = this.currFieldConfig;
    if (fieldConfig['__filter'] !== undefined) {
      for (let i = 0; i < fieldConfig['__filter'].length; i++) {
        //let filter = fieldConfig['__filter'][i];
        let filter = this._parseHelperName(fieldConfig['__filter'][i]);

        value = this.getHelper(filter.name, 'filter').filter(value, ...filter.params);
      }
    }

    return value;
  }

  processPrepare(value, fieldConfig) {
    //let fieldConfig = this.currFieldConfig;
    if (fieldConfig['__prepare'] !== undefined) {
      for (let i = 0; i < fieldConfig['__prepare'].length; i++) {
        //let prepare = fieldConfig['__prepare'][i];
        let prepare = this._parseHelperName(fieldConfig['__prepare'][i]);

        value = this.getHelper(prepare.name, 'prepare').prepare(value, ...prepare.params);
      }
    }

    return value;
  }

  _parseHelperName(helper) {
    let parsed = {name: helper, params: []};
    if (false !== helper.indexOf(':')) { // helper name with params
      let parts = helper.split(':');
      parsed.name = parts[0];
      if (undefined !== parts[1]) {
        parsed.params = parts[1].split(',').map(function(param) {
          return param.trim();
        });
      }
    }
    return parsed;
  }

  getHelper(name, pool) {
    let key = pool + '-' + name;
    if (this.helpers && this.helpers[key] !== undefined) {
      return this.helpers[key];
    }

    //console.log(name, pool);

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

    //console.log('config-handler.js', pool, key);

    let HelperClass = require('scraper/adapter/helper/' + key);
    return this.helpers[key] = new HelperClass(this);
  }
}

module.exports = ConfigHandler;