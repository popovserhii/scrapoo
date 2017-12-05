module.exports = {
  "scraper": {
    "south-sale": {
      "source": {
        "pool": "shop-it",
        "type": "file",
        "path": "data/shop-it/south-contract/sale-combined.csv",
        "searchKeys": "sku",
        "fields": {
          "sku": "sku",
          "name": "name",
          "qty": "qty",
          "is_in_stock": "is_in_stock",
          "price": "price",
          "special_price": "special_price",
          "categories": "categories",
          "comment_inner": "comment_inner"
        }
      },
      "crawler": [
        {
          "name": "search",
          "url": {"path": "https://yugcontract.ua/search/goods?q=%s", "selector": ".cat-item:first-child a"},
          "group": {
            "selector": "#content-place",
            "fields": {
              "name": {"selector": ".good-info-header ", "__output": {"as": "html"}, "__filter": ["text-node", "trim"]},
              "image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "small_image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "thumbnail": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "media_gallery": {"selector": "#images-list a", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "description": {"selector": ".panes-item:first-child > p", "__output": {"as": "html"}, "__filter": [{"name": "replace", "params": ["/(?:\\r\\n|\\r|\\n)/g", "<br />"]}], "__prepare": ["join"]},
              "specifications": {"selector": ".panes-item .properties-table", "__output": {"as": "html"}}
            }
          }
        }
      ],

      "output": {
        "default": {
          "path": "data/shop-it/south-contract/products-south-sale.csv"
        },
        "problem": {
          "path": "data/shop-it/south-contract/shop-it-problem-south-sale.csv"
        }
      },

      "preprocessor": {
        "fields": {
          "attribute_set": "Default",
          "store": "admin",
          "status": 1,
          "visibility": 4,
          "translated": 0,
          //"is_in_stock": 1,
          //"qty": 1,
          "type": "simple",
          "root_category": "Root Catalog",
          "categories": "$source.categories",
          "sku": "$source.sku",
          "price": "$source.price",
          "special_price": "$source.special_price",
          "comment_inner": "$source.comment_inner"
        }
      }
    },

    "south-contract-sale-dish": {
      "source": {
        "pool": "shop-it",
        "type": "file",
        "path": {"name": "data/rasprodazha_29-10-2017_5.10.18PM.xlsx", "sheet": " УЦЕНКА ПОСУДА"},
        "searchKeys": "Код",
        "fields": {
          "sku": "Код",
          "name": "Товар",
          "price": "цена грн",
          "category": "Category",
          "comment_inner": "F"
        }
      },
      "crawler": [
        {
          "name": "search",
          "url": {"path": "https://yugcontract.ua/search/goods?q=%s", "selector": ".cat-item:first-child a"},
          "group": {
            "selector": "#content-place",
            "fields": {
              "image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "small_image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "thumbnail": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "media_gallery": {"selector": "#images-list a", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "description": {"selector": ".panes-item:first-child", "__filter": ["replace:/(?:\\r\\n|\\r|\\n)/g, <br />"]},
              "specifications": {"selector": ".panes-item .properties-table", "__output": {"as": "html"}}
            }
          }
        }
      ],

      "output": {
        "path": "data/products-south-sale.csv"
      },

      "problemOutput": {
        "type": "csv",
        "path": "data/shop-it-problem-south-sale.csv"
      },

      "preprocessor": {
        "fields": {
          "attribute_set": "Default",
          "store": "admin",
          "status": 1,
          "visibility": 4,
          "is_in_stock": 1,
          "translated": 0,
          "root_category": "Root Catalog",
          "categories": {"value": ["Акційні товари", "$source.category"], "__filter": ["replace:/\//, -", "replace:/УЦЕНКА ПОСУДА/, Посуд"], "__prepare": ["join-categories-magento"]},
          "type": "simple",
          "sku": {"value": ["$source.sku", "-1"], "__prepare": ["join"]},
          "price": {"value": ["$source.price"], "__filter": ["shift", "price", "plus-percent:20"]},
          "special_price": {"value": ["$source.price"], "__filter": ["shift", "price"]},
          "qty": 1,
          "name": {"value": ["$source.name"], "__filter": ["shift", "replace:/ /, %20", "split:%20", "pop"]},
          "comment_inner": "$source.comment_inner"
        }
      }
    },


    "south-contract-defect-dish": {
      "source": {
        "type": "file",
        "path": {"name": "data/rasprodazha_29-10-2017_7.32.09PM.xlsx", "sheet": "ДЕФЕКТ УП. ПОСУДА"},
        "searchKeys": "Код",
        "fields": {
          "sku": "Код",
          "name": "Товар",
          "price": "цена грн",
          "category": "Category",
          "comment_inner": "склад"
        }
      },
      "crawler": [
        {
          "name": "search",
          "url": {"path": "https://yugcontract.ua/search/goods?q=%s", "selector": ".cat-item:first-child a"},
          "group": {
            "selector": "#content-place",
            "fields": {
              "image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "small_image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "thumbnail": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "media_gallery": {"selector": "#images-list a", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "description": {"selector": ".panes-item:first-child", "__filter": ["replace:/(?:\\r\\n|\\r|\\n)/g, <br />"]},
              "specifications": {"selector": ".panes-item .properties-table", "__output": {"as": "html"}}
            }
          }
        }
      ],

      "output": {
        "path": "data/products-south-sale.csv"
      },

      "problemOutput": {
        "type": "csv",
        "path": "data/shop-it-problem-south-sale.csv"
      },

      "preprocessor": {
        "fields": {
          "attribute_set": "Default",
          "store": "admin",
          "status": 1,
          "visibility": 4,
          "is_in_stock": 1,
          "translated": 0,
          "root_category": "Root Catalog",
          "categories": {"value": ["Акційні товари", "$source.category"], "__filter": ["replace:/\//, -", "replace:/УЦЕНКА ПОСУДА/, Посуд"], "__prepare": ["join-categories-magento"]},
          "type": "simple",
          "sku": {"value": ["$source.sku", "-1"], "__prepare": ["join"]},
          "price": {"value": ["$source.price"], "__filter": ["shift", "price", "plus-percent:20"]},
          "special_price": {"value": ["$source.price"], "__filter": ["shift", "price"]},
          "qty": 1,
          "name": {"value": ["$source.name"], "__filter": ["shift", "replace:/ /, %20", "split:%20", "pop"]},
          "comment_inner": "$source.comment_inner"
        }
      }
    },


    "south-contract-defect-accessory": {
      "source": {
        "type": "file",
        "path": {"name": "data/rasprodazha_29-10-2017_7.32.09PM.xlsx", "sheet": "Аксессуарные группы"},
        "searchKeys": "Группа товара",
        "fields": {
          "sku": "Группа товара",
          "name": "Модель",
          "price": "ЦЕНА РАСПРОДАЖИ ГРН",
          "category": "Category",
          "comment_inner": "описание"
        }
      },
      "crawler": [
        {
          "name": "search",
          "url": {"path": "https://yugcontract.ua/search/goods?q=%s", "selector": ".cat-item:first-child a"},
          "group": {
            "selector": "#content-place",
            "fields": {
              "image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "small_image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "thumbnail": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "media_gallery": {"selector": "#images-list a", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "description": {"selector": ".panes-item:first-child", "__filter": ["replace:/(?:\\r\\n|\\r|\\n)/g, <br />"]},
              "specifications": {"selector": ".panes-item .properties-table", "__output": {"as": "html"}}
            }
          }
        }
      ],

      "output": {
        "path": "data/products-south-sale.csv"
      },

      "problemOutput": {
        "type": "csv",
        "path": "data/shop-it-problem-south-sale.csv"
      },

      "preprocessor": {
        "fields": {
          "attribute_set": "Default",
          "store": "admin",
          "status": 1,
          "visibility": 4,
          "is_in_stock": 1,
          "translated": 0,
          "root_category": "Root Catalog",
          "categories": {"value": ["Акційні товари", "$source.category"], "__filter": ["replace:/\//, -", "replace:/УЦЕНКА ПОСУДА/, Посуд"], "__prepare": ["join-categories-magento"]},
          "type": "simple",
          "sku": {"value": ["$source.sku", "-1"], "__prepare": ["join"]},
          "price": {"value": ["$source.price"], "__filter": ["shift", "price", "plus-percent:20"]},
          "special_price": {"value": ["$source.price"], "__filter": ["shift", "price"]},
          "qty": 1,
          "name": {"value": ["$source.name"], "__filter": ["shift", "replace:/ /, %20", "split:%20", "pop"]},
          "comment_inner": "$source.comment_inner"
        }
      }
    },


    "south-contract-defect-pack": {
      "source": {
        "type": "file",
        "path": {"name": "data/rasprodazha_29-10-2017_7.32.09PM.xlsx", "sheet": "Дефект уп-ки Акция!"},
        "searchKeys": "Код",
        "fields": {
          "sku": "Код",
          "name": "Модель",
          "price": "Цена грн",
          "category": "Category",
          "comment_inner": "D"
        }
      },
      "crawler": [
        {
          "name": "search",
          "url": {"path": "https://yugcontract.ua/search/goods?q=%s", "selector": ".cat-item:first-child a"},
          "group": {
            "selector": "#content-place",
            "fields": {
              "image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "small_image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "thumbnail": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "media_gallery": {"selector": "#images-list a", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "description": {"selector": ".panes-item:first-child", "__filter": ["replace:/(?:\\r\\n|\\r|\\n)/g, <br />"]},
              "specifications": {"selector": ".panes-item .properties-table", "__output": {"as": "html"}}
            }
          }
        }
      ],

      "output": {
        "path": "data/products-south-sale.csv"
      },

      "problemOutput": {
        "type": "csv",
        "path": "data/shop-it-problem-south-sale.csv"
      },

      "preprocessor": {
        "fields": {
          "attribute_set": "Default",
          "store": "admin",
          "status": 1,
          "visibility": 4,
          "is_in_stock": 1,
          "translated": 0,
          "root_category": "Root Catalog",
          "categories": {"value": ["Акційні товари", "$source.category"], "__filter": ["replace:/\//, -", "replace:/УЦЕНКА ПОСУДА/, Посуд"], "__prepare": ["join-categories-magento"]},
          "type": "simple",
          "sku": {"value": ["$source.sku", "-1"], "__prepare": ["join"]},
          "price": {"value": ["$source.price"], "__filter": ["shift", "price", "plus-percent:20"]},
          "special_price": {"value": ["$source.price"], "__filter": ["shift", "price"]},
          "qty": 1,
          "name": {"value": ["$source.name"], "__filter": ["shift", "replace:/ /, %20", "split:%20", "pop"]},
          "comment_inner": "$source.comment_inner"
        }
      }
    },


    "south-contract-defect-notebook": {
      "source": {
        "type": "file",
        "path": {"name": "data/rasprodazha_29-10-2017_7.32.09PM.xlsx", "sheet": "it_ноутбуки"},
        "searchKeys": "Код",
        "fields": {
          "sku": "Код",
          "name": "Модель",
          "price": "Цена гр",
          "category": "Category",
          "comment_inner": "Состояние"
        }
      },
      "crawler": [
        {
          "name": "search",
          "url": {"path": "https://yugcontract.ua/search/goods?q=%s", "selector": ".cat-item:first-child a"},
          "group": {
            "selector": "#content-place",
            "fields": {
              "image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "small_image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "thumbnail": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "media_gallery": {"selector": "#images-list a", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "description": {"selector": ".panes-item:first-child", "__filter": ["replace:/(?:\\r\\n|\\r|\\n)/g, <br />"]},
              "specifications": {"selector": ".panes-item .properties-table", "__output": {"as": "html"}}
            }
          }
        }
      ],

      "output": {
        "path": "data/products-south-sale.csv"
      },

      "problemOutput": {
        "type": "csv",
        "path": "data/shop-it-problem-south-sale.csv"
      },

      "preprocessor": {
        "fields": {
          "attribute_set": "Default",
          "store": "admin",
          "status": 1,
          "visibility": 4,
          "is_in_stock": 1,
          "translated": 0,
          "root_category": "Root Catalog",
          "categories": {"value": ["Акційні товари", "$source.category"], "__filter": ["replace:/\//, -", "replace:/УЦЕНКА ПОСУДА/, Посуд"], "__prepare": ["join-categories-magento"]},
          "type": "simple",
          "sku": {"value": ["$source.sku", "-1"], "__prepare": ["join"]},
          "price": {"value": ["$source.price"], "__filter": ["shift", "price", "plus-percent:20"]},
          "special_price": {"value": ["$source.price"], "__filter": ["shift", "price"]},
          "qty": 1,
          "name": {"value": ["$source.name"], "__filter": ["shift", "replace:/ /, %20", "split:%20", "pop"]},
          "comment_inner": "$source.comment_inner"
        }
      }
    },


    "south-contract-defect-appliance": {
      "source": {
        "type": "file",
        "path": {"name": "data/rasprodazha_29-10-2017_7.32.09PM.xlsx", "sheet": "быт.тех"},
        "searchKeys": "Код",
        "fields": {
          "sku": "Код",
          "name": "Модель",
          "price": "Цена",
          "category": "Category",
          "comment_inner": "Описание внешнего вида"
        }
      },
      "crawler": [
        {
          "name": "search",
          "url": {"path": "https://yugcontract.ua/search/goods?q=%s", "selector": ".cat-item:first-child a"},
          "group": {
            "selector": "#content-place",
            "fields": {
              "image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "small_image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "thumbnail": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "media_gallery": {"selector": "#images-list a", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "description": {"selector": ".panes-item:first-child", "__filter": ["replace:/(?:\\r\\n|\\r|\\n)/g, <br />"]},
              "specifications": {"selector": ".panes-item .properties-table", "__output": {"as": "html"}}
            }
          }
        }
      ],

      "output": {
        "path": "data/products-south-sale.csv"
      },

      "problemOutput": {
        "type": "csv",
        "path": "data/shop-it-problem-south-sale.csv"
      },

      "preprocessor": {
        "fields": {
          "attribute_set": "Default",
          "store": "admin",
          "status": 1,
          "visibility": 4,
          "is_in_stock": 1,
          "translated": 0,
          "root_category": "Root Catalog",
          "categories": {"value": ["Акційні товари", "$source.category"], "__filter": ["replace:/\//, -", "replace:/УЦЕНКА ПОСУДА/, Посуд"], "__prepare": ["join-categories-magento"]},
          "type": "simple",
          "sku": {"value": ["$source.sku", "-1"], "__prepare": ["join"]},
          "price": {"value": ["$source.price"], "__filter": ["shift", "price", "plus-percent:20"]},
          "special_price": {"value": ["$source.price"], "__filter": ["shift", "price"]},
          "qty": 1,
          "name": {"value": ["$source.name"], "__filter": ["shift", "replace:/ /, %20", "split:%20", "pop"]},
          "comment_inner": "$source.comment_inner"
        }
      }
    },


    "south-contract-defect-tv": {
      "source": {
        "type": "file",
        "path": {"name": "data/rasprodazha_29-10-2017_7.32.09PM.xlsx", "sheet": "TV_видео_аудио"},
        "searchKeys": "Код",
        "fields": {
          "sku": "Код",
          "name": "Модель",
          "price": "Цена    гр",
          "category": "Category",
          "comment_inner": "Состояние"
        }
      },
      "crawler": [
        {
          "name": "search",
          "url": {"path": "https://yugcontract.ua/search/goods?q=%s", "selector": ".cat-item:first-child a"},
          "group": {
            "selector": "#content-place",
            "fields": {
              "image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "small_image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "thumbnail": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "media_gallery": {"selector": "#images-list a", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "description": {"selector": ".panes-item:first-child", "__filter": ["replace:/(?:\\r\\n|\\r|\\n)/g, <br />"]},
              "specifications": {"selector": ".panes-item .properties-table", "__output": {"as": "html"}}
            }
          }
        }
      ],

      "output": {
        "path": "data/products-south-sale.csv"
      },

      "problemOutput": {
        "type": "csv",
        "path": "data/shop-it-problem-south-sale.csv"
      },

      "preprocessor": {
        "fields": {
          "attribute_set": "Default",
          "store": "admin",
          "status": 1,
          "visibility": 4,
          "is_in_stock": 1,
          "translated": 0,
          "root_category": "Root Catalog",
          "categories": {"value": ["Акційні товари", "$source.category"], "__filter": ["replace:/\//, -", "replace:/УЦЕНКА ПОСУДА/, Посуд"], "__prepare": ["join-categories-magento"]},
          "type": "simple",
          "sku": {"value": ["$source.sku", "-1"], "__prepare": ["join"]},
          "price": {"value": ["$source.price"], "__filter": ["shift", "price", "plus-percent:20"]},
          "special_price": {"value": ["$source.price"], "__filter": ["shift", "price"]},
          "qty": 1,
          "name": {"value": ["$source.name"], "__filter": ["shift", "replace:/ /, %20", "split:%20", "pop"]},
          "comment_inner": "$source.comment_inner"
        }
      }
    },


    "south-contract-defect-audio": {
      "source": {
        "type": "file",
        "path": {"name": "data/rasprodazha_29-10-2017_7.32.09PM.xlsx", "sheet": "авто_ц.фото_ц.планшеты_аудио"},
        "searchKeys": "Код",
        "fields": {
          "sku": "Код",
          "name": "Модель",
          "price": "Цена гр",
          "category": "Category",
          "comment_inner": "Состояние"
        }
      },
      "crawler": [
        {
          "name": "search",
          "url": {"path": "https://yugcontract.ua/search/goods?q=%s", "selector": ".cat-item:first-child a"},
          "group": {
            "selector": "#content-place",
            "fields": {
              "image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "small_image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "thumbnail": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "media_gallery": {"selector": "#images-list a", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "description": {"selector": ".panes-item:first-child", "__filter": ["replace:/(?:\\r\\n|\\r|\\n)/g, <br />"]},
              "specifications": {"selector": ".panes-item .properties-table", "__output": {"as": "html"}}
            }
          }
        }
      ],

      "output": {
        "path": "data/products-south-sale.csv"
      },

      "problemOutput": {
        "type": "csv",
        "path": "data/shop-it-problem-south-sale.csv"
      },

      "preprocessor": {
        "fields": {
          "attribute_set": "Default",
          "store": "admin",
          "status": 1,
          "visibility": 4,
          "is_in_stock": 1,
          "translated": 0,
          "root_category": "Root Catalog",
          "categories": {"value": ["Акційні товари", "$source.category"], "__filter": ["replace:/\//, -", "replace:/УЦЕНКА ПОСУДА/, Посуд"], "__prepare": ["join-categories-magento"]},
          "type": "simple",
          "sku": {"value": ["$source.sku", "-1"], "__prepare": ["join"]},
          "price": {"value": ["$source.price"], "__filter": ["shift", "price", "plus-percent:20"]},
          "special_price": {"value": ["$source.price"], "__filter": ["shift", "price"]},
          "qty": 1,
          "name": {"value": ["$source.name"], "__filter": ["shift", "replace:/ /, %20", "split:%20", "pop"]},
          "comment_inner": "$source.comment_inner"
        }
      }
    },


    "south-contract-defect-phone": {
      "source": {
        "type": "file",
        "path": {"name": "data/rasprodazha_29-10-2017_7.32.09PM.xlsx", "sheet": "моб.тел_планшеты"},
        "searchKeys": "Код",
        "fields": {
          "sku": "Код",
          "name": "Модель",
          "price": "Цена",
          "category": "Category",
          "comment_inner": " Описание внешнего вида"
        }
      },
      "crawler": [
        {
          "name": "search",
          "url": {"path": "https://yugcontract.ua/search/goods?q=%s", "selector": ".cat-item:first-child a"},
          "group": {
            "selector": "#content-place",
            "fields": {
              "image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "small_image": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "thumbnail": {"selector": "#images-preview", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "media_gallery": {"selector": "#images-list a", "__output": {"attr": "href"}, "__prepare": ["base-url", "join-by-semicolon"]},
              "description": {"selector": ".panes-item:first-child", "__filter": ["replace:/(?:\\r\\n|\\r|\\n)/g, <br />"]},
              "specifications": {"selector": ".panes-item .properties-table", "__output": {"as": "html"}}
            }
          }
        }
      ],

      "output": {
        "path": "data/products-south-sale.csv"
      },

      "problemOutput": {
        "type": "csv",
        "path": "data/shop-it-problem-south-sale.csv"
      },

      "preprocessor": {
        "fields": {
          "attribute_set": "Default",
          "store": "admin",
          "status": 1,
          "visibility": 4,
          "is_in_stock": 1,
          "translated": 0,
          "root_category": "Root Catalog",
          "categories": {"value": ["Акційні товари", "$source.category"], "__filter": ["replace:/\//, -", "replace:/УЦЕНКА ПОСУДА/, Посуд"], "__prepare": ["join-categories-magento"]},
          "type": "simple",
          "sku": {"value": ["$source.sku", "-1"], "__prepare": ["join"]},
          "price": {"value": ["$source.price"], "__filter": ["shift", "price", "plus-percent:20"]},
          "special_price": {"value": ["$source.price"], "__filter": ["shift", "price"]},
          "qty": 1,
          "name": {"value": ["$source.name"], "__filter": ["shift", "replace:/ /, %20", "split:%20", "pop"]},
          "comment_inner": "$source.comment_inner"
        }
      }
    }
  }
};