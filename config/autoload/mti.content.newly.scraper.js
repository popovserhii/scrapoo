module.exports = {
  "scraper": {
    "full-catalog-newly": {
      "pool": "shop-it",

      "source": {
        "type": "file",
        "path": "data/shop-it/inventory-combined-newly.csv",
        "searchKeys": {"name": ["manufacturer_code"], "__filter": ["unshift:$source.manufacturer"], "__prepare": [{"name": "join", "params": " "}]},
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
        },
        {
          "name": "search",
          "url": {"path": "https://www.ttt.ua/ua/shop/search?text=%s", "selector": ".product-item:first-child .product-item__name a"},
          "action": {"click": ".gallery-side__more"},
          "group": {
            "selector": ".product-card-wr",
            "fields": {
              "name": {"selector": "h1.product-card__name", /*"__output": {"as": "html"},*/ "__filter": ["trim"]},
              "image": {"selector": "#galleryPopupList .slick-track .gallery-item:first-child a .gallery-item__img", "__output": {"attr": "data-big-src"}, "__prepare": ["base-url"]},
              "small_image": {"selector": "#galleryPopupList .slick-track .gallery-item:first-child a .gallery-item__img", "__output": {"attr": "data-big-src"}, "__prepare": ["base-url"]},
              "thumbnail": {"selector": "#galleryPopupList .slick-track .gallery-item:first-child a .gallery-item__img", "__output": {"attr": "data-big-src"}, "__prepare": ["base-url"]},
              "media_gallery": {"selector": "#galleryPopupList .slick-track .slick-slide a .gallery-item__img", "__output": {"attr": "data-big-src"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "short_description": {"selector": "#nothing-to-output", "__filter": ["trim"]},
              "description": {"selector": "#nothing-to-output", "__filter": ["trim"]},
              "specifications": {"selector": ".panes-item .properties-table", "__output": {"as": "html"}, "__prepare": ["unwrap"]}
            }
          }
        },
        {
          "name": "search",
          "url": {"path": "https://comfy.ua/ua/catalogsearch/result?q=%s", "selector": ".content__row .col-xs-12:first-child .product-cut__content .product-cut__title"},
          //"action": {"click": ".gallery-side__more"},
          "group": {
            "selector": ".content__container",
            "fields": {
              "name": {"selector": "h1.content__title", /*"__output": {"as": "html"},*/ "__filter": ["trim"]},
              "image": {"selector": ".product-photo__thumbs .product-photo__thumb:first-child a.product-photo__thumb-item", "__output": {"attr": "href"}, "__prepare": ["base-url"]},
              "small_image": {"selector": ".product-photo__thumbs .product-photo__thumb:first-child a.product-photo__thumb-item", "__output": {"attr": "href"}, "__prepare": ["base-url"]},
              "thumbnail": {"selector": ".product-photo__thumbs .product-photo__thumb:first-child a.product-photo__thumb-item", "__output": {"attr": "href"}, "__prepare": ["base-url"]},
              "media_gallery": {"selector": ".product-photo__thumbs .product-photo__thumb a.product-photo__thumb-item", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "short_description": {"selector": "#nothing-to-output", "__filter": ["trim"]},
              "description": {"selector": ".accordion-tabs__content .typo", "__output": {"as": "html"}, "__filter": ["trim"]},
              "specifications": {"selector": ".accordion-tabs__content .properties", "__output": {"as": "html"}, "__prepare": ["unwrap"]}
            }
          }
        }
      ],

      "output": {
        "default": {
          "path": "data/shop-it/products-newly.csv"
        },
        "problem": {
          "path": "data/shop-it/products-newly-problem.csv"
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
          "categories": {"value": ["$fields.category", "$fields.subcategory"], "__filter": ["categories-map"], "__prepare": ["join-categories-magento"]},
          "type": "simple",
          "sku": "$fields.sku",
          "guarantee": {"value": "$fields.guarantee", "__filter": ["guarantee"]},
          "price": {"value": "$fields.price", "__filter": ["price"]},
          "qty": {"value": "$fields.qty", "__filter": ["number"]},
          "is_in_stock": {"value": "$fields.is_in_stock", "__filter": ["in-stock"]},
          "manufacturer": "$fields.manufacturer",
          "manufacturer_code": "$fields.manufacturer_code",
          "name": "$fields.name",
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