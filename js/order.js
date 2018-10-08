'use strict';

(function () {
  var formEl = document.querySelector('.buy form');

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
      return;
    }

    if (checkCardNumber(cardInput.value)) {
      cardInput.setCustomValidity('');
    } else {
      cardInput.setCustomValidity('Неверный номер кредитной карты');
    }
  };

  formEl.querySelector('#payment__card-number').addEventListener('input', cardNumberHandler);
})();
