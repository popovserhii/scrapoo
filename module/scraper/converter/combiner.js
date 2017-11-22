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
      let fileNames = this.getFileNames(paths);

      for (let f = 0; f < fileNames.length; f++) {
        //let config = this._config.file[i]
        this._current = {index: this._xlsx.length, xlsx: new Xlsx(this._config.file[i])};
        this._xlsx.push(this._current.xlsx);

        await this.prepare();

      }
    }
  }

  async prepare(sheetName) {
    let sheets = _.castArray(this._current.xlsx.config.sheet);
    for (let sheet in sheets) {
      let sheetName = sheet ? sheet.name : undefined;

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

    //xlsx.source = name;
    //xlsx.source = this._config.path;
    //xlsx.sheetName = sheetName;

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

}

module.exports = Combiner;