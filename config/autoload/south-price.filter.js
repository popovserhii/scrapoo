module.exports = {
  "default": {
    "pool": {
      "shop-it": {
        "helper": {
          "filter-price": {
            "fixed": 0,
            "rules": [
              /*{ // Планшети
                "condition": "AND",
                "rules": [
                  {
                    "field": "name",
                    "type": "string",
                    "operator": "contains",
                    "value": "Планшет"
                  },
                ],
                "valid": true,
                "apply": {
                  "operand": "+5%",
                  "to": "$fields.price_purchase" // optional
                }
              },*/
              {
                "condition": "OR",
                "rules": [
                  {
                    "field": "price",
                    "type": "double",
                    "operator": "less_or_equal",
                    "value": "0"
                  },
                  {
                    "field": "price",
                    "type": "double",
                    "operator": "is_empty",
                    //"value": "0"
                  },
                ],
                "valid": true,
                "apply": {
                  "operand": "+5%",
                  "to": "$fields.price_purchase" // optional
                }
              },
              {
                "condition": "AND",
                "rules": [
                  {
                    "field": "price_purchase",
                    "type": "double",
                    "operator": "greater",
                    "value": "800.00"
                  },
                  {
                    "field": "manufacturer",
                    "type": "string",
                    "operator": "not_equal",
                    "value": "RONDELL"
                  },
                ],
                "valid": true,
                "apply": {
                  "operand": "+5%",
                  "to": "$fields.price_purchase" // optional
                }
              },
              {
                "condition": "AND",
                "rules": [
                  {
                    "field": "price",
                    "type": "double",
                    "operator": "greater",
                    "value": "150.00"
                  },
                ],
                " valid": true,
                "apply": {
                  "operand": "-7",
                  "to": "$fields.price" // optional
                }
              },
            ]
          },
        }
      }
    }
  }
};