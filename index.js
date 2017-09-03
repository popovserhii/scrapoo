require('app-module-path').addPath(__dirname + '/module');
const Communicator = require('scraper/web/communicator');
const express = require('express');
const app = express();
const port = 1337;

let com = new Communicator();

app.use('/data', express.static('data'));

app.get('/api/sources', (request, response) => {
  let sources = ['cheapbasket', 'supermarketcy', 'supermarketcy-en'];

  let host = request.protocol + '://' + request.get('x-forwarded-host');
  let json = [];

  console.log(host);

  sources.map(name => {
    let paths = com.getScrapedFiles(name);
    let source = {
      name: name,
      files: paths.map(path => {
        return {
          name: path.split('/').pop(),
          url: (host + '/' + path).replace(/\\/g,"/")
        };
      })
    };
    json.push(source);
  });

  response.json(json);
});

app.get('/api/sources/:source', async (request, response) => {
  let sourceName = request.params.source;
  let scrapedFile = await com.scrap(sourceName);
  scrapedFile = scrapedFile.replace(/\\/g,"/");
  //console.log(scrapedFile);
  let host = request.protocol + '://' + request.get('x-forwarded-host');
  let source = {
    name: sourceName,
    files: [{
      name: scrapedFile.split('/').pop(),
      url: (host + '/' + scrapedFile)
    }]
  };

  response.json(source);
});


app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})