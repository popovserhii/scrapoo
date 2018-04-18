const _ = require('lodash');
const RuleChecker = require('scraper/query-builder/checker');
const Abstract = require('./abstract');

class Combiner extends Abstract {

  _getRuleChecker() {
    if (!this._ruleChecker) {
      this._ruleChecker = new RuleChecker();
    }

    return this._ruleChecker;
  }

  async _prepareSheet(sheetName) {
    if (!_.has(this._rowsIndex, 'default')) {
      this._rows = {
        'default': [],
        'newly': [],
      };
      this._rowsIndex = {
        'default': {},
        'newly': {},
      };
    }

    let xlsx = this._current.xlsx;

    // if have more than one similar files then remove first file for avoid over excessive iteration
    //if (this._current.fileNames.length > 1) {
    //  this._current.fileNames.shift();
    //}

    xlsx.sheetName = sheetName;

    let fileNames = this._current.fileNames;
    //let rows = await xlsx.getRows();
    //for (let f = 0; f < fileNames.length; f++) {
    for (let f = (fileNames.length - 1); f >= 0; f--) { // take the reverse order, this give possibility determine "newly" items
      //let prevConfig = _.merge({}, this._current.config, {path: fileNames});
      let prevXlsx = this.getXlsx(fileNames[f], this._current.config);

      if (f > 1 && !prevXlsx.sheetName) { // if handle similar files then reset sheetName
        prevXlsx.sheetName = this._current.sheetName;
      }

      let prevRows = await prevXlsx.getRows();
      let prevIndex = await prevXlsx.getIndex();
      delete prevIndex[prevXlsx.config.index]; // delete header name from index
      for (let r = 1; r < prevRows.length; r++) { // skip header
        let row = prevRows[r];
        let indexValue = row[prevXlsx.config.index];
        let fields = this.getFields(row, prevXlsx.config);
        let custom = _.get(prevXlsx.config, 'custom.fields', {});
        fields = _.merge({}, custom, fields);

        if ((f === 0 && fileNames.length > 1)/*головнийАлеНеЄдиний*/ && _.isUndefined(this._rowsIndex.default[indexValue]) && _.get(prevXlsx.config, 'newly.separate')) { // is new value
          let newly = _.get(prevXlsx.config, 'newly.raw') ? row : fields;
          this._pushFields(newly, indexValue, 'newly');
        } else if ((f !== 0 && fileNames.length > 1) && _.isUndefined(this._rowsIndex.default[indexValue])) { // omitted value
          let omitted = _.get(prevXlsx.config, 'omit.fields', {});
          fields = this.preprocessor.process(_.merge(fields, omitted));
          this._pushFields(fields, indexValue);
        } else if ((f === 0 && fileNames.length > 1)/* && _.isUndefined(this._rowsIndex.default[indexValue])*/) { // is actual value
          fields = this.preprocessor.process(fields);
          this._pushFields(fields, indexValue);
        }
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

  /**
   * If fields already is added and this fields have "index" then replace fields with new data from "fields" argument
   * otherwise add new row and mark index if needed
   *
   * @param fields
   * @param indexValue
   * @param type
   * @private
   */
  _pushFields(fields, indexValue, type = 'default') {
    if (!_.isUndefined(indexValue)) {
      let index = this._rowsIndex[type][indexValue];
      if (_.isUndefined(index)) {
        this._rowsIndex[type][indexValue] = this._rows[type].length;
        this._rows[type].push(fields);
      } else {
        //this._rowsIndex.default[indexValue] = this._rows.default.length;
        let checker = this._getRuleChecker().setFields({
          'new': fields,
          'old': this._rows[type][index]
        });
        _.each(this.config.rules, rule => {
          if (checker.check(rule)) {
            this._rows[type][index] = fields;

            return false; // rule is matching, break next iteration
          }
        });
      }
    } else {
      this._rows[type].push(fields);
    }
  }
}

module.exports = Combiner;