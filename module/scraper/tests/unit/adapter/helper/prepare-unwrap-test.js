const chai = require('chai');
const expect = chai.expect;
const Helper = require('../../../../adapter/helper/prepare-unwrap');

describe('Helper: Prepare Unwrap', () => {

  it('prepare: should unwrap all <a> by default', () => {
    let html = '<dl class="features-list">' +
      '<dd><a href="https://example.com/brand/lenovo.html">Lenovo</a></dd>' +
      '<dd><a href="https://example.com/brand/samsung.html">Samsung</a></dd>' +
      '</dl>';

    let helper = new Helper();
    let unwraped = helper.prepare(html);

    expect(unwraped).to.be.eql('<dl class="features-list">' +
      '<dd>Lenovo</dd>' +
      '<dd>Samsung</dd>' +
      '</dl>');
  });
});