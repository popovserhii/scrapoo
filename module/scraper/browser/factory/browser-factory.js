const { Chromeless } = require('chromeless');
const Nightmare = require('nightmare');

class BrowserFactory {
  static create(container) {
    //let configer = container.get('configer');
    //let config = configer.manageConfig('converter', task);

    let browser = new Chromeless(/*config*/);
    //let browser = new Nightmare(/*config*/);
    //browser.setUserAgent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36");

    return browser;
  }
}

BrowserFactory.default = BrowserFactory; // compatibility with ES6 and Babel transpiler @link https://github.com/Microsoft/TypeScript/issues/2719
module.exports = BrowserFactory;