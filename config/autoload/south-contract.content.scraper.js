module.exports = {
  "scraper": {
    "south-contract-catalog": {
      "pool": "shop-it",

      "source": {
        "type": "file",
        "path": "data/pprice_list.xls",
        "searchKeys": {"name": "Полное описание", "__filter": ["get:hyperlink"]},
        "fields": {
          "manufacturer": "ТМ",
          "manufacturer_code": "Артикул",
          "category": "Направление",
          "subcategory": "Подгруппа",
          "sku": "Код",
          "name": "Наименование укр.",
          "title": "Товар",
          "short_description": "Описание",
          "price": "РРЦ, грн.",
          "price_purchase": "Цена, грн.",
          "qty": "Остаток Киев, шт.",
          "is_in_stock": "Склад Киев",
          "image": "Фото",
          "small_image": "Фото",
          "thumbnail": "Фото",
          "media_gallery": "Фото",
          "guarantee_period": "Гарантия",
          "content_url": "Полное описание"
        }
      },
      "crawler": [
        {
          "name": "default",
          "group": {
            "selector": "#content-place",
            "fields": {
              "media_gallery": {"selector": "#images-list a", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "description": {"selector": ".panes-item:first-child > p", "__output": {"as": "html"}, "__filter": [{"name": "replace", "params": ["/(?:\\r\\n|\\r|\\n)/g", "<br />"]}], "__prepare": ["join"]},
              "specifications": {"selector": ".panes-item .properties-table", "__output": {"as": "html"}}
            }
          }
        }
      ],

      "output": {
        "default": {
          "path": "data/products-south.csv"
        },
        "problem": {
          "path": "data/shop-it-problem-south.csv"
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
          "categories": {"value": ["$source.category", "$source.subcategory"], "__filter": ["categories-map", "unshift:Каталог товарів"], "__prepare": ["join-categories-magento"]},
          "type": "simple",
          "sku": "$source.sku",
          "price": {"value": ["$source.price", "$source.price_purchase"], "__filter": ["price"]},
          "qty": {"value": ["$source.qty"], "__filter": ["shift", "number"]},
          "is_in_stock": {"value": ["$source.is_in_stock"], "__filter": ["shift", "in-stock"]},
          "manufacturer": "$source.manufacturer",
          "manufacturer_code": "$source.manufacturer_code",
          "name": {"value": ["$source.title"], "__filter": ["shift", "replace:/ /, %20", "split:%20", "pop"]},
          "short_description": {"value": ["$source.short_description"], "__filter": ["shift", "replace:/(?:\\r\\n|\\r|\\n)/g, <br />"]},
          "guarantee_period": "$source.guarantee_period",
          "image": {"value": ["$source.image"], "__filter": ["shift", "get:hyperlink"]},
          "small_image": {"value": ["$source.small_image"], "__filter": ["shift", "get:hyperlink"]},
          "thumbnail": {"value": ["$source.thumbnail"], "__filter": ["shift", "get:hyperlink"]}
        }
      }
    }
  }
};