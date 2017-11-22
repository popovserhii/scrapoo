require('app-module-path').addPath(process.cwd() + '/module');

let chai = require('chai');
let sinon = require('sinon');
let expect = chai.expect;
let fs = require('fs');
let path =  require('path');
//let File = require('scraper/source/file');
let Combiner = require('scraper/converter/combiner');
//let Csv = require('scraper/output/csv');

let consts = {};
describe('Combiner', () => {
  before(() => {
    consts.config = {
      "pool": "shop-it",
      "type": "combiner",


      "file": [
        {
          "path": "data/shop-it/south-contract/pprice_list-*.xls",
          "default": {
            "index": "Код",
            "fields": {
              "code": "Код",
              "manufacturer": "ТМ",
              "manufacturer_code": "Артикул",
              "is_in_stock": "NS W300",
            },
            "omit": {
              "fields": {
                "is_in_stock": "немає в наявності"
              }
            },
            "newly": {
              "separate": true
            }
          },
          // if should combine all sheet to one then use "sheet config"
          /*"sheet": [
            {"name": " УЦЕНКА ПОСУДА", "skip": 1, "skipLast": 1},
            {"name": "ДЕФЕКТ УП. ПОСУДА", "skip": 2, "skipLast": 1},
            {"name": "Аксессуарные группы", "skip": 5, "skipLast": 1},
            {"name": "Дефект уп-ки Акция!", "skip": 1},
            {"name": "it_ноутбуки", "skip": 1},
            {"name": "быт.тех", "skip": 1, "categorize": {"__filter": ["replace:ЦЕНЫ СНИЖЕНЫ !, ", "upper-first"]}},
            {"name": "TV_видео_аудио", "skip": 1, "categorize": {"__filter": ["replace:/^.+\/.+?\\s(.*)$/, $1", "upper-first"]}},
            {"name": "авто_ц.фото_ц.планшеты_аудио", "skip": 0, "categorize": {"__filter": ["replace:/^.+\/.+?\\s(.*)$/, $1", "upper-first"]}},
            {"name": "моб.тел_планшеты", "skip": 1, "categorize": {"__filter": ["replace:/^.+\/.+?\\s(.*)$/, $1", "upper-first"]}}
          ]*/
        },
        {
          // if set only "path" then all config will be taken from first file config
          "path": "data/shop-it/south-contract/pprice_list-*.xls"
        }
      ]

    }
  });

  it('run: should combine omitted items and mark as "out of stock"', async () => {
    let config = {
      "pool": "shop-it",
      "type": "combiner",


      "file": [
        {
          "path": "data/shop-it/south-contract/pprice_list-*.xls",
          "default": {
            "index": "Код",
            "fields": {
              "code": "Код",
              "manufacturer": "ТМ",
              "manufacturer_code": "Артикул",
              "is_in_stock": "NS W300",
            },
            "omit": {
              "fields": {
                "is_in_stock": "немає в наявності"
              }
            },
            "newly": {
              "separate": true
            }
          },
        },
        /*{
          // WRONG! if set only "path" then all config will be taken from first file config
          // "path": "data/shop-it/south-contract/pprice_list-*.xls"
        }*/
      ]
    };

    let combiner = new Combiner(config);
    await combiner.run();

    expect(combiner._rows.length)
      .to.deep.equal(7);

    expect(combiner._rows[1])
      .to.include.members([6349283, 'Мониторы:: 1 :: 1 :: 1 || 4']);
  });

  /*it('run: should convert merged category row to category column', async () => {
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
    consts.config['south-defect']['sheet'] = [{"name": " УЦЕНКА ПОСУДА", "skip": 1/!*, "header": 2*!/}];

    let converter = new Converter(consts.config['south-defect']);
    await converter.run(' УЦЕНКА ПОСУДА');
    //await converter.save();

    //console.log(converter._rows);

    expect(converter._rows.length)
      .to.deep.equal(5);

    //console.log(converter._rows);
    expect(converter._rows[1])
      .to.include.members([6304243, 'УЦЕНКА ПОСУДА:: 1 :: 1 :: 1 || 4']);
  });*/
});