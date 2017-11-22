let chai = require('chai');
let expect = chai.expect;
let Helper = require('../../../../adapter/helper/filter-price');

describe('Helper: Price Filter', () => {
  it('filter: should convert any human readable number to float', () => {
    let helper = new Helper();
    let price1 = helper.filter('556');
    let price2 = helper.filter('556,65');
    let price3 = helper.filter('556.65');
    let price4 = helper.filter(556.65);

    expect(price1).to.equal(556);
    expect(price2).to.equal(556.65);
    expect(price3).to.equal(556.65);
    expect(price4).to.equal(556.65);
  });

  it('filter: should return recommended price if first element > 0', () => {
    let helper = new Helper();
    let price = helper.filter(['556', '255']);

    expect(price).to.equal(556);
  });

  it('filter: should return purchase price if recommended <= 0', () => {
    let helper = new Helper();
    let price = helper.filter(['0', '', '255']);

    expect(price).to.equal(255);
  });

  it('filter: should subtract number taken from config pattern to recommended price', () => {
    let helper = new Helper({}, {
      "apply": {0: "-6"},
    });
    let price = helper.filter([556, '255']);

    expect(price).to.equal(550);
  });

  it('filter: should add number taken from config pattern to price', () => {
    let helper = new Helper({}, {
      "apply": "+6",
    });
    let price = helper.filter(556);

    expect(price).to.equal(562);
  });

  it('filter: should add percent taken from config pattern to price', () => {
    let helper = new Helper({}, {
      "apply": "+20%",
    });
    let price = helper.filter(1000);

    expect(price).to.equal(1250);
  });

  it('filter: should subtract percent taken from config pattern to price', () => {
    let helper = new Helper({}, {
      "apply": "-12%",
    });
    let price = helper.filter(1000);

    expect(price).to.equal(863.6363636363637);
  });

  it('filter: should not correlated price will be lower than min rate', () => {
    let helper = new Helper({}, {
      "apply": "-12%",
      "minRate": 150
    });
    let price = helper.filter(100);

    expect(price).to.equal(100);
  });

});