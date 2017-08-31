let fs = require('fs');
let d3 = require('d3-dsv');
let _ = require('lodash');

class Csv {

  constructor(config) {
    this._config = config;
    this.pathname = config.path;
    this.file = fs.createWriteStream(config.path, {
      flags: 'w',
      encoding: 'utf8',
      mode: '0744'
    });
    this.stats = fs.existsSync(config.path)
      ? fs.statSync(config.path)
      : {};
  }

  getPathname() {
    return this.pathname;
  }

  get output() {
    return this.file;
  }

  async send(row) {
    let isArray = _.isArray(row);
    row = isArray ? row : [row];

    let dsv = d3.dsvFormat(';');
    for (let r in row) {
      //console.log(row[r]);
      if (!this.stats.size) {
        let csv = dsv.formatRows([_.keys(row[r])]);

        await this.file.write(csv + '\n');
        this.stats.size++; // feature
      }

      let csv = dsv.formatRows([_.values(row[r])]);
      //console.log(csv);
      // call the write option where you need to append new data
      // @link https://stackoverflow.com/a/9812799/1335142
      this.file.write(csv + '\n');
    }
  }
}

module.exports = Csv;