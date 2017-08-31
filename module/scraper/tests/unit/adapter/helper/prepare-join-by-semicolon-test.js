let chai = require('chai');
let expect = chai.expect;
let Helper = require('../../../../adapter/helper/prepare-join-by-semicolon');

describe('Helper: Prepare Join By Semicolon', () => {
  it('prepare: should join array by semicolon and return string', () => {
    let images = ['http://example.com/img.jpg', 'http://example.com/img_1.jpg', 'http://example.com/img_2.jpg'];
    let helper = new Helper();
    let joined = helper
      //.setOption('location', 'http://example.com')
      .prepare(images);

    expect(joined).to.equal('http://example.com/img.jpg;http://example.com/img_1.jpg;http://example.com/img_2.jpg');
  });

});