require('app-module-path').addPath(process.cwd() + '/module');

const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
//const fs = require('fs');
const File = require('scraper/source/file');
const Preprocessor = require('scraper/preprocessor');
const ConfigHandler = require('scraper/config-handler');
const Variably = require('scraper/variably');
//let Csv = require('scraper/output/csv');

describe('Preprocessor', () => {

  it('process: should handle variable of field set as string', () => {
    let preprocessorConfig = {
      "fields": {
        "code": "$fields.code",
      }
    };

    let variably = new Variably();
    let configHandler = new ConfigHandler(variably);
    let pre = new Preprocessor(configHandler, preprocessorConfig);
    sinon.stub(configHandler, 'globalConfig').get(() => {});

    let fields = pre.process({"code": '12345'});

    expect(fields).to.deep.eql({"code": "12345"});
  });

  it('process: should handle variable of field set as plain object', () => {
    let preprocessorConfig = {
      "fields": {
        "code": {"value": "$fields.code"}
      }
    };

    let variably = new Variably();
    let configHandler = new ConfigHandler(variably);
    let pre = new Preprocessor(configHandler, preprocessorConfig);
    sinon.stub(configHandler, 'globalConfig').get(() => {});

    let fields = pre.process({"code": '12345'});

    expect(fields).to.deep.eql({"code": "12345"});
  });

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


    let file = new File({}, configSource);

    file._headerMap = {'Категорія': 1, 'Під категорія': 3};
    file._row = ['Test item', 'IT ACCESSORIES', 'enable', 'NOTEBOOK'];

    sinon.stub(file, 'getOutput').returns({'send': () => {}});

    let variably = new Variably();
    variably.set('source', file);
    variably.set('config', {}/*file*/);

    let configHandler = new ConfigHandler(variably);

    let pre = new Preprocessor(configHandler, config);
    let fields = pre.process({});

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

    let file = new File({}, configSource);
    file._headerMap = {'Категорія': 1, 'Під категорія': 3};
    file._row = ['Test item', 'IT ACCESSORIES', 'enable', 'NOTEBOOK'];
    sinon.stub(file, 'getOutput').returns({'send': () => {}});

    let variably = new Variably();
    variably.set('source', file);

    let configHandler = new ConfigHandler(variably);

    let pre = new Preprocessor(configHandler, config);
    let fields = pre.process({});

    expect(fields)
      .to.deep.equal({
        "categories": "IT ACCESSORIES:: 1 :: 1 :: 1 || 4/NOTEBOOK:: 1 :: 1 :: 1 || 4",
      });
  });

  it('process: should merge config in right order, preprocessor fields have high priority', () => {
    let config = {
      "default": {
        "shop-it": {
          "helper": {
            "filter-in-stock": {
              "map": {"yes": 1, "no": 0}
            }
          }
        }
      },
      "source": {
        "pool": "shop-it",
      }
    };

    let preprocessorConfig = {
      "fields": {
        "code": "$fields.code",
        "name": "$fields.name",
        "is_in_stock": {"value": ["$fields.is_in_stock"], "__filter": ["shift", "in-stock"]}
      }
    };

    let variably = new Variably();
    variably.set('config', config.source);

    let configHandler = new ConfigHandler(variably);
    sinon.stub(configHandler, 'globalConfig').get(() => config);
    let pre = new Preprocessor(configHandler, preprocessorConfig);
    let fields = pre.process({
      "code": '12345',
      "name": 'Red Hat',
      "is_in_stock": 'yes'
    });

    expect(fields)
      .to.deep.eql({
        "code": '12345',
        "name": 'Red Hat',
        "is_in_stock": 1
    });
  });

});