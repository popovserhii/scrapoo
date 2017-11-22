const cheerio = require('cheerio');
let URL = require('url');
let _ = require('lodash');
let s = require('sprintf-js');
const Abstract = require('scraper/adapter/abstract');

class HotlineUa  extends Abstract {

  constructor(nightmare, config) {
    super(nightmare, config);
    this.$ = {};
    //this.helpers = [];
    //this.currField = '';
  }

  /*get currFieldConfig() {
    return this.config.fields[this.currField];
  }*/


  async scan(searchable) {
    this.location = URL.parse(this.config.url);

    for (let key of searchable) {
      let searchKey = encodeURIComponent(key);
      let searchUrl = s.sprintf(this.config.url, searchKey);

      //console.log('Start searchable iterate...');
      await this.nightmare.goto(searchUrl);

      await this.resolveCaptcha();
      //console.log('Pass captcha...');

      let response = await this.nightmare
        //.goto(searchUrl)
        //.goto('http://hotline.ua/sr/autocomplete/?term=MPXQ2')
        .wait()
        .evaluate(function () {
          //return JSON.parse(document.body.innerText)
          //return document.body.innerText
          return document.body.innerHTML
        });


      //response = JSON.parse(response);
      //console.log('---------------00000000000-------------');
      //console.log(this.config);
      //console.log(response);

      let $ = this.$ = cheerio.load(response);
      let href = $('.description-box .description-box-in + div > a, .product-item .info-description .h4 a').first().attr('href');

      //console.log(href);

      if (!href || !href.length) {
        continue;
      }

      //console.log(this.config)

      // take only first element from response
      //let url = this.location.href + href;
      let url = this.location.protocol + "//" + this.location.host + href;

      let wait = Math.floor(Math.random() * (4 - 3 + 1)) + 2; // dynamic wait: 2-8 seconds
      let body = await this.nightmare
        .goto(url)
        .click(this.config.action.click)
        .wait(wait * 1000)
        //.wait('#r1-0 a.result__a')
        .evaluate(function () {
          return document.body.innerHTML;
        });


      //this.baseUrlHelper = new PrepareBaseUrl().setOption('location', this.location);
      //console.log(body);

      this.configHandler.getHelper('base-url', 'prepare').setConfig('location', this.location);

      return this.getFields(body);
    }

    return false;
  }

  async resolveCaptcha() {
    // first step try to click on recaptcha

    //console.log('hotline-ua83');

    /*let currHref = await this.nightmare.evaluate(() => {
      return window.location.href;
    });*/
    //let currHref = await this.nightmare.goto('http://hotline.ua').exists('body');
    /*let currHref = await this.nightmare.wait(100).url();
    if (!currHref) {
      return true;
    }*/


    let captchaExists = await this.nightmare.exists('#g-recaptcha');

    //console.log('hotline-ua89', captchaExists);

    if (!captchaExists) {
      return;
    }

    let url = await this.nightmare.url();
    //console.log('hotline-ua106', url);


    //try {
    let result = await this.nightmare
      .wait(4000)
      .evaluate(function () {
        // @link https://stackoverflow.com/a/37690757/1335142
        let iframe = document.querySelector('#g-recaptcha iframe');
        let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        iframeDocument.querySelector('#recaptcha-anchor').click();
      });

    //console.log('hotline-ua126', result);

    captchaExists = await this.nightmare.wait(5000).exists('#g-recaptcha');

    // second step if recaptcha hasn't been resolved wait for human
    while (captchaExists) {
      console.log('Waiting human interaction...');
      captchaExists = await this.nightmare.wait(10000).exists('#g-recaptcha');
    }

    //console.log('Something went wrong...');

  }
}

module.exports = HotlineUa;