let chai = require('chai');
let expect = chai.expect;
let Helper = require('../../../../adapter/helper/filter-guaranty');

describe('Helper: Guarantee Filter', () => {

  it('filter: should convert days to months', () => {
    let helper = new Helper({}, {
      "convertTo": "month",
      "map": {
        "day": [
          "(\\d+) день",
          "(\\d+) днів",
          "(\\d+) д.",
          "(\\d+) д",
        ],
      }
    });

    let oneMonth = helper.filter('30 днів');
    let twoMonth = helper.filter('60 д.');
    let threeMonth = helper.filter('90 д');
    let oneAndHalfMonth = helper.filter('45 днів');

    expect(oneMonth).to.equal(1);
    expect(twoMonth).to.equal(2);
    expect(threeMonth).to.equal(3);
    expect(oneAndHalfMonth).to.equal(1.5);
  });

  it('filter: should convert days to years', () => {
    let helper = new Helper({}, {
      "convertTo": "year",
      "map": {
        "day": [
          "(\\d+) д",
        ],
      }
    });

    let oneYear = helper.filter('365 днів');
    let twoYear = helper.filter('730 д.');

    expect(oneYear).to.equal(1);
    expect(twoYear).to.equal(2);
  });

  it('filter: should convert months to days', () => {
    let helper = new Helper({}, {
      "convertTo": "day",
      "map": {
        "month": [
          "(\\d+) м",
        ],
      }
    });

    let sixtyDays = helper.filter('2 місяці');
    let thirtyDays = helper.filter('1 м');

    expect(sixtyDays).to.equal(60);
    expect(thirtyDays).to.equal(30);
  });

  it('filter: should convert months to years', () => {
    let helper = new Helper({}, {
      "convertTo": "year",
      "map": {
        "month": [
          "(\\d+) м",
        ],
      }
    });

    let oneYear = helper.filter('12 місяців');
    let oneAndHalfYear = helper.filter('18 м');

    expect(oneYear).to.equal(1);
    expect(oneAndHalfYear).to.equal(1.5);
  });

  it('filter: should convert years to days', () => {
    let helper = new Helper({}, {
      "convertTo": "day",
      "map": {
        "year": [
          "(\\d+) р",
        ],
      }
    });

    let oneYear = helper.filter('1 рік');
    let twoYears = helper.filter('2 роки');

    expect(oneYear).to.equal(365);
    expect(twoYears).to.equal(730);
  });

  it('filter: should convert years to months', () => {
    let helper = new Helper({}, {
      "convertTo": "month",
      "map": {
        "year": [
          "(\\d+) р",
        ],
      }
    });

    let oneYear = helper.filter('1 рік');
    let fourYears = helper.filter('4 р.');

    expect(oneYear).to.equal(12); // month
    expect(fourYears).to.equal(48); // month
  });

  it('filter: should convert years, months and days to month', () => {
    let helper = new Helper({}, {
      "convertTo": "month",
      "map": {
        "year": [
          "(\\d+) р",
        ],
        "month": [
          "(\\d+) м",
        ],
        "day": [
          "(\\d+) д.",
        ],
      }
    });

    let oneYear = helper.filter('2 роки');
    let fourMonths = helper.filter('4 місяців');
    let ninetyDays = helper.filter('45 д.');

    expect(oneYear).to.equal(24); // month
    expect(fourMonths).to.equal(4); // month
    expect(ninetyDays).to.equal(1.5); // month
  });

  it('filter: should throw error when converter not found', () => {
    let helper = new Helper({}, {
      "convertTo": "unknown",
      "map": {
        "year": [
          "(\\d+) р",
        ],
      }
    });

    expect(() => { helper.filter('2 роки'); }).to.throw();
  });

});