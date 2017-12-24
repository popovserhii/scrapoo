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

  async start() {
    //let filename = 'data/laptops.xlsx';
    let filename = this.config.source.path;

    //let sheetName = 1;
    //if (!_.isString(filename)) {
    //  sheetName = filename.sheet;
    //  filename = filename.name;
    //}

    console.log('File processing: ' + (filename.name || filename));

    // read from a file
    //let excel = new Excel(); // @toto get driver based on file extension
    let excel = this.driver; // @toto get driver based on file extension

    excel.source = filename.name || filename;
    excel.sheetName = filename.sheet;
    let firstRow = await excel.firstRow();
    let lastRow = await excel.lastRow();
    //let firstColumn = await excel.firstColumn();
    //let lastColumn = await excel.lastColumn();

    let head = await excel.read(firstRow);

    //console.log('module/scraper/source/file.js', head);
    //console.log(firstRow);


    this._headerMap = {};
    _.each(head, (val, i) => {
      if (!_.isEmpty(val)) {
        this._headerMap[val] = i;
      }
    });


    // iterate through rows data
    for (let i = (firstRow + 1); i <= lastRow; i++) {
      let searchable = [];

      //this._row = null;
      this._row = await excel.read(i);
      //console.log(this._row);

      let searchKeys = _.castArray(this.config.source.searchKeys);
      for (let k = 0; k < searchKeys.length; k++) {
        //this._row = await excel.read(i);
        //let name = null;
        let cell = null;
        if (_.isPlainObject(searchKeys[k])) {
          let name = searchKeys[k].name;
          cell = this.configHandler.process(this._row[this._headerMap[name]], searchKeys[k]);
        } else {
          let name = searchKeys[k];
          cell = this._row[this._headerMap[name]];
        }
        searchable.push(cell);
      }

      searchable = _.compact(searchable);
      //if (!searchable.length || 1 === _.size(searchable)) {
      //  let i = 0;
      //}

      //if (searchable.length) {
        //this.nightmare.useragent(useragent.getRandom()); // @todo exclude to abstract.js
        await this.process(searchable);
      //}
    }

    //this.process();

    //this.logger.end();
  }
}

module.exports = File;