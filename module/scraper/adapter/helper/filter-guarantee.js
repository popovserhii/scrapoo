const FilterAbstract = require('./filter-abstract');
const _ = require('lodash');

const DAYS_IN_MONTH = 30;
const DAYS_IN_YEAR = 365;
const MONTHS_IN_YEAR = 12;

class FilterGuarantee extends FilterAbstract {

  get defaultConfig() {
    return {
      "convertTo": "month"
    };
  }

  /**
   * Get object property value
   * @param value
   */
  filter(value) {
    let guaranty = 0;
    _.each(this.config.map, (patterns, measure) => {
      _.each(patterns, pattern => {
        let regexp = new RegExp(pattern);
        let matches =  regexp.exec(value);
        if (_.has(matches, 1)) {
          guaranty = this._convert(_.toFinite(matches[1]), measure);

          return false;
        }
      });
    });

    return +guaranty.toFixed(1);
  }

  _convert(number, measure) {
    if (this.config.convertTo === measure) {
      return number;
    }

    let method = '_convert' + _.upperFirst(measure) + 'To' + _.upperFirst(this.config.convertTo);
    if (!_.isFunction(this[method])) {
      throw new Error(`There isn't available method for convert "${measure}" to "${this.config.convertTo}"`);
    }

    return this[method](number);
  }

  _convertDayToMonth(days) {
    /*let month = days / 30;
    if (1 > month) {
      month = Math.floor(month);
    }*/
    return days / DAYS_IN_MONTH;
  }

  _convertDayToYear(days) {
    return days / DAYS_IN_YEAR;
  }

  _convertMonthToYear(months) {
    return months / MONTHS_IN_YEAR;
  }

  _convertMonthToDay(months) {
    return months * DAYS_IN_MONTH;
  }

  _convertYearToMonth(year) {
    return year * MONTHS_IN_YEAR;
  }

  _convertYearToDay(year) {
    return year * DAYS_IN_YEAR;
  }
}

module.exports = FilterGuarantee;