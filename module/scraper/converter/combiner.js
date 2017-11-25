const _ = require('lodash');
const globby = require('globby');
const XLSX = require('xlsx');
const Xlsx = require('scraper/source/driver/xlsx');
const Abstract = require('./abstract');

class Combiner extends Abstract {

  async getFileNames(paths) {
    return await globby(paths)/*.then(paths => {
      return paths.shift();
    });*/
  }


  /*isFirstFile() {
    return 0 === this._current.index;
  }

  getCurrentXlsx() {
    return this._current.xlsx;
  }*/

  /**
   * Is set "sheet" config with list of sheet for handle
   */
  /*hasSheetQueue() {
    return _.has(this._current.xlsx.config, 'sheet');
  }*/

  async run(sheetName = null) {
    this.variably.set('combiner', this);

    this._rows = [];
    this._newRows = [];

    for (let i in this._config.file) {
      let paths = _.castArray(this._config.file[i].path);
      let fileNames = await this.getFileNames(paths);
      //this._xlsx = [];
      //for (let f = 0; f < fileNames.length; f++) {
      for (let f = 0; f < 1; f++) { // iterate only over first file on this step
        //let config = this._config.file[i]
        this._current = {
          index: this._xlsx.length,
          config: this._config.file[i],
          fileNames: fileNames,
          xlsx: this.getXlsx(fileNames[f], this._config.file[i])
        };
        //this._xlsx.push(this._current.xlsx);

        await this.prepare();
      }
    }

    //await this._persist(this._rows, 'Combined', this._config.output.path);
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

    }
  }

  async _prepareSheet(sheetName) {

    let xlsx = this._current.xlsx;

    xlsx.source = this._current.fileNames.shift();
    if (sheetName) {
      xlsx.sheetName = sheetName;
    }

    let fileNames = this._current.fileNames;
    //let config = xlsx.config;
    let rows = await xlsx.getRows();
    for (let f = 0; f < fileNames.length; f++) {
      //let prevConfig = _.merge({}, this._current.config, {path: fileNames});
      let prevXlsx = this.getXlsx(fileNames[f], this._current.config);
      let prevIndex = await prevXlsx.getIndex();
      delete prevIndex[xlsx.config.index]; // delete header from index
      for (let r = 1; r < rows.length; r++) { // skip header
        let row = rows[r];
        let indexValue = row[xlsx.config.index];

        this._fields = this.getFields(row, xlsx.config);

        if (undefined === prevIndex[indexValue]) { // is new value
          //this._newRows.push(row);
          await this.getOutput('newly').send(row);
        } else { // is similar value
          //this._rows.push(this._fields);
          //this.output.send();
          await this.getOutput().send(this._fields);

          delete prevIndex[indexValue];
        }
      }

      // omitted value
      for (let index in prevIndex) {
        let row = await prevXlsx.read(prevIndex[index]);
        let omitted = _.has(xlsx.config, 'omit.fields') ? prevXlsx.config.omit.fields : {};
        rows.push(row); // avoid duplicates on next iteration
        this._fields = this.getFields(row, prevXlsx.config);
        //this._rows.push(_.merge(this._fields, omitted));
        await this.getOutput().send(_.merge(this._fields, omitted));
      }

      // @todo Add preprocessor

      // is omitted value
    }

  }

  getFields(row, config) {
    let fields = {};
    _.each(config.fields, (field, name) => {
      fields[name] = _.isPlainObject(field)
        ? this.configHandler.process(row[field.name], field)
        : row[field];
    });

    return fields;
  }
}

module.exports = Combiner;