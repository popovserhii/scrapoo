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
      "south-defect": {
        "path": consts.sourcePathname,
        "default": {
          //"categorize": {"name": "category", "__filter": ["replace:/^.+\/.+?\s(.*)$/, $1", "upper-first"]}
          "categorize": true
        },
        "sheet": [
          {"name": "it_ноутбуки", "skip": 1}
        ]
      }
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

    xlsx._config = 'south-defect';
    xlsx.sheetName = 'it_ноутбуки';
    let config = xlsx._mergeConfig();

    expect(config).to.be.an('object')
      .to.deep.include({ skip: 1, name: 'it_ноутбуки', categorize: true });
  });

  it('firstRow: should skip 1 row and return integer value of first not empty row in excel', async () => {
    let xlsx = new Xlsx(consts.config);

    xlsx._config = 'south-defect';
    xlsx.sheetName = 'it_ноутбуки';

    let i = await xlsx.firstRow();

    expect(i).to.equal(0);
  });

  it('lastRow: should return integer value of last row in excel', async () => {
    let xlsx = new Xlsx(consts.config);

    xlsx._config = 'south-defect';
    xlsx.sheetName = 'it_ноутбуки';

    let i = await xlsx.lastRow();

    expect(i).to.equal(10);
  });

  it('firstColumn: should return integer values of first column', async () => {
    let xlsx = new Xlsx(consts.config);

    xlsx._config = 'south-defect';
    xlsx.sheetName = 'it_ноутбуки';

    let i = await xlsx.firstColumn();

    expect(i).to.equal(0);
  });

  it('lastColumn: should return integer values of last column', async () => {
    let xlsx = new Xlsx(consts.config);

    xlsx._config = 'south-defect';
    xlsx.sheetName = 'it_ноутбуки';

    let i = await xlsx.lastColumn();

    expect(i).to.equal(8);
  });

  it('read(row): should return row (array)', async () => {
    let xlsx = new Xlsx(consts.config);

    xlsx._config = 'south-defect';
    xlsx.sheetName = 'it_ноутбуки';

    let row = await xlsx.read(0);
    //console.log(row);

    expect(row).to.be.an('array')
      .that.includes('Код')
      .that.includes('Модель');
  });

  it('rows: should return indexed rows', async () => {
    consts.config["south-defect"]["default"]["skip"] = 1;
    consts.config["south-defect"]["default"]["index"] = 'Код товара';
    consts.config["south-defect"]["path"] = __dirname + '/../../../data/laptops.xlsx';

    let xlsx = new Xlsx(consts.config["south-defect"]);

    xlsx.source = consts.config["south-defect"]["path"];

    let index = await xlsx.index();
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