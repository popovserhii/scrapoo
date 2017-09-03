require('app-module-path').addPath(process.cwd() + '/module');

let chai = require('chai');
let sinon = require('sinon');
let expect = chai.expect;
let fs = require('fs');
//let File = require('scraper/source/file');
let Communicator = require('scraper/web/communicator');
//let Csv = require('scraper/output/csv');

describe('Communicator', () => {
  it('getScrapedFiles: should return array with file paths', async() => {

    let com = new Communicator();

    let paths = await com.getScrapedFiles('cheapbasket');
    expect(paths).to.be.an('array');
  });
});