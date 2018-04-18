const _ = require('lodash');
const RuleChecker = require('scraper/query-builder/checker');
const FilterAbstract = require('./filter-abstract');

class FilterPrice extends FilterAbstract {

  /*get defaultConfig() {
    return {
      "minRate": 0
    };
  }*/

  filter(price) {
    if (_.isArray(price)) {
      _.forEach(price, (one, index) => {
        price = this._parsePrice(one);
        if (this.config.rules) {
          price = this._checkRules(price);
        }

        return false; // correct price is found, break next iterations
      });
    } else {
      price = this._parsePrice(price);
      if (this.config.rules) {
        price = this._checkRules(price);
      }
    }

    if (!_.isUndefined(this.config.fixed)) {
      price = +price.toFixed(this.config.fixed);
    }

    return price;
  }

  _checkRules(price) {
    if (!this._ruleChecker) {
      this._ruleChecker = new RuleChecker();
    }

    this._ruleChecker.setFields(this.variably.get('fields'));
    _.each(this.config.rules, rule => {
      if (this._ruleChecker.check(rule)) {
        if (_.isString(rule.apply.to)) {
          price = this.variably.process(rule.apply.to);
        }
        price = this._applyPattern(price, rule.apply.operand);

        return false; // rule is matching, break next iteration
      }
    });

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

    //if (correlated > this.config.minRate) {
      number = correlated;
    //}

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