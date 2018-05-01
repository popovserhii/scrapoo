const _ = require('lodash');
const d3 = require('d3-dsv');
const XLSX = require('xlsx');
const Abstract = require('scraper/output/abstract');

class Xlsx extends Abstract {

  constructor(config) {
    super(config);
    delete this.file; // @todo improve implementation of file opening
    this._rows = [];
    this._persisted = {};
  }

   async send(row) {
    let rows = _.castArray(row);

    for (let r in rows) {
      this._rows.push(rows[r]);
    }
  }

  /**
   * If need save rows to other filer set _newWorkbook to null, its create new file
   *
   * @returns object
   */
  getNewWorkbook() {
    if (!this._newWorkbook) {
      this._newWorkbook = {
        SheetNames: [],
        Sheets: {}
      }
    }

    return this._newWorkbook;
  }

  /**
   * @todo Use native Node Events and implement all logic as csv.js without save() and prepare() methods
   *
   * @param sheetName
   * @param path
   * @private
   */
  async _persist(sheetName) {
    //XLSX.writeFile(workbook, 'out.xlsb');
    //XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'})

    // prepare for save
    let wb = this.getNewWorkbook();
    //let ws = XLSX.utils.aoa_to_sheet(this._rows);
    let ws = XLSX.utils.json_to_sheet(this._rows);

    // add worksheet to workbook
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = ws;

    this._persisted[this._pathname] = wb;
    this._rows = [];
  }

  async _save() {
    for (let path in this._persisted) {
      let wb = this._persisted[path];

      /* // prepare for save
       let wb = this.getNewWorkbook();
       //let ws = XLSX.utils.aoa_to_sheet(this._rows);
       let ws = XLSX.utils.json_to_sheet(rows);

       // add worksheet to workbook
       wb.SheetNames.push(this._xlsx.sheetName);
       wb.Sheets[this._xlsx.sheetName] = ws;*/

      // write file
      //let filePath = this.configHandler.process(path, this._config.output.options || {});
      //let filePath = this.pa(path, this._config.output.options || {});
      //console.log(filePath);

      XLSX.writeFile(wb, path/*, {FS:";"}*/);
      //XLSX.utils.sheet_to_csv(ws, {FS:"\t"})
    }
  }
}

module.exports = Xlsx;
