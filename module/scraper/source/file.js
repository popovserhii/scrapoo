let fs = require('fs');
let d3 = require('d3-dsv');
let _ = require('lodash');
let useragent = require('random-useragent');
let Excel = require('scraper/source/driver/excel');
let Csv = require('scraper/output/csv');
let HotlineUa = require('scraper/adapter/hotline-ua');
let AlmondsCom = require('scraper/adapter/almonds-com');
let Preprocessor = require('scraper/preprocessor');

class File {
  constructor(nightmare, config) {
    this.nightmare = nightmare;
    this._config = config || {};
    this.crawlerQueue = [];
    this.searchKeys = [];
    //Site.nextUrl = '';
    //this.filePath = 'data/shop-it.csv';

    this._row = null;
    this._headMap = null;
    this._adapters = null;
    this._output = null;
    this._outputProblem = null;
    this._preprocessor = null;

    this.logger = fs.createWriteStream('logs/error.log', {
      flags: 'a', // 'a' means appending (old data will be preserved)
      encoding: 'utf8',
    })

  }

  get config() {
    return this._config;
  }

  /**
   * Get current row
   * @returns json
   */
  get row() {
    return this._row;
  }

  /**
   * Get column names to index
   * @returns json
   */
  get headMap() {
    return this._headMap;
  }

  getNamedField(name) {
    let headName = this.config.source.fields[name];
    let columnIndex = this.headMap[headName];

    return this.row[columnIndex];
  }

  getCrawler(config) {
    let Adapter = require('scraper/adapter/' + config.name);
    let adapter = new Adapter(this.nightmare, config); // retrieve hotline etc. adapter

    return adapter;
  }

  set adapter(adapter) {
    this._adapters = adapter;

    return this;
  }

  get adapter() {
    if (!this._adapters) {
      //this._adapter = new AlmondsCom(this.nightmare, this.config.crawler[0]);
      this._adapters = new HotlineUa(this.nightmare, this.config.crawler[0]);
    }

    return this._adapters;
  }

  set output(output) {
    this._output = output;

    return this;
  }

  get output() {
    if (!this._output) {
      this._output = new Csv(this.config.output.path);
    }

    return this._output;
  }

  set outputProblem(output) {
    this._outputProblem = output;

    return this;
  }

  get outputProblem() {
    if (!this._outputProblem) {
      this._outputProblem = new Csv('data/shop-it-problem.csv');
    }

    return this._outputProblem;
  }

  get preprocessor() {
    if (!this._preprocessor) {
      this._preprocessor = new Preprocessor(this, this.config.preprocessor);
    }

    return this._preprocessor;
  }

  async start() {
    //console.log(this.config);
    //let filename = 'data/laptops.xlsx';
    let filename = this.config.source.path;
    // read from a file
    let excel = new Excel();
    excel.source = filename;
    let firstRow = await excel.firstRow();
    let lastRow = await excel.lastRow();
    //let firstColumn = await excel.firstColumn();
    //let lastColumn = await excel.lastColumn();

    let head = await excel.read(firstRow);

    this._headMap = {};
    _.each(head, (val, i) => {
      if (!_.isEmpty(val)) {
        this._headMap[val] = i;
      }
    });

    //console.log(head);
    //console.log(this._headMap);


    // iterate through rows data
    for (let i = (firstRow + 1); i <= lastRow; i++) {
      let searchable = [];
      this._row = null;
      let searchKeys = this.config.source.searchKeys;
      for (let k = 0; k < searchKeys.length; k++) {
        //this._row = await excel.read(i);
        this._row = await excel.read(i);
        let name = searchKeys[k];
        let cell = this._row[this._headMap[name]];

        searchable.push(cell);
      }

      searchable = _.compact(searchable);
      if (searchable.length) {
        this.nightmare.useragent(useragent.getRandom());
        await this.process(searchable);
      }
    }

    //console.log(firstRow);
    //this.process();

    //this.logger.end();
  }


  async process(searchable) {
    //console.log(searchable);
    //return;
    try {
      //for (let crawler in this.config.crawler) {
      // here must be iteration though config.crawler
      let fields = await this.adapter.scan(searchable);

      if (_.size(fields)) {
        //// ++fields = this.preprocessor.process(fields);

        await this.output.send(fields);
      } else {
        // fields not found with any crawler
        // write to file about problem product
        this.outputProblem.send({
          value: searchable.join(','),
          message: 'Not found'
        });
      }

      //this.output.file.end(); // here is problem "write after end Error: write after end"
      //}
    } catch (e) {
      //console.log(e.stack);
      this.log(e.message + ' ' + e.stack);
    }
  }

  async scanList() {
    let that = this;
    let options = this.config.options;

    let links = await this.nightmare.evaluate(function(iterateOver) {
      return Array.from(document.querySelectorAll(iterateOver)).map(function(a) {
        return a.href;
      });
    }, options.iterateOver);



    const series = links.reduce(async (queue, link) => {

      let searches = await this.nightmare
        .goto(link)
        .wait()
        .evaluate(function () {
          let searchable = []; // array of searchable values on hotline and etc
          //that.scan(Site.links.shift());

          return searchable;
        });

      const dataArray = await queue;
      dataArray.push(await getAddress(link));
      return dataArray;
    }, Promise.resolve([]));


      /*.then(function(searchable) {
      that.searchKeys = searchable;
      that.crawlerQueue = that.config.crawler;
      let adapter = that.getCrawler(that.crawlerQueue.shift()); // retrieve hotline etc. adapter
      that.scanAdapter(adapter, that.searchKeys.shift())
    }).then(function () {
      if (that.searchKeys.length) {

      }
    });
    */
  }

  scanAdapter(searchable) {
    let that = this;
    let options = this.config.options;

    let crawler = that.getCrawler(options.crawler[0]);
    adapter.process(searchable);
    /*adapter
      .scan(searchable)
      .then(function(result) {
        if (!result || !result.length) {
          let adapter = that.getCrawler(that.crawlerQueue.shift());
          that.scanAdapter(adapter);
        }
      });*/
  }

  log(message) {
    this.logger.write(new Date().toISOString() + '\t' + message + '\n');
  }
}

module.exports = File;