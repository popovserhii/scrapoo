require('app-module-path').addPath(__dirname + '/module');

const cheerio = require('cheerio');
const _ = require('lodash');

const { Chromeless } = require('chromeless');
let browser = new Chromeless(/*config*/);

/*const Nightmare = require('nightmare');
let browser = Nightmare({
  show: true,
  webPreferences: {
    webSecurity: false
  }
});*/


const AUTH_USER = 'perfekt_IT';
const AUTH_PASS = 'AELRgX6hem1';
const START_URL = 'https://wholesale.yugcontract.ua/';
const URL = 'https://wholesale.yugcontract.ua/sales/';
const DATE_FROM = '01.12.2017';
const DATE_TO = '31.12.2017';
const FILE_OUTPUT = 'data/shop-it/south-contract/december_up.xlsx';

class South {

  async run() {
    let none = await browser
      .goto(START_URL)
      //.wait(3000)

      .type(AUTH_USER, 'input[name="user_login"]')
      .type(AUTH_PASS, 'input[name="user_password"]')
      .click('input[type="submit"]')
      .wait(1000)

      .goto(URL)
      //.wait(3000)
      .type(DATE_FROM, '#current_sale_datefrom')
      .type(DATE_TO, '#current_sale_dateto')
      .focus('#search_string input[name="search_string"]')
      .click('#calc')
      //.press(13)
      .wait(2000)
      .evaluate(function () {
        console.log(jQuery('#calc'));
        jQuery('#calc').click();
        //return document.body.innerHTML
      });

    let nextPage = await browser
    //.goto(catalogUrl)
    //.type('.pager input[name="page"]', '')
    //.type('.pager input[name="page"]', 38)
    //.type('.pager input[name="page"]', '\u000d')
    //.wait(5000)
      .exists('.pagination-next');

    //await this.processCatalogPage();
    await this.processListPage();

    let urls = [];
    while (nextPage) {
      await browser
        .click('.pagination-next')
        .wait(2000);

      //await this.processCatalogPage();
      await this.processListPage();
      nextPage = await browser.exists('.pagination-next');
    }

    await browser.end();
    await this.getOutput()._persist('Sheet1');
    await this.getOutput()._save();
  }

  async processListPage() {
    let info = await browser
      .evaluate(async function () {
        let result = $('#documents-container-s .top-shift').html();
        //jQuery('.popup-box .x').click();

        return result;
      });

    this.$ = cheerio.load(info);

    await this.getOutput().send(this.convertTable('table'));
  }

  async processCatalogPage() {
    let docIds = await browser
    //.goto(catalogUrl)
    .wait(2000)
      .evaluate(function () {
        return Array.from(document.querySelectorAll('#documents-container table .document_details')).map(function (a) {
          return a.getAttribute('doc_id');
        })
      });

    //console.log(urls);
    for (let i = 0; i < docIds.length; i++) {
      await this.processProductPage(docIds[i]);
    }

    return docIds;
  }

  async processProductPage(docId) {
    console.log(docId);

      await  browser
      //.wait(3000)
      .click(`.document_details[doc_id="${docId}"] img`)
      //  .wait(3000);

    let info = await  browser
      //.wait(3000)
      .evaluate(async function (docId) {
        function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
        //console.log(jQuery(`[doc_id="${docId}"]`));
        jQuery(`.document_details[doc_id="${docId}"] img`).click();

        await sleep(2000);

        //return document.body.innerHTML;

        //let result = document.querySelectorAll('.popup-box-wrapper .document-box').innerHTML;
        let result = $('.popup-box-wrapper .document-box .document-item').html();

        jQuery('.popup-box .x').click();

        return result;
      }, docId)

    let $ = cheerio.load(info);
    //let size


    let fields = {};
    $('.document_label').each((i, val) => {
      let elm = $(val);
      fields[elm.text().trim()] = elm[0].nextSibling.nodeValue.trim();
    });

    $('table tr').each((i, tr) => {
      let elm = $(tr);
      if (0 === i) {
        elm.find('th').each((i, td) => {
          let elm = $(td);
          headNames[elm.index()] = elm.text().trim();
        });
      } else if (!elm.is(':last-child')) {
        let product = _.merge({}, fields);
        elm.find('td').each((i, val) => {
          let elm = $(val);
          let name = headNames[elm.index()];
          product[name] = elm.text().trim();
        });
        products.push(product);
      }
    });

    await this.getOutput().send(products);
  }

  convertTable(tableSelector, fields = {}) {
    let headNames = [];
    let products = [];

    this.$(tableSelector + ' tr').each((i, tr) => {
      let elm = this.$(tr);
      if (0 === i) {
        elm.find('th').each((i, td) => {
          let elm = this.$(td);
          headNames[elm.index()] = elm.text().trim();
        });
      } else /*if (!elm.is(':last-child'))*/ {
        let product = _.merge({}, fields);
        elm.find('td').each((i, val) => {
          let elm = this.$(val);
          let name = headNames[elm.index()];
          product[name] = elm.text().trim();
        });
        products.push(product);
      }
    });

    return products;
  }

  getOutput() {
    if (!this._output) {
      let Output = require('scraper/output/xlsx');

      this._output = new Output({
        "path": FILE_OUTPUT,
        "options": {
          "dateable": false
        }
      });
    }

    return this._output;
  }
}

(async function() {
  let mega = new South();
  await mega.run();
})();