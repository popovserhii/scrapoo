require('app-module-path').addPath(process.cwd() + '/module');

const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const withData = require('leche').withData;
const Combiner = require('scraper/converter/combiner');

let consts = {};
describe('Combiner', () => {
  beforeEach(() => {
    staber.combiner = null;
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
              "is_in_stock": "Склад",
            },
            "omit": {
              "fields": {
                "is_in_stock": "out of stock"
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

  withData([
    [ // first data set
      'run: should combine omitted items and mark as "out of stock"', // message
      {
        files: [ // file rows mock
          //[ // "path" config has several files (two files with identical structure)
          [ // first file
            {"Код": "Код", "Назва": "Назва", "Склад": "Склад"},
            {"Код": "2974651", "Назва": "ноутбук i5", "Склад": "in stock"},
            {"Код": "2852963", "Назва": "ноутбук i7", "Склад": "out of stock"},
          ],
          [ // second file
            {"Код": "Код", "Назва": "Назва", "Склад": "Склад"},
            {"Код": "2974651", "Назва": "ноутбук i5", "Склад": "out of stock"},
            {"Код": "2852963", "Назва": "ноутбук i7", "Склад": "in stock"},
            {"Код": "2879423", "Назва": "ноутбук i3", "Склад": "in stock"}
          ]
          //],
          //[] // second file with different structure
        ]
      },
      [ // expected combined rows
        {"code": "2974651", "is_in_stock": "in stock", "name": "ноутбук i5"},
        {"code": "2852963", "is_in_stock": "out of stock", "name": "ноутбук i7"},
        {"code": "2879423", "is_in_stock": "out of stock", "name": "ноутбук i3"}
      ]
    ],

    //[3, 4]
  ], function(message, data, expectedRows) {
    it(message, async () => {
      let config = {
        "pool": "shop-it",
        "type": "combiner",

        "file": [
          {
            "path": ['path/to/file-one.xlsx', 'path/to/file-two.xlsx'],
            "default": {
              "index": "Код",
              "fields": {"code": "Код", "is_in_stock": "Склад", "name": {"name": "Назва"}},
              "omit": {"fields": {"is_in_stock": "out of stock"}},
              "newly": {"separate": true}
            },
          },
          /*{
            // WRONG! if set only "path" then all config will be taken from first file config
            // "path": "data/shop-it/south-contract/pprice_list-*.xls"
          }*/
        ],
        "preprocessor": {
          "fields": {
            "code": "$fields.code",
            "is_in_stock": "$fields.is_in_stock",
            "name": "$fields.name",
          }
        }
      };

      let combiner = staber.prepareCombinerStub(config, config.file[0].path);
      data.files.forEach((rows, i) => {
        staber.prepareXlsxStub(config.file[0].path[i], config.file[0], rows);
      });

      await combiner.run();

      //expect(staber.rows.length).to.deep.equal(expectedLength);
      expect(combiner._rows.default).to.eql(expectedRows);
    });
  });

  withData([
    [ // first data set
      'run: should combine two files with different format and correct stock fields', // message
      { // config
        "pool": "shop-it",
        "type": "combiner",

        "file": [
          {
            "path": ['path/to/file-one.xlsx', 'path/to/file-one-old.xlsx'],
            "default": {
              "index": "Код",
              "fields": {"code": "Код", "is_in_stock": "Склад", "name": {"name": "Назва"}},
              "omit": {"fields": {"is_in_stock": "out of stock"}},
              "newly": {"separate": true}
            },
          },
          {
            "path": ['path/to/file-two.xlsx'],
            "default": {
              "index": "Артикуль",
              "fields": {"code": "Артикуль", "is_in_stock": "Наявність", "name": {"name": "Назва"}},
              "omit": {"fields": {"is_in_stock": "out of stock"}},
              "newly": {"separate": true}
            },
          },
        ],
        "preprocessor": {
          "fields": {
            "code": "$fields.code",
            "is_in_stock": "$fields.is_in_stock",
            "name": "$fields.name",
          }
        }
      },
      {
        files: { // file rows mock
          //[ // "path" config has several files (two files with identical structure)
          "path/to/file-one.xlsx": [ // first file
            {"Код": "Код", "Назва": "Назва", "Склад": "Склад"},
            {"Код": "2974651", "Назва": "ноутбук i5", "Склад": "in stock"},
            {"Код": "2852963", "Назва": "ноутбук i7", "Склад": "out of stock"},
          ],
          "path/to/file-one-old.xlsx": [ // first old file
            {"Код": "Код", "Назва": "Назва", "Склад": "Склад"},
            {"Код": "2974651", "Назва": "ноутбук i5", "Склад": "out of stock"},
            {"Код": "2852963", "Назва": "ноутбук i7", "Склад": "out of stock"},
            {"Код": "2879423", "Назва": "ноутбук i3", "Склад": "in stock"}
          ],
          "path/to/file-two.xlsx": [ // second file
            {"Артикуль": "Артикуль", "Назва": "Назва", "Наявність": "Наявність"},
            {"Артикуль": "2974651", "Назва": "ноутбук i5", "Наявність": "in stock"},
            {"Артикуль": "2852963", "Назва": "ноутбук i7", "Наявність": "out of stock"},
            {"Артикуль": "2879425", "Назва": "ноутбук AMD", "Наявність": "in stock"}
          ]
          //],
          //[] // second file with different structure
        }
      },
      [ // expected combined rows
        {"code": "2974651", "is_in_stock": "out of stock", "name": "ноутбук i5"},
        {"code": "2852963", "is_in_stock": "out of stock", "name": "ноутбук i7"},
        {"code": "2879423", "is_in_stock": "out of stock", "name": "ноутбук i3"},
        {"code": "2879425", "is_in_stock": "in stock", "name": "ноутбук AMD"}
      ]
    ],

    //[3, 4]
  ], function(message, config, data, expectedRows) {
    it(message, async () => {
      let combiner = staber.prepareCombinerStub(config/*, config.file[0].path*/);
      config.file.forEach((fileConfig, i) => {
        fileConfig.path.forEach((path, i) => {
          staber.prepareXlsxStub(path, fileConfig, data.files[path]);
        });
      });

      await combiner.run();

      expect(combiner._rows.default).to.eql(expectedRows);
    });
  });

});

let staber = {

  getCombinerStub: function () {
    return this.combiner;
  },

  prepareCombinerStub: function(config) {
    if (!this.combiner) {
      this.rows = [];
      let combiner = new Combiner(config);
      sinon.stub(combiner, 'getOutput').returns({send: (fields) => {this.rows.push(fields)}});
      let getFileNamesStub = sinon.stub(combiner, 'getFileNames');
      config.file.forEach((fileConfig, i) => {
        getFileNamesStub.onCall(i).returns(fileConfig.path);
      });
      this.combiner = combiner;
    }
    return this.combiner;
  },

  prepareXlsxStub: function (path, fileConfig, rows) {
    let combiner = this.getCombinerStub(path);
    let xlsx = combiner.getXlsx(path, fileConfig);

    sinon.stub(xlsx, '_getSheets').returns({'Sheet1': {}});
    sinon.stub(xlsx, '_getSheetNames').returns(['Sheet1']);
    sinon.stub(xlsx, '_convertRawSheet').returns(rows);
    sinon.stub(xlsx, '_getFilename');
    sinon.stub(xlsx, '_getWorkbookReader');

    return xlsx;
  }
};
