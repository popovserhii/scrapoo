let _ = require('lodash');
let ExcelJs = require('exceljs');
let Abstract = require('./abstract');

class Excel extends Abstract {

  constructor(config = null) {
    super();
    this._source = '';
    this.xlBook = null;
    this.xlSheet = null;
    this._firstRow = null;
    this._firstColumn = null;

    /*this._config = _.merge({
      skip: 2,
      categorize: true
    }, config);*/
  }

  get source() {
    return this._source;
  }

  set source(name) {
    this._source = name;

    return this;
  }

  get sheetName() {
    return this._sheetName;
  }

  set sheetName(name) {
    this._sheetName = name;

    // reset sheet params
    this._sheet = null;
    this._firstRow = 1;
    this._firstColumn = 0;
    this._headers = {};

    return this;
  }

  async firstColumn() {
    if (null === this._firstColumn) {
      let worksheet = await this._xlSheet();
      let firstRow = await this.firstRow();
      let lastColumn = await this.lastColumn();
      let row = await worksheet.getRow(firstRow);

      for (let i = 1; i <= lastColumn; i++) {
        let cell = row.getCell(i).value;
        if (null !== cell) {
          this._firstColumn = i;
          break;
        }
      }
    }

    return this._firstColumn;
  }

  async lastColumn() {
    let worksheet = await this._xlSheet();

    return await worksheet.columnCount;
  }

  async firstRow() {
    if (null === this._firstRow) {
      let worksheet = await this._xlSheet();
      let last = await this.lastRow();
      for (let i = 1; i <= last; i++) {
        let row = worksheet.getRow(i).values;
        if (row.length) {
          this._firstRow = i;
          break;
        }
      }
    }

    return this._firstRow;
  }

  async lastRow() {
    let worksheet = await this._xlSheet();

    return worksheet.rowCount;
  }

  async read(row, column = null) {
    let val;
    let worksheet = await this._xlSheet();
    let _row = worksheet.getRow(row);

    if (null === column) {
      val = _row.values;
    } else {
      val = _row.getCell(column).value;
    }

    return val;
  }

  get config() {
    return this._config;
  }

  async _xlBook() {
    if (!this.xlBook) {
      let workbook = new ExcelJs.Workbook();
      //this.xlBook = await workbook.csv.readFile(this.source)
      this.xlBook = await workbook.xlsx.readFile(this.source)
        .then(function () {
          return workbook;
        });
    }

    return this.xlBook;
  }

  async _xlSheet() {
    if (!this.xlSheet) {
      let workbook = await this._xlBook();
      this.xlSheet = workbook.getWorksheet(this.sheetName);
    }

    return this.xlSheet;
  }
}

module.exports = Excel;