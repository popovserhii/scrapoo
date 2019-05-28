module.exports = {
  "scraper": {
    "101stomatolog-catalog": {
      "source": {
        "pool": "stagem",
        "type": "hierarchy",
        "name": "101stomatolog-catalog",

        "path": "http://101stomatolog.com.ua/stomatologii/",
        //"selector": "ul li a:contains('Реабілітаційні центри')", // Стоматологія \ Реабілітаційні центри // вибираємо посилання по яких будемо сканувати, в даному випадку одне

        "iterate": {
          "classic": {
            "nextPage": ".pagination li.active + li a", // наступна сторінка
            "pages": ".pagination li a" // всі сторінки в пагінації
          },
        },

        "group": {
          "context": ".stomatology-list .list-item", // якщо ми знаходимось в "group", тоді вказуємо "context" (селектор) відносно якого буде відбуватись подальша вибірка інформації
          "selector": ".right + p a", // "selector" який знаходиться в "group", працює відносно "context"

          "fields": {
            "url": {"selector": ".right + p a", "__output": {"attr": "href"}, "__prepare": [{"name": "base-url", "config": {"location": "$source.location"}}]},
          },

          "source": { // в даному випадку це кінцевий елемент в ієрархії, тому залишається лише вибрати потрібні дані і зберегти оброблену сутність
            "fields": {
              "type": ".single .type",
              "name": ".single h1",
              "address": ".single .address",
              "phone": ".single .phone a",
              "phone_additional": {"selector": ".text-content p:has(img[alt='Телефон'])", "__prepare": ["join:;"]},
              "email": ".text-content a[href^='mailto'] + a[href^='mailto']",
              "site": {"selector": ".single ._more.www", "__output": {"attr": "href"}},
              "facebook": ".text-content p:contains('Страница на Facebook') a",
              "price_category": ".single .price-category span",
            }
          }
        },

      },

      "output": {
        "default": {
          "path": "data/scraped/stagem/101stomatolog-catalog.xlsx",
          "options": {
            "dateable": false
          }
        }
      },

      "preprocessor": {
        "fields": {
          "type": "$fields.type",
          "name": "$fields.name",
          "address": "$fields.address",
          "phone": "$fields.phone",
          "phone_additional": "$fields.phone_additional",
          "email": "$fields.email",
          "site": "$fields.site",
          "url": "$fields.url",
          "facebook": "$fields.facebook",
          "price_category": "$fields.price_category",
        }
      }
    }
  }
};