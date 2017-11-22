const chai = require('chai');
const expect = chai.expect;
const path = require('path');
const fs = require('fs');
const Helper = require('../../../../adapter/helper/prepare-find-merge');

describe('Helper: Prepare Find some json object and Merge new value', () => {

  it('prepare: should find "Посуд" and replace parent to empty', () => {
    let helper = new Helper();
    let json = helper.prepare({"Посуд": {"name": "Посуд", "parent": "Все для дому"}}, {"name": "Посуд"}, {"parent": ""});

    expect(json).to.be.an('object')
      .to.deep.include({"Посуд": {"name": "Посуд", "parent": ""}})
    ;
  });

  it('prepare: should find and decode json params such as find-merge:{name:"Посуд"},{parent:""}', () => {

    let helper = new Helper();
    let json = helper.prepare({"Посуд": {"name": "Посуд", "parent": "Все для дому"}}, "{name:'Посуд'}", "{parent:''}");

    expect(json).to.be.an('object')
      .to.deep.include({"Посуд": {"name": "Посуд", "parent": ""}})
      //.to.deep.include({ 'Диктофони': { name: 'Диктофони', parent: 'Оргтехніка' }})
    ;
  });

});