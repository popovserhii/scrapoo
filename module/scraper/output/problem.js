let fs = require('fs');
let d3 = require('d3-dsv');
let _ = require('lodash');

class Problem {

  constructor(file) {
    this._pathname = file;
    this.file = fs.createWriteStream(file, {
      flags: 'a',
      encoding: 'utf8',
      mode: '0744'
    });
    this.stats = fs.existsSync(file)
      ? fs.statSync(file)
      : {};
  }

  getPathname() {
    return this._pathname;
  }

  get output() {
    return this.file;
  }

  send(row) {
    let dsv = d3.dsvFormat(';');

    let csv = dsv.formatRows([_.values(row)]);
    // call the write option where you need to append new data
    // @link https://stackoverflow.com/a/9812799/1335142
    this.file.end(csv + '\n');

  }
}

module.exports = Problem;