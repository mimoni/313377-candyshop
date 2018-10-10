'use strict';

(function () {
  var formFilterEl = document.querySelector('.catalog__sidebar form');
  var filterPopularEl = formFilterEl.querySelector('#filter-popular');
  var resetFilterBtn = formFilterEl.querySelector('.catalog__submit');
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

  var priceSlider = function () {
    var minXPosition = 0;
    var rangeWidth = formFilterEl.querySelector('.range__filter').offsetWidth;
    var priceMinEl = formFilterEl.querySelector('.range__price--min');
    var priceMaxEl = formFilterEl.querySelector('.range__price--max');
    var rangePinLeftEl = formFilterEl.querySelector('.range__btn--left');
    var rangePinRightEl = formFilterEl.querySelector('.range__btn--right');
    var pinWidth = rangePinLeftEl.offsetWidth;
    var rangeFillLineEl = formFilterEl.querySelector('.range__fill-line');
    var getPercentFromRangeBtn = function (el) {
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
        priceMinEl.textContent = getPercentFromRangeBtn(pin);
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
      };

      var mouseUpHandler = function () {
        priceMinEl.textContent = getPercentFromRangeBtn(pin);
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
        priceMaxEl.textContent = getPercentFromRangeBtn(pin);
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
      };

      var mouseUpHandler = function () {
        priceMaxEl.textContent = getPercentFromRangeBtn(pin);
        removeEvent(mouseUpHandler, mouseMoveHandler);
      };

      document.addEventListener('mouseup', mouseUpHandler);
      document.addEventListener('mousemove', mouseMoveHandler);
    });
  };

  // var resetPriceSlider = function () {
  //
  // };

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

  var foodPropertyFilters = {
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
          goods.filter(foodPropertyFilters[idFilter])
      );
    });

    if (idsFiltersFoodType.length === 0) {
      filteredGoods = goods;
    }

    // Фильтрация по составу
    var idsFiltersFoodProperty = getIdsFilterByType('food-property');
    idsFiltersFoodProperty.forEach(function (idFilter) {
      filteredGoods = filteredGoods.filter(foodPropertyFilters[idFilter]);
    });


    // Сортировка
    var sortFunctionId = getIdsFilterByType('sort')[0];
    if (sortFunctionId !== 'filter-popular') {
      var sortFunction = foodPropertyFilters[sortFunctionId];
      filteredGoods.sort(sortFunction);
    }

    window.catalog.renderCatalogGoods(filteredGoods);

    if (filteredGoods.length) {
      removeEmptyFilterMessage();
    } else {
      showEmptyFilterMessage();
    }
  };

  var resetFilterHandler = function (evt) {
    evt.preventDefault();

    var inputs = formFilterEl.querySelectorAll('input');
    inputs.forEach(function (input) {
      input.checked = false;
    });

    filterPopularEl.checked = true;
    applyFilter();
  };

  priceSlider();

  formFilterEl.addEventListener('change', changeFilterHandler);
  resetFilterBtn.addEventListener('click', resetFilterHandler);
})();
