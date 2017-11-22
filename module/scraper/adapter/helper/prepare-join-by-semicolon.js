let PrepareAbstract = require('./prepare-abstract');

class PrepareJoinBySemicolon extends PrepareAbstract {

  prepare(relative) {
    if (typeof relative === 'string') {
      relative = [relative];
    }
    return relative.join(';');
  }
}

module.exports = PrepareJoinBySemicolon;