class PrepareAbstract {
  constructor() {
    this.options = {};
  }

  prepare(value) {};

  setOption(key, value) {
    this.options[key] = value;

    return this;
  }

  getOption(key) {
    return this.options.hasOwnProperty(key)
      ? this.options[key]
      : false;
  }
}

module.exports = PrepareAbstract;