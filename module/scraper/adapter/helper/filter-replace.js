const FilterAbstract = require('./filter-abstract');
const _ = require('lodash');

class FilterReplace extends FilterAbstract {

  /**
   * @see https://stackoverflow.com/a/10003709
   * @param value
   */
  filter(value) {
    //console.log('filter', value, regexp, newSubStr);
    //console.log(value.replace(this._getRegexp(regexp), newSubStr));

    let regexp = this.config.params[0]; // first argument
    let newSubStr = this.config.params[1]; // second argument

    let filtered = null;
    if (_.isArray(value)) {
      filtered = _.map(value, (val) => {
        return this.filter(val, regexp, newSubStr);
      });
    } else if (_.isString(value)) {
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
      //if ('\\' === regParts[1]) {
      //  regexp = new RegExp('/' + regParts[1] + '/', regParts[2]);
      //} else {
        //regexp = new RegExp(this._quoteRegexp(regParts[1]), regParts[2]);
        regexp = new RegExp(regParts[1], regParts[2]);
      //}
    } else {
      // we got pattern string without delimiters
      regexp = new RegExp(inputRegexp);
    }

    //console.log('module/scraper/adapter/helper/filter-replace.js', regexp);

    return regexp;
  }

  _quoteRegexp(regexp) {
      return regexp.replace(/([\\])/g, "\\$1");
  }
}

module.exports = FilterReplace;