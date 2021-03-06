let PrepareAbstract = require('./prepare-abstract');
let URL = require('url');
let _ = require('lodash');

class PrepareBaseUrl extends PrepareAbstract {
  /*constructor(adapter) {
    super(adapter);
    this.options = {};

    //console.log('module/scraper/adapter/helper/prepare-base-url.js', adapter.nightmare.url());
    //console.log('module/scraper/adapter/helper/prepare-base-url.js', adapter.nightmare.url());

    //if (adapter && adapter.hasOwnProperty('location')) {
    //  this.setOption('location', adapter.location)
    //} else if (adapter && adapter.nightmare) {
    //  this.setOption('location', adapter.nightmare.url())
    //}
  }*/

  prepare(relative) {
    let isArray = _.isArray(relative);
    relative = _.castArray(relative);

    //console.log('module/scraper/adapter/helper/prepare-base-url.js', relative);

    _.each(relative, (val, key) => {
      // string start with http:// or https://
      if (val.indexOf('://') > -1) {
        return;
      } else if (this._hasLocation()) {
        let url = this.getConfig('location');
        let location = (typeof url === 'object')
          ? url
          : URL.parse(url);

        //location.pathname = _.trimStart(val, '.');
        //relative[key] = URL.format(location);
        relative[key] = location.protocol + "//" + location.host + '/' +  _.trimStart(val, './');
      } else {
        throw new Error('You must set "location" option before calling prepare() method');
      }
    });

    return isArray ? relative : relative.shift();
  }

  _hasLocation() {
    if (this.getConfig('location')) {
      return true;
    }

    let url = _.get(this.config, 'params.location');
    if (!url) {
      return false;
    }

    this.setConfig('location', url);

    return true;
  }
}

module.exports = PrepareBaseUrl;