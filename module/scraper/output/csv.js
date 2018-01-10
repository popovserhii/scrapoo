//const fs = require('fs');
const d3 = require('d3-dsv');
const _ = require('lodash');
const Abstract = require('scraper/output/abstract');

class Csv extends Abstract {

   async send(row) {
    let rows = _.castArray(row);

    let dsv = d3.dsvFormat(';');
    for (let r in rows) {
      //console.log(row[r]);
      if (!this.stats) {
        let csv = dsv.formatRows([_.keys(rows[r])]);

        if (this._config.options.bom) {
          csv = '\ufeff' + csv;
        }

        await this.file.write(/*'\ufeff' + */csv + '\n');
        this.stats++; // feature
      }

      let csv = dsv.formatRows([_.values(rows[r])]);
      // call the write option where you need to append new data
      // @link https://stackoverflow.com/a/9812799/1335142
      this.file.write(csv + '\n');
    }
  }
}

module.exports = Csv;
