const _ = require('lodash');

class Preprocessor {
  constructor(source, config/*, crawler*/) {
    this._config = config || {};
    this._source = source;
    //this._crawler = crawler;
  }

  get config() {
    return this._config;
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
        if (_.startsWith(varPattern, '$', 0)) {
          //preFields[name] = this._processValue(varPattern);
          preFields[name] = this._processValue(varPattern.substring(1));
        }
      });

      return _.assign({}, configFields, preFields, _fields);
    });

    //  console.log(configFields);

    //console.log(fields);

    return isArray ? fields : fields.shift();
  }

  _processValue(varPatter) {
    let parts = varPatter.split('.');
    let fieldName = parts.pop();
    let objectName = parts.pop();

    if (objectName === 'source') {
      return this[objectName].getNamedField(fieldName);
    } else {
      return this[objectName][fieldName];
    }
  }
}

module.exports = Preprocessor;