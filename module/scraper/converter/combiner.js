const _ = require('lodash');
const Abstract = require('./abstract');

class Combiner extends Abstract {

  async _prepareSheetOld(sheetName) {
    let xlsx = this._current.xlsx;

    // if have more than one similar files then remove first file for avoid over excessive iteration
    //if (this._current.fileNames.length > 1) {
    //  this._current.fileNames.shift();
    //}

    xlsx.sheetName = sheetName;

    let fileNames = this._current.fileNames;
    let rows = await xlsx.getRows();
    //for (let f = 0; f < fileNames.length; f++) {
    for (let f = (fileNames.length - 1); f >= 0; f--) { // take the reverse order, this give possibility determine "newly" items
      //let prevConfig = _.merge({}, this._current.config, {path: fileNames});
      //let isMain = f === 0 && fileNames.length > 1; // if we have more then one similar files @todo rename to more suitable name
      let isMain = fileNames.length > 1; // if we have more then one similar files @todo rename to more suitable name

      await this._handleActiveSheet(fileNames[f], isMain);
      continue;

      let prevXlsx = this.getXlsx(fileNames[f], this._current.config);
      if (prevXlsx.source !== xlsx.source) { // if handle different files with same data then reset sheetName
        prevXlsx.sheetName = sheetName;
      }
      let prevIndex = await prevXlsx.getIndex();
      delete prevIndex[xlsx.config.index]; // delete header name from index
      for (let r = 1; r < rows.length; r++) { // skip header
        let row = rows[r];
        let indexValue = row[xlsx.config.index];
        let fields = this.getFields(row, xlsx.config);

        if (_.isUndefined(prevIndex[indexValue]) && _.get(xlsx.config, 'newly.separate')) { // is new value
          let newly = _.get(xlsx.config, 'newly.raw') ? row : fields;
          await this.getOutput('newly').send(newly);
        } else { // is similar value
          fields = this.preprocessor.process(fields);
          await this.getOutput().send(fields);

          delete prevIndex[indexValue];
        }
      }

      // omitted value
      for (let index in prevIndex) {
        let row = await prevXlsx.read(prevIndex[index]);
        let omitted = _.has(xlsx.config, 'omit.fields') ? prevXlsx.config.omit.fields : {};
        rows.push(row); // avoid duplicates on next iteration

        let fields = this.getFields(row, prevXlsx.config);
        fields = this.preprocessor.process(_.merge(fields, omitted));
        //await this.getOutput().send(_.merge(this._fields, omitted));
        await this.getOutput().send(fields);
      }
    }

    // @todo
    // Можна реалізувати обробку файлів в загальному циклі винесши все в окрему функцію і передавати додаковий параметр
    // який би вказував чи файл є головним, чи попереднім і використовується лише для актувалізації.
    // Коли відбувається перевірка наявності рядка з файлу у загальних даних (_rows), також перевіряється чи файл є додатковим,
    // якщо він додатковий, відповіжно поля зарахвуються як omitted.
    //
    // !!!Інформація нижче поки що не актуальна!!!
    // На даному етапі оптимальним варіантом обробки декількох файлів від різних постачаьників бачу додатковий обхід
    // в циклі і фінального визначення чи є товар у наявності і т.д. Тут додасться визначення спільного СКУ, ціни і додаткових фільтрів.
    // Всі обробленні рядки зберігаються у додатковому полі _rows, тобто в пам'ті і вже потім записуються у файл.
    //
  }

  async _prepareSheet(sheetName) {
    if (!this._rows.default) {
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

        if ((f === 0 && fileNames.length > 1)/*головнийАлеНеЄдиний*/ && _.isUndefined(this._rowsIndex.default[indexValue]) && _.get(prevXlsx.config, 'newly.separate')) { // is new value
          let newly = _.get(prevXlsx.config, 'newly.raw') ? row : fields;

          //await this.getOutput('newly').send(newly);

          //this._rowsIndex.newly[indexValue] = this._rows.newly.length;
          //this._rows.newly.push(newly);

          this._pushFields(newly, indexValue, 'newly');

        } else if ((f !== 0 && fileNames.length > 1) && _.isUndefined(this._rowsIndex.default[indexValue])) { // omitted value
          let omitted = _.has(prevXlsx.config, 'omit.fields') ? prevXlsx.config.omit.fields : {};
          //prevRows.push(row); // avoid duplicates on next iteration

          //let fields = this.getFields(row, prevXlsx.config);
          fields = this.preprocessor.process(_.merge(fields, omitted));
          //await this.getOutput().send(_.merge(this._fields, omitted));

          //this._rowsIndex.default[indexValue] = this._rows.default.length;
          //this._rows.default.push(fields);

          this._pushFields(fields, indexValue);
        } else { // is actual value
          fields = this.preprocessor.process(fields);
          //await this.getOutput().send(fields);

          //this._rowsIndex.default[indexValue] = this._rows.default.length;
          //this._rows.default.push(fields);

          this._pushFields(fields, indexValue);

          //delete prevIndex[indexValue];
        }
      }
    }

    // omitted value
    /*for (let index in prevIndex) {
      let row = await prevXlsx.read(prevIndex[index]);
      let omitted = _.has(xlsx.config, 'omit.fields') ? prevXlsx.config.omit.fields : {};
      prevRows.push(row); // avoid duplicates on next iteration

      let fields = this.getFields(row, prevXlsx.config);
      fields = this.preprocessor.process(_.merge(fields, omitted));
      //await this.getOutput().send(_.merge(this._fields, omitted));
      await this.getOutput().send(fields);
    }*/
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
        this._rows[type][index] = fields;
      }
    } else {
      this._rows[type].push(fields);
    }
  }
}

module.exports = Combiner;