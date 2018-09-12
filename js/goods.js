'use strict';

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
var ratingClassList = [
  'stars__rating--one',
  'stars__rating--two',
  'stars__rating--three',
  'stars__rating--four',
  'stars__rating--five'
];
var NUMBER_OF_GOODS = 26;
var IMAGE_PATH = 'img/cards/';

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

var getRatingClass = function (rating) {
  return ratingClassList[rating - 1];
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

var getGoods = function () {
  var items = [];

  for (var i = 0; i < NUMBER_OF_GOODS; i++) {
    var product = {
      name: names[i],
      picture: IMAGE_PATH + getImageName(),
      amount: getRandomInt(0, 20),
      price: getRandomInt(100, 1500),
      weight: getRandomInt(30, 300),
      rating: getRating(),
      nutritionFacts: getNutritionFacts()
    };

    items.push(product);
  }

  return items;
};

var catalogCardsElement = document.querySelector('.catalog__cards');
catalogCardsElement.classList.remove('catalog__cards--load');

var catalogLoadElement = catalogCardsElement.querySelector('.catalog__load');
catalogLoadElement.classList.add('visually-hidden');

var cardCatalogTemplate = document.querySelector('#card')
  .content
  .querySelector('.catalog__card');

var renderCatalogCard = function (item) {
  var cardCatalogElement = cardCatalogTemplate.cloneNode(true);
  var amountClass = '';

  if (item.amount === 0) {
    amountClass = 'card--soon';
  } else if (item.amount >= 1 && item.amount <= 5) {
    amountClass = 'card--little';
  } else {
    amountClass = 'card--in-stock';
  }

  cardCatalogElement.classList.add(amountClass);

  cardCatalogElement.querySelector('.card__title').textContent = item.name;

  cardCatalogElement.querySelector('.card__price').firstChild.textContent = item.price + ' ';

  cardCatalogElement.querySelector('.card__weight').textContent = '/ ' + item.weight + ' Г';

  cardCatalogElement.querySelector('.stars__rating').classList.remove('stars__rating--five');
  cardCatalogElement.querySelector('.stars__rating').classList.add(getRatingClass(item.rating.value));

  cardCatalogElement.querySelector('.star__count').textContent = '(' + item.rating.number + ')';

  var imgElement = cardCatalogElement.querySelector('.card__img');
  imgElement.src = item.picture;
  imgElement.alt = item.name;

  cardCatalogElement.querySelector('.card__characteristic').textContent = item.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';
  cardCatalogElement.querySelector('.card__composition-list').textContent = item.nutritionFacts.contents;

  return cardCatalogElement;
};

var cardTemplate = document.querySelector('#card-order')
  .content
  .querySelector('.goods_card');

var renderCard = function (item) {
  var cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('.card-order__title').textContent = item.name;

  var imgElement = cardElement.querySelector('.card-order__img');
  imgElement.alt = item.name;
  imgElement.src = item.picture;

  cardElement.querySelector('.card-order__price').textContent = item.price + ' ₽';

  return cardElement;
};

var goods = getGoods();
var fragmentCatalogCard = document.createDocumentFragment();

for (var i = 0; i < goods.length; i++) {
  fragmentCatalogCard.appendChild(renderCatalogCard(goods[i]));
}

document.querySelector('.catalog__cards').appendChild(fragmentCatalogCard);

// добавление в корзину
var goodsInCard = goods.slice(0, 3);
var fragmentCard = document.createDocumentFragment();

for (var j = 0; j < 3; j++) {
  fragmentCard.appendChild(
      renderCard(goodsInCard[j])
  );
}

var goodsCardsElement = document.querySelector('.goods__cards');
goodsCardsElement.querySelector('.goods__card-empty').remove();
goodsCardsElement.classList.remove('goods__cards--empty');
goodsCardsElement.appendChild(fragmentCard);
