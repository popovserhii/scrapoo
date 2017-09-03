const path = require('path');
const dateFormat = require('dateformat');
let fs = require('fs');
let d3 = require('d3-dsv');
let _ = require('lodash');

class Csv {

  constructor(config) {
    this._config = config;
    this._pathname = this._preparePath(config.path);

    this.file = fs.createWriteStream(this._pathname, {
      flags: 'w',
      encoding: 'utf8',
      mode: '0744'
    });
    this.stats = fs.existsSync(this._pathname)
      ? fs.statSync(this._pathname)
      : {};
  }

  get pathname() {
    return this._pathname;
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
      // call the write option where you need to append new data
      // @link https://stackoverflow.com/a/9812799/1335142
      this.file.write(csv + '\n');
    }
  }

  _preparePath(filepath) {
    let parsed = path.parse(filepath);
    let now = new Date();
    let date = dateFormat(now, 'dd-mm-yyyy_h.MM.ssTT');

    return path.format({
      root: '/ignored',
      dir: parsed.dir,
      name: parsed.name + '_' + date,
      ext: parsed.ext
    });
  }
}

module.exports = Csv;