let chai = require('chai');
let sinon = require('sinon');
let expect = chai.expect;
let Site = require('../../../source/site');

describe('Site Source', function() {
  it('getConfig should return json', function() {
    let site = new Site({}, {});
    expect(site.getConfig()).to.be.an('object');
  });

  it('ajaxAuth should be called based on json config', function() {
    let authConfig = {
      "options": {
        "auth": {"type": "ajax"}
      }
    };

    let site = new Site({}, authConfig);
    let mock = sinon.mock(site);
    let expectation = mock.expects("ajaxAuth");

    site.auth();

    expectation.once().verify();
  });
});