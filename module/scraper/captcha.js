const cheerio = require('cheerio');
const Nightmare = require('nightmare');

let nightmare = Nightmare({
  show: true, webPreferences: {
    webSecurity: false
  }
});

let resolveCaptcha = async function() {
  let result = await nightmare
    .goto('http://hotline.ua')
    .wait(3000)
    .exists('#g-recaptcha')
    .evaluate(function (result) {
      if (result) {
        // @link https://stackoverflow.com/a/37690757/1335142
        let iframe = document.querySelector('#g-recaptcha iframe');
        let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
        iframeDocument.querySelector('#recaptcha-anchor').click();

        nightmare.exists('#g-recaptcha')
          .evaluate(function (result) {
            while (result) {

            }
          });
      }
    });
    /*.evaluate(function () {
      return $("#g-recaptcha iframe").contents().find("body").html();
    });*/

  console.log(result);

  let response = await nightmare
    .goto('http://hotline.ua')
    .exists('#g-recaptcha')
    .then(function (result) {
      console.log(result)
      if (result) {
        return nightmare
          .click('#g-recaptcha')
          .wait(5000);
      } else {
        console.log("Could not find selector")
      }
    });

  console.log(response);

}

resolveCaptcha();