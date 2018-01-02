module.exports = {
  services: {
    browser: {
      //arguments: ['@container'],
      factory: {
        class: '@browserFactory',
        method: 'create'
      }
    },
    browserFactory: {
      class: '/../factory/browser-factory',
      arguments: ['@container']
    },
  }
};