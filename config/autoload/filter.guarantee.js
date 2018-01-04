module.exports = {
  "default": {
    "pool": {
      "shop-it": {
        "helper": {
          "filter-guarantee": {
            "convertTo": "month",
            "map": {
              "month": [
                "(\\d+) м",
              ],
              "year": [
                "(\\d+) г",
                "(\\d+) л",
              ],
              "day": [
                "(\\d+) д",
              ],
            }
          },
        }
      }
    }
  }
};