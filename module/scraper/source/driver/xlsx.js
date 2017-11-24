const _ = require('lodash');
const globby = require('globby');
const XLSX = require('xlsx');
const Abstract = require('./abstract');

class Xlsx extends Abstract {

  constructor(config = null) {
    super();
    this._config = config || {};
    //this._source = config ? config.path : null; // path is globby pattern in general
    this._sheetName = null;
    this._sheetsConfig = null;
    //this._indexes = {};
    //this._xlBook = null;
    //this._xlSheet = null;
    this._firstRow = 0;
    this._firstColumn = 0;
    this._headers = {};
    this._index = {};
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

    // reset sheet params
    this._sheet = null;
    this._firstRow = 0;
    this._firstColumn = 0;
    this._headers = {};

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
    let rows = await this._activateSheet();

    return rows.length - 1;
  }

  async read(row, column = null) {
    this._sheet = await this._activateSheet();

    let val;
    let _row = this._sheet[row];

    if (null === column) {
      val = _row;
    } else {
      //val = _row.getCell(column).value; // @todo
    }
    //return _.values(val);
    return val;
  }

  async getRows() {
    return await this._activateSheet();
  }

  async getIndex() {
    await this._mergeConfig();
    if (!this._currConfig.index) {
      throw new Error('Field name of index must be set in "index" config');
    }
    await this._activateSheet();

    return this._index;
  }

  async _getFilename() {
    if (!this._filename) {
      this._filename = await globby([this.source]).then(paths => {
        return paths.shift();
      });
    }

    return this._filename;
  }

  async _getWorkbookReader() {
    if (!this._wb) {
      this._wb = XLSX.readFile(await this._getFilename());
    }

    return this._wb;
  }

  async _getSheetNames() {
    let wb = await this._getWorkbookReader();

    return wb.SheetNames;
  }

  async _getSheets() {
    let wb = await this._getWorkbookReader();

    return wb.Sheets;
  }

  async _mergeConfig() {
    if (!this._sheetsConfig) {
      let sheetNames = await this._getSheetNames();
      this._sheetsConfig = {};
      //_.forEach(this._config.sheet, (sheetConfig, i) => {
      _.forEach(sheetNames, (name, i) => {
        let named = { 'name': name };
        let sheetConfig = _.find(this._config.sheet, named) || named;
        this._sheetsConfig[sheetConfig.name] = _.merge({
          skip: 0,
          skipLast: 0,
          header: 0,
          categorize: false,
          index: false
        }, this._config.default, sheetConfig);
      });

      if (!this.sheetName) {
        this.sheetName = sheetNames[0];
      }
    }

    return this._currConfig = this._sheetsConfig[this.sheetName];
  }

  async _activateSheet() {
    if (!this._sheet) {
      await this._mergeConfig();

      /*let wb = await this._getWorkbookReader();
      let ws = wb.Sheets[this.sheetName];*/
      let sheets = await this._getSheets();
      let ws = sheets[this.sheetName];

      this._prepareSheet(ws, this._currConfig);
    }

    return this._sheet;
  }

  _prepareSheet(worksheet, sheetConfig) {
    let data = this._convertRawSheet(worksheet, sheetConfig);

    data = _.drop(data, /*1 + */sheetConfig.skip + sheetConfig.header);

    let filtered = [];
    _.forEach(data, (row, i) => {
      row = _.pickBy(row, _.identity);
      if (!_.isEmpty(row)) {
        if (sheetConfig.index) {
          this._index[row[sheetConfig.index]] = filtered.length;
        }
        filtered.push(data[i]);
      }
    });

    if (sheetConfig.skipLast) {
      filtered = _.dropRight(filtered, sheetConfig.skipLast);
    }

    return this._sheet = filtered;
  }

  _convertRawSheet(worksheet, sheetConfig) {
    let data = [];
    console.log(this.sheetName + ': ' + worksheet['!ref']);

    let range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        let cellAddress = {c: C, r: R};
        // if an A1-style address is needed, encode the address
        let cell = XLSX.utils.encode_cell(cellAddress);

        //parse out the column, row, and value
        let tt = 0;
        for (let i = 0; i < cell.length; i++) {
          if (!isNaN(cell[i])) {
            tt = i;
            break;
          }
        }

        let col = cell.substring(0, tt);
        let row = parseInt(cell.substring(tt));
        let value = worksheet[cell]
          ? worksheet[cell].v
          : null;

        if (row <= sheetConfig.skip) {
          continue;
        }

        // store header names
        if ((sheetConfig.header >= 0) && row == (/*1 + */sheetConfig.skip + sheetConfig.header)/* && value*/) {
          if (value) {
            this._headers[col] = value;
          } else {
            this._headers[col] = col;
            value = col; // replace null header name
          }
          //continue;
        } else if (!sheetConfig.header) {
          this._headers[col] = cell;
        }


        if (!data[row]) data[row] = {};
        data[row][this._headers[col]] = value;
      }
    }

    return data;
  }
}

module.exports = Xlsx;