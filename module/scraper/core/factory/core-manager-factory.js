class CoreManagerFactory {
  /*constructor(container) {
    this._container = container;
  }*/

  static create(container, name) {
    let configer = container.get('configer');
    let managerName = name.split('/').pop();
    let config = configer.manageConfig(managerName);

    let factory = container.get(managerName + 'Factory');
    let Manager = require(name);
    let manager = new Manager(config, factory);
    // ...

    return manager;
  }
}

CoreManagerFactory.default = CoreManagerFactory;
module.exports = CoreManagerFactory;