module.exports = {
  "scraper": {
    "dentistry-catalog": {
      "source": {
        "pool": "stagem",
        "type": "hierarchy",
        "name": "dentistry-catalog",

        "path": "https://www.dlab.com.ua/biznes-katalog",
        "selector": "ul li a:contains('Реабілітаційні центри')", // Стоматологія \ Реабілітаційні центри // вибираємо посилання по яких будемо сканувати, в даному випадку одне

        //"fields": {} // на першому рівні в нас немає важливої інформації для збереження


        // дочірній елемент має аналогічну структуру, крім службових полів pool, type, name
        // path опускається, так як він автоматично дорівнює урл отриманому на рівні вище
        "source": {
          //"path": "https://www.dlab.com.ua/biznes-katalog",
          //"selector": ".company-info-desc a", // опускаємо "selector", якщо є "group". Це значить що потрібно парсити значення на поточній сторінці і провалюватись в середину

          //"pagination": {
          "iterate": {
            // classic - класичний перемикач з кількістю сторінок (1, 2, 3..., 99)
            // load-more - при кліку на кнопку підвантажується наступна порація даних
            // on-scroll - коли прокручування пройшло до кінця сторінки, автоматично підтягується наступна порація даних
            //"type":   // [classic. loadMore, onScroll]

            "classic": {
              //"context": ".b-paginator",
              //"active": ".b-paginator .item-link.act", // активна сторінка
              "nextPage": ".b-paginator .item:has(> span.act) + .item a", // наступна сторінка
              "pages": ".b-paginator .item-link" // всі сторінки в пагінації
            },
            //"loadMore": {
            //  "next": ".preloader-trigger .g-i-more-link", // кнопка "load-more"
            //},
            //"onScroll": {},
          },

          // прийняв рішення генерувати конфіг "crawler" динамічно, щоб не порушувати цілісність даного модулю
          /*"crawler": [
            {
              "name": "default",
              "group": {
                "selector": ".company-info-header h2 a", // "selector" який знаходиться в "group", працює відносно "context"
                "fields": {
                  "ownership": {"selector": ".company-additional-info", "__output": {"as": "html"}, "__prepare": ["list-to-flat-json", "find-merge:{name:'Посуд'},{parent:''}", "delete:Все для дому"]}
                },
              }
            }
          ],*/

          "group": {
            "context": ".company-info", // якщо ми знаходимось в "group", тоді вказуємо "context" (селектор) відносно якого буде відбуватись подальша вибірка інформації
            "selector": ".company-info-header h2 a", // "selector" який знаходиться в "group", працює відносно "context"

            "fields": {
              "ownership": {"selector": ".company-additional-info"},
              "url": {"selector": ".company-info-header h2[itemprop='name'] a", "__output": {"attr": "href"}, "__prepare": [{"name": "base-url", "config": {"location": "$source.location"}}]},
            },

            "source": { // в даному випадку це кінцевий елемент в ієрархії, тому залишається лише вибрати потрібні дані і зберегти оброблену сутність
              "fields": {
                "name": ".b-profile-header",
                "zip": ".company-info-data .row [itemprop='postalCode']",
                "address": ".company-info-data div:contains('Адреса:') ~ div.data, .company-info-data div:contains('Фактична адреса:') ~ div.data",
                "phone": ".company-info-data .row [itemprop='telephone']",
                "phone_additional": ".company-info-data div:contains('Телефони:') ~ div.data",
                "email": ".company-info-data .row [itemprop='email']",
                "site": ".company-info-data .row [itemprop='url']",
              }
            }
          }
        }
      },

      "output": {
        "default": {
          "path": "data/scraped/stagem/dentistry-catalog.xlsx",
          "options": {
            "dateable": false
          }
        }
      },

      "preprocessor": {
        "fields": {
          "name": "$fields.name",
          "ownership": "$fields.ownership",
          "zip": "$fields.zip",
          "address": "$fields.address",
          "phone": "$fields.phone",
          "phone_additional": "$fields.phone_additional",
          "email": "$fields.email",
          "site": "$fields.site",
          "url": "$fields.url",
        }
      }
    }
  }
};