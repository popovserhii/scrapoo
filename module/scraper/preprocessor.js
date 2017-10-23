const _ = require('lodash');
const ConfigHandler = require('scraper/config-handler');

class Preprocessor {
  constructor(source, config) {
    this._config = config || {};
    this._source = source;
    //this._crawler = crawler;
  }

  get config() {
    return this._config;
  }

  get configHandler() {
    if (!this._configHandler) {
      this._configHandler = new ConfigHandler();
    }

    return this._configHandler;
  }

  get source() {
    return this._source;
  }

  get crawler() {
    return this._source.crawler;
  }

  process(fields) {
    let isArray = _.isArray(fields);
    fields = isArray ? fields : [fields];

    fields = _.map(fields, _fields => {
      let preFields = {};

      let configFields = this.config.fields/* || {}*/;

      _.each(configFields, (varPattern, name) => {
        if (_.isObject(varPattern)) { // variable is complex with __filter & __prepare
          let values = _.map(varPattern.value, value => {
            if (this.isVariable(value)) {
              return this._processValue(value.substring(1));
            } else {
              return value;
            }
          });
          preFields[name] = this.configHandler.process(values, varPattern);

          //console.log('processor.js', varPattern, preFields[name]);
        } else if (this.isVariable(varPattern)) {
          //preFields[name] = this._processValue(varPattern);
          preFields[name] = this._processValue(varPattern.substring(1));
        }
      });
      return _.assign({}, configFields, preFields, _fields);
    });
    return isArray ? fields : fields.shift();
  }

  _processValue(varPattern) {
    let value = null;

    //console.log(varPattern);

    //if (_.startsWith(varPattern, '$', 0)) {
      let parts = varPattern.split('.');
      let fieldName = parts.pop();
      let objectName = parts.pop();

      //console.log(varPattern);
      //console.log(parts);

      if (objectName === 'source') { // @todo unified get values from object. Implement adding variables (source, crawler) with simple API such as pre.addVariable(name, value)
        value = this[objectName].getNamedField(fieldName);
      } else {
        value = this[objectName][fieldName];
      }
    //}

    return value;
  }

  isVariable(varPattern) {
    return _.startsWith(varPattern, '$', 0);
  }
}

module.exports = Preprocessor;