let chai = require('chai');
let expect = chai.expect;
let Helper = require('../../../../adapter/helper/filter-replace');

describe('Helper: Replace Filter', () => {
  it('filter: should return string with replaced first space to ~ (tilda)', () => {
    let helper = new Helper();
    let string = helper
      //.setOption('location', 'http://example.com')
      .filter('Aircl/humid POLARIS PUH 5903', / /, '~');

    expect(string).to.equal('Aircl/humid~POLARIS PUH 5903');
  });
});