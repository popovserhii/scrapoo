const cheerio = require('cheerio');
const Nightmare = require('nightmare');

let nightmare = Nightmare({
  show: true,
  webPreferences: {
    webSecurity: false
  }
});

let resolveCaptcha = async function() {
  let result = await nightmare
    .goto('http://hotline.ua')
    .wait(3000)
    .url();

  console.log(result);


  let captchaExists = false;
  while (!captchaExists) {
    //console.log('Waiting human interaction...');
    //await nightmare.wait(10000).goto('http://hotline.ua/bt-vytyazhki/gorenje-dk63clb');

    console.log('Waiting human interaction...');
    captchaExists = await nightmare.wait(10000).exists('#g-recaptcha');
  }

  console.log('Something went wrong...');

};

resolveCaptcha();