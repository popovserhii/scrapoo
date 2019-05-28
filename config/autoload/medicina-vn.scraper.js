module.exports = {
  "scraper": {
    "medicina-vn-catalog": {
      "source": {
        "pool": "stagem",
        "type": "hierarchy",
        "name": "medicina-vn-catalog",

        "path": "http://medicina.vn.ua/ua/catalog/13/",
        //"selector": "ul li a:contains('Реабілітаційні центри')", // Стоматологія \ Реабілітаційні центри // вибираємо посилання по яких будемо сканувати, в даному випадку одне

        /*"iterate": {
          "classic": {
            "nextPage": ".pagination-sunshine li.active + li a", // наступна сторінка
            "pages": ".pagination-sunshine li a" // всі сторінки в пагінації
          },
        },*/

        "group": {
          "context": ".centrRightBl .CompItem", // якщо ми знаходимось в "group", тоді вказуємо "context" (селектор) відносно якого буде відбуватись подальша вибірка інформації
          "selector": "a.MainMenu", // "selector" який знаходиться в "group", працює відносно "context"

          "fields": {
            "url": {"selector": "a.MainMenu", "__output": {"attr": "href"}, "__prepare": [{"name": "base-url", "config": {"location": "$source.location"}}]},
          },

          "source": { // в даному випадку це кінцевий елемент в ієрархії, тому залишається лише вибрати потрібні дані і зберегти оброблену сутність
            "fields": {
              "name": ".centrRightBl .wrapBlH1 h1",
              "email": ".cont-item table td:contains('Эл. пошта') + td",
              "address": ".cont-item table td:contains('Адреса') + td",
              "phone": ".cont-item table td:contains('Телефон') + td",
              "site": {"selector": ".cont-item table td:contains('Сайт') + td a", "__output": {"attr": "href"}},
            }
          }
        },
      },

      "output": {
        "default": {
          "path": "data/scraped/stagem/medicina-vn-catalog.xlsx",
          "options": {
            "dateable": false
          }
        }
      },

      "preprocessor": {
        "fields": {
          "name": "$fields.name",
          "email": "$fields.email",
          "address": "$fields.address",
          "phone": "$fields.phone",
          "site": "$fields.site",
          "url": "$fields.url",
        }
      }
    }
  }
};