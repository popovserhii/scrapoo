module.exports = {
  "scraper": {
    "south-contract-category": {
      "pool": "shop-it",
      "source": {
        "type": "file",
        "path": "data/shop-it/south-contract/pprice_list.xls",
        "fields": {
          "manufacturer": "ТМ",
          "manufacturer_code": "Артикул",
          "category": "Направление",
          "subcategory": "Подгруппа",
          "name": "Наименование укр.",
          "title": "Товар",
          "sku": "Код",
          "short_description": "Описание",
          "price": "РРЦ, грн.",
          "price_purchase": "Цена, грн.",
          "is_in_stock": "Склад Киев",
          "qty": "Остаток Киев, шт.",
          "image": "Фото",
          "small_image": "Фото",
          "thumbnail": "Фото",
          "media_gallery": "Фото",
          "guarantee_period": "Гарантия",
          "content_url": "Полное описание"
        }
      },

      "output": {
        "default": {
          "path": "data/shop-it/south-contract/products-category-mapping.csv",
          "options": {
            "dateable": false
          }
        },
        "problem": {
          "path": "data/shop-it/south-contract/products-problem.csv"
        }
      },

      "preprocessor": {
        "fields": {
          "attribute_set": "Default",
          "store": "admin",
          "status": 1,
          "visibility": 4,
          "translated": 0,
          "root_category": "Root Catalog",
          "categories": {"value": ["$fields.category", "$fields.subcategory"], "__filter": ["categories-map"], "__prepare": ["join-categories-magento"]},
          "type": "simple",
          "sku": "$fields.sku",
          "manufacturer": "$fields.manufacturer",
          "manufacturer_code": "$fields.manufacturer_code",
          "price": {"value": "$fields.price", "__filter": ["price"]},
          "qty": {"value": "$fields.qty", "__filter": ["number"]},
          "is_in_stock": {"value": "$fields.is_in_stock", "__filter": ["in-stock"]},
          "name": {"value": "$fields.title", "__filter": ["split:$fields.manufacturer", "pop", "unshift:$fields.manufacturer"], "__prepare": ["join"]},
          "short_description": {"value": "$fields.short_description", "__filter": ["replace:/(?:\\r\\n|\\r|\\n)/g, <br />", "replace:/\\\\/g, /"]},
          "guarantee_period": "$fields.guarantee_period",
          //"image": {"value": "$fields.image", "__filter": ["get:hyperlink"]},
          //"small_image": {"value": "$fields.small_image", "__filter": ["get:hyperlink"]},
          //"thumbnail": {"value": "$fields.thumbnail", "__filter": ["get:hyperlink"]}
        }
      }
    }
  }
};
