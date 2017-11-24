const _ = require('lodash');

class Variably {
  constructor() {
    this._variables = {};
  }

  /**
   * Set variable
   *
   * @param name
   * @param variable
   */
  set(name, variable) {
    if (!this._variables) {
      this._variables = {};
    }
    this._variables[name] = variable;

    return this;
  }

  /**
   * Is parameter stringable variable
   *
   * @param varPattern
   * @returns {boolean}
   */
  is(varPattern) {
    return _.startsWith(varPattern, '$', 0);
  }

  process(variable) {
    if (this.is(variable)) {
      return this._processValue(variable.substring(1));
    }
    return variable;
  }

  _processValue(varPattern) {
    let path = varPattern.split('.');
    let objectName = path.shift();
    let resolved = this._variables[objectName];

    if (undefined === resolved) {
      throw new Error('$' + objectName + ' is not set in Variable object');
    }

    _.each(path, (part) => {
      if (undefined !== resolved[part]) {
        resolved = resolved[part];
      } else if (_.isFunction(resolved.getData)) {
        resolved = resolved.getData(part);
      } else if (undefined === resolved[part]) {
        resolved = resolved[part];
        return false;
      }
    });
    return resolved;
  }
}

module.exports = Variably;