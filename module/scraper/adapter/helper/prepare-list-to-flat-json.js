const _ = require('lodash');
const cheerio = require('cheerio');
const PrepareAbstract = require('./prepare-abstract');

/**
 * By default search parent element in first element relative to .parent() of current list,
 * otherwise get nearest previous sibling element as parent.
 */
class PrepareListToFlatJson extends PrepareAbstract {
  prepare(value) {
    this.flat = {};
    this.$ = cheerio.load(value);
    let fistLevel = this.$('ul li:not(ul li ul li)');

    this.buildJson(fistLevel);

    return this.flat;
  }

  buildJson(list) {
    list.each((i, val) => {
      let elm = this.$(val);
      let name = this.getName(elm);
      let data = this.getData(elm);

      let id = data['menuId'] // @toto Hardcode. Think how to move to the config
        ? name + ' : ' + data['menuId']
        : name;

      this.flat[id] = _.merge({}, data, {
        name: name,
        parent: this.getName(this.getParent(elm)),
      });

      if (elm.has('ul')) {
        this.buildJson(elm.find('ul > li'));
      }
    });

    //console.log(this.flat);
  }

  getName(elm) {
    return elm.children().first().text().trim();
  }

  getParent(li) {
    if (li.parents('li').length) {
      return li.parents('li');
    } else {
      return li.closest('ul').parent().prev();
    }
  }

  getData(elm) {
    let data = {};
    if (_.size(elm.data())) {
      data = elm.data();
    } else if (_.size(elm.children().first().data())) {
      data = elm.children().first().data();
    }

    return data;
  }
}

module.exports = PrepareListToFlatJson;