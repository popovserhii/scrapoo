module.exports = {
  "converter": {
    "south-sale-combiner": {
      "pool": "shop-it",
      "type": "combiner",

      "file": [
        {
          "path": ["data/shop-it/south-contract/sale-converted.xlsx"],
          "default": {
            "index": "Код",
            "fields": {
              "sku": "Код"
            }
          },
          "sheet": [
            /*{
              "name": " УЦЕНКА ПОСУДА",
              "fields": {
                "sku": "Код",
                "name": "Товар",
                "price": "цена грн",
                "category": "Category",
                "comment_inner": "F"
              }
            },*/
            {
              "name": "ДЕФЕКТ УП. ПОСУДА",
              "fields": {
                "sku": "Код",
                "name": "Товар",
                "categories": "Category",
                "comment_inner": "склад",
                "price": "цена грн"
              }
            },
            /*{
              "name": "Аксессуарные группы",
              "fields": {
                "sku": "Группа товара",
                "name": "Модель",
                "price": "ЦЕНА РАСПРОДАЖИ ГРН",
                "category": "Category",
                "comment_inner": "описание"
              }
            },*/
            {
              "name": "Дефект уп-ки Акция!",
              "fields": {
                "sku": "Код",
                "name": "Модель",
                "categories": "Category",
                "comment_inner": "D",
                "price": "Цена грн"
              }
            },
            /*{
              "name": "it_ноутбуки",
              "fields": {
                "sku": "Код",
                "name": "Модель",
                "price": "Цена гр",
                "category": "Category",
                "comment_inner": "Состояние"
              }
            },
            {
              "name": "быт.тех",
              "fields": {
                "sku": "Код",
                "name": "Модель",
                "price": "Цена",
                "category": "Category",
                "comment_inner": "Описание внешнего вида"
              }
            },
            {
              "name": "TV_видео_аудио",
              "fields": {
                "sku": "Код",
                "name": "Модель",
                "price": "Цена    гр",
                "category": "Category",
                "comment_inner": "Состояние"
              }
            },
            {
              "name": "авто_фото_видео",
              "fields": {
                "sku": "Код",
                "name": "Модель",
                "price": "Цена гр",
                "category": "Category",
                "comment_inner": "Состояние"
              }
            },
            {
              "name": "моб.тел_планшеты",
              "fields": {
                "sku": "Код",
                "name": "Модель",
                "price": "Цена",
                "category": "Category",
                "comment_inner": " Описание внешнего вида"
              }
            }*/
          ]

        }
      ],
      "preprocessor": {
        "fields": {
          "qty": 1,
          "is_in_stock": 1,
          "sku": {"value": ["$fields.sku", "-S"], "__prepare": ["join"]},
          "price": {"value": "$fields.price", "__filter": [{"name": "price", "config": {"apply": "+20%", "minRate": 0}}]},
          "special_price": {"value": "$fields.price", "__filter": [{"name": "price", "config": {"apply": "+12%", "minRate": 0}}]},
          "name": {"value": "$fields.name", "__filter": ["replace:/ /, %20", "split:%20", "pop"]},
          "categories": {"value": ["Акційні товари", "$fields.categories"], "__filter": ["replace:/\//, -", "replace:/ДЕФЕКТ УП. ПОСУДА/, Посуд", "replace:/\//, -", "replace:/УЦЕНКА ПОСУДА/, Посуд"], "__prepare": ["join-categories-magento"]},
        }
      },
      "output": {
        "default": {
          "path": "data/shop-it/south-contract/sale-combined.csv",
          "options": {
            "dateable": false,
            "bom": true
          }
        },
        "newly": {
          "path": "data/shop-it/south-contract/sale-combined-similar.csv",
          "options": {
            "dateable": false
          }
        }
      },
    }
  }
};