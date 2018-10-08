'use strict';

(function () {
  var NUMBER_OF_GOODS = 26;
  var IMAGE_PATH = 'img/cards/';

  var names = [
    'Чесночные сливки',
    'Огуречный педант',
    'Молочная хрюша',
    'Грибной шейк',
    'Баклажановое безумие',
    'Паприколу итальяно',
    'Нинзя-удар васаби',
    'Хитрый баклажан',
    'Горчичный вызов',
    'Кедровая липучка',
    'Корманный портвейн',
    'Чилийский задира',
    'Беконовый взрыв',
    'Арахис vs виноград',
    'Сельдерейная душа',
    'Початок в бутылке',
    'Чернющий мистер чеснок',
    'Раша федераша',
    'Кислая мина',
    'Кукурузное утро',
    'Икорный фуршет',
    'Новогоднее настроение',
    'С пивком потянет',
    'Мисс креветка',
    'Бесконечный взрыв',
    'Невинные винные',
    'Бельгийское пенное',
    'Острый язычок'
  ];
  var contents = [
    'молоко',
    'сливки',
    'вода',
    'пищевой краситель',
    'патока',
    'ароматизатор бекона',
    'ароматизатор свинца',
    'ароматизатор дуба, идентичный натуральному',
    'ароматизатор картофеля',
    'лимонная кислота',
    'загуститель',
    'эмульгатор',
    'консервант: сорбат калия',
    'посолочная смесь: соль, нитрит натрия',
    'ксилит',
    'карбамид',
    'вилларибо',
    'виллабаджо'
  ];
  var pictureNames = [
    'gum-cedar.jpg',
    'gum-chile.jpg',
    'gum-eggplant.jpg',
    'gum-mustard.jpg',
    'gum-portwine.jpg',
    'gum-wasabi.jpg',
    'ice-cucumber.jpg',
    'ice-eggplant.jpg',
    'ice-garlic.jpg',
    'ice-italian.jpg',
    'ice-mushroom.jpg',
    'ice-pig.jpg',
    'marmalade-beer.jpg',
    'marmalade-caviar.jpg',
    'marmalade-corn.jpg',
    'marmalade-new-year.jpg',
    'marmalade-sour.jpg',
    'marshmallow-bacon.jpg',
    'marshmallow-beer.jpg',
    'marshmallow-shrimp.jpg',
    'marshmallow-spicy.jpg',
    'marshmallow-wine.jpg',
    'soda-bacon.jpg',
    'soda-celery.jpg',
    'soda-cob.jpg',
    'soda-garlic.jpg',
    'soda-peanut-grapes.jpg',
    'soda-russian.jpg'
  ];

  // Возвращает случайное целое число между min (включительно) и max (включительно)
  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var getImageName = function () {
    var index = getRandomInt(0, pictureNames.length - 1);
    return pictureNames[index];
  };

  var getRating = function () {
    return {
      value: getRandomInt(1, 5),
      number: getRandomInt(10, 900)
    };
  };

  var getNutritionFacts = function () {
    var content = [];
    var maxContentLength = getRandomInt(1, contents.length - 1);

    for (var i = 0; i < maxContentLength; i++) {
      content.push(contents[i]);
    }

    return {
      sugar: !!getRandomInt(0, 1),
      energy: getRandomInt(70, 500),
      contents: content.join(', ')
    };
  };

  window.getGoods = function () {
    var items = [];

    for (var i = 0; i < NUMBER_OF_GOODS; i++) {
      items.push({
        id: i.toString(),
        favorite: false,
        name: names[i],
        picture: IMAGE_PATH + getImageName(),
        amount: getRandomInt(0, 20),
        price: getRandomInt(100, 1500),
        weight: getRandomInt(30, 300),
        rating: getRating(),
        nutritionFacts: getNutritionFacts()
      });
    }

    return items;
  };
})();
