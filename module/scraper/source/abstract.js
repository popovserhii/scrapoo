const fs = require('fs');
const _ = require('lodash');
const path = require('path');
//let Csv = require('scraper/output/csv');
const Problem = require('scraper/output/problem');
const Preprocessor = require('scraper/preprocessor');
const ConfigHandler = require('scraper/config-handler');
const Variably = require('scraper/variably');

class Abstract {
  constructor(nightmare, config) {
    this._nightmare = nightmare;
    //this._config = config || {};

    this._config = _.merge({"source": {"driver": {"file": "scraper/source/driver/xlsx"}}}, config);

    this._crawler = null;
    this._output = null;
    this._outputProblem = null;
    this._preprocessor = null;
    this._configHandler = null;
    this._nextUrl = null;

    this._row = {};
    this._headerMap = null;

    if (!_.has(this.config, 'source.path')) {
      throw new Error('Config error: source.path must be set');
    }
    // source.path in file is path and in site is url
    /*this.location = URL.parse(config.source.path);
    this.baseUrlHelper = new PrepareBaseUrl().setOption('location', this.location);*/

    this.logger = fs.createWriteStream('data/error.log', {
      flags: 'a', // 'a' means appending (old data will be preserved)
      encoding: 'utf8',
    });

    if (new.target === Abstract) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }
    // or maybe test typeof this.method === undefined

    /**
     * Start scan process
     *
     * @return self
     */
    if (this.start === 'function') {
      throw new TypeError('Must override method "start()"');
    }
  }

  get nightmare() {
    return this._nightmare;
  }

  get config() {
    return this._config;
  }

  /**
   * Get column names to index
   * @returns json
   */
  get headMap() {
    return this._headerMap;
  }

  /**
   * Get current row
   * @returns json
   */
  get row() {
    return this._row;
  }

  getData(name) {
    return this.getField(name);
  }

  getField(name) {
    let headName = this.config.source.fields[name];
    let columnIndex = this.headMap[headName];

    return this.row[columnIndex];
  }

  /** @deprecated */
  getNamedField(name) {
    return this.getField(name);
  }

  getCrawler(config) {
    let Adapter = require('scraper/adapter/' + config.name);
    let adapter = new Adapter(this.nightmare, this.configHandler, config); // retrieve hotline etc. adapter

    return adapter;
  }

  set output(output) {
    this._output = output;

    return this;
  }

  get output() {
    if (!this._output) {
      let name = path.extname(this.config.output.path).substring(1);
      let Output = require('scraper/output/' + name);
      //return this.helpers[key] = new HelperClass(this);

      this._output = new Output(this.config.output);
    }

    return this._output;
  }

  set outputProblem(output) {
    this._outputProblem = output;

    return this;
  }

  get outputProblem() {
    if (!this._outputProblem) {
      this._outputProblem = new Problem(this.config.problemOutput);
    }

    return this._outputProblem;
  }

  set driver(driver) {
    this._driver = driver;

    return this;
  }

  get driver() {
    if (!this._driver) {
      let Driver = require(this.config.source.driver[this.config.source.type]);
      this._driver = new Driver();
    }

    return this._driver;
  }

  get variably() {
    if (!this._variably) {
      this._variably = new Variably();
      this._variably.add('source', this);
      this._variably.add('crawler', this.crawler);
    }

    return this._variably;
  }

  get preprocessor() {
    if (!this._preprocessor) {
      this._preprocessor = new Preprocessor(this.variably, this.configHandler, this.config.preprocessor);
    }

    return this._preprocessor;
  }

  get configHandler() {
    if (!this._configHandler) {
      //this._configHandler = new ConfigHandler(this);
      this._configHandler = new ConfigHandler(this.variably);
    }

    return this._configHandler;
  }

  /**
   * Return current crawler (adapter)
   *
   * @returns {*|null}
   */
  get crawler() {
    return this._crawler;
  }

  log(message) {
    this.logger.write(new Date().toISOString() + '\t' + message + '\n');
  }

  async process(searchable) {
    try {
      //console.log(this.config.crawler);
      if (_.size(this.config.crawler) && _.size(searchable)) {
        // iterate through crawlers if they are placed in config
        let fields = null;
        for (let key in this.config.crawler) {
          if (fields) {
            // don't run other crawler if first has found needed fields
            break;
          }
            let crawlerConfig = this.config.crawler[key];

            //console.log('Run crawler: ' + crawlerConfig.name);
            console.log('Search: ' + _.castArray(searchable).join(', '));


            // here must be iteration though config.crawler
            let adapter = this._crawler = this.getCrawler(crawlerConfig);
            fields = await adapter.scan(searchable.slice()); // why slice? see here http://orizens.com/wp/topics/javascript-arrays-passing-by-reference-or-by-value/

            //console.log('--------++++++++++---------');

            if (fields && _.size(fields)) {
              // @todo Подумати як обробляти ситуацію коли Адаптер може виконати будь яку кількість запитів,
              // а потрібно додати змінні в _row для категорії і підкатегорії.
              // Винести це в Препроцесор. Зробити розширену обробку значень, або перевести конфіг на .js
              if ('Site' === this.constructor.name) {
                await this.prepareFields();
              }

              fields = this.preprocessor.process(fields);
              await this.output.send(fields);
            } else {
              // fields not found with any crawler
              // write to file about problem product
              this.outputProblem.send({
                value: searchable.join(','),
                message: 'Not found'
              });
            }
            if (await this.nextPageExist()) {
              await this.process(this._nextUrl);
            }
            //this.output.file.end(); // here is problem "write after end Error: write after end"
        }
      } else if (_.isUndefined(this.config.source.searchKeys)) {
        // run preprocessor skip crawling
        let fields = this.preprocessor.process({});
        await this.output.send(fields);
      }
    } catch (e) {
      if (_.isString(e)) {
        console.error(e);
        this.log(e);
      } else {
        console.log(e);
        this.log(e.message + ' ' + e.stack);
      }
    }
  }

  async nextPageExist() {
    let options = this.config.options;
    let nextExist = false;

    if (options && options.nextPage) {
      nextExist = await this.nightmare.visible(options.nextPage);
      if (nextExist) {
        this._nextUrl = await this.nightmare.evaluate(function(nextPageSelector) {
          // return next page url
          return window.location.protocol + "//" + window.location.host + '/' + jQuery(nextPageSelector).attr('href');
        }, options.nextPage);
      }
    }

    return nextExist;
  }
}

module.exports = Abstract;