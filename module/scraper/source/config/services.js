module.exports = {
  services: {
    scraper: {
      arguments: ['@container', 'scraper/source/scraper'],
      factory: {
        class: '@coreManagerFactory',
        method: 'create',
      }
    },
    /*source: {
      factory: {
        class: '/../factory/source-factory',
        method: 'create'
      }
    },*/
    sourceFactory: {
      class: '/../factory/source-factory',
      arguments: ['@container'/*, '%package_reference'*/]
    },
  }
};