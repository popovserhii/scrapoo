const _ = require('lodash');
//const ConfigHandler = require('scraper/config-handler');

class Preprocessor {
  constructor(variably, configHandler, config) {
    this._config = config || {};
    this._variably = variably;
    this._configHandler = configHandler;

    //this._crawler = crawler;
  }

  get config() {
    return this._config;
  }

  /*set configHandler(configHandler) {
    this._configHandler = configHandler;

    return this;
  }*/

  get configHandler() {
    //if (!this._configHandler) {
    //  this._configHandler = new ConfigHandler(this._source);
    //}

    return this._configHandler;
  }

  get variably() {
    return this._variably;
  }

  /*get source() {
    return this._source;
  }

  get crawler() {
    return this._source.crawler;
  }*/

  process(fields) {
    let isArray = _.isArray(fields);
    fields = _.castArray(fields);

    fields = _.map(fields, _fields => {
      let preFields = {};
      let configFields = this.config.fields/* || {}*/;
      _.each(configFields, (varPattern, name) => {
        if (_.isObject(varPattern)) { // complex variable with __filter & __prepare
          let values = _.map(varPattern.value, value => {
            //if (this.isVariable(value)) {
            if (this.variably.is(value)) {
              //return this._processValue(value.substring(1));
              return this.variably.process(value);
            } else {
              return value;
            }
          });
          preFields[name] = this.configHandler.process(values, varPattern);

          //console.log('processor.js', varPattern, preFields[name]);
        } else if (this.variably.is(varPattern)) {
          //preFields[name] = this._processValue(varPattern);
          //preFields[name] = this._processValue(varPattern.substring(1));
          preFields[name] = this.variably.process(varPattern);
        }
      });
      return _.assign({}, configFields, preFields, _fields);
    });
    return isArray ? fields : fields.shift();
  }
}

module.exports = Preprocessor;