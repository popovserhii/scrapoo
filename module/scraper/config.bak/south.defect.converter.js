module.exports = {
  "converter": {
    "south-defect": {
      "path": "data/RASPRODAZHA.xls",
      "default": {
        "categorize": {"name": "Category", "__filter": ["replace:/^.+\/.+?\s(.*)$/, $1", "upper-first"]}
      },
      "sheet": [
        {"name": "Дефект уп-ки Акция!", "skip": 1},
        {"name": "it_ноутбуки", "skip": 1},
        {"name": "быт.тех", "skip": 1},
        {"name": "TV_видео_аудио", "skip": 1},
        {"name": "авто_ц.фото_ц.планшеты_аудио", "skip": 1},
        {"name": "моб.тел_планшеты", "skip": 1}
      ]
    }
  }
};