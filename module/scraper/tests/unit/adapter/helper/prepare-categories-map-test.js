let chai = require('chai');
let sinon = require('sinon');
let expect = chai.expect;
//let File = require('../../../../source/file');
let Helper = require('../../../../adapter/helper/prepare-categories-map');

const consts = {};
describe('Helper: Prepare Categories Map', () => {

  before(() => {
    consts.categories = {
      "Фотоапарати, відеокамери": {
        "listCategory": 458,
        "name": "Фотоапарати, відеокамери",
        "parent": "ТВ, Аудіо, Відео, Фото"
      },
      "Сумки, футляри, кофри для фото і відео": {
        "name": "Сумки, футляри, кофри для фото і відео",
        "parent": "Фотоапарати, відеокамери"
      },
      "Ноутбуки, планшети, електронні книги": {
        "listCategory": 3,
        "name": "Ноутбуки, планшети, електронні книги",
        "parent": "Комп'ютери, Мережі"
      },
      "Сумки, чохли для ноутбуків": {
        "name": "Сумки, чохли для ноутбуків",
        "parent": "Ноутбуки, планшети, електронні книги"
      },
      "Туризм, кемпінг": {
        "listCategory": 1280,
        "name": "Туризм, кемпінг",
        "parent": "Туризм, Риболовля"
      },
      "Свердлильний електроінструмент": {
        "listCategory": 3715,
        "name": "Свердлильний електроінструмент",
        "parent": "Інструменти"
      },
      "Свердла, бури, свердлильні коронки": {
        "name": "Свердла, бури, свердлильні коронки",
        "parent": "Свердлильний електроінструмент"
      },
      "Шурупокрути": {
        "name": "Шурупокрути",
        "parent": "Свердлильний електроінструмент"
      },
    };
  });


  it('prepare: simple category resolving', () => {
    consts.categoriesMap  = {"АКСЕССУАРЫ/Аксессуары к сумкам": "Сумки, футляри, кофри для фото і відео"};

    let helper = new Helper({}, consts);
    let categoriesTree = helper.prepare(["АКСЕССУАРЫ", "Аксессуары к сумкам"]);

    expect(categoriesTree).to.eql([
      "ТВ, Аудіо, Відео, Фото",
      "Фотоапарати, відеокамери",
      "Сумки, футляри, кофри для фото і відео"
    ]);
  });

  it('prepare: simple category resolving with escaped symbols', () => {
    consts.categoriesMap  = {"АКСЕССУАРЫ/17\" и более": "Сумки, чохли для ноутбуків",};

    let helper = new Helper({}, consts);
    let categoriesTree = helper.prepare(["АКСЕССУАРЫ", "17\" и более"]);

    expect(categoriesTree).to.eql([
      "Комп'ютери, Мережі",
      "Ноутбуки, планшети, електронні книги",
      "Сумки, чохли для ноутбуків"
    ]);
  });

  it('prepare: category resolving with parent path', () => {
    consts.categoriesMap  = {"АКСЕССУАРЫ/Рюкзаки для активного отдыха": "Туризм, кемпінг/Рюкзаки"};

    let helper = new Helper({}, consts);
    let categoriesTree = helper.prepare(["АКСЕССУАРЫ", "Рюкзаки для активного отдыха"]);

    expect(categoriesTree).to.eql([
      "Туризм, Риболовля",
      "Туризм, кемпінг",
      "Рюкзаки"
    ]);
  });

  it('prepare: category resolving depend on keywords', () => {
    consts.categoriesMap = {
      "ИНСТРУМЕНТЫ/Аксессуары": {
        "cверлo": "Свердла, бури, свердлильні коронки",
        "*": "Шурупокрути",
      }
    };

    //let source = new File({}, {});
    let source = {getField: () => {}}; // like File
    //source.source = {scan: () => {}};
    let getFieldStub = sinon.stub(source, 'getField');
    getFieldStub.withArgs('name')
      .onFirstCall().returns('Акс.інстр DeWALT Cверлo EXTREME2 HSS-G по металлу 10.5х84x133мм.')
      .onSecondCall().returns('Stenly Шурупокрут HSS-G по металлу')
    ;

    let helper = new Helper(source, consts);

    let categoriesTreeFirst = helper.prepare(["ИНСТРУМЕНТЫ", "Аксессуары"]);
    expect(categoriesTreeFirst).to.eql([
      "Інструменти",
      "Свердлильний електроінструмент",
      "Свердла, бури, свердлильні коронки"
    ]);

    let categoriesTreeSecond = helper.prepare(["ИНСТРУМЕНТЫ", "Аксессуары"]);
    expect(categoriesTreeSecond).to.eql([
      "Інструменти",
      "Свердлильний електроінструмент",
      "Шурупокрути"
    ]);
  });
});