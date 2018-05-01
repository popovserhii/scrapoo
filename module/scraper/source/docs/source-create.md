## Create new Source

In rare cases you will need create new Source.

In this example we will crate *Hierarchy* Source.
First of all create new `Hierarchy` class and extend `Abstract`
```js
const Abstract = require('scraper/source/abstract');

class Hierarchy extends Abstract {
  async start() {
  }
}

module.exports = Hierarchy;
```

Next step you must implement `start` method which is main for run new source.


