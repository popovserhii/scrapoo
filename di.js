require('app-module-path').addPath(__dirname + '/module');

const ContainerBuilder = require('node-dependency-injection').ContainerBuilder;
const JsFileLoader = require('node-dependency-injection').JsFileLoader;

let container = new ContainerBuilder();
let loader = new JsFileLoader(container);
loader.load(__dirname + '/config/modules.js');


// set container itself
let containerDef = container.register('container');
containerDef.synthetic = true;
container.set('container', container);

// set config itself
let configDef = container.register('config');
configDef.synthetic = true;
container.set('config', require('./config'));


let sourceFactory = container.get('sourceFactory');

sourceFactory.create('file', 'south-contract-category');

//container.register('mailer', Mailer);

console.log(container.get('mailer'));

