require('app-module-path').addPath(process.cwd() + '/module');

let chai = require('chai');
let sinon = require('sinon');
let expect = chai.expect;
let fs = require('fs');
let path =  require('path');
//let File = require('scraper/source/file');
let Converter = require('scraper/converter/price-list');
//let Csv = require('scraper/output/csv');

let consts = {};
describe('Price List Converter', () => {
  before(() => {
    consts.config = {
      "south-defect": {
        "path": __dirname + '/../../data/RASPRODAZHA.xls',
        "default": {
          "categorize": {"name": "category", "__filter": ["replace:/^.+\/.+?\s(.*)$/, $1", "upper-first"], "__prepare": ["join-categories-magento"]}
        },
        "sheet": [
          {"name": "it_ноутбуки", "skip": 1}
        ]
      }
    }
  });

  it('run: should convert category row to category column', async () => {
    let converter = new Converter(consts.config);
    await converter.run('south-defect', 'it_ноутбуки');

    expect(converter._rows.length)
      .to.deep.equal(7);

    expect(converter._rows[1])
      .to.include.members([6349283, 'Мониторы:: 1 :: 1 :: 1 || 4']);
  });

  it('run: should convert merged category row to category column', async () => {
    consts.config['south-defect']['sheet'] = [{"name": "Дефект уп-ки Акция!", "skip": 1}];
    let converter = new Converter(consts.config);
    await converter.run('south-defect', 'Дефект уп-ки Акция!');

    expect(converter._rows.length)
      .to.deep.equal(15);

    //console.log(converter._rows);
    expect(converter._rows[1])
      .to.include.members([6207553, 'Вст.поверхности газовые:: 1 :: 1 :: 1 || 4']);
  });

  it('run: should convert sheet name to category name', async () => {
    consts.config['south-defect']['sheet'] = [{"name": " УЦЕНКА ПОСУДА", "skip": 1/*, "header": 2*/}];

    let converter = new Converter(consts.config['south-defect']);
    await converter.run(' УЦЕНКА ПОСУДА');
    //await converter.save();

    //console.log(converter._rows);

    expect(converter._rows.length)
      .to.deep.equal(5);

    //console.log(converter._rows);
    expect(converter._rows[1])
      .to.include.members([6304243, 'УЦЕНКА ПОСУДА:: 1 :: 1 :: 1 || 4']);
  });
});