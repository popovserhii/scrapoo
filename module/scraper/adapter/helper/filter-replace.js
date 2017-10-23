const FilterAbstract = require('./filter-abstract');
const _ = require('lodash');

class FilterReplace extends FilterAbstract {
  constructor(adapter) {
    super();
    this.adapter = adapter;
  }

  /**
   * @see https://stackoverflow.com/a/10003709
   * @param value
   * @param regexp
   * @param newSubStr
   */
  filter(value, regexp, newSubStr) {
    //console.log('filter', value, regexp, newSubStr);
    //console.log(value.replace(this._getRegexp(regexp), newSubStr));
    let filtered = null;
    if (_.isArray(value)) {
      filtered = _.map(value, (val) => {
        return this.filter(val, regexp, newSubStr);
      });
    } else {
      filtered = value.replace(this._getRegexp(regexp), newSubStr);
    }

    return filtered;
  }

  _getRegexp(inputRegexp) {
    let regParts = inputRegexp.match(/^\/(.*?)\/([gim]*)$/);
    //console.log(inputRegexp);
    let regexp = null;
    if (regParts) {
      // the parsed pattern had delimiters and modifiers. handle them.
      regexp = new RegExp(regParts[1], regParts[2]);
    } else {
      // we got pattern string without delimiters
      regexp = new RegExp(inputRegexp);
    }

    //console.log(regexp);

    return regexp;
  }
}

module.exports = FilterReplace;