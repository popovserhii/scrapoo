const _ = require('lodash');
const globby = require('globby');
const XLSX = require('xlsx');
const Abstract = require('./abstract');

class Xlsx extends Abstract {

  constructor(config = null) {
    super();
    this._source = '';
    this._sheetName = 1;
    this._config = config;
    this._sheetsConfig = null;
    //this._indexes = {};
    //this._xlBook = null;
    //this._xlSheet = null;
    this._firstRow = 0;
    this._firstColumn = 0;
    this._headers = {};
  }

  get config() {
    return this._currConfig;
  }

  get source() {
    return this._source;
  }

  set source(name) {
    this._source = name;

    /*_.forEach(this._config[name].sheet, (sheetConfig, i) => {
      this._indexes[sheetConfig.name] = i;
    });*/

    return this;
  }

  get sheetName() {
    return this._sheetName;
  }

  set sheetName(name) {
    this._sheetName = name;

    return this;
  }

  async firstColumn() {
    return this._firstColumn;
  }

  async lastColumn() {
    await this._activateSheet();

    return _.size(this._headers);
  }

  async firstRow() {
    return this._firstRow;
  }

  async lastRow() {
    let ws = await this._activateSheet();

    return ws.length - 1;
  }

  async read(row, column = null) {
    this._sheet = await this._activateSheet();
    //console.log(this._sheet);

    let val;
    //let worksheet = await this._xlSheet();
    let _row = this._sheet[row];

    if (null === column) {
      val = _row;
    } else {
      val = _row.getCell(column).value;
    }
    return _.values(val);
  }

  async getFilename() {
    if (!this._filename) {
      //console.log(this._config[this.source]);
      this._filename = await globby([this._config[this.source].path]).then(paths => {
        return paths.shift();
      });
    }

    return this._filename;
  }

  async _getWorkbookReader() {
    if (!this._wb) {

      this._wb = XLSX.readFile(await this.getFilename());
    }

    return this._wb;
  }

  _mergeConfig() {
    /*this._currConfig = this._config[this.source];
    _.forEach(this._currConfig.sheet, (sheetConfig, i) => {
      this._sheetsConfig[sheetConfig.name] = this._currConfig.sheet[i] = _.merge({
          skip: 0,
          categorize: true
        }, sheetConfig);
    });*/

    //this._currConfig = this._config[this.source];
    if (!this._sheetsConfig) {
      this._sheetsConfig = {};
      _.forEach(this._config[this.source].sheet, (sheetConfig, i) => {
        this._sheetsConfig[sheetConfig.name] = /*this._currConfig.sheet[i] = */_.merge({
          skip: 0,
          categorize: true
        }, this._config[this.source].default, sheetConfig);
      });
    }


    //console.log(this._sheetsConfig);
    //sconsole.log(this._sheetsConfig[this.sheetName]);

    return this._currConfig = this._sheetsConfig[this.sheetName];
  }

  async _activateSheet() {

    if (!this._sheet) {
      this._mergeConfig();

      let wb = await this._getWorkbookReader();
      let ws = wb.Sheets[this.sheetName];
      //this._sheet = this._prepareSheet(ws, this._sheetsConfig[this.sheetName]);
      this._sheet = this._prepareSheet(ws, this._currConfig);
    }

    return this._sheet;
  }

  _prepareSheet(worksheet, sheetConfig) {
    //let headers = {};
    let data = [];
    for(let z in worksheet) {
      if(z[0] === '!') continue;
      //parse out the column, row, and value
      let tt = 0;
      for (let i = 0; i < z.length; i++) {
        if (!isNaN(z[i])) {
          tt = i;
          break;
        }
      }
      let col = z.substring(0, tt);
      let row = parseInt(z.substring(tt));
      let value = worksheet[z].v;

      if (row <= sheetConfig.skip) {
        continue;
      }

      //store header names
      if (row == (1 + sheetConfig.skip) && value) {
        this._headers[col] = value;
        //continue;
      }

      if (!data[row]) data[row] = {};
      data[row][this._headers[col]] = value;
    }

    //drop those first two rows which are empty
    data = _.drop(data, 1 + sheetConfig.skip);

    return data;
  }
}

module.exports = Xlsx;