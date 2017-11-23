const _ = require('lodash');
const globby = require('globby');
const XLSX = require('xlsx');
const ConfigHandler = require('scraper/config-handler');
const Xlsx = require('scraper/source/driver/xlsx');

//const argv = require('minimist')(process.argv.slice(2));
//const config = require('config/south.defect.converter');

class Abstract {

  constructor(config) {
    this._config = config;
    this._xlsx = [];
    this._rows = [];
    this.configHandler = new ConfigHandler();

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

  async run(sheetName = null) {
    for (let i in this._config.sheet) {

      if (sheetName && sheetName !== this._config.sheet[i].name) {
        continue;
      }

      await this.prepare(this._config.sheet[i].name);
    }
  }

  async save() {
    /* write file */
    let filePath = this.configHandler.process(await this._xlsx.getFilename(), {"__filter": ["to-lower"], "__prepare": ["dateable-path:.xlsx"]});
    console.log(filePath);

    XLSX.writeFile(this.getNewWorkbook(), filePath);
  }

  getXlsx(filePath, config) {
    if (!this._xlsx[filePath]) {
      this._xlsx[filePath] = new Xlsx(config);
    }

    return this._xlsx[filePath];
  }

  getNewWorkbook() {
    if (!this._newWorkbook) {
      this._newWorkbook = {
        SheetNames: [],
        Sheets: {}
      }
    }

    return this._newWorkbook;
  }
}

module.exports = Abstract;