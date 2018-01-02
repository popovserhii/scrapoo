const _ = require('lodash');
const Nightmare = require('nightmare');
//const mix = require('mixwith').mix;
//const ConfigManageMixin = require('scraper/configure/manage-mixin');

/**
 * Scraper is central class and in get all "scraper" config
 */
//class Scraper extends ManageMixin(Object) {
class Scraper /*extends mix(Object).with(ConfigManageMixin)*/ {
  constructor(config, sourceFactory) {
    //super();
    this._config = config;
    this._sources = {};
    this._sourceFactory = sourceFactory;
  }

  get config() {
    return this._config;
  }

  get factory() {
    return this._sourceFactory;
  }

  /*getSource(config) {
    let Source = require('./source/' + currConfig.source.type);
    let source = new Source(nightmare, currConfig);

    return source;
  }*/

  getNamedSource(name) {
    return this._sources[name];
  }

  /**
   * @todo Use mixin
   * @param name
   * @param task
   */
  /*manageConfig(name, task) {
    let local = this.config[task];
    if (!local.default) {
      local.default = {};
    }

    let defaultConfig = _.get(this.config, `default.${name}`);
    if (defaultConfig) {
      this.config[task] = _.merge({}, defaultConfig, local);
    }

    let pool = _.get(this.config, `${task}.pool`);
    if (pool) {
      //let pool = this.config[task].source.pool;
      //let defaultConfig = _.has(this.config, `default.${pool}.scraper`) ? _.get(this.config, `default.${pool}.scraper`) : {};
      let defaultConfig = _.get(this.config, `default.pool.${pool}.${name}`);
      if (defaultConfig) {
        this.config[task] = _.merge({}, defaultConfig, local);
      }
    }

    let subDefault = _.get(this.config, `default.pool.${pool}`);
    if (subDefault) {
      _.each(subDefault, (subConfig, subName) => {
        if (subName !== name) {
          if (!local.default[subName]) {
            local.default[subName] = {};
          }
          _.merge(local.default[subName], subConfig);
        }
      });
    }

    return local;
  }*/

  async run(taskName = null) {
    /*let nightmare = Nightmare({
      show: true,
      webPreferences: {
        webSecurity: false
      }
    });*/

    //let size = _.size(this.config);
    //for (let i = 0; i < size; i++) {

    //nightmare.useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36");
    for (let name in this.config) {

      //console.log(sourceName);
      //console.log(this.config);
      //console.log('./source/' + currConfig.source.type);

      if (taskName && taskName !== name) {
        continue;
      }

      //let config = _.merge((this.config.default || {}), (this.config[this.source.config.pool] || {}), this.config[key]);

      //let currConfig = this.config[name];
      // @todo Use mixin
      //let pool = this.config[name].source.pool;
      //let defaultConfig = _.has(this.config, `default.${pool}.scraper`) ? _.get(this.config, `default.${pool}.scraper`) : {};
      //let currConfig = _.merge({}, defaultConfig, this.config[name]);

      //let currConfig = this.manageConfig('scraper', name);
      //console.log(name);
      //console.log(currConfig);

      try {
        //let Source = require('scraper/source/' + currConfig.source.type);
        //let Source = require('scraper/source/site');

        //console.log(currConfig.source);
        //let source = new Source(nightmare, currConfig);
        //let source = this.s;
        let source = this.factory.create(this.config[name].source.type, name);


        await source.start();

        this._sources[name] = source;

        source.browser.then(() => {
          return source.browser.end();
        });
      } catch (e) {
        if (_.isString(e)) {
          console.error(e);
        } else {
          console.log(e);
        }
      }
    }
  }
}

module.exports = Scraper;