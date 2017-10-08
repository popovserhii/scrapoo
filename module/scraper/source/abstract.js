let fs = require('fs');
let _ = require('lodash');
let Csv = require('scraper/output/csv');
let Problem = require('scraper/output/problem');
let URL = require('url');
let PrepareBaseUrl = require('scraper/adapter/helper/prepare-base-url');
let Preprocessor = require('scraper/preprocessor');

class Abstract {
  constructor(nightmare, config) {
    this._nightmare = nightmare;
    this._config = config || {};

    this._crawler = null;
    this._output = null;
    this._outputProblem = null;
    this._preprocessor = null;
    this._nextUrl = null;

    this._row = {};
    this._headMap = null;


    this.location = URL.parse(config.source.path);
    this.baseUrlHelper = new PrepareBaseUrl().setOption('location', this.location);

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
    return this._headMap;
  }

  /**
   * Get current row
   * @returns json
   */
  get row() {
    return this._row;
  }

  getNamedField(name) {
    let headName = this.config.source.fields[name];
    let columnIndex = this.headMap[headName];

    //console.log(name);
    //console.log(headName);
    //console.log(columnIndex);
    //console.log(this.headMap);
    //console.log(this.row);
    //return this.row[headName];
    return this.row[columnIndex];
  }

  getCrawler(config) {
    let Adapter = require('scraper/adapter/' + config.name);
    let adapter = new Adapter(this.nightmare, config); // retrieve hotline etc. adapter

    return adapter;
  }

  set output(output) {
    this._output = output;

    return this;
  }

  get output() {
    if (!this._output) {
      this._output = new Csv(this.config.output);
    }

    return this._output;
  }

  set outputProblem(output) {
    this._outputProblem = output;

    return this;
  }

  get outputProblem() {
    if (!this._outputProblem) {
      //this._outputProblem = new Csv(this.config.problemOutput);
      this._outputProblem = new Problem(this.config.problemOutput);
    }

    return this._outputProblem;
  }

  get preprocessor() {
    if (!this._preprocessor) {
      this._preprocessor = new Preprocessor(this, this.config.preprocessor);
    }

    return this._preprocessor;
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
      for (let key in this.config.crawler) {

        console.log(searchable);
        // here must be iteration though config.crawler
        let adapter = this._crawler = this.getCrawler(this.config.crawler[key]);
        let fields = await adapter.scan(searchable);

        console.log(fields);
        console.log('--------++++++++++---------');

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
    } catch (e) {
      console.log(e.stack);
      this.log(e.message + ' ' + e.stack);
    }
  }

  async nextPageExist() {
    let options = this.config.source.options;
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