let chai = require('chai');
let expect = chai.expect;
let Helper = require('../../../../adapter/helper/filter-in-stock');

describe('Helper: InStock Filter', () => {

  it('filter: should map values in correct way', () => {
    let helper = new Helper({}, {
      "map": {
        "есть": 1,
        "нет": 0,
      }
    });

    let is1 = helper.filter('есть');
    let is2 = helper.filter('нет');
    let is3 = helper.filter('ожидается');

    expect(is1).to.equal(1);
    expect(is2).to.equal(0);
    expect(is3).to.equal(0);
  });

  it('filter: should change default value in correct way', () => {
    let helper = new Helper({}, {
      "map": {
        "есть": 1,
        "нет": 0,
        "__default": 1
      }
    });

    let is1 = helper.filter('есть');
    let is2 = helper.filter('нет');
    let is3 = helper.filter('ожидается');

    expect(is1).to.equal(1);
    expect(is2).to.equal(0);
    expect(is3).to.equal(1);
  });


});