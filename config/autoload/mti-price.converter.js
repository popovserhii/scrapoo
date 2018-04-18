module.exports = {
  "converter": {
    "mti-price": {
      "pool": "shop-it",
      "type": "price-list",
      "file": [{
        "default": {
          "categorize": {"name": "Category", "__prepare": ["join:/"]}
        },
        "path": "data/shop-it/mti/12_01_18_11_50_40.xlsx",
        "sheet": [
          {"name": "MTI", "skip": 2, /*"skipLast": 1,*/ "header": 3},
        ]
      }],
      "output": {
        "default": {
          "path": "data/shop-it/mti/price-converted.xlsx",
          "options": {
            "dateable": false
          }
        }
      }
    }
  }
};