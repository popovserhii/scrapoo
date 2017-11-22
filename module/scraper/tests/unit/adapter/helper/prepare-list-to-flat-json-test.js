const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs');
const Helper = require('../../../../adapter/helper/prepare-list-to-flat-json');

describe('Helper: Prepare List To Flat Json', () => {
  it('prepare: should complex convert html list to flat', () => {
    let html = fs.readFileSync(__dirname + '/../../../data/category.html').toString();

    let helper = new Helper();
    let json = helper.prepare(html);

    expect(json).to.be.an('object')
      .to.deep.include({ 'Автозапчастини': { name: 'Автозапчастини', parent: 'Авто і Мото', "listCategory": 1289 }})
      .to.deep.include({ 'Диктофони': { name: 'Диктофони', parent: 'Оргтехніка' }})
    ;
  });
  it('prepare: should convert simple html list to flat', () => {
    let html = fs.readFileSync(__dirname + '/../../../data/category-2.html').toString();

    let helper = new Helper();
    let json = helper.prepare(html);

    expect(json).to.be.an('object')
      .to.deep.include({ 'Автозапчастини': { name: 'Автозапчастини', parent: 'Автозапчастини' }})
      .to.deep.include({ 'Холодильники': { name: 'Холодильники', parent: 'Велика побутова техніка' }})
    ;
  });

});