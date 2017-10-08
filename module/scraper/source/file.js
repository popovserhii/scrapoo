//const fs = require('fs');
//const d3 = require('d3-dsv');
const _ = require('lodash');
const useragent = require('random-useragent');
const Excel = require('scraper/source/driver/excel');
//const Csv = require('scraper/output/csv');
//const HotlineUa = require('scraper/adapter/hotline-ua');
//const Preprocessor = require('scraper/preprocessor');
const Abstract = require('scraper/source/abstract');


class File extends Abstract {
  constructor(nightmare, config) {
    super(nightmare, config);
    //this.nightmare = nightmare;
    //this._config = config || {};
    //this.searchKeys = [];
    //Site.nextUrl = '';
    //this.filePath = 'data/shop-it.csv';

    //this._row = null;
    //this._headMap = null;
    //this._adapters = null;
    //this._output = null;
    //this._outputProblem = null;
    //this._preprocessor = null;

    //this.logger = fs.createWriteStream('data/error.log', {
    //  flags: 'a', // 'a' means appending (old data will be preserved)
    //  encoding: 'utf8',
    //})

  }

  //get config() {
  //  return this._config;
  //}

  /**
   * Get current row
   * @returns json
   */
  /*get row() {
    return this._row;
  }*/

  /**
   * Get column names to index
   * @returns json
   */
  /*get headMap() {
    return this._headMap;
  }*/

  /*getNamedField(name) {
    let headName = this.config.source.fields[name];
    let columnIndex = this.headMap[headName];

    return this.row[columnIndex];
  }*/

  /*getCrawler(config) {
    let Adapter = require('scraper/adapter/' + config.name);
    let adapter = new Adapter(this.nightmare, config); // retrieve hotline etc. adapter

    return adapter;
  }*/

  /*set adapter(adapter) {
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
  }*/

  async start() {
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

        //console.log(this._row);


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

    //this.process();

    //this.logger.end();
  }


  /*async process(searchable) {
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
  }*/
}

module.exports = File;