//const File = require('../file');
//const Nightmare = require('nightmare');

class SourceFactory {
  constructor(container) {
      this._container = container;
  }

  create(type, task) {
    let configer = this._container.get('configer');
    //let nightmare = this._container.get('nightmare');
    let config = configer.manageConfig('scraper', task);

    let Source = require('scraper/source/' + type);
    let source = new Source(null, config);

    return source;
  }
}

SourceFactory.default = SourceFactory; // compatibility with ES6 and Babel transpiler @link https://github.com/Microsoft/TypeScript/issues/2719
module.exports = SourceFactory;