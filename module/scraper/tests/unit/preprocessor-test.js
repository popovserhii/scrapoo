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
        "path": "path/to/file.ext",
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
    file._headerMap = {'МТІ код': 2, 'Артикул': 4};
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

  it('process: should replace array variables pattern to values', () => {
    let config = { // preprocessor config
      "fields": {
        "categories": {"value": ["$source.category", "$source.subcategory"]},
        //"categories": {"value": ["$source.category", "$source.subcategory"], "__prepare": ["prepare-join-categories-magento"]},
      }
    };

    let configSource = {
      "source": {
        "path": "path/to/file.ext",
        "fields": {
          "category": "Категорія",
          "subcategory": "Під категорія"
        }
      }
    };

    let fields = {};

    let file = new File({}, configSource);
    file._headerMap = {'Категорія': 1, 'Під категорія': 3};
    file._row = ['Test item', 'IT ACCESSORIES', 'enable', 'NOTEBOOK'];

    let pre = new Preprocessor(file, config);
    fields = pre.process(fields);

    expect(fields)
      .to.deep.equal({
        "categories": ['IT ACCESSORIES', 'NOTEBOOK'],
      });
  });

  it('process: should replace array variables pattern and process with helper', () => {
    let config = { // preprocessor config
      "fields": {
        //"categories": {"value": ["$source.category", "$source.subcategory"]},
        "categories": {"value": ["$source.category", "$source.subcategory"], "__prepare": ["join-categories-magento"]},
      }
    };

    let configSource = {
      "source": {
        "path": "path/to/file.ext",
        "fields": {
          "category": "Категорія",
          "subcategory": "Під категорія"
        }
      }
    };

    let fields = {};

    let file = new File({}, configSource);
    file._headerMap = {'Категорія': 1, 'Під категорія': 3};
    file._row = ['Test item', 'IT ACCESSORIES', 'enable', 'NOTEBOOK'];

    let pre = new Preprocessor(file, config);
    fields = pre.process(fields);

    expect(fields)
      .to.deep.equal({
        "categories": "IT ACCESSORIES:: 1 :: 1 :: 1 || 4/NOTEBOOK:: 1 :: 1 :: 1 || 4",
      });
  });
});