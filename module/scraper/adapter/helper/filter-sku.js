const _ = require('lodash');
const crypto = require('crypto');
const RuleChecker = require('scraper/query-builder/checker');
const FilterAbstract = require('./filter-abstract');

class FilterSku extends FilterAbstract {

  get defaultConfig() {
    return {
      "apply": {
        "normalize": {
          "format": "$sku",
          "hash": {
            "fields": [], // if empty take default passed value
            "skip": true,
            "onlyNumbers": true,
            "length": 7,
            "algorithm": "md5",
          }
          //"format": "$value-$field.supplier",
        },
      }
    }
  }

  filter(value) {
    this._merged = [];

    if (this.config.rules) {
      value = this._checkRules(value);
    }

    if (!this.variably.get('sku')) {
      value = this._normalize(value, this.config.apply.normalize);
    }

    this.variably.unset('sku');

    return value;
  }

  _normalize(value, normalizeConfig) {
    if (!normalizeConfig.hash.skip) {
      // omit default value if set "hash.fields"
      if (normalizeConfig.hash.fields.length > 0) {
        value = _.map(normalizeConfig.hash.fields, (field) => {
          return this.variably.process(field)
        }).join();
      }
      value = crypto.createHash(normalizeConfig.hash.algorithm).update(value).digest('hex');
      if (normalizeConfig.hash.onlyNumbers) {
        value = value.replace(/\D/g, '');
      }
      value = value.substr(0, normalizeConfig.hash.length);
    }

    this.variably.set('sku', value);

    value = this.variably.process(normalizeConfig.format);

    return value;
  }

  _checkRules(value) {
    if (!this._ruleChecker) {
      this._ruleChecker = new RuleChecker();
    }

    this._ruleChecker.setFields(this.variably.get('fields'));
    _.each(this.config.rules, (rule, i) => {
      if (this._ruleChecker.check(rule)) {
        // normalize rule only once per all items for performance
        _.has(this._merged, i) || this._configNormalize(rule);
        value = this._normalize(value, rule.apply.normalize);

        return false; // rule is matching, break next iteration
      }
    });
    return value;
  }

  _configNormalize(rule, order) {
    rule.apply.normalize = _.merge({}, this.config.apply.normalize, rule.apply.normalize);

    return this._merged[order] = rule.apply.normalize;
  }
}

module.exports = FilterSku;