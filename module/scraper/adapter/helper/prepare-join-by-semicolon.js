let PrepareAbstract = require('./prepare-abstract');

class PrepareJoinBySemicolon extends PrepareAbstract {
  constructor(adapter) {
    super();
    this.adapter = adapter;
  }

  prepare(relative) {
    if (typeof relative === 'string') {
      relative = [relative];
    }
    return relative.join(';');
  }
}

module.exports = PrepareJoinBySemicolon;