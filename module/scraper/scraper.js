let fs = require('fs');
let http = require('http');
let Nightmare = require('nightmare');
let config = require('./config');

class Scraper {
  constructor() {
    this._config = config.scraper;
  }

  get config() {
    return this._config;
  }

  async run() {
    let nightmare = Nightmare({show: true});

    nightmare.useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36");

    for (let i = 0; i < this.config.catalog.length; i++) {
      let currConfig = this.config.catalog[i];
      let Source = require('./source/' + currConfig.source.type);
      let source = new Source(nightmare, currConfig);
      await source.start();
    }

    nightmare.then(() => {
      return nightmare.end();
    });
  }
}

module.exports = Scraper;