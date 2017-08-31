let PrepareAbstract = require('./prepare-abstract');

class PrepareJoinBySemicolon extends PrepareAbstract {
  constructor(adapter) {
    super();
    this.adapter = adapter;
  }

  prepare(relative) {
    //console.log(relative);
    return relative.join(';');
  }
}

module.exports = PrepareJoinBySemicolon;