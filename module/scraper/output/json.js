const fs = require('fs');
const d3 = require('d3-dsv');
const _ = require('lodash');
const Abstract = require('scraper/output/abstract');

class Json extends Abstract {

  /*constructor(config) {
    console.log('module/scraper/output/json.js', config);
    super(config);
  }*/

   async send(row) {
    row = _.castArray(row);

    for (let r in row) {
      let json = JSON.stringify(row[r]);
      // call the write option where you need to append new data
      // @link https://stackoverflow.com/a/9812799/1335142
      //this.file.write(csv + '\n');
      this.file.write(json + '\n');
    }
  }
}

module.exports = Json;
