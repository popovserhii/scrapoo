const globby = require('globby');
const fs = require('fs');
const s = require('sprintf-js');
const Scraper = require('scraper/scraper');

class Communicator {

  getScrapedFiles(sourceName) {
    let dir = s.sprintf('data/scraped/%s/', sourceName);

    return fs.readdirSync(dir)
      .map(function(v) {
        return {
          name: v,
          time: fs.statSync(dir + v).mtime.getTime()
        };
      })
      .sort(function(a, b) { return b.time - a.time; })
      .map(function(v) {
        return dir + v.name;
      });
  }

  async scrap(sourceName) {
    let scraper = new Scraper();
    await scraper.run(sourceName);

    return scraper.getNamedSource(sourceName).output.pathname;
  }
}

module.exports = Communicator;