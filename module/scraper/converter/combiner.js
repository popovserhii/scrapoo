const _ = require('lodash');
const Abstract = require('./abstract');

class Combiner extends Abstract {

  async _prepareSheet(sheetName) {
    let xlsx = this._current.xlsx;

    // if have more than one like files then remove first file for avoid over excessive iteration
    if (this._current.fileNames.length > 1) {
      this._current.fileNames.shift();
    }

    xlsx.sheetName = sheetName;

    let fileNames = this._current.fileNames;
    let rows = await xlsx.getRows();
    for (let f = 0; f < fileNames.length; f++) {
      //let prevConfig = _.merge({}, this._current.config, {path: fileNames});
      let prevXlsx = this.getXlsx(fileNames[f], this._current.config);
      if (prevXlsx.source !== xlsx.source) { // if handle different files with same data then reset sheetName
        prevXlsx.sheetName = sheetName;
      }
      let prevIndex = await prevXlsx.getIndex();
      delete prevIndex[xlsx.config.index]; // delete header from index
      for (let r = 1; r < rows.length; r++) { // skip header
        let row = rows[r];
        let indexValue = row[xlsx.config.index];

        if (undefined === prevIndex[indexValue]) { // is new value
          await this.getOutput('newly').send(row);
        } else { // is similar value
          this._fields = this.getFields(row, xlsx.config);
          this._fields = this.preprocessor.process(this._fields);
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
        this._fields = this.preprocessor.process(_.merge(this._fields, omitted));
        await this.getOutput().send(_.merge(this._fields, omitted));
      }
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