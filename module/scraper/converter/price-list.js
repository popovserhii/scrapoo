const _ = require('lodash');
//const globby = require('globby');
const XLSX = require('xlsx');
//const ConfigHandler = require('scraper/config-handler');
//const Xlsx = require('scraper/source/driver/xlsx');
const Abstract = require('./abstract');
//const argv = require('minimist')(process.argv.slice(2));
//const config = require('config/south.defect.converter');

class PriceList extends Abstract{

  async prepare(sheetName) {
    await this._prepareSheet(sheetName);
    await this._prepareToSave();
  }

  async _prepareSheet(sheetName) {
    this._rows = [];

    let xlsx = this.getXlsx();

    //xlsx.source = name;
    xlsx.source = this._config.path;
    xlsx.sheetName = sheetName;

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

    //console.log(head);
    //console.log(this._headMap);

    //let sheetConfig = xlsx.config;
    let row = [];
    let categoryNames = [];
    // iterate through rows data
    for (let i = (firstRow + 1); i <= lastRow; i++) {

      //let searchable = [];

      //row = await xlsx.read(i);
      row = await xlsx.read(i);
      //row = _.compact(row);

      if (xlsx.config.categorize) {
        if (i === (firstRow + 1)) { // take sheet name as category if first data row is not category
          categoryNames = [];
          categoryNames.push(sheetName.trim());
        }

        let category = _.compact(row);
        if (1 === category.length) {
          categoryNames = [];
          categoryNames.push(category.shift());
          continue;
        } else if (categoryNames.length) {
          row.push(this.configHandler.process(categoryNames, xlsx.config.categorize));
        }
      }
      this._rows.push(row);
    }
  }

  async _prepareToSave() {
    // @todo try to use json_to_sheet instead

    //XLSX.writeFile(workbook, 'out.xlsb');
    //XLSX.write(wb, {bookType:'xlsx', bookSST:false, type: 'binary'})

    let wb = this.getNewWorkbook();
    let ws = XLSX.utils.aoa_to_sheet(this._rows);

    /* add worksheet to workbook */
    wb.SheetNames.push(this._xlsx.sheetName);
    wb.Sheets[this._xlsx.sheetName] = ws;
  }

}

module.exports = PriceList;