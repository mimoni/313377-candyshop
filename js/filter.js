'use strict';

(function () {
  var rangeEl = document.querySelector('.range');

  var priceSlider = function () {
    var maxPrice = 100;
    var minXPosition = 0;
    var rangeWidth = rangeEl.querySelector('.range__filter').offsetWidth;
    var priceMinEl = rangeEl.querySelector('.range__price--min');
    var priceMaxEl = rangeEl.querySelector('.range__price--max');
    var rangePinLeftEl = rangeEl.querySelector('.range__btn--left');
    var rangePinRightEl = rangeEl.querySelector('.range__btn--right');
    var pinWidth = rangePinLeftEl.offsetWidth;
    var rangeFillLineEl = rangeEl.querySelector('.range__fill-line');
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

  priceSlider();
})();
