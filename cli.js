require('app-module-path').addPath(__dirname + '/module');

const Converter = require('scraper/converter');

class Cli {

  async run() {
    let converter = new Converter();
    await converter.run('south-defect', 'Дефект уп-ки Акция!');
    await converter.save();
  }

}

let cli = new Cli();
cli.run();