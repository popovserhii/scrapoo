require('app-module-path').addPath(process.cwd() + '/module');

let chai = require('chai');
let sinon = require('sinon');
let expect = chai.expect;
let fs = require('fs');
let Csv = require('../../../output/csv');

describe('CSV Output', function() {
  it('send() should get json row and write to file', function() {
    let fields = {
      "store": 1,
      "status": 1,
      "visibility": 4,
      "sku": "SUPER-SKU",
      "image": "http://example.com/img.jpg",
      "small_image": "http://example.com/img.jpg",
      "thumbnail": "http://example.com/img.jpg",
      "media_gallery": 'http://example.com/img.jpg;http://example.com/img_2.jpg'
    };

    let random = Math.floor(Math.random() * 11);
    let pathname = process.cwd() + '/data/test' + random + '.csv';
    let csv = new Csv(pathname);

    let writeStub = sinon.stub(csv.output, 'write');
    let endStub = sinon.stub(csv.output, 'end');

    // let's pretend this is the call you want to verify
    csv.send(fields);

    let writeArgument = writeStub.getCall(0).args[0];
    expect(writeArgument).to
      .equal('store;status;visibility;sku;image;small_image;thumbnail;media_gallery\n');

    let endArgument = endStub.getCall(0).args[0];
    expect(endArgument).to
      .equal('1;1;4;SUPER-SKU;http://example.com/img.jpg;http://example.com/img.jpg;http://example.com/img.jpg;"http://example.com/img.jpg;http://example.com/img_2.jpg"\n');

    csv.send(fields);
  });
});