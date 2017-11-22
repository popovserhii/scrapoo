const _ = require('lodash');
let FilterAbstract = require('./filter-abstract');

class FilterPrice extends FilterAbstract {

  get defaultConfig() {
    return {
      "minRate": 0
    };
  }

  filter(price) {
    if (_.isArray(price)) {
      _.forEach(price, (one, index) => {
        price = this._parsePrice(one);
        if (price <= 0) {
          return;
        }

        if (_.has(this.config, `apply.${index}`)) {
          price = this._applyPattern(price, this.config.apply[index]);
        }

        return false; // correct price is found, break next iterations
      });
    } else {
      price = this._parsePrice(price);
      if (_.has(this.config, 'apply')) {
        price = this._applyPattern(price, this.config.apply);
      }
    }

    if (!_.isUndefined(this.config.fixed)) {
      price = +price.toFixed(this.config.fixed);
    }

    return price;
  }

  _parsePrice(price) {
    if (_.isString(price)) {
      price = price.replace(',', '.').replace(' ', '');
      price = price.replace(/[^\d\.]*/g, '');
      price = parseFloat(price); // 1739.12
    }

    if (_.isNaN(price) || _.isNil(price)) {
      price = 0;
    }

    return price; // 1739.12
  }

  _applyPattern(number, pattern) {
    let group = pattern.match(/([+\-*\/]+)([\d]+)([%]?)/);
    if (!_.size(group)) {
      return number;
    }

    let correlated = 0;
    let correlation = this._correlation(number, group[2], group[3]);
    if ('+' === group[1]) {
      correlated = number + correlation;
    } else if ('-' === group[1]) {
      correlated = number - correlation;
    } else if ('*' === group[1]) {
      correlated = number * correlation;
    } else if ('/' === group[1]) {
      correlated = number / correlation;
    }

    if (correlated > this.config.minRate) {
      number = correlated;
    }

    return number;
  }

  _correlation(number, correlation, percent) {
    correlation = parseFloat(correlation);
    if ('%' === percent) {
      correlation = (number / ((100 - correlation) / 100) - number); // 1000/0.88
    }

    return correlation;
  }
}

module.exports = FilterPrice;