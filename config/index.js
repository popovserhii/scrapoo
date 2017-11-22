const path = require('path');
const globby = require('globby');
const configly = require('configly');

// advanced usage @link https://www.npmjs.com/package/configly
// example @link http://www.javascriptexamples.info/search/node-js-synchronous/10
module.exports = configly([path.join(__dirname), path.join(__dirname, 'autoload')], {
  files: configly.files.concat(globby.sync([path.join(__dirname, 'autoload/*.*')]).map(filename => {
    return path.basename(filename, path.extname(filename));
  }))
});