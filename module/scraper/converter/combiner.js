const _ = require('lodash');
const globby = require('globby');
const XLSX = require('xlsx');
const ConfigHandler = require('scraper/config-handler');
const Xlsx = require('scraper/source/driver/xlsx');
const Abstract = require('./abstract');

class Combiner extends Abstract {

  async getFileNames(paths) {
    return await globby(paths)/*.then(paths => {
      return paths.shift();
    });*/
  }

  isFirstFile() {
    return 0 === this._current.index;
  }

  getCurrentXlsx() {
    return this._current.xlsx;
  }

  /**
   * Is set "sheet" config with list of sheet for handle
   */
  hasSheetQueue() {
    return _.has(this._current.xlsx.config, 'sheet');
  }

  async run(sheetName = null) {
    for (let i in this._config.file) {
      let paths = _.castArray(this._config.file[i].path);
      let fileNames = await this.getFileNames(paths);
      this._xlsx = [];
      //for (let f = 0; f < fileNames.length; f++) {
      for (let f = 0; f < 1; f++) { // iterate only over first file on this step
        //let config = this._config.file[i]
        this._current = {
          index: this._xlsx.length,
          config: this._config.file[i],
          fileNames: fileNames,
          xlsx: new Xlsx(this._config.file[i])
        };
        //this._xlsx.push(this._current.xlsx);

        await this.prepare();

      }
    }
  }

  async prepare(sheetName) {
    //if (this.isFirstFile()) {
    //  return; // remember first file and go for next for combine
    //}

    let sheets = _.castArray(this._current.config.sheet);
    for (let i in sheets) {
      let sheetName = sheets[i] ? sheets[i].name : undefined;



      //if (sheetName && sheetName !== this._config.sheet[i].name) {
      //  continue;
      //}

      await this._prepareSheet(sheetName);
      await this._prepareToSave();
    }
  }

  async _prepareSheet(sheetName) {
    this._rows = [];

    let xlsx = this._current.xlsx;

    xlsx.source = this._current.fileNames.shift();
    if (sheetName) {
      xlsx.sheetName = sheetName;
    }

    let fileNames = this._current.fileNames;
    //let config = xlsx.config;
    let rows = xlsx.rows();
    for (let f = 0; f < fileNames.length; f++) {
      //let prevConfig = _.merge({}, this._current.config, {path: fileNames});
      let prevXlsx = this.getXlsx(fileNames, this._current.config);
      let prevIndex = prevXlsx.index();
      for (let r = 0; r < rows.length; r++) {
        let row = rows[r];
        let indexValue = row[xlsx.config.index];

        let fields = this._processRow(row, xlsx.config);

        if (undefined === prevIndex[indexValue]) { // is new value

        } else { // is similar value
          this._rows = ''
        }
      }

      // is omitted value
    }

    let firstRow = await xlsx.firstRow();
    let lastRow = await xlsx.lastRow();

    let head = await xlsx.read(firstRow);

    this._headerMap = {};
    _.each(head, (val, i) => {
      if (!_.isEmpty(val)) {
        this._headerMap[val] = i;
      }
    });

    if (xlsx.config.categorize) {
      let field = xlsx.config.categorize.name || 'Category';
      //head.push(field) = this._headerMap[field] = _.size(this._headerMap);
      head.push(field);
    }
    this._rows.push(head);
  }

  _processRow(row, config) {
    fields[name] = this.configHandler.process(fields[name], this.currFieldConfig);
  }

  get configHandler() {
    if (!this._configHandler) {
      this._configHandler = new ConfigHandler();
    }
    return this._configHandler;
  }

}

module.exports = Combiner;