require('app-module-path').addPath(process.cwd() + '/module');

let fs = require('fs');
let chai = require('chai');
let sinon = require('sinon');
let config = require('../../../config');
let Nightmare = require('nightmare');
let File = require('scraper/source/file');
let expect = chai.expect;


let consts = {};

describe('Integration for File', function() {
  this.timeout(1500000);

  before(function() {
    consts.nightmare = new Nightmare({show: true/*, width: 1920, height: 1080*/});
  });

  after(function() {
    // @see why https://stackoverflow.com/a/40832950/1335142
    consts.nightmare.then(function () {
      return consts.nightmare.end();
    });
  });

  it('Entire iteration should iterate through three items in file and write data to csv', async () => {
    let sourceConfig = config.scraper.catalog[0];
    //sourceConfig.source.path = __dirname + '/../../data/laptops.xlsx';

    let file = new File(consts.nightmare, sourceConfig);

    await file.start();

    let fileBuffer =  fs.readFileSync(sourceConfig.output.path);
    let splitLines = fileBuffer.toString().split("\n");

    //console.log(splitLines.length-1);

    expect(splitLines.length-1).to.equal(4);
    //expect(fields).to.have.a.property('images');
    //expect(fields).to.have.a.property('description');
    //expect(fields).to.have.a.property('specifications');
  });

  /*it('scan() should call getFields() with correct url', async function () {
    let searchable = ['MPXQ2', 'Apple MacBook Pro 13" Space Gray'];
    let hotline = new HotlineUa(consts.nightmare);
    let mock = sinon.mock(hotline);
    let expectation = mock.expects('getFields')
    //.withArgs('http://hotline.ua/sr/autocomplete/?term=MPXQ2')
      .once()
      .returns({});

    await hotline.scan(searchable);

    expectation.verify();
  });*/


});