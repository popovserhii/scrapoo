const _ = require('lodash');

class Variably {
  constructor() {
    this._variables = {};
    this._regexp = /{{([a-zA-Z0-9_\-.]*?)}}/gi;
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
   * Get variable
   *
   * @param name
   */
  get(name) {
    return this._variables[name];
  }

  unset(name) {
    delete this._variables[name];

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

    variable = variable.replace(this._regexp, (match, varPattern, offset, inputString) => {
      return this._processValue(varPattern);
    });

    return variable;
  }

  _processValue(varPattern) {
    let path = varPattern.split('.');
    let objectName = path.shift();
    let resolved = this._variables[objectName];

    if (undefined === resolved) {
      throw new Error('$' + objectName + ' is not set in Variable Object');
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