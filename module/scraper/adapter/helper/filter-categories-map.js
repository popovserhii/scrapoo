const _ = require('lodash');
const FilterAbstract = require('./filter-abstract');

class FilterCategoriesMap extends FilterAbstract {

  /*get categories() {
    if (!this._categories) {
      this._categories = require(this.config.categories);
    }

    return this._categories;
  }

  get categoriesMap() {
    if (!this._categoriesMap) {
      this._categoriesMap = require(this.config.categoriesMap);
    }

    return this._categoriesMap;
  }*/

  filter(value) {
    value = _.map(value, (val) => {
      return val.replace(/\//, '-');
    });
    let category = this._resolve(value.join('/'));
    let categories = this._buildTree(category);

    return categories;
  }

  _resolve(externalCategories) {
    let categories = '';
    if (_.has(this.config.categoriesMap, externalCategories)) {
      categories = this.config.categoriesMap[externalCategories];
    }

    return categories;
  }

  _buildTree(category, parent = []) {
    if (!_.isString(category)) {
      let goOn = true;
      let name = this.variably.get('fields')['name'];
      _.each(category, (cat, keywords) => {
        if (!goOn) return false;
        _.each(keywords.split(','), (keyword) => {
          let index = name.toLowerCase().indexOf(keyword.toLowerCase().trim());
          if (-1 !== index) {
            category = category[keywords];

            return goOn = false;
          }
        });
      });
      if (goOn && _.has(category, '*')) {
        category = category['*'];
      }
    }

    if (!category.trim()) {
      return parent;
    }
    if (-1 !== category.indexOf('/')) {
      parent = parent.concat(category.split('/'));
      this._buildTree(parent.shift(), parent);
    } else if (_.has(this.config.categories, category)) {
      let config = this.config.categories[category];
      parent.unshift(config.name);
      this._buildTree(config.parent, parent);
    } else if (parent.length) {
      parent.unshift(category);
    }

    return parent;
  }

}

module.exports = FilterCategoriesMap;