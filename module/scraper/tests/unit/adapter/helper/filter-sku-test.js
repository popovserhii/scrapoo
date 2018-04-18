require('app-module-path').addPath(process.cwd() + '/module');

let chai = require('chai');
let expect = chai.expect;
let Variably = require('scraper/variably');
let Helper = require('../../../../adapter/helper/filter-sku');

describe('Helper: SKU Filter', () => {

  it('filter: check default filter behavior', () => {
    let variably = new Variably();
    let helper = new Helper(variably, {});

    let sku = helper.filter('some_test_code');

    expect(sku).to.equal('some_test_code');
  });

  it('filter: should run normalization with default config', () => {
    let variably = new Variably();
    let helper = new Helper(variably, {
      "apply": {
        "normalize": {
          "hash": {
            "skip": false
          }
        }
      }
    });

    let sku = helper.filter('some_test_code');

    expect(sku).to.equal('1891162');
  });

  it('filter: should apply custom fields for normalization', () => {
    let variably = new Variably();
    variably.set('fields', {supplier: '10', code: 'ER-45', ean: '8888'});

    let helper = new Helper(variably, {
      "apply": {
        "normalize": {
          "format": "{{sku}}-{{fields.supplier}}",
          "hash": {
            "skip": false,
            "fields": ["$fields.code", "$fields.ean"]
          },
        }
      }
    });

    let sku = helper.filter('some_test_code');

    expect(sku).to.equal('6974254-10');
  });

  it('filter: should normalize and apply correct format', () => {
    let variably = new Variably();
    variably.set('fields', {supplier: '10'});

    let helper = new Helper(variably, {
      "apply": {
        "normalize": {
          "format": "{{sku}}-{{fields.supplier}}",
          "hash": {
            "skip": false,
          },
        }
      }
    });

    let sku = helper.filter('some_test_code');

    expect(sku).to.equal('1891162-10');
  });

  it('filter: should apply correct format depend on rule', () => {
    let variably = new Variably();
    variably.set('fields', {supplier: '10'});

    let helper = new Helper(variably, {
      "rules": [{
        "condition": "AND",
        "rules": [
          {
            "field": "supplier",
            "type": "string",
            "operator": "equal",
            "value": "10"
          },
        ],
        "valid": true,
        "apply": {
          "normalize": {
            "format": "{{sku}}-{{fields.supplier}}",
            "hash": {
              "skip": false,
            },
          }
        }
      }],
    });

    let sku = helper.filter('some_test_code');

    expect(sku).to.equal('1891162-10');
  });

});