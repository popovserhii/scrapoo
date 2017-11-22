require('app-module-path').addPath(process.cwd() + '/module');

let chai = require('chai');
let sinon = require('sinon');
let expect = chai.expect;
let ConfigHandler = require('scraper/config-handler');

let consts = {};
describe('ConfigHandler', () => {
  before(() => {
  });

  it('_parseHelperName: should correct parse simple name', () => {
    let variably = {process: () => {}};
    sinon.stub(variably, 'process');

    let ch = new ConfigHandler(variably);
    let fields = ch._parseHelperName("find-merge");

    expect(fields)
      .to.eql({ name: 'find-merge', params: [] });
  });

  it('_parseHelperName: should correct parse json params', () => {
    let variably = {process: () => {}};
    let processStub = sinon.stub(variably, 'process');
    processStub.withArgs("/\\.,/g").returns("/\\.,/g");
    processStub.withArgs("<br />").returns("<br />");

    let ch = new ConfigHandler(variably);
    let fields = ch._parseHelperName({ "name": "replace", "params": ["/\\.,/g", "<br />"] });

    expect(fields)
      .to.deep.eql({ "name": "replace", "params": ["/\\.,/g", "<br />"] });
  });

});