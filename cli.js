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

  get _ignored() {
    let ignore = _.keys(this.map);
    //ignore.push('pool');

    return ignore;
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


    //let Construct = require(this.map[_.upperFirst(_.camelCase(root))]);
    ////let Construct = require(this.map[_.camelCase(root)]);
    //console.log(config);
    //console.log(Construct);
    //console.log(config[root][name]);

    try {
      //let construct = className]);
      //let _config = config[root];
      //config[root]['default'] = config.default;

      //let defaultConfig = _.has(this.config, `default.${root}`)? this.config.default[root] : {};
      //let currConfig = _.merge({}, defaultConfig, this.config[root]);


      ///let currConfig = this.manageConfig(root, this._ignored);

      let manager = container.get(_.camelCase(root));

      //let manager = new Construct(currConfig);
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