require('app-module-path').addPath(__dirname + '/module');
const Scraper = require('scraper/scraper');

let scraper = new Scraper();
scraper.run();