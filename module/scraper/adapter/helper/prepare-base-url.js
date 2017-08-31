let PrepareAbstract = require('./prepare-abstract');
let URL = require('url');
let _ = require('lodash');

class PrepareBaseUrl extends PrepareAbstract {
  constructor(adapter) {
    super();
    this.adapter = adapter;
    this.options = {};

    if (adapter && adapter.hasOwnProperty('location')) {
      this.setOption('location', adapter.location)
    }
  }

  setOption(key, value) {
    this.options[key] = value;

    return this;
  }

  getOption(key) {
    return this.options.hasOwnProperty(key)
      ? this.options[key]
      : false;
  }

  prepare(relative) {
    let isArray = _.isArray(relative);
    relative = isArray ? relative : [relative];
    _.each(relative, (val, key) => {
      // string start with http:// or https://
      if (val.indexOf('://') > -1) {
        return;
      } else if (this.getOption('location')) {
        let url = this.getOption('location');
        let location = (typeof url === 'object')
          ? url
          : URL.parse(url);

        relative[key] = location.protocol + "//" + location.host + _.trimStart(val, '.');
      } else {
        throw new Error('You must set "location" option before calling prepare() method');
      }
    });

    return isArray ? relative : relative.shift();
  }
}

module.exports = PrepareBaseUrl;