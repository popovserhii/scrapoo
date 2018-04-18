module.exports = {
  "converter": {
    "shop-it-combiner": {
      "pool": "shop-it",
      "type": "combiner",

      "file": [
        {
          "path": ["data/shop-it/south-contract/pprice_list.xls", "data/shop-it/south-contract/pprice_list-*.xls"],
          "default": {
            "index": "Код",
            "fields": {
              "manufacturer": "ТМ",
              "manufacturer_code": "Артикул",
              "category": "Направление",
              "subcategory": "Подгруппа",
              "name": "Наименование укр.",
              "title": "Товар",
              "sku": "Код",
              "price": "РРЦ, грн.",
              "price_purchase": "Цена, грн.",
              "is_in_stock": "Склад Киев",
              "qty": "Остаток Киев, шт.",
              "image": "Фото",
              "small_image": "Фото",
              "thumbnail": "Фото",
              "media_gallery": "Фото",
              "guarantee": "Гарантия",
              "content_url": "Полное описание",
            },
            "omit": {
              "fields": {"is_in_stock": "0", "qty": 0}
            },
            "newly": {
              "raw": false,
              "separate": true
            },
            "custom": {
              "fields": {"supplier": 1}
            }
          }
        },
        /*{
          "path": ["data/shop-it/south-contract/mti_list.xls", "data/shop-it/south-contract/mti_list-*.xls"],
          "default": {
            "index": "Код произв",
            "fields": {
              "manufacturer": "Производитель",
              "manufacturer_code": "Код произв",
              "category": "Категория",
              "subcategory": "Category",
              "name": "Наименование",
              "title": "Наименование",
              "sku": "MTI код",
              "price": "Розн. цена (грн.)",
              "price_purchase": "Цена, грн.",
              "is_in_stock": "Склад Киев",
              "qty": "Остаток Киев, шт.",
              "image": "Фото",
              "small_image": "Фото",
              "thumbnail": "Фото",
              "media_gallery": "Фото",
              "guarantee": "Гарантия",
              "content_url": "Полное описание",
            },
            "omit": {
              "fields": {"is_in_stock": "0", "qty": 0}
            },
            "newly": {
              "raw": false,
              "separate": true
            },
            "custom": {
              "fields": {"price": "", "is_in_stock": "1", "qty": 20, "supplier": 2}
            }
          }
        }*/
      ],
      "output": {
        "default": {
          "path": "data/shop-it/inventory-combined.csv",
          "options": {
            "dateable": false
          }
        },
        "newly": {
          "path": "data/shop-it/inventory-combined-newly.csv",
          "options": {
            "dateable": false,
            "bom": true
          }
        }
      },
      "preprocessor": {
        "fields": {
          "sku": {"value": "$fields.sku", "__filter": ["sku"]},
          "manufacturer_code": "$fields.manufacturer_code",
          "guarantee": {"value": "$fields.guarantee", "__filter": ["guarantee"]},
          "price_purchase": {"value": "$fields.price_purchase"},
          "price": {"value": "$fields.price", "__filter": ["price"]},
          "qty": {"value": "$fields.qty", "__filter": ["number"]},
          "is_in_stock": {"value": "$fields.is_in_stock", "__filter": ["in-stock"]}
        }
      },
      "rules": [
        { // pick up the best value
          "condition": "OR",
          "rules": [
            {
              "condition": "AND",
              "rules": [
                {
                  "field": "new.is_in_stock",
                  "type": "integer",
                  "operator": "equal",
                  "value": 1
                },
                {
                  "field": "old.is_in_stock",
                  "type": "integer",
                  "operator": "not_equal",
                  "value": 1
                },
              ],
            },
            {
              "condition": "AND",
              "rules": [
                {
                  "field": "new.is_in_stock",
                  "type": "integer",
                  "operator": "equal",
                  "value": 1
                },
                {
                  "field": "new.price_purchase",
                  "type": "double",
                  "operator": "less",
                  "value": "$old.price_purchase"
                }
              ],
            }
          ],
          "valid": true,
          /*"apply": {
            "operand": "+300",
            "to": "$fields.price_purchase" // optional
          }*/
        },
      ],
    }
  }
};