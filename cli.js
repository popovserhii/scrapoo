require('app-module-path').addPath(__dirname + '/module');

const _ = require('lodash');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const config = require('./config');
//const config = require('./config');
//const Converter = require('scraper/converter'); // @todo implement converter wrapper
const Scraper = require('scraper/scraper');


class Cli {

  constructor() {
    this.map = {
      'Scraper': 'scraper/scraper',
      'Converter': 'scraper/converter'
    };
  }

  /**
   * Run as # node cli.js scraper:hotline-category
   * where first is root config name and second config for execute
   *
   * @returns {Promise.<void>}
   */
  async run() {
    let cmd = argv._.shift().split(':');
    let root = cmd.shift();
    let name = cmd.shift();


    let Construct = require(this.map[_.upperFirst(_.camelCase(root))]);
    //console.log(config);
    //console.log(Construct);
    //console.log(config[root][name]);

    try {
      //let construct = className]);
      //let _config = config[root];
      config[root]['default'] = config.default;
      let manager = new Construct(config[root]);
      await manager.run(name);
    } catch (e) {
      if (_.isString(e)) {
        console.error(e);
      } else {
        console.log(e);
      }
    }
    //let converter = new Converter();
    //await converter.run('south-defect', 'Дефект уп-ки Акция!');
    //await converter.save();
  }

}

let cli = new Cli();
cli.run();