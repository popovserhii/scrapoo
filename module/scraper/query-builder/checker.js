const _ = require('lodash');

class Checker {

  setFields(fields) {
    this._fileds = fields;

    return this;
  }

  check(conditions) {
    let result = '';
    let params = [];

    if (!_.has(conditions, 'condition')) {
      result = true;
    } else {
      let globalBoolOperator = this._conditionToOperator(conditions['condition']);
      let counter = 0;
      let total = _.size(conditions['rules']);
      _.each(conditions['rules'], (rules) => {
        if (_.has(rules, 'condition')) {
          result += this.parseGroup(rules, params);
          total--;
          if (counter < total) {
            result += globalBoolOperator;
          }
        } else {
          result += this.parseRule(rules, params);
          //result = result && this.parseRule(rules, params);
          total--;
          if (counter < total) {
            result += globalBoolOperator;
          }
        }
      });
    }

    return eval(result);
  }

  /**
   * Parse a group of conditions
   */
  parseGroup(rule, param) {
    let parseResult = '(';
    let boolOperator = this._conditionToOperator(rule['condition']);
    // counters to avoid boolean operator at the end of the cycle
    // if there are no more conditions
    let counter = 0;
    let total = _.size(rule['rules']);
    _.each(rule['rules'], (r) => {
      if (_.has(r, 'condition')) {
        parseResult += this.parseGroup(r, param);
      } else {
        parseResult += this.parseRule(r, param);
        total--;
        if (counter < total) {
          parseResult += boolOperator;
        }
      }
    });

    return parseResult + ')';
  }

  /**
   * Parsing of a single condition
   */
  parseRule(rule) {
    let operator = '_' + _.camelCase(rule['operator']);
    if (!_.isFunction(this[operator])) {
      throw new Error(`Unknown "${rule['operator']}" operator for field "${rule['name']}"`);
    }
    let value = this._fileds[rule.field];
    let ruleValue = rule.value;
    if (_.startsWith(ruleValue, '$', 0)) {
      ruleValue = this._fileds[ruleValue.substring(1)];
    }
    if (this._isCastOperator(rule.operator) && _.includes(["integer", "double"], rule.type)) { // casting numeric for correct comparison
      value = _.toNumber(value);
      ruleValue = _.isArray(ruleValue)
        ? _.map(ruleValue, _.toNumber)
        : _.toNumber(ruleValue);
    }
    let parseResult = this[operator](value, ruleValue);

    return this._boolToString(parseResult);
  }

  _boolToString(bool) {
    return bool ? 'true' : 'false';
  }

  _conditionToOperator(condition) {
    return ('AND' === _.toUpper(condition)) ? ' && ' : ' || ';
  }

  _isCastOperator(operator) {
    return !_.includes(['is_empty', 'is_not_empty', 'is_null', 'is_not_null'], operator);
  }

  _equal(value, ruleValue) {
    //"=",
    return _.isEqual(value, ruleValue);
  }

  _notEqual(value, ruleValue) {
    //'"!=",
    return value !== ruleValue;
  }

  _in(value, ruleValue) {
    //"IN (?)",
    return _.includes(ruleValue, value);
  }

  _notIn(value, ruleValue) {
    //"NOT IN (_REP_)",
    return !_.includes(ruleValue, value);
  }

  _less(value, ruleValue) {
    //"<",
    return value < ruleValue;
  }

  _lessOrEqual(value, ruleValue) {
    //"<=",
    return value <= ruleValue;
  }

  _greater(value, ruleValue) {
    //">",
    return value > ruleValue;
  }

  _greaterOrEqual(value, ruleValue) {
    //">=",
    return value >= ruleValue;
  }

  _beginsWith(value, ruleValue) {
    //"ILIKE",
    return _.startsWith(value, ruleValue);
  }

  _notBeginsWith(value, ruleValue) {
    //"NOT ILIKE",
    return !_.startsWith(value, ruleValue);
  }

  _contains(value, ruleValue) {
    //"ILIKE",
    return value.indexOf(ruleValue) !== -1;
  }

  _notContains(value, ruleValue) {
    //"NOT ILIKE",
    return !(value.indexOf(ruleValue) !== -1);
  }

  _endsWith(value, ruleValue) {
    //"ILIKE",
    return _.endsWith(value, ruleValue);
  }

  _notEndsWith(value, ruleValue) {
    //"NOT ILIKE",
    return !_.endsWith(value, ruleValue);
  }

  _isEmpty(value, ruleValue) {
    //"=''",
    return !value;
  }

  _isNotEmpty(value, ruleValue) {
    //"!=''",
    return !!value;
  }

  _isNull(value, ruleValue) {
    //"IS NULL",
    return _.isNull(value);
  }

  _isNotNull(value, ruleValue) {
    //"IS NOT NULL"
    return !_.isNull(value);
  }
}

module.exports = Checker;