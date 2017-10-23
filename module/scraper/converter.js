const _ = require('lodash');
const globby = require('globby');
const XLSX = require('xlsx');
const ConfigHandler = require('scraper/config-handler');
const Xlsx = require('scraper/source/driver/xlsx');
const argv = require('minimist')(process.argv.slice(2));
//const config = require('config/south.defect.converter');

class Converter {

  constructor(config) {
    this._config = config || require('scraper/config/south.defect.converter').converter;
    //console.log(this._config);
    this.configHandler = new ConfigHandler();
    this._rows = [];
  }

  /*get sheetName() {
    return this._sheetName;
  }*/

  /*get allowedSheetNames() {
    //let wb = this.getWorkbookReader();
    return _.map(this._currConfig.sheetName, (sheet) => {
      return sheet.name;
    });
  }*/


  async run(name, sheetName) {
    let xlsx = this._xlsx = new Xlsx(this._config);

    xlsx.source = name;
    xlsx.sheetName = sheetName;

    //let wb = await this.getWorkbookReader();
    //let sheetNameList = wb.SheetNames;
    //let allowed = this.allowedSheetNames;


    let firstRow = await xlsx.firstRow();
    let lastRow = await xlsx.lastRow();
    //let firstColumn = await excel.firstColumn();
    //let lastColumn = await excel.lastColumn();

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

    //console.log(head);
    //console.log(this._headMap);

    //let sheetConfig = xlsx.config;
    let row = [];
    let category = [];
    // iterate through rows data
    for (let i = (firstRow + 1); i <= lastRow; i++) {
      //let searchable = [];

      //this._row = null;
      //this._row = await xlsx.read(i);
      row = await xlsx.read(i);

      if (xlsx.config.categorize) {
        //if (row.length == this._headerMap.length) {
        if (1 === row.length) {
          category = [];
          category.push(row.shift());
          continue;
        } else if (category.length) {
          row.push(this.configHandler.process(category, xlsx.config.categorize));
          //category);

        }
      }
      this._rows.push(row);

      //console.log(row);
      //console.log(xlsx.config.categorize);
    }
    //console.log(this._rows);
  }

  async save() {
    // @todo try to use json_to_sheet instead

    //XLSX.writeFile(workbook, 'out.xlsb');
    //XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'})

    let wb = this.getNewWorkbook();
    let ws = XLSX.utils.aoa_to_sheet(this._rows);

    /* add worksheet to workbook */
    wb.SheetNames.push(this._xlsx.sheetName);
    wb.Sheets[this._xlsx.sheetName] = ws;

    /* write file */
    let filePath = this.configHandler.process(await this._xlsx.getFilename(), {"__filter": ["to-lower"], "__prepare": ["datable-path:.xlsx"]});
    console.log(filePath);

    XLSX.writeFile(
      wb,
      filePath
    );
  }

  getNewWorkbook() {
    return {
      SheetNames: [],
      Sheets: {}
    }
  }

}

module.exports = Converter;