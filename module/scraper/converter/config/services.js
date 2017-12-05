module.exports = {
  services: {
    converter: {
      arguments: ['@container', 'scraper/converter/converter'],
      factory: {
        class: '@coreManagerFactory',
        method: 'create'
      }
    },
    converterFactory: {
      class: '/../factory/converter-factory',
      arguments: ['@container']
    },
  }
};