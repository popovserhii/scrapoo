module.exports = {
  "converter": {
    "south-combiner": {
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
              "content_url": "Полное описание"
            },
            "omit": {
              "fields": {"is_in_stock": "0", "qty": 0}
            },
            "newly": {
              "raw": false,
              "separate": true
            }
          }
        }
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
          "sku": "$fields.sku",
          "manufacturer_code": "$fields.manufacturer_code",
          "guarantee": {"value": "$fields.guarantee", "__filter": ["guarantee"]},
          "price_purchase": {"value": "$fields.price_purchase"},
          "price": {"value": "$fields.price", "__filter": ["price"]},
          "qty": {"value": "$fields.qty", "__filter": ["number"]},
          "is_in_stock": {"value": "$fields.is_in_stock", "__filter": ["in-stock"]}
        }
      }
    }
  }
};