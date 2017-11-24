const _ = require('lodash');
const globby = require('globby');
const XLSX = require('xlsx');
const Variably = require('scraper/variably');
const ConfigHandler = require('scraper/config-handler');
const Xlsx = require('scraper/source/driver/xlsx');

//const argv = require('minimist')(process.argv.slice(2));
//const config = require('config/south.defect.converter');

class Abstract {

  constructor(config) {
    this._config = config;
    this._xlsx = {};
    this._row = {};
    this._rows = [];
    this._persisted = {};

    if (new.target === Abstract) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }

    /**
     * Handle sheet for following save
     *
     * @param string $name
     * @return void
     */
    if (this.prepare === 'function') {
      throw new TypeError('Must override method "prepare(sheetName)"');
    }
  }

  get variably() {
    if (!this._variably) {
      this._variably = new Variably();
      //this._variably.add('source', this);
      //this._variably.add('crawler', this.crawler);
    }

    return this._variably;
  }

  get configHandler() {
    if (!this._configHandler) {
      //this._configHandler = new ConfigHandler(this);
      this._configHandler = new ConfigHandler(this.variably);
    }

    return this._configHandler;
  }

  getData(name) {

    return this['_' + name];
  }

  async run(sheetName = null) {
    for (let i in this._config.sheet) {

      if (sheetName && sheetName !== this._config.sheet[i].name) {
        continue;
      }

      await this.prepare(this._config.sheet[i].name);
    }
  }

  getXlsx(filePath, config) {
    if (!this._xlsx[filePath]) {
      this._xlsx[filePath] = new Xlsx(config);
      this._xlsx[filePath].source = filePath;
    }

    return this._xlsx[filePath];
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

  async _persist(rows, sheetName, path) {
    // @todo try to use json_to_sheet instead

    //XLSX.writeFile(workbook, 'out.xlsb');
    //XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'})

    // prepare for save
    let wb = this.getNewWorkbook();
    //let ws = XLSX.utils.aoa_to_sheet(this._rows);
    let ws = XLSX.utils.json_to_sheet(rows);

    // add worksheet to workbook
    wb.SheetNames.push(sheetName);
    wb.Sheets[sheetName] = ws;

    this._persisted[path] = wb;
  }

  async save() {
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
      let filePath = this.configHandler.process(path, this._config.output.options || {});
      //console.log(filePath);

      XLSX.writeFile(wb, filePath);
    }
  }

}

module.exports = Abstract;