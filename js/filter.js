'use strict';

(function () {
  var formFilterEl = document.querySelector('.catalog__sidebar form');
  var filterPopularEl = formFilterEl.querySelector('#filter-popular');
  var resetFilterBtn = formFilterEl.querySelector('.catalog__submit');

  var rangeCountEl = formFilterEl.querySelector('.range__count');
  var priceMinEl = formFilterEl.querySelector('.range__price--min');
  var priceMaxEl = formFilterEl.querySelector('.range__price--max');
  var rangeWidth = formFilterEl.querySelector('.range__filter').offsetWidth;
  var rangePinLeftEl = formFilterEl.querySelector('.range__btn--left');
  var rangePinRightEl = formFilterEl.querySelector('.range__btn--right');
  var rangeFillLineEl = formFilterEl.querySelector('.range__fill-line');

  var catalogCardsEl = document.querySelector('.catalog__cards-wrap');
  var maxPrice;

  var emptyFiltersTemplate = document.querySelector('#empty-filters')
    .content
    .querySelector('.catalog__empty-filter');

  var showEmptyFilterMessage = function () {
    catalogCardsEl.appendChild(emptyFiltersTemplate);
  };

  var removeEmptyFilterMessage = function () {
    var emptyFilterMessage = catalogCardsEl.querySelector('.catalog__empty-filter');

    if (emptyFilterMessage) {
      emptyFilterMessage.remove();
    }
  };

  var updateCount = function (countEl, count) {
    countEl.textContent = '(' + count + ')';
  };

  var updateRangeCount = function (count) {
    updateCount(rangeCountEl, count);
  };

  var setMaxPriceProduct = function (goods) {
    var products = goods.slice();
    var mostExpensiveProduct = products.sort(sortDescendingPrice)[0].price;
    maxPrice = mostExpensiveProduct;
    priceMaxEl.textContent = mostExpensiveProduct;
  };

  var getItemCountElFromInputId = function (id) {
    return formFilterEl.querySelector('#' + id).nextElementSibling.nextElementSibling;
  };

  var updateCountsGoods = function (goods) {
    setMaxPriceProduct(goods);
    updateRangeCount(goods.length);

    var idsFiltersFoodType = getIdsFilterByTypeAll('food-type');
    var idsFiltersFoodProperty = getIdsFilterByTypeAll('food-property');
    var idsForCount = idsFiltersFoodType.concat(idsFiltersFoodProperty);

    idsForCount.forEach(function (filterId) {
      var filter = goodsFilters[filterId];
      var count = goods.filter(filter).length;
      var itemCountEl = getItemCountElFromInputId(filterId);

      updateCount(itemCountEl, count);
    });
  };

  var priceSlider = function () {
    var minXPosition = 0;
    var pinWidth = rangePinLeftEl.offsetWidth;
    var getPriceFromRangeBtn = function (el) {
      var percent = parseFloat(el.style.left) * 100 / rangeWidth;
      return Math.round(maxPrice * percent / 100);
    };

    var removeEvent = function (mouseUpHandler, mouseMoveHandler) {
      document.removeEventListener('mouseup', mouseUpHandler);
      document.removeEventListener('mousemove', mouseMoveHandler);
    };

    rangePinLeftEl.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      var pin = evt.target;
      var shiftX = evt.clientX - parseInt(pin.style.left, 10);

      var mouseMoveHandler = function (moveEvt) {
        priceMinEl.textContent = getPriceFromRangeBtn(pin);
        var newPositionPin = moveEvt.clientX - shiftX;

        if (newPositionPin < minXPosition) {
          newPositionPin = 0;
        }

        var rightLimit = parseInt(rangePinRightEl.style.left, 10) - pinWidth / 2;
        if (newPositionPin > rightLimit) {
          newPositionPin = rightLimit;
        }

        pin.style.left = newPositionPin + 'px';
        rangeFillLineEl.style.left = newPositionPin + 'px';

        applyFilter();
      };

      var mouseUpHandler = function () {
        priceMinEl.textContent = getPriceFromRangeBtn(pin);
        applyFilter();

        removeEvent(mouseUpHandler, mouseMoveHandler);
      };

      document.addEventListener('mouseup', mouseUpHandler);
      document.addEventListener('mousemove', mouseMoveHandler);
    });

    rangePinRightEl.addEventListener('mousedown', function (evt) {
      evt.preventDefault();

      var pin = evt.target;
      var shiftX = evt.clientX - parseInt(pin.style.left, 10);

      var mouseMoveHandler = function (moveEvt) {
        priceMaxEl.textContent = getPriceFromRangeBtn(pin);

        var newPositionPin = moveEvt.clientX - shiftX;

        if (newPositionPin > rangeWidth) {
          newPositionPin = rangeWidth;
        }

        var leftLimiter = Math.abs(parseInt(rangePinLeftEl.style.left, 10) + pinWidth / 2);
        if (newPositionPin < leftLimiter) {
          newPositionPin = leftLimiter;
        }

        pin.style.left = newPositionPin + 'px';
        rangeFillLineEl.style.right = rangeWidth - newPositionPin + 'px';

        applyFilter();
      };

      var mouseUpHandler = function () {
        priceMaxEl.textContent = getPriceFromRangeBtn(pin);

        removeEvent(mouseUpHandler, mouseMoveHandler);

        applyFilter();
      };

      document.addEventListener('mouseup', mouseUpHandler);
      document.addEventListener('mousemove', mouseMoveHandler);
    });
  };

  var resetPriceSlider = function () {
    priceMinEl.textContent = 0;
    priceMaxEl.textContent = maxPrice;

    rangePinLeftEl.style.left = 0 + 'px';
    rangePinRightEl.style.left = rangeWidth + 'px';

    rangeFillLineEl.style.left = 0 + 'px';
    rangeFillLineEl.style.right = 0 + 'px';
  };

  // filter functions
  var isSugarFree = function (product) {
    return product.nutritionFacts.sugar === false;
  };

  var isVegetarian = function (product) {
    return product.nutritionFacts.vegetarian;
  };

  var isGlutenFree = function (product) {
    return product.nutritionFacts.gluten === false;
  };

  var productKidFilter = function (kind) {
    return function (product) {
      return product.kind === kind;
    };
  };

  var getCheckedInputs = function () {
    var inputs = formFilterEl.querySelectorAll('input');
    var checkedInputsIds = [];

    inputs.forEach(function (input) {
      if (input.checked) {
        checkedInputsIds.push(input);
      }
    });

    return checkedInputsIds;
  };

  var getIdsFilterByType = function (foodType) {
    var inputs = getCheckedInputs();
    var result = [];

    inputs.forEach(function (input) {
      if (input.name === foodType) {
        result.push(input.id);
      }
    });

    return result;
  };

  var getIdsFilterByTypeAll = function (foodType) {
    var inputs = formFilterEl.querySelectorAll('input');
    var result = [];

    inputs.forEach(function (input) {
      if (input.name === foodType) {
        result.push(input.id);
      }
    });

    return result;
  };

  // Сортировка 'сначала дешёвые'
  var sortAscendingPrice = function (a, b) {
    return a.price - b.price;
  };

  // Сортировка 'сначала дорогие'
  var sortDescendingPrice = function (a, b) {
    return b.price - a.price;
  };

  // Сортировкапо рейтингу
  var sortByRating = function (a, b) {
    var ratingValue = b.rating.value - a.rating.value;
    if (ratingValue !== 0) {
      return ratingValue;
    }

    return b.rating.number - a.rating.number;
  };

  var goodsFilters = {
    'filter-sugar-free': isSugarFree,
    'filter-vegetarian': isVegetarian,
    'filter-gluten-free': isGlutenFree,
    'filter-icecream': productKidFilter('Мороженое'),
    'filter-soda': productKidFilter('Газировка'),
    'filter-gum': productKidFilter('Жевательная резинка'),
    'filter-marmalade': productKidFilter('Мармелад'),
    'filter-marshmallows': productKidFilter('Зефир'),
    'filter-expensive': sortDescendingPrice,
    'filter-cheep': sortAscendingPrice,
    'filter-rating': sortByRating
  };

  var changeFilterHandler = function (evt) {
    var inputEl = evt.target;

    if (inputEl.name === 'mark') {
      return;
    }

    applyFilter();
  };

  var applyFilter = function () {
    var goods = window.catalog.goods.slice();
    var idsFiltersFoodType = getIdsFilterByType('food-type');
    var filteredGoods = [];

    // Фильтрация по виду товара
    idsFiltersFoodType.forEach(function (idFilter) {
      filteredGoods = filteredGoods.concat(
          goods.filter(goodsFilters[idFilter])
      );
    });

    if (idsFiltersFoodType.length === 0) {
      filteredGoods = goods;
    }

    // Фильтрация по составу
    var idsFiltersFoodProperty = getIdsFilterByType('food-property');
    idsFiltersFoodProperty.forEach(function (idFilter) {
      filteredGoods = filteredGoods.filter(goodsFilters[idFilter]);
    });

    // Сортировка
    var sortFunctionId = getIdsFilterByType('sort')[0];
    if (sortFunctionId !== 'filter-popular') {
      var sortFunction = goodsFilters[sortFunctionId];
      filteredGoods.sort(sortFunction);
    }

    // Фильтрация по цене
    var priceMax = parseInt(priceMaxEl.textContent, 10);
    var priceMin = parseInt(priceMinEl.textContent, 10);

    filteredGoods = filteredGoods.filter(function (product) {
      var price = product.price;
      return (price >= priceMin) && (price <= priceMax);
    });

    updateRangeCount(filteredGoods.length);

    window.catalog.renderCatalogGoods(filteredGoods);

    if (filteredGoods.length) {
      removeEmptyFilterMessage();
    } else {
      showEmptyFilterMessage();
    }
  };

  var resetFilter = function () {
    var inputs = formFilterEl.querySelectorAll('input');
    inputs.forEach(function (input) {
      input.checked = false;
    });

    filterPopularEl.checked = true;

    resetPriceSlider();
    applyFilter();
  };

  var resetFilterHandler = function (evt) {
    evt.preventDefault();

    resetFilter();
  };

  priceSlider();

  formFilterEl.addEventListener('change', changeFilterHandler);
  resetFilterBtn.addEventListener('click', resetFilterHandler);

  window.updateCountsGoods = updateCountsGoods;
})();
