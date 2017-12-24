require('app-module-path').addPath(process.cwd() + '/module');

let chai = require('chai');
let sinon = require('sinon');
let expect = chai.expect;
let Checker = require('scraper/query-builder/checker');

let consts = {};
describe('Checker', () => {
  before(() => {
  });

  it('check: should parse one rule and return true', () => {
    let rule = {
      "condition": "AND",
      "rules": [{"field": "price", "type": "double", "operator": "equal", "value": "10.25"}]
    };

    let checker = new Checker();
    let bool = checker.setFields({"price": "10.25"}).check(rule);

    expect(bool).to.eql(true);
  });

  it('check: should parse two positive rules and return true', () => {
    let rule = {
      "condition": "AND",
      "rules": [
        {"field": "price", "type": "double", "operator": "equal", "value": "10.25"},
        {"field": "price", "type": "double", "operator": "less", "value": "20"}
      ]
    };

    let checker = new Checker();
    let bool = checker.setFields({"price": "10.25"}).check(rule);

    expect(bool).to.eql(true);
  });

  it('check: should parse AND operation with two rules, positive and negative, and return false', () => {
    let rule = {
      "condition": "AND",
      "rules": [
        {"field": "price", "type": "double", "operator": "equal", "value": "10.25"},
        {"field": "price", "type": "double", "operator": "less", "value": "5"}
      ]
    };

    let checker = new Checker();
    let bool = checker.setFields({"price": "10.25"}).check(rule);

    expect(bool).to.eql(false);
  });

  it('check: should parse OR operation with two rules, positive and negative and return true', () => {
    let rule = {
      "condition": "OR",
      "rules": [
        {"field": "price", "type": "double", "operator": "equal", "value": "10"},
        {"field": "price", "type": "double", "operator": "less", "value": "15"}
      ]
    };

    let checker = new Checker();
    let bool = checker.setFields({"price": "10.25"}).check(rule);

    expect(bool).to.eql(true);
  });

  it('check: should parse two groups with two rules both and return true', () => {
    let rule = {
      "condition": "AND",
      "rules": [
        {"field": "price", "type": "double", "operator": "equal", "value": "10.25"},
        {"field": "price", "type": "double", "operator": "less", "value": "15"},
        {
          "condition": "AND",
          "rules": [
            {"field": "price", "type": "double", "operator": "greater", "value": "10"},
            {"field": "price", "type": "double", "operator": "not_equal", "value": "10"},
          ]
        }
      ]
    };

    let checker = new Checker();
    let bool = checker.setFields({"price": "10.25"}).check(rule);

    expect(bool).to.eql(true);
  });

  it('check: should parse rule with variable and resolve correct value', () => {
    let rule = {
      "condition": "AND",
      "rules": [{"field": "price", "type": "double", "operator": "greater", "value": "$price_purchase"}]
    };

    let checker = new Checker();
    let bool = checker.setFields({"price": "10.25", "price_purchase": "8"}).check(rule);

    expect(bool).to.eql(true);
  });

  it('check: should correct resolve all conditional operations and return true', () => {
    let rule = {
      "condition": "AND",
      "rules": [
        {"field": "price", "type": "double", "operator": "equal", "value": "10.25"},
        {"field": "price", "type": "double", "operator": "not_equal", "value": "15"},
        {"field": "price", "type": "double", "operator": "in", "value": ["10.25", "15"]},
        {"field": "price", "type": "double", "operator": "not_in", "value": ["20", "15"]},
        {"field": "price", "type": "double", "operator": "less", "value": "15"},
        {"field": "price", "type": "double", "operator": "less_or_equal", "value": "10.25"},
        {"field": "price", "type": "double", "operator": "less_or_equal", "value": "11"},
        {"field": "price", "type": "double", "operator": "greater", "value": "10"},
        {"field": "price", "type": "double", "operator": "greater_or_equal", "value": "10.25"},
        {"field": "price", "type": "double", "operator": "greater_or_equal", "value": "10"},
        {"field": "name", "type": "string", "operator": "begins_with", "value": "S"},
        {"field": "name", "type": "string", "operator": "not_begins_with", "value": "R"},
        {"field": "name", "type": "string", "operator": "contains", "value": "erh"},
        {"field": "name", "type": "string", "operator": "not_contains", "value": "oo"},
        {"field": "name", "type": "string", "operator": "ends_with", "value": "ii"},
        {"field": "name", "type": "string", "operator": "not_ends_with", "value": "oo"},
        {"field": "status", "type": "integer", "operator": "is_empty"},
        {"field": "available", "type": "integer", "operator": "is_not_empty"},
        {"field": "delivery", "type": "integer", "operator": "is_null"},
        {"field": "qty", "type": "integer", "operator": "is_not_null"},
      ]
    };

    let checker = new Checker();
    let bool = checker.setFields({
      "price": "10.25",
      "name": "Serhii",
      "status": "",
      "available": "1",
      "delivery": null,
      "qty": "5"
    }).check(rule);

    expect(bool).to.eql(true);
  });

});