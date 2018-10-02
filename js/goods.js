'use strict';

var NUMBER_OF_GOODS = 26;
var IMAGE_PATH = 'img/cards/';

var cardCatalogTemplate = document.querySelector('#card')
  .content
  .querySelector('.catalog__card');

var cardTemplate = document.querySelector('#card-order')
  .content
  .querySelector('.goods_card');

var headerBasket = document.querySelector('.main-header__basket');
var goods = [];
var goodsInCard = {};
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

  var favoriteBtnElement = cardCatalogElement.querySelector('.card__btn-favorite');
  favoriteBtnElement.dataset.productId = item.id;
  if (item.favorite) {
    cardCatalogElement.classList.add('.card__btn-favorite--selected');
  }

  cardCatalogElement.querySelector('.card__btn').dataset.productId = item.id;

  var imgElement = cardCatalogElement.querySelector('.card__img');
  imgElement.src = item.picture;
  imgElement.alt = item.name;

  cardCatalogElement.querySelector('.card__characteristic').textContent = item.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';
  cardCatalogElement.querySelector('.card__composition-list').textContent = item.nutritionFacts.contents;

  return cardCatalogElement;
};

var renderGoodsInCard = function (item) {
  var cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('.card-order__title').textContent = item.name;

  var imgElement = cardElement.querySelector('.card-order__img');
  imgElement.alt = item.name;
  imgElement.src = item.picture;

  cardElement.querySelector('.card-order__price').textContent = item.price + ' ₽';

  cardElement.querySelector('.card-order__close').dataset.productId = item.id;
  cardElement.querySelector('.card-order__btn--decrease').dataset.productId = item.id;
  cardElement.querySelector('.card-order__btn--increase').dataset.productId = item.id;

  cardElement.querySelector('.card-order__count').dataset.productId = item.id;
  cardElement.querySelector('.card-order__count').value = goodsInCard[item.id].orderedAmount;

  return cardElement;
};

var displayElements = function (elements, containerElement) {
  var fragment = document.createDocumentFragment();

  elements.forEach(function (element) {
    fragment.appendChild(element);
  });

  containerElement.appendChild(fragment);
};

var createGoods = function () {
  goods = getGoods();
  var catalogCards = document.querySelector('.catalog__cards');
  var goodsElements = [];

  goods.forEach(function (product) {
    goodsElements.push(renderCatalogCard(product));
  });

  displayElements(goodsElements, catalogCards);
};

var renderCart = function () {
  var goodsCardsElement = document.querySelector('.goods__cards');
  var goodsInCardElements = [];

  for (var productId in goodsInCard) {
    if (goodsInCard.hasOwnProperty(productId)) {
      var product = getProductFromId(productId);

      goodsInCardElements.push(renderGoodsInCard(product));
    }
  }

  // перед отображением корзины удалить все карточки из неё
  document.querySelectorAll('.goods_card').forEach(function (goodsCard) {
    goodsCard.remove();
  });

  // Если в корзине есть товары, убрать сообщение о пустой корзине
  if (Object.keys(goodsInCard).length) {
    goodsCardsElement.querySelector('.goods__card-empty').classList.add('visually-hidden');
    goodsCardsElement.classList.remove('goods__cards--empty');
  } else {
    goodsCardsElement.querySelector('.goods__card-empty').classList.remove('visually-hidden');
    goodsCardsElement.classList.add('goods__cards--empty');
  }

  displayElements(goodsInCardElements, goodsCardsElement);
};

var addProductIdToCart = function (productId) {
  if (productId in goodsInCard) {
    goodsInCard[productId].orderedAmount += 1;
  } else {
    goodsInCard[productId] = {orderedAmount: 1};
  }

  headerBasket.textContent = 'В корзине полно вкусняшек';
};

var reduceProductIdInCart = function (productId) {
  goodsInCard[productId].orderedAmount -= 1;

  if (goodsInCard[productId].orderedAmount === 0) {
    removeProductIdFromCart(productId);
  }
};

var removeProductIdFromCart = function (productId) {
  delete goodsInCard[productId];

  if (!Object.keys(goodsInCard).length) {
    headerBasket.textContent = 'В корзине ничего нет';
  }
};

var toggleTabsDelivery = function () {
  var deliverStore = document.querySelector('.deliver__store');
  var deliverCourier = document.querySelector('.deliver__courier');

  document.querySelector('.deliver__toggle').addEventListener('click', function (evt) {
    if (!evt.target.id) {
      return;
    }

    deliverStore.classList.add('visually-hidden');
    deliverCourier.classList.add('visually-hidden');

    var id = evt.target.id;
    document.querySelector('.' + id).classList.remove('visually-hidden');
  });
};

var toggleTabsPayment = function () {
  var paymentCard = document.querySelector('.payment__card-wrap');
  var paymentCash = document.querySelector('.payment__cash-wrap');

  document.querySelector('.payment__method').addEventListener('click', function (evt) {
    if (!evt.target.id) {
      return;
    }

    paymentCard.classList.add('visually-hidden');
    paymentCash.classList.add('visually-hidden');

    var id = evt.target.id;
    document.querySelector('.' + id + '-wrap').classList.remove('visually-hidden');
  });
};

var hideCatalogLoadedText = function () {
  var catalogCardsElement = document.querySelector('.catalog__cards');
  catalogCardsElement.classList.remove('catalog__cards--load');

  var catalogLoadElement = catalogCardsElement.querySelector('.catalog__load');
  catalogLoadElement.classList.add('visually-hidden');
};

var getProductFromId = function (id) {
  return goods.find(function (product) {
    return product.id === id;
  });
};

var productHandler = function (evt) {
  var actionBtnElement = evt.target;

  // Добавление/удаление в избранное
  if (actionBtnElement.classList.contains('card__btn-favorite')) {
    evt.preventDefault();

    var product = getProductFromId(actionBtnElement.dataset.productId);
    if (actionBtnElement.classList.contains('card__btn-favorite--selected')) {
      // Удаление из избранного
      actionBtnElement.classList.remove('card__btn-favorite--selected');
      product.favorite = false;
    } else {
      // Добавление в избранное
      actionBtnElement.classList.add('card__btn-favorite--selected');
      product.favorite = true;
    }
  }

  //  Добавление товара в корзину
  if (actionBtnElement.classList.contains('card__btn')) {
    evt.preventDefault();

    var productId = actionBtnElement.dataset.productId;
    addProductIdToCart(productId);
    renderCart();
  }
};

var cartHandler = function (evt) {
  var actionBtnElement = evt.target;
  var productId = actionBtnElement.dataset.productId;

  // Удаление товара из корзины
  if (actionBtnElement.classList.contains('card-order__close')) {
    evt.preventDefault();

    removeProductIdFromCart(productId);
    renderCart();
  }

  // Увеличить количество товара в корзине на единицу
  if (actionBtnElement.classList.contains('card-order__btn--increase')) {
    evt.preventDefault();

    addProductIdToCart(productId);
    renderCart();
  }

  // Уменьшить  количество товара в корзине на единицу
  if (actionBtnElement.classList.contains('card-order__btn--decrease')) {
    evt.preventDefault();

    reduceProductIdInCart(productId);
    renderCart();
  }
};

var priceSlider = function () {
  var maxPrice = 100;
  var priceMinEl = document.querySelector('.range__price--min');
  var priceMaxEl = document.querySelector('.range__price--max');
  var rangeBtnLeftEl = document.querySelector('.range__btn--left');
  var rangeBtnRightEl = document.querySelector('.range__btn--right');
  var getPercentFromRangeBtn = function (el) {
    var percent = parseFloat(el.style.left);
    return maxPrice * percent / 100;
  };

  rangeBtnLeftEl.addEventListener('mouseup', function (evt) {
    priceMinEl.textContent = getPercentFromRangeBtn(evt.target);
  });

  rangeBtnRightEl.addEventListener('mouseup', function (evt) {
    priceMaxEl.textContent = getPercentFromRangeBtn(evt.target);
  });
};

var checkCardNumber = function (inputValue) {
  var numbers = inputValue.split('').map(function (char, index) {
    var digit = parseInt(char, 10);

    if (index % 2 === 0) {
      digit *= 2;
    }

    return digit > 9 ? digit - 9 : digit;
  });

  var sum = numbers.reduce(function (a, b) {
    return a + b;
  }, 0);

  return sum % 10 === 0;
};

var cardNumberHandler = function (evt) {
  var cardInput = evt.target;

  if (cardInput.value.length !== 16) {
    cardInput.setCustomValidity('Номер карты должен состоять из 16 символов');
    // return;
  }

  if (checkCardNumber(cardInput.value)) {
    cardInput.setCustomValidity('');
  } else {
    cardInput.setCustomValidity('Неверный номер кредитной карты');
  }
};

hideCatalogLoadedText();
createGoods();
toggleTabsDelivery();
toggleTabsPayment();
priceSlider();

document.querySelector('.catalog__cards').addEventListener('click', productHandler);

document.querySelector('.goods__cards').addEventListener('click', cartHandler);

document.querySelector('#payment__card-number').addEventListener('input', cardNumberHandler);
