const ContainerBuilder = require('node-dependency-injection').ContainerBuilder;
const JsFileLoader = require('node-dependency-injection').JsFileLoader;

class App {
  static init(paths) {
    let container = new ContainerBuilder();
    let loader = new JsFileLoader(container);
    loader.load(paths.modules);


    // set container itself
    let containerDef = container.register('container');
    containerDef.synthetic = true;
    container.set('container', container);

    // set config itself
    let configDef = container.register('config');
    configDef.synthetic = true;
    container.set('config', require(paths.config));

    return container;
  }
}

module.exports = App;