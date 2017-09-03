require('app-module-path').addPath(process.cwd() + '/module');

let chai = require('chai');
let sinon = require('sinon');
let expect = chai.expect;
let fs = require('fs');
let File = require('scraper/source/file');
let Preprocessor = require('scraper/preprocessor');
//let Csv = require('scraper/output/csv');

describe('Preprocessor', () => {
  it('process: should replace variables pattern to value', () => {
    let config = { // preprocessor config
      "fields": {
        "store": 1,
        "status": 1,
        "visibility": 4,
        "sku": "$source.sku",
      }
    };

    let configSource = {
      "source": {
        "fields": {
          "sku": "МТІ код"
        }
      }
    };

    let fields = {
      "image": "http://example.com/img.jpg",
      "short_name": "Mini item name"
    };

    let file = new File({}, configSource);
    file._headMap = {'МТІ код': 2, 'Артикул': 4};
    file._row = [1, 'Test item', 'SUPER_CODE', 'enable', 'SUPER_ARTICLE'];

    let pre = new Preprocessor(file, config);
    fields = pre.process(fields);

    expect(fields)
      .to.deep.equal({
        "store": 1,
        "status": 1,
        "visibility": 4,
        "sku": "SUPER_CODE",
        "image": "http://example.com/img.jpg",
        "short_name": "Mini item name"
      });
  });
});