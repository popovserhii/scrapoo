require('app-module-path').addPath(process.cwd() + '/module');

let chai = require('chai');
let sinon = require('sinon');
let expect = chai.expect;
let fs = require('fs');
let Xlsx = require('scraper/source/driver/xlsx');
//let Csv = require('scraper/output/csv');

let consts = {};
describe('XLSX Driver', function() {
  before(() => {
    consts.sourcePathname = __dirname + '/../../../data/RASPRODAZHA.xls';
    consts.config = {
      //"south-defect": {
        "path": consts.sourcePathname,
        "default": {
          //"categorize": {"name": "category", "__filter": ["replace:/^.+\/.+?\s(.*)$/, $1", "upper-first"]}
          "header": 1,
          "categorize": true
        },
        "sheet": [
          {"name": "it_ноутбуки", "skip": 1}
        ]
      //}
    }
  });

  /*it('config: should be merged correctly', async () => {
    let xlsx = new Xlsx(consts.config);

    xlsx.source = 'south-defect';
    xlsx.sheetName = 'it_ноутбуки';
    xlsx._mergeConfig();

    expect(xlsx.config.sheet[0]).to.be.an('object')
      .to.deep.include({ skip: 1, name: 'it_ноутбуки', categorize: true });
  });*/

  it('config: should be merged correctly with default values', async () => {
    let xlsx = new Xlsx(consts.config);

    xlsx.source = consts.config.path;
    xlsx.sheetName = 'it_ноутбуки';
    let config = await xlsx._mergeConfig();

    expect(config).to.be.an('object')
      .to.eql({
        "skip": 1,
        "skipLast": 0,
        "header": 1,
        "categorize": true,
        "index": false,
        "name": "it_ноутбуки"
    });
  });

  it('firstRow: should skip 1 row and return integer value of first not empty row in excel', async () => {
    let xlsx = new Xlsx(consts.config);

    xlsx.source = consts.config.path;
    xlsx.sheetName = 'it_ноутбуки';

    let i = await xlsx.firstRow();

    expect(i).to.equal(0);
  });

  it('lastRow: should skip 1 row and return integer value of last row in excel', async () => {
    let xlsx = new Xlsx(consts.config);

    xlsx.source = consts.config.path;
    xlsx.sheetName = 'it_ноутбуки';

    let i = await xlsx.lastRow();

    expect(i).to.equal(9);
  });

  it('firstColumn: should return integer values of first column', async () => {
    let xlsx = new Xlsx(consts.config);

    xlsx.source = consts.config.path;
    xlsx.sheetName = 'it_ноутбуки';

    let i = await xlsx.firstColumn();

    expect(i).to.equal(0);
  });

  it('lastColumn: should return integer values of last column', async () => {
    let xlsx = new Xlsx(consts.config);

    xlsx.source = consts.config.path;
    xlsx.sheetName = 'it_ноутбуки';

    let i = await xlsx.lastColumn();

    expect(i).to.equal(8);
  });

  it('read(row): should return header in json format when read first row', async () => {
    let xlsx = new Xlsx(consts.config);

    xlsx.source = consts.config.path;
    xlsx.sheetName = 'it_ноутбуки';

    let row = await xlsx.read(0);

    expect(row).to.be.an('object')
      .to.deep.include({ "Код": "Код", "Модель": 'Модель', "Цена гр": "Цена гр" });
  });

  it('rows: should return indexed rows', async () => {
    consts.config["default"]["skip"] = 1;
    consts.config["default"]["index"] = 'Код товара';
    consts.config["path"] = __dirname + '/../../../data/laptops.xlsx';

    let xlsx = new Xlsx(consts.config);

    xlsx.source = consts.config["path"];

    let index = await xlsx.getIndex();
    //console.log(row);

    expect(index)
      .to.deep.eql({
        "2852963": 2,
        "2879423": 3,
        "2974651": 1,
        "Код товара": 0
      });
  });

});