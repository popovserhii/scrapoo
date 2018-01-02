module.exports = {
  "scraper": {
    "south-contract-catalog-newly": {
      "pool": "shop-it",

      "source": {
        "type": "file",
        "path": "data/shop-it/inventory-combined-newly.csv",
        "searchKeys": {"name": "content_url"/*, "__filter": ["get:hyperlink"]*/},
        "fields": {
          "manufacturer": "manufacturer",
          "manufacturer_code": "manufacturer_code",
          "category": "category",
          "subcategory": "subcategory",
          "sku": "sku",
          "name": "name",
          "title": "title",
          "short_description": "short_description",
          "price": "price",
          "price_purchase": "price_purchase",
          "qty": "qty",
          "is_in_stock": "is_in_stock",
          "image": "image",
          "small_image": "small_image",
          "thumbnail": "thumbnail",
          "media_gallery": "media_gallery",
          "guarantee_period": "guarantee_period",
          "content_url": "content_url"
        }
      },
      "crawler": [
        {
          "name": "default",
          "group": {
            "selector": "#content-place",
            "fields": {
              "name": {"selector": ".good-info-header ", "__output": {"as": "html"}, "__filter": ["text-node", "trim"]},
              "image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "small_image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "thumbnail": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "media_gallery": {"selector": "#images-list a", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "short_description": {"selector": ".item-descr-small-content ul:first-child", "__output": {"as": "html"}, "__filter": [{"name": "replace", "params": ["/(?:\\r\\n|\\r|\\n)/g", "<br />"]}], "__prepare": ["join"]},
              "description": {"selector": ".panes-item:first-child > p", "__output": {"as": "html"}, "__filter": [{"name": "replace", "params": ["/(?:\\r\\n|\\r|\\n)/g", "<br />"]}], "__prepare": ["join"]},
              "specifications": {"selector": ".panes-item .properties-table", "__output": {"as": "html"}}
            }
          }
        }
      ],

      "output": {
        "default": {
          "path": "data/shop-it/south-contract/products-newly.csv"
        },
        "problem": {
          "path": "data/shop-it/south-contract/products-newly-problem.csv"
        },
      },

      "preprocessor": {
        "fields": {
          "attribute_set": "Default",
          "store": "admin",
          "status": 1,
          "visibility": 4,
          "translated": 0,
          "root_category": "Root Catalog",
          "categories": {"value": ["$fields.category", "$fields.subcategory"], "__filter": ["categories-map"/*, "unshift:Каталог товарів"*/], "__prepare": ["join-categories-magento"]},
          "type": "simple",
          "sku": "$fields.sku",
          "price": {"value": "$fields.price", "__filter": ["price"]},
          "qty": {"value": "$fields.qty", "__filter": ["number"]},
          "is_in_stock": {"value": "$fields.is_in_stock", "__filter": ["in-stock"]},
          "manufacturer": "$fields.manufacturer",
          "manufacturer_code": "$fields.manufacturer_code",
          "name": "$fields.name",
          //"short_description": {"value": "$fields.short_description", "__filter": [{"name": "replace", "params": ["/(?:\\r\\n|\\r|\\n)/g", " "]}]},
          "short_description": "$fields.short_description",
          "description": "$fields.description",
          "specifications": "$fields.specifications",
          "guarantee_period": "$fields.guarantee_period",
          "image": "$fields.image",
          "small_image": "$fields.small_image",
          "thumbnail": "$fields.thumbnail",
          "media_gallery": "$fields.media_gallery",
        }
      }
    }
  }
};