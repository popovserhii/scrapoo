module.exports = {
  "scraper": {
    "list-if-catalog": {
      "source": {
        "pool": "stagem",
        "type": "hierarchy",
        "name": "list-if-catalog",

        "path": "https://list.in.ua/Івано-Франківськ/Стоматології-Івано-Франківська",
        //"selector": "ul li a:contains('Реабілітаційні центри')", // Стоматологія \ Реабілітаційні центри // вибираємо посилання по яких будемо сканувати, в даному випадку одне

        "iterate": {
          "classic": {
            "nextPage": ".pagination-sunshine li.active + li a", // наступна сторінка
            "pages": ".pagination-sunshine li a" // всі сторінки в пагінації
          },
        },

        "group": {
          "context": "#itemsList .item-search", // якщо ми знаходимось в "group", тоді вказуємо "context" (селектор) відносно якого буде відбуватись подальша вибірка інформації
          "selector": ".item-search__title.mobile-hide a", // "selector" який знаходиться в "group", працює відносно "context"

          "fields": {
            "url": {"selector": ".item-search__title.mobile-hide a", "__output": {"attr": "href"}, "__prepare": [{"name": "base-url", "config": {"location": "$source.location"}}]},
          },

          "source": { // в даному випадку це кінцевий елемент в ієрархії, тому залишається лише вибрати потрібні дані і зберегти оброблену сутність
            "fields": {
              "name": ".container .company__title",
              "address": {"selector": ".container .company-address", "__filter": ["uniq"] , "__prepare": ["join:;"]},
              "phone": {"selector": ".container .company-phone .js-store-user-action-statistic", "__filter": ["uniq"] , "__prepare": ["join:;"]},
              "email": ".container .company-email .color-black",
              "site": {"selector": ".container .company-site .color-black", "__output": {"attr": "href"}},
            }
          }
        },

      },

      "output": {
        "default": {
          "path": "data/scraped/stagem/list-if-catalog.xlsx",
          "options": {
            "dateable": false
          }
        }
      },

      "preprocessor": {
        "fields": {
          "name": "$fields.name",
          "address": "$fields.address",
          "phone": "$fields.phone",
          "email": "$fields.email",
          "site": "$fields.site",
          "url": "$fields.url",
        }
      }
    }
  }
};