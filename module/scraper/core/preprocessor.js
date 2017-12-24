const _ = require('lodash');

class Preprocessor {
  constructor(configHandler, config) {
    this._config = config || {};
    this._variably = configHandler.variably;
    this._configHandler = configHandler;
  }

  get config() {
    return this._config;
  }

  get configHandler() {
    return this._configHandler;
  }

  get variably() {
    return this._variably;
  }

  /**
   * Mark native value as array or not and return array
   *
   * You must use this in strong order of cast() and back() method otherwise get unexpected behavior
   *
   * @param value
   * @returns {Array}
   */
  cast(value) {
    if (!this._cast) {
      this._cast = [];
    }

    this._cast.push(_.isArray(value));

    return _.castArray(value);
  }

  back(array) {
    return this._cast.pop() ? array : array.shift();
  }

  process(fields) {
    this.variably.set('fields', fields);

    //let isArray = _.isArray(fields);
    //let collection = _.castArray(fields);

    let collection = this.cast(fields);

    collection = _.map(collection, fields => {
      let preFields = {};
      _.each(this.config.fields, (varPattern, name) => {
        if (_.isPlainObject(varPattern)) { // complex variable with __filter & __prepare
          let values = _.map(this.cast(varPattern.value), value => {
            return this.variably.is(value)
              ? this.variably.process(value)
              : value;
          });
          preFields[name] = this.configHandler.process(this.back(values), varPattern);
        } else if (this.variably.is(varPattern)) {
          preFields[name] = this.variably.process(varPattern);
        } else {
          preFields[name] = varPattern;
        }
      });
      return _.assign({}, /*fields,*/ preFields);
    });

    //return isArray ? collection : collection.shift();
    return this.back(collection);
  }
}

module.exports = Preprocessor;