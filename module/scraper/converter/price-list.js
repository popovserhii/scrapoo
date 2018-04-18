const _ = require('lodash');
const Abstract = require('./abstract');

class PriceList extends Abstract{

  async _prepareSheet(sheetName) {
    await this._handleSheet(sheetName);
  }

  async _handleSheet(sheetName) {
    this._rows.default = [];

    let xlsx = this._current.xlsx;

    xlsx.source = this._current.fileNames.shift();
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

    let categoryField = xlsx.config.categorize
      ? xlsx.config.categorize.name
      : 'Category';

    if (xlsx.config.categorize) {
      //head.push(field) = this._headerMap[field] = _.size(this._headerMap);
      //head.push(field);
      head['category'] = categoryField;
    }
    //this.getOutput().send(head);

    let row = [];
    let categoryNames = [];
    // iterate through rows data
    for (let i = (firstRow + 1); i <= lastRow; i++) {
      row = await xlsx.read(i);
      if (xlsx.config.categorize) {
        let category = _.pickBy(row, _.identity);
        let size = _.size(category);

        if ((i === (firstRow + 1)) && (1 !== size)) { // take sheet name as category if first data row is not category
          categoryNames = [];
          categoryNames.push(sheetName.trim());
        }

        if (1 === size) {
          categoryNames = [];
          categoryNames.push(_.find(category));
          continue;
        } else if (categoryNames.length) {
          row[categoryField] = this.configHandler.process(categoryNames, xlsx.config.categorize);
        }
      }
      //this.getOutput().send(row);
      this._rows.default.push(row)
    }
  }
}

module.exports = PriceList;