'use strict';

(function () {
  var URL_GOODS = 'https://js.dump.academy/candyshop/data';
  var IMG_GOODS_PATH = './img/cards/';
  var cardCatalogTemplate = document.querySelector('#card')
    .content
    .querySelector('.catalog__card');

  var cardTemplate = document.querySelector('#card-order')
    .content
    .querySelector('.goods_card');

  var headerBasket = document.querySelector('.main-header__basket');
  var catalogCardsEl = document.querySelector('.catalog__cards');
  var goodsCardsEl = document.querySelector('.goods__cards');
  var goodsInCart = {};
  var goods = [];
  var ratingClassList = [
    'stars__rating--one',
    'stars__rating--two',
    'stars__rating--three',
    'stars__rating--four',
    'stars__rating--five'
  ];

  var loadGoods = function () {
    var onError = function () {
    };

    var onSuccess = function (data) {
      goods = data;
      hideCatalogLoadedText();

      var goodsElements = [];

      goods.forEach(function (product) {
        goodsElements.push(renderCatalogCard(product));
      });

      displayElements(goodsElements, catalogCardsEl);
    };

    window.load(URL_GOODS, onSuccess, onError);
  };

  var getRatingClass = function (rating) {
    return ratingClassList[rating - 1];
  };

  var renderCatalogCard = function (item) {
    var cardCatalogEl = cardCatalogTemplate.cloneNode(true);
    var amountClass = '';

    if (item.amount === 0) {
      amountClass = 'card--soon';
    } else if (item.amount >= 1 && item.amount <= 5) {
      amountClass = 'card--little';
    } else {
      amountClass = 'card--in-stock';
    }

    cardCatalogEl.classList.add(amountClass);

    cardCatalogEl.querySelector('.card__title').textContent = item.name;

    cardCatalogEl.querySelector('.card__price').firstChild.textContent = item.price + ' ';

    cardCatalogEl.querySelector('.card__weight').textContent = '/ ' + item.weight + ' Г';

    cardCatalogEl.querySelector('.stars__rating').classList.remove('stars__rating--five');
    cardCatalogEl.querySelector('.stars__rating').classList.add(getRatingClass(item.rating.value));

    cardCatalogEl.querySelector('.star__count').textContent = '(' + item.rating.number + ')';

    var favoriteBtnElement = cardCatalogEl.querySelector('.card__btn-favorite');
    favoriteBtnElement.dataset.productName = item.name;
    if (item.favorite) {
      cardCatalogEl.classList.add('.card__btn-favorite--selected');
    }

    cardCatalogEl.querySelector('.card__btn').dataset.productName = item.name;

    var imgElement = cardCatalogEl.querySelector('.card__img');
    imgElement.src = IMG_GOODS_PATH + item.picture;
    imgElement.alt = item.name;

    cardCatalogEl.querySelector('.card__characteristic').textContent = item.nutritionFacts.sugar ? 'Содержит сахар' : 'Без сахара';
    cardCatalogEl.querySelector('.card__composition-list').textContent = item.nutritionFacts.contents;

    return cardCatalogEl;
  };

  var renderGoodsInCart = function (item) {
    var cardElement = cardTemplate.cloneNode(true);

    cardElement.querySelector('.card-order__title').textContent = item.name;

    var imgElement = cardElement.querySelector('.card-order__img');
    imgElement.src = IMG_GOODS_PATH + item.picture;
    imgElement.alt = item.name;

    cardElement.querySelector('.card-order__price').textContent = item.price + ' ₽';

    cardElement.querySelector('.card-order__close').dataset.productName = item.name;
    cardElement.querySelector('.card-order__btn--decrease').dataset.productName = item.name;
    cardElement.querySelector('.card-order__btn--increase').dataset.productName = item.name;

    cardElement.querySelector('.card-order__count').dataset.productName = item.name;
    cardElement.querySelector('.card-order__count').value = goodsInCart[item.name].orderedAmount;

    return cardElement;
  };

  var displayElements = function (elements, containerElement) {
    var fragment = document.createDocumentFragment();

    elements.forEach(function (element) {
      fragment.appendChild(element);
    });

    containerElement.appendChild(fragment);
  };

  var renderCart = function () {
    var goodsInCartElements = [];

    for (var productName in goodsInCart) {
      if (goodsInCart.hasOwnProperty(productName)) {
        var product = getProductFromName(productName);

        goodsInCartElements.push(renderGoodsInCart(product));
      }
    }

    // перед отображением корзины удалить все карточки из неё
    document.querySelectorAll('.goods_card').forEach(function (goodsCard) {
      goodsCard.remove();
    });

    // Если в корзине есть товары, убрать сообщение о пустой корзине
    if (Object.keys(goodsInCart).length) {
      goodsCardsEl.querySelector('.goods__card-empty').classList.add('visually-hidden');
      goodsCardsEl.classList.remove('goods__cards--empty');
    } else {
      goodsCardsEl.querySelector('.goods__card-empty').classList.remove('visually-hidden');
      goodsCardsEl.classList.add('goods__cards--empty');
    }

    displayElements(goodsInCartElements, goodsCardsEl);
  };

  var addProductToCart = function (name) {
    if (name in goodsInCart) {
      goodsInCart[name].orderedAmount += 1;
    } else {
      goodsInCart[name] = {orderedAmount: 1};
    }

    headerBasket.textContent = 'В корзине полно вкусняшек';
  };

  var reduceProductInCart = function (productName) {
    goodsInCart[productName].orderedAmount -= 1;

    if (goodsInCart[productName].orderedAmount === 0) {
      removeProductFromCard(productName);
    }
  };

  var removeProductFromCard = function (productName) {
    delete goodsInCart[productName];

    if (!Object.keys(goodsInCart).length) {
      headerBasket.textContent = 'В корзине ничего нет';
    }
  };

  var productHandler = function (evt) {
    var actionBtnElement = evt.target;

    // Добавление/удаление в избранное
    if (actionBtnElement.classList.contains('card__btn-favorite')) {
      evt.preventDefault();

      var product = getProductFromName(actionBtnElement.dataset.productName);
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

      var productName = actionBtnElement.dataset.productName;
      addProductToCart(productName);
      renderCart();
    }
  };

  var cartHandler = function (evt) {
    var actionBtnElement = evt.target;
    var productName = actionBtnElement.dataset.productName;

    // Удаление товара из корзины
    if (actionBtnElement.classList.contains('card-order__close')) {
      evt.preventDefault();

      removeProductFromCard(productName);
      renderCart();
    }

    // Увеличить количество товара в корзине на единицу
    if (actionBtnElement.classList.contains('card-order__btn--increase')) {
      evt.preventDefault();

      addProductToCart(productName);
      renderCart();
    }

    // Уменьшить  количество товара в корзине на единицу
    if (actionBtnElement.classList.contains('card-order__btn--decrease')) {
      evt.preventDefault();

      reduceProductInCart(productName);
      renderCart();
    }
  };

  var getProductFromName = function (name) {
    return goods.find(function (product) {
      return product.name === name;
    });
  };

  var hideCatalogLoadedText = function () {
    catalogCardsEl.classList.remove('catalog__cards--load');

    var catalogLoadElement = catalogCardsEl.querySelector('.catalog__load');
    catalogLoadElement.classList.add('visually-hidden');
  };

  loadGoods();

  catalogCardsEl.addEventListener('click', productHandler);

  goodsCardsEl.addEventListener('click', cartHandler);
})();
