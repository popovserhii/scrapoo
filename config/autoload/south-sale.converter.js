module.exports = {
  "converter": {
    "south-sale": {
      "pool": "shop-it",
      "type": "price-list",
      "file": [{
        "default": {
          "categorize": {"name": "Category", "__prepare": ["join:/"]}
        },
        "path": "data/shop-it/south-contract/RASPRODAZHA.xls",
        "sheet": [
          //{"name": " УЦЕНКА ПОСУДА", "skip": 1, "skipLast": 1, "header": 2},
          {"name": "ДЕФЕКТ УП. ПОСУДА", "skip": 2, "skipLast": 1, "header": 3},
          //{"name": "Аксессуарные группы", "skip": 5, "skipLast": 1, "header": 6},
          {"name": "Дефект уп-ки Акция!", "skip": 1, "header": 2},
          //{"name": "it_ноутбуки", "skip": 1, "header": 2},
          //{"name": "быт.тех", "skip": 1, "header": 2, "categorize": {"__filter": ["replace:ЦЕНЫ СНИЖЕНЫ !, ", "upper-first"]}},
          //{"name": "TV_видео_аудио", "skip": 1, "header": 2, "categorize": {"__filter": ["replace:/^.+\/.+?\\s(.*)$/, \\$1", "trim:\\", "upper-first"]}},
          //{"name": "авто_фото_видео", "skip": 0, "categorize": {"__filter": ["replace:/^.+\/.+?\\s(.*)$/, \\$1", "trim:\\", "upper-first"]}},
          //{"name": "моб.тел_планшеты", "skip": 1, "header": 2, "categorize": {"__filter": ["replace:/^.+\/.+?\\s(.*)$/, \\$1", "trim:\\", "upper-first"]}}
        ]
      }],
      "output": {
        "default": {
          "path": "data/shop-it/south-contract/sale-converted.xlsx",
          "options": {
            "dateable": false
          }
        }
      }
    }
  }
};