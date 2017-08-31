let chai = require('chai');
let expect = chai.expect;
let Helper = require('../../../../adapter/helper/prepare-base-url');

describe('Helper: Prepare Base Url', () => {
  it('should return full url based on string location', () => {
    let helper = new Helper();
    let urlPath = helper
      .setOption('location', 'http://example.com')
      .prepare('/img/2.jpg');

    expect(urlPath).to.equal('http://example.com/img/2.jpg');
  });

  it('should return full url based on object location', () => {
    let location = {
      protocol: "http:",
      host: "example.com"
    };
    let helper = new Helper();
    let urlPath = helper
      .setOption('location', location)
      .prepare('/img/2.jpg');

    expect(urlPath).to.equal('http://example.com/img/2.jpg');
  });

  it('should throw Error if location option is not set', () => {
    let helper = new Helper();

    expect(() => helper.prepare('/img/2.jpg')).to.throw(Error);
  });
});