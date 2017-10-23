require('app-module-path').addPath(__dirname + '/../../../../../module');

let chai = require('chai');
let expect = chai.expect;
//let Default = require('module/adapter/default');
//let Default = require('../../../adapter/default');
let ConfigHandler = require('scraper/config-handler');

describe('Adapter: Default', () => {
  it('should return last element of array', () => {
    let adapter = new ConfigHandler();
    let string = adapter
      .processFilters(['Aircl/humid', 'POLARIS PUH 5903'], {"__filter": ["pop"]});

    expect(string).to.equal('POLARIS PUH 5903');
  });

  it('should return second part of string after first space based on filters chain', () => {
    let adapter = new ConfigHandler();
    let string = adapter
      .processFilters('Aircl/humid POLARIS PUH 5903', {"__filter": ["replace:/\\s/, ~", "split:~", "pop"]});

    expect(string).to.equal('POLARIS PUH 5903');
  });
});