require('app-module-path').addPath(process.cwd() + '/module');

let chai = require('chai');
let sinon = require('sinon');
let expect = chai.expect;
let fs = require('fs');
let MtiConverter = require('../../../job/mti-converter');

describe('MTI Converter Job', function() {
  this.timeout(15000);

  it('run: should remove empty string', async function() {

    let converter = new MtiConverter();
    await converter.run();


    //let writeStub = sinon.stub(csv.output, 'write');
    //let endStub = sinon.stub(csv.output, 'end');

    // let's pretend this is the call you want to verify
    //csv.send(fields);

    /*let writeArgument = writeStub.getCall(0).args[0];
    expect(writeArgument).to
      .equal('store;status;visibility;sku;image;small_image;thumbnail;media_gallery\n');

    let endArgument = endStub.getCall(0).args[0];
    expect(endArgument).to
      .equal('1;1;4;SUPER-SKU;http://example.com/img.jpg;http://example.com/img.jpg;http://example.com/img.jpg;"http://example.com/img.jpg;http://example.com/img_2.jpg"\n');

    csv.send(fields);*/
  });
});