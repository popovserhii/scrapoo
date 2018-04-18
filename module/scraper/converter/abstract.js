const _ = require('lodash');
const path = require('path');
const globby = require('globby');
const XLSX = require('xlsx');
const Variably = require('scraper/variably');
const ConfigHandler = require('scraper/core/config-handler');
const Preprocessor = require('scraper/core/preprocessor');
const Xlsx = require('scraper/source/driver/xlsx');

//const argv = require('minimist')(process.argv.slice(2));
//const config = require('config/south.defect.converter');

class Abstract {

  constructor(config) {
    this._config = config;
    this._xlsx = {};
    this._row = {};
    this._rows = {"default": []};
    this._fields = {};
    //this._persisted = {};
    this._output = {};
    this._preprocessor = null;

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

  get config() {
    return this._config;
  }

  get variably() {
    if (!this._variably) {
      this._variably = new Variably();
      this._variably.set('config', this.config);
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

  get preprocessor() {
    if (!this._preprocessor) {
      this._preprocessor = new Preprocessor(this.configHandler, this.config.preprocessor);
    }

    return this._preprocessor;
  }

  getData(name) {
    //if (undefined !== this['_' + name]) {
      return this['_' + name];
    //}

    //return this._fields[name];
  }

  getXlsx(filePath, config) {
    if (!this._xlsx[filePath]) {
      this._xlsx[filePath] = new Xlsx(config);
      this._xlsx[filePath].source = filePath;
    }

    return this._xlsx[filePath];
  }

  /**
   * @todo use mixin for remove duplicates from here and source/abstract.js
   * @param context
   * @returns {*}
   */
  getOutput(context = 'default') {
    //let context = context || 'default';
    if (!this._output[context]) {
      let config = _.get(this.config, `output.${context}`);
      let name = path.extname(config.path).substring(1);
      let Output = require('scraper/output/' + name);

      this._output[context] = new Output(config);
    }

    return this._output[context];
  }

  async getFileNames(paths) {
    return await globby(paths)/*.then(paths => {
      return paths.shift();
    });*/
  }

  async run(sheetName = null) {
    this.variably.set(_.lowerFirst(this.constructor.name), this);

    //this._rows = [];

    for (let i in this._config.file) {
      let paths = _.castArray(this._config.file[i].path);
      let fileNames = await this.getFileNames(paths);
      for (let f = 0; f < 1; f++) { // iterate only over first file on this step
        this._current = {
          index: this._xlsx.length,
          config: this._config.file[i],
          fileNames: fileNames,
          xlsx: this.getXlsx(fileNames[f], this._config.file[i])
        };

        await this.prepare(sheetName);
      }

    }

    // It is most efficient to aggregate data in memory and save all by once.
    // In one experiment no benefits were noticed when saving each row separately
    for (let type in this._rows) {
      await this.getOutput(type).send(this._rows[type]);
    }


    // @todo Remove this. It is quick realization for price-list
    if (_.isFunction(this.getOutput()._persist)) {
      await this.getOutput()._persist(this._current.xlsx.sheetName);
    }
    // @todo Remove this. It is quick realization for price-list
    if (_.isFunction(this.getOutput()._save)) {
      await this.getOutput()._save();
    }

  }

  async prepare(sheetName) {
    let sheets = _.castArray(this._current.config.sheet);
    for (let i in sheets) {
      let currSheetName = sheets[i] ? sheets[i].name : undefined;

      //if (sheetName && sheetName !== this._config.sheet[i].name) {
      if (sheetName && sheetName !== currSheetName) {
        continue;
      }

      await this._prepareSheet(currSheetName);
    }
  }
}

module.exports = Abstract;