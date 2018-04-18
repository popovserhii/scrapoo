const cheerio = require('cheerio');
const _ = require('lodash');
const Nightmare = require('nightmare');

let nightmare = Nightmare({
  show: true,
  webPreferences: {
    webSecurity: false
  }
});

class Mega {

  async run() {
    let catalogUrl = await nightmare
        .goto('https://megamuscle.ua/admin')
        .wait()
        .type('#username', 'Roman')
        .type('#login', 'Roman2016')
        .click('#loginForm .form-button')
        .wait(3000)
        /*.then(() => {
           let ex = nightmare.exists('#nav li.level0:nth-child(3) ul .level1:first-child a')
               .then((ex) => {
               console.log(ex);

             })
             ;

            nightmare
             .inject('js', 'node_modules/jquery/dist/jquery.js') // Look here!
             .click('#nav li.level0:nth-child(3) ul .level1:first-child a');
           console.log('-------------00');
        })*/
        .evaluate(function() {
          var el = document.querySelector("#nav li.level0:nth-child(3) ul .level1:first-child a").href;
          //var el = document.querySelector("#nav").getAttribute('id');
          return el;
          //return jQuery('#nav li.level0:nth-child(3) ul .level1:first-child').attr('href');
          /*return {
            name: $('.downloadItemTitle').text().trim(),
            href: $('.downloadGo').prop('href').trim()
          };*/

        }/*, function(result){
          // now we're inside Node scope again
          console.log( result);
        }*/)
        /*.then(async function(result) {
          console.log(result);
          return nightmare
            .goto(result)
            .wait()
            .click('[title="Следующая страница"]')
            .wait(2000)

        }).then((result) => {
          console.log('bu vu');
      });*/

        let nextPage = nightmare
          .goto(catalogUrl)
          .type('.pager input[name="page"]', '')
          .type('.pager input[name="page"]', 38)
          .type('.pager input[name="page"]', '\u000d')
          //.type('body','\u000d')
          //.click('[title="Найти"]')
          .wait(5000)
          .exists('[title="Следующая страница"]');
        await this.processCatalogPage();

        let urls = [];
        while (nextPage) {
          nightmare
            .click('[title="Следующая страница"]')
            .wait(2000);

          let _url = await this.processCatalogPage();

          //urls = _.merge(urls, _url);
          urls = urls.concat(_url);

          //console.log(urls);


          nextPage = nightmare.exists('[title="Следующая страница"]');

        }


    //console.log(catalogUrl);
    //console.log(urls.length);
  }

  async processCatalogPage() {
    let urls = await nightmare
      //.goto(catalogUrl)
      //.wait()
      .evaluate(function () {
        //var el = document.querySelectorAll('tbody tr').href;
        //var el = document.querySelector("#nav").getAttribute('id');
        //return el;

        return Array.from(document.querySelectorAll('#productGrid_table tbody tr')).map(function (tr) {
          return tr.title;
        })
      });


    //console.log(urls);
    for (let i = 0; i < urls.length; i++){
      await this.processProductPage(urls[i]);
    }

    return urls;
  }

  async processProductPage(url) {
    console.log(url);

    nightmare
      .goto(url)
      .wait()
      .click('[title="Prices"]')
    //.click('[title="Следующая страница"]')
    //.wait(3000)

    let checkedValues = await nightmare
      .evaluate(function () {
        //var el = document.querySelectorAll('tbody tr').href;
        //var el = document.querySelector("#nav").getAttribute('id');
        //return el;

        return {
          "price": parseFloat(document.querySelector('#price').value),
          "specialPrice": parseFloat(document.querySelector('#special_price').value),
          "specialFromDate": document.querySelector('#special_from_date').value
        }
      });

    //if (!checkedValues.specialFromDate && checkedValues.specialPrice > 0) {
    if (!checkedValues.specialFromDate) {
      if (checkedValues.specialPrice === checkedValues.price) {
        console.log('checkedValues.specialPrice === checkedValues.price');
        await nightmare.type('#special_price', '');
      } else if (checkedValues.specialPrice < checkedValues.price) {
        console.log('checkedValues.specialPrice < checkedValues.price')
        await nightmare.type('#special_from_date', '0');
      }
    } else {
      if (checkedValues.specialPrice === checkedValues.price) {
        console.log('checkedValues.specialPrice === checkedValues.price');
        await nightmare.type('#special_price', '');
      }
    }

    let button = await nightmare
      //.wait()
      //.exists('[title="Save and Continue Edit"]')
      //.click('[title="Save and Continue Edit"]')
      .click('[title="Сохранить"]')
      .wait(3000);

    //console.log(button);
    //console.log(checkedValues);

    /*checkedValues = await nightmare
      .evaluate(function () {
        //var el = document.querySelectorAll('tbody tr').href;
        //var el = document.querySelector("#nav").getAttribute('id');
        //return el;

        return {
          "price": parseFloat(document.querySelector('#price').value),
          "specialPrice": parseFloat(document.querySelector('#special_price').value),
          "specialFromDate": document.querySelector('#special_from_date').value
        }
      });

    console.log(checkedValues);*/
  }
}

(async function() {
  let mega = new Mega();
  await mega.run();
})();