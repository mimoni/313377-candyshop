'use strict';

(function () {
  var RANGE_EL = document.querySelector('.range');

  var priceSlider = function () {
    var maxPrice = 100;
    var minXPosition = 0;
    var rangeWidth = RANGE_EL.querySelector('.range__filter').offsetWidth;
    var priceMinEl = RANGE_EL.querySelector('.range__price--min');
    var priceMaxEl = RANGE_EL.querySelector('.range__price--max');
    var rangePinLeftEl = RANGE_EL.querySelector('.range__btn--left');
    var rangePinRightEl = RANGE_EL.querySelector('.range__btn--right');
    var pinWidth = rangePinLeftEl.offsetWidth;
    var rangeFillLineEl = RANGE_EL.querySelector('.range__fill-line');
    var getPercentFromRangeBtn = function (el) {
      var percent = parseFloat(el.style.left) * 100 / rangeWidth;
      return Math.round(maxPrice * percent / 100);
    };

    rangePinLeftEl.addEventListener('mousedown', function (evt) {
      var startCoordinateX = evt.clientX;
      var pin = evt.target;

      var mouseMoveHandler = function (moveEvt) {
        var shiftX = startCoordinateX - moveEvt.clientX;

        startCoordinateX = moveEvt.clientX;

        priceMinEl.textContent = getPercentFromRangeBtn(pin);
        var newPositionPin = parseInt(pin.style.left, 10) - shiftX;

        var rightLimiter = parseInt(rangePinRightEl.style.left, 10) - pinWidth / 2;
        if ((newPositionPin > rightLimiter) || (newPositionPin < minXPosition)) {
          removeEvents();
          return;
        }

        pin.style.left = newPositionPin + 'px';
        rangeFillLineEl.style.left = newPositionPin + 'px';
      };

      var mouseUpHandler = function () {
        priceMinEl.textContent = getPercentFromRangeBtn(pin);
        removeEvents();
      };

      var mouseOutHandler = function () {
        removeEvents();
      };

      var removeEvents = function () {
        pin.removeEventListener('mouseup', mouseUpHandler);
        pin.removeEventListener('mousemove', mouseMoveHandler);
        pin.removeEventListener('mousemove', mouseOutHandler);
      };

      pin.addEventListener('mouseup', mouseUpHandler);

      pin.addEventListener('mousemove', mouseMoveHandler);

      pin.addEventListener('mouseout', mouseOutHandler);

    });

    rangePinRightEl.addEventListener('mousedown', function (evt) {
      var startCoordinateX = evt.clientX;
      var pin = evt.target;

      var mouseMoveHandler = function (moveEvt) {
        var shiftX = startCoordinateX - moveEvt.clientX;

        startCoordinateX = moveEvt.clientX;

        priceMaxEl.textContent = getPercentFromRangeBtn(pin);
        var newPositionPin = parseInt(pin.style.left, 10) - shiftX;

        var leftLimiter = Math.abs(parseInt(rangePinLeftEl.style.left, 10) + pinWidth / 2);
        if ((newPositionPin < leftLimiter) || (newPositionPin > rangeWidth)) {
          removeEvents();
          return;
        }

        pin.style.left = newPositionPin + 'px';
        rangeFillLineEl.style.right = rangeWidth - newPositionPin + 'px';
      };

      var mouseUpHandler = function () {
        priceMaxEl.textContent = getPercentFromRangeBtn(pin);
        removeEvents();
      };

      var mouseOutHandler = function () {
        removeEvents();
      };

      var removeEvents = function () {
        pin.removeEventListener('mouseup', mouseUpHandler);
        pin.removeEventListener('mousemove', mouseMoveHandler);
        pin.removeEventListener('mousemove', mouseOutHandler);
      };

      pin.addEventListener('mouseup', mouseUpHandler);

      pin.addEventListener('mousemove', mouseMoveHandler);

      pin.addEventListener('mouseout', mouseOutHandler);
    });
  };

  priceSlider();
})();
