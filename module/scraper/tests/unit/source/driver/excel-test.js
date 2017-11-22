require('app-module-path').addPath(process.cwd() + '/module');

let chai = require('chai');
let sinon = require('sinon');
let expect = chai.expect;
let fs = require('fs');
let Excel = require('scraper/source/driver/excel');
//let Csv = require('scraper/output/csv');

let consts = {};
describe('Excel Driver', function() {
  before(() => {
    consts.sourcePathname = __dirname + '/../../../data/laptops.xlsx';
  });

  it('_xlBook: should return workbook synchronously', async () => {
    let excel = new Excel();
    excel._config = consts.sourcePathname;
    let workbook = await excel._xlBook();

    expect(workbook).to.have.a.property('_worksheets');
  });

  it('_xlSheet: should return first worksheet', async () => {
    let excel = new Excel();
    excel._config = consts.sourcePathname;
    let worksheet = await excel._xlSheet();

    expect(worksheet).to.have.a.property('_rows');
  });

  it('firstRow: should return integer value of first not empty row in excel', async () => {
    let excel = new Excel();
    excel._config = consts.sourcePathname;
    let i = await excel.firstRow();

    expect(i).to.equal(2);
  });

  it('lastRow: should return integer value of last row in excel', async () => {
    let excel = new Excel();
    excel._config = consts.sourcePathname;
    let i = await excel.lastRow();

    expect(i).to.equal(5);
  });

  it('firstColumn: should return integer values of first column', async () => {
    let excel = new Excel();
    excel._config = consts.sourcePathname;
    let i = await excel.firstColumn();

    expect(i).to.equal(1);
  });

  it('lastColumn: should return integer values of last column', async () => {
    let excel = new Excel();
    excel._config = consts.sourcePathname;
    let i = await excel.lastColumn();

    expect(i).to.equal(20);
  });

  it('read(row) should return row (array)', async () => {
    let excel = new Excel();
    excel._config = consts.sourcePathname;
    let i = await excel.read(2);
    expect(i).to.be.an('array')
      .that.includes('PartNo')
      .that.includes('Код товара');
  });

});