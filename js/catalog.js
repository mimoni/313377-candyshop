'use strict';

(function () {

  var cardCatalogTemplate = document.querySelector('#card')
    .content
    .querySelector('.catalog__card');

  var cardTemplate = document.querySelector('#card-order')
    .content
    .querySelector('.goods_card');

  var headerBasket = document.querySelector('.main-header__basket');
  var catalogCardsEl = document.querySelector('.catalog__cards');
  var goodsCardsEl = document.querySelector('.goods__cards');
  var goods = [];
  var goodsInCard = {};

  var ratingClassList = [
    'stars__rating--one',
    'stars__rating--two',
    'stars__rating--three',
    'stars__rating--four',
    'stars__rating--five'
  ];

  var getRatingClass = function (rating) {
    return ratingClassList[rating - 1];
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
    goods = window.getGoods();
    var goodsElements = [];

    goods.forEach(function (product) {
      goodsElements.push(renderCatalogCard(product));
    });

    displayElements(goodsElements, catalogCardsEl);
  };

  var renderCart = function () {
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
      goodsCardsEl.querySelector('.goods__card-empty').classList.add('visually-hidden');
      goodsCardsEl.classList.remove('goods__cards--empty');
    } else {
      goodsCardsEl.querySelector('.goods__card-empty').classList.remove('visually-hidden');
      goodsCardsEl.classList.add('goods__cards--empty');
    }

    displayElements(goodsInCardElements, goodsCardsEl);
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

  var getProductFromId = function (id) {
    return goods.find(function (product) {
      return product.id === id;
    });
  };

  var hideCatalogLoadedText = function () {
    catalogCardsEl.classList.remove('catalog__cards--load');

    var catalogLoadElement = catalogCardsEl.querySelector('.catalog__load');
    catalogLoadElement.classList.add('visually-hidden');
  };

  hideCatalogLoadedText();
  createGoods();

  catalogCardsEl.addEventListener('click', productHandler);

  goodsCardsEl.addEventListener('click', cartHandler);
})();
