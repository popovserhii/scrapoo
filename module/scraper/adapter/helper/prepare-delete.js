const PrepareAbstract = require('./prepare-abstract');

class PrepareDelete extends PrepareAbstract {

  prepare(value) {
    let name = this.config.params[0];
    delete value[name];

    return value;
  }
}

module.exports = PrepareDelete;