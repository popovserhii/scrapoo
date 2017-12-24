# Web Content Scraper

## Вирізки по модульній організації коду
https://stackoverflow.com/questions/39199776/express-js-modular-rest-framework
https://javabeat.net/nodejs-modular-application/
https://stackoverflow.com/questions/5778245/expressjs-how-to-structure-an-application


## Mixin
Mixin implementation use [mixwith.js](https://github.com/justinfagnani/mixwith.js) library.

### Mixin usage
For example, create *YourNewMixin*
```
const YourNewMixin = (SuperClass) => class extends SuperClass {
  mixinMethod() {
  }
}

module.exports = YourNewMixin;
```
Include new mixin in your code
```
const mix = require('mixwith').mix;
const YourNewMixin = require('path/to/your-new-mixin');

class Scraper extends mix(Object).with(YourNewMixin) {
}
```
In example above show extending from standard JS `Object` class, because `Scraper` class does not have any super class.
If you have `super` class simply replace `Object` with your class. 


## Configuration
Now config files is include with `require()` method.
More detailed can read [here](https://stackoverflow.com/a/26446604/1335142) or another [acceptable solution](https://goenning.net/2016/05/13/how-i-manage-application-configuration-with-nodejs/)

### Config Hierarchy
The main goal is customization and extensibility.
There are several config levels and anybody can choose appropriate for self.
All config should at minimum be bind to specific `pool`.

On the top is `default`
```
{
  "default": {
	  "pool": {
		"your-pool": {
			"scraper": {},
			// other custom configuration here
		}
	  },
	  "scraper": {},
	  "converter": {},
	  "sheet": {},
	  "helper": {},
      // custom configuration here
    }
  }
}
```

- specific by task
```
{
  "scraper": {
    "your-custom-task": {
       "pool": "your-pool",
       // custom configuration here
     }
  }
}
```

- specific by helper
```
{
  "scraper": {
    "your-custom-task": {
       "pool": "your-pool",
       "preprocessor": {
         "fields": {
            "special_price": {
              "__filter": [{
                "name": "price", 
                "config": {
                  // custom configuration here
                }
              }]
            }
         }
       }
     }
  }
}
```

Configuration is merged in the order shown above, **specific by helper** wins. 

### General config keys information

    - for "path" allowed next formats:
    -- string: "path": "path/to/file.ext"
    -- json: "path": {"name": "path/to/file.ext"}
    -- array: "path": ["path/to/file.ext", "path/to/file2.ext"]
    -- array combination: "path": [{"name": "path/to/file.ext"}, "path/to/file2.ext"]
    -- glob pattern: in all above config can be used glob pattern 

## Helpers
### Price Helper
`apply` option allows carry out different arithmetic operations, such as add or subtract some part of price.
Available all mathematics operation: "+", "-", "*", "/" and "%" (percent) operation.

* `{"apply": "-7"}` - subtract 7 from price
* `{"apply": "+10%"}` - add 10 percent to price, and etc.

Also is possibility to pass server price and base on that order apply different conditions.
```
"field_name": {
    "value": ["$source.price", "$source.price_purchase"], 
    "__filter": [
        {
            "name": "price", 
            "apply": {"0": "-7", "1": "+20%"}
        }
    ]
}
```
Under such circumstances first ($source.price) price is checked and if it less than zero then second ($source.price_purchase) price is handled.
Index number is important in `apply` config.

`minRate` option allows set minimal price for which you can apply conditions above.

`fixed` option allows specifying quantity of numbers after the point.  
 