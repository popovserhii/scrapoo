require('app-module-path').addPath(process.cwd() + '/module');

//let fs = require('fs');
let chai = require('chai');
let sinon = require('sinon');
let expect = chai.expect;
let Variable = require('scraper/variable');

describe('Variable', () => {
  it('process: should parse simple path and return string', () => {

    let variable = new Variable();
    variable.add('crawler', {name: 'Test string'});
    let val = variable.process('$crawler.name');

    expect(val).to.equal('Test string');
  });

  it('process: should parse complex path return string', () => {

    let variable = new Variable();
    variable.add('crawler', {obj: {name: 'Test string in complex object'}});

    let val = variable.process('$crawler.obj.name');

    expect(val).to.equal('Test string in complex object');
  });

  it('process: should parse complex path based on getter and return string', () => {
    let variable = new Variable();
    variable.add('crawler', {
      obj: {
        get name() {
          return 'Test string in complex object';
        }
      }
    });

    let val = variable.process('$crawler.obj.name');

    expect(val).to.equal('Test string in complex object');
  });

  it('process: should parse complex path and use getData if', () => {
    let variable = new Variable();
    variable.add('crawler', {
      obj: {
        getData(field) {
          if ('name' === field) {
            return 'Test string from getData';
          }
        }
      }
    });
    let val = variable.process('$crawler.obj.name');

    expect(val).to.equal('Test string from getData');
  });

  it('process: should throw Error when variable is not registered', () => {
    let variable = new Variable();

    expect(() => { variable.process('$crawler.obj.name'); }).to.throw('$crawler');
  });
});