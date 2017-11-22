let fs = require('fs');
let _ = require('lodash');
let http = require('http');
let Nightmare = require('nightmare');
let config = require('./config');

/**
 * Scraper is central class and in get all "scraper" config
 */
class Scraper {
  constructor(config) {
    this._config = config || config.scraper;
    this._sources = {};
  }

  get config() {
    return this._config;
  }


  /*getSource(config) {
    let Source = require('./source/' + currConfig.source.type);
    let source = new Source(nightmare, currConfig);

    return source;
  }*/

  getNamedSource(name) {
    return this._sources[name];
  }

  async run(sourceName = null) {
    let nightmare = Nightmare({
      show: true,
      webPreferences: {
        webSecurity: false
      }
    });

    //let size = _.size(this.config);
    //for (let i = 0; i < size; i++) {

    nightmare.useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36");
    for (let name in this.config) {
      let currConfig = this.config[name];

      //console.log(sourceName);
      //console.log(this.config);
      //console.log('./source/' + currConfig.source.type);

      if (sourceName && sourceName !== name) {
        continue;
      }

      //let config = _.merge((this.config.default || {}), (this.config[this.source.config.pool] || {}), this.config[key]);

      currConfig = _.merge(this.config.default, this.config[currConfig.source.pool], currConfig);

      //console.log(name);
      //console.log(currConfig);

      try {
        let Source = require('scraper/source/' + currConfig.source.type);
        //let Source = require('scraper/source/site');

        //console.log(currConfig.source);
        let source = new Source(nightmare, currConfig);

        await source.start();

        this._sources[currConfig.source.name] = source;
      } catch (e) {
        if (_.isString(e)) {
          console.error(e);
        } else {
          console.log(e);
        }
      }
    }

    nightmare.then(() => {
      return nightmare.end();
    });
  }
}

module.exports = Scraper;