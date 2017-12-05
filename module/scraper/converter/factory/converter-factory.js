class ConverterFactory {
  constructor(container) {
      this._container = container;
  }

  create(type, task) {
    let configer = this._container.get('configer');
    let config = configer.manageConfig('converter', task);
    let Converter = require('scraper/converter/' + type);
    let converter = new Converter(config);

    return converter;
  }
}

ConverterFactory.default = ConverterFactory; // compatibility with ES6 and Babel transpiler @link https://github.com/Microsoft/TypeScript/issues/2719
module.exports = ConverterFactory;