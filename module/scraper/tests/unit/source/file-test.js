require('app-module-path').addPath(process.cwd() + '/module');

let chai = require('chai');
let sinon = require('sinon');
let expect = chai.expect;
let fs = require('fs');
let File = require('scraper/source/file');
//let Csv = require('scraper/output/csv');

describe('File Source', () => {

  it('process: should write problem product info to file if nothing found', async () => {
    let searchable = ['MNX-NOT-FOUND', 'Name not found'];
    let source = new File({}, {});
    source.source = {scan: () => {}};
    source.outputProblem = {send: () => {}};
    //source.preprocessor = {: () => {}};

    let scanStub = sinon.stub(source.source, 'scan');
    let sendStub = sinon.stub(source.outputProblem, 'send');

    scanStub.withArgs(searchable).returns({});

    // let's pretend this is the call you want to verify
    await source.process(searchable);

    let writeArgument = sendStub.getCall(0).args[0];
    expect(writeArgument).to.have.a.property('value');
    expect(writeArgument).to.have.a.property('message');
  });

  it('process: should catch exception and write to log', async () => {
    let searchable = ['MNX-NOT-FOUND', 'Name not found'];
    let source = new File({}, {});
    source.source = {scan: () => {}};
    source.outputProblem = {send: () => {}};

    let scanStub = sinon.stub(source.source, 'scan');

    await scanStub.throws(new Error('Test message'));

    // let's pretend this is the call you want to verify
    source.process(searchable);
  });

  it('start: open worksheet and process each row', async() => {
    let config = {
      "source": {
        "searchKeys": ["PartNo", "Модель"]
      }
    };

    let source = new File({}, config);
    let processStub = sinon.stub(source, 'process');

    processStub.withArgs(['20CLS2NL0D', 'TP X250 8G 500 W7P']);
    processStub.withArgs(['P5R72EA', 'HP ProBook 440 G3 P5R72EA']);
    processStub.withArgs(['N001L347014EMEA', 'Latitude E3470 N001L347014']);

    await source.start();

    let firstCall = processStub.getCall(0).args[0];
    let secondCall = processStub.getCall(1).args[0];
    let thirdCall = processStub.getCall(2).args[0];

    expect(firstCall)
      .to.be.an('array')
      .and.deep.equal(['20CLS2NL0D', 'TP X250 8G 500 W7P']);
    expect(secondCall)
      .to.be.an('array')
      .and.deep.equal(['P5R72EA', 'HP ProBook 440 G3 P5R72EA']);
    expect(thirdCall)
      .to.be.an('array')
      .and.deep.equal(['N001L347014EMEA', 'Latitude E3470 N001L347014']);
  });
});