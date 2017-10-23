const globby = require('globby');
const Excel = require('exceljs');

class SouthContract {
  constructor(source) {
    this.source = source;
    this._source = '';
  }

  async getFilename() {
    if (!this._source) {
      this._source = await globby(['data/RASPRODAZHA.xls']).then(paths => {
        return paths.shift();
      });
    }

    return this._source;
  }

  async run() {
    await this._convert();
    //this._worksheet.commit(); // Need to commit the changes to the worksheet

    //await this._workbook.csv
    //  .writeFile('data/south-contract-discount-converted.csv')
    /*.then(function() {
     console.log('CSV Saved!');
     // done
     });*/

    //this._workbook.commit(); // Finish the workbook
  }

  async _convert() {
    let workbook = await this._workbookReader();
    let writer = this._sheetWriter();

    workbook.eachSheet((sheetReader, id) => {
      let category = '';
      sheetReader.spliceRows(1,2);
      sheetReader.eachRow((row, rowNumber) => {
        // if first and last cells are equal it's category name
        if (row.getCell(1).value === row.getCell(17).value) {
          category = row.getCell(1).value + ':: 1 :: 1 :: 1 || 4';
        } else {
          if (1 !== rowNumber) {
            let cell = row.getCell(1);
            cell.value = category + '/' + cell.value + ' :: 1 :: 1 :: 1 || 4';
          }
          //console.log(row.getCell(0).value);
          console.log(row.values);

          writer.addRow(row.values);
        }
      });
    });


  }

  async _workbookReader() {
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
      filename: 'data/south-contract-discount-converted.csv', // existing filepath
      useStyles: true, // Default
      useSharedStrings: true // Default
    };

    //this._workbook = new Excel.stream.xlsx.WorkbookWriter(options);
    this._wb = new Excel.Workbook();
    this._wb.addWorksheet('South-Contract');
    this._worksheet = this._wb.getWorksheet('South-Contract');

    return this._worksheet
  }
}

module.exports = SouthContract;