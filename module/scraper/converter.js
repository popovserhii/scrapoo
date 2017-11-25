class Converter {
  constructor(config) {
    this._config = config;
  }

  async run(sourceName) {
    //console.log(sourceName);
    //console.log(this._config);

    let Converter = require('scraper/converter/' + this._config[sourceName].type);
    //console.log(config);
    //console.log(Construct);
    //console.log(config[root][name]);

    //let construct = className]);
    this._config[sourceName]["default"] = this._config.default;
    let converter = new Converter(this._config[sourceName]);
    await converter.run();
    //await converter.save();
  }
}

module.exports = Converter;