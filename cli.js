require('app-module-path').addPath(__dirname + '/module');

const _ = require('lodash');
//const path = require('path');
const argv = require('minimist')(process.argv.slice(2));
const App = require('scraper/core/app');
//const config = require('./config');
//const config = require('./config');
//const Converter = require('scraper/converter'); // @todo implement converter wrapper
//const Scraper = require('scraper/scraper');


class Cli {

  constructor() {
    this.map = {
      'scraper': 'scraper/scraper',
      'converter': 'scraper/converter'
    };
  }

  get config() {
    return config;
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

    let container = App.init({
      'config': __dirname + '/config/index.js',
      'modules': __dirname + '/config/modules.js',
    });

    try {

      let manager = container.get(_.camelCase(root));

      await manager.run(name);
    } catch (e) {
      if (_.isString(e)) {
        console.error(e);
      } else {
        console.log(e);
      }
    }
  }

  manageConfig(name, ignore) {
    let local = this.config[name];
    if (!local.default) {
      local.default = {};
    }


    // merge direct default config to main config
    //let defaultConfig = _.has(this.config, `default.${name}`) ? this.config.default[name] : {};
    //let currConfig = _.merge({}, defaultConfig, this.config[root]);
    //_.merge(this.config[name].default, defaultConfig);

    // merge sub configs
    _.each(this.config.default, (subConfig, subName) => {
      if (!_.includes(ignore, subName)) {
        if (!local.default[subName]) {
          local.default[subName] = {};
        }
        _.merge(local.default[subName], subConfig);
      }
    });

    return local;
  }

}

let cli = new Cli();
cli.run();