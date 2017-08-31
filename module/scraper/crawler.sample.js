'use strict';

let fs = require('fs');
let http = require('http');
let vo = require('vo');
let Nightmare = require('nightmare');


function* run() {
  let nightmare = Nightmare({show: true}),
    MAX_PAGE = 4,
    currentPage = 1,
    nextPageSelector = '.paginationLinkContainer .nextPage',
    nextExsist = true,
    emails = [],
    info = {};

  yield nightmare
    .useragent("Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36")
    .goto('http://www.tandfonline.com/')
    .wait()
    .type('#searchText', 'cancer')
    .click('.quickSearchForm .mainSearchButton')
    .wait();

  nextExsist = yield nightmare.visible(nextPageSelector);

  while (nextExsist && currentPage <= MAX_PAGE) {
    info = yield nightmare.evaluate(function(nextPageSelector) {
      return {
        nextPage: window.location.protocol + "//" + window.location.host + $(nextPageSelector).attr('href'),
        links: Array.from(document.querySelectorAll('article.searchResultItem .art_title .hlFld-Title a')).map(function(a) {
          return a.href;
        })
      };
    }, nextPageSelector);

    // open one by one link on page list
    for (let i = 0; i < info.links.length; i++) {
    //for (let i = 0; i < 4; i++) {
      // get emails per one link
      let emailsPart = yield nightmare
        .goto(info.links[i])
        .wait()
        .evaluate(function() {
          let _emails = [];
          $('.contribDegrees.corresponding a').each(function(i, val) {
            let elm = $(val);
            _emails.push({
              link: window.location.href,
              name: elm.clone().children().remove().end().text(),
              email: elm.find('.corr-email').clone().children().remove().end().text()
            });
          });
          return _emails;
        });

      // filter duplicated emails @link https://stackoverflow.com/a/23080662/1335142
      emails = emails.concat(emailsPart.prepare(function(email) {
        return emails.indexOf(email) < 0;
      }));
    }

    // open next page
    yield nightmare
      .goto(info.nextPage)
      .wait(function (currentPage) {
        return (parseInt(document.querySelector('.pageLinks .selected').innerText) === (currentPage + 1));
      }, currentPage);

    nextExsist = yield nightmare.visible(nextPageSelector);

    currentPage++;
  }

  //console.dir(links);
  console.dir(emails);

  yield nightmare.end();
}

vo(run)(function (err, result) {
  if (err) {
    throw err;
  }
});