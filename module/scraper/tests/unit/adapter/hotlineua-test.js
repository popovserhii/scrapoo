require('app-module-path').addPath(__dirname + '/module');

let chai = require('chai');
let sinon = require('sinon');
let Nightmare = require('nightmare');
let HotlineUa = require('../../../adapter/hotline-ua');
let expect = chai.expect;

let consts = {};

describe('HotlineUa Crawler', function() {
  this.timeout(15000);

  before(function() {
    consts.nightmare = new Nightmare({show: true/*, width: 1920, height: 1080*/});
  });

  after(function() {
    // @see why https://stackoverflow.com/a/40832950/1335142
    consts.nightmare.then(function () {
      return consts.nightmare.end();
    });
  });

  it('getFields() should return attributes', async function() {
    let config = {
      "name": "hotline-ua",
      "fields": {
        "images": {"selector": "#gallery-box a", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"/*, "magmi-image-append"*/]},
        "description": {"selector": ".description .full-desc"/*, "__filter": ["clear-html"]*/},
        "specifications": {"selector": "#full-props-list", "__output": {"as": "html"}/*, "__filter": ["clear-html"], "__prepare": ["attributes-two-columns"]*/}
      }
    };

    let hotline = new HotlineUa(consts.nightmare, config);
    let fields = await hotline.getFields('http://hotline.ua/computer-noutbuki-netbuki/lenovo-legion-y520-15-ikbn-80wk00sepb/');

    expect(fields).to.be.an('object');
    expect(fields).to.have.a.property('images');
    expect(fields).to.have.a.property('description');
    expect(fields).to.have.a.property('specifications');
  });

  it('getFields: should return images implode by semicolon', async function() {
    let config = {
      "name": "hotline-ua",
      "fields": {
        "images": {"selector": "#gallery-box a", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
      }
    };

    let hotline = new HotlineUa(consts.nightmare, config);
    let fields = await hotline.getFields('http://hotline.ua/computer-noutbuki-netbuki/lenovo-legion-y520-15-ikbn-80wk00sepb/');

    console.log(fields);

    expect(fields).to.be.an('object');
    expect(fields.images).to.equal('http://hotline.ua/img/tx/143/1435252465.jpg;http://hotline.ua/img/tx/143/1435252485.jpg;http://hotline.ua/img/tx/143/1435252505.jpg');
  });

  it('scan() should call getFields() with correct url', async function () {
    let searchable = ['MPXQ2', 'Apple MacBook Pro 13" Space Gray'];
    let hotline = new HotlineUa(consts.nightmare);
    let mock = sinon.mock(hotline);
    let expectation = mock.expects('getFields')
      //.withArgs('http://hotline.ua/sr/autocomplete/?term=MPXQ2')
      .once()
      .returns({});

    await hotline.scan(searchable);

    expectation.verify();
  });

});