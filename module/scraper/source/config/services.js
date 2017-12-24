module.exports = {
  services: {
    scraper: {
      arguments: ['@container', 'scraper/source/scraper'],
      factory: {
        class: '@coreManagerFactory',
        method: 'create',
      }
    },
    scraperFactory: {
      class: '/../factory/source-factory',
      arguments: ['@container'/*, '%package_reference'*/]
    },
  }
};