const globby = require('globby');
const Excel = require('exceljs');

class MtiConverter {
  constructor(source) {
    this.source = source;
    this._filename = '';
  }

  async getFilename() {
    if (!this._filename) {
      this._filename = await globby(['data/mti_*.xlsx']).then(paths => {
        return paths.shift();
      });
    }

    return this._filename;
  }

  async run() {
    await this._convert();
    this._worksheet.commit(); // Need to commit the changes to the worksheet
    this._workbook.commit(); // Finish the workbook
  }

  async _convert() {
    let reader = await this._sheetReader();
    let writer = this._sheetWriter();

    let category = '';
    reader.spliceRows(1,2);
    reader.eachRow((row, rowNumber) => {
      // if first and last cells are equal it's category name
      if (row.getCell(1).value === row.getCell(17).value) {
        category = row.getCell(1).value + ':: 1 :: 1 :: 1 || 4';
      } else {
        if (1 !== rowNumber) {
          let cell = row.getCell(1);
          cell.value = category + '/' + cell.value + ' :: 1 :: 0 :: 1 || 4';
        }
        writer.addRow(row.values);
      }
    });
  }

  async _sheetReader() {
    let workbook = new Excel.Workbook();
    let worksheet = workbook.xlsx.readFile(await this.getFilename())
      .then(function () {
        return workbook.getWorksheet(1);
      });

    return worksheet;
  }

  _sheetWriter() {
    // You can find an example of the code here:
    // https://github.com/guyonroche/exceljs#writing-xlsx
    let options = {
      filename: 'data/converted.xlsx', // existing filepath
      useStyles: true, // Default
      useSharedStrings: true // Default
    };

    this._workbook = new Excel.stream.xlsx.WorkbookWriter(options);
    this._workbook.addWorksheet("MTI");
    this._worksheet = this._workbook.getWorksheet("MTI");

    return this._worksheet
  }
}

module.exports = MtiConverter;