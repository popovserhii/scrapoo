const _ = require('lodash');

class Converter {
  constructor(config, converterFactory) {
    this._config = config;
    this._converterFactory = converterFactory;
  }

  get config() {
    return this._config;
  }

  get factory() {
    return this._converterFactory;
  }

  async run(taskName) {
    let converter = this.factory.create(this._config[taskName].type, taskName);
    await converter.run();
  }
}

module.exports = Converter;