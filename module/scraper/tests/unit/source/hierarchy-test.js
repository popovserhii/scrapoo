require('app-module-path').addPath(process.cwd() + '/module');

let chai = require('chai');
let sinon = require('sinon');
let expect = chai.expect;
let Hierarchy = require('../../../source/hierarchy');

describe('Hierarchy Source', function() {
  it('config: should return json', function() {
    let source = new Hierarchy({}, {
      "source": {
        "path": "http://example.com"
      }
    });

    expect(source.config).to.be.an('object');
  });

  it('start: should return json', function() {
    let source = new Hierarchy({}, {
      "source": {
        "path": "http://example.com"
      }
    });

    expect(source.config).to.be.an('object');
  });
});