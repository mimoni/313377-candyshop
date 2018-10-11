'use strict';

(function () {
  var IMG_PATH = 'img/map/';
  var formEl = document.querySelector('.buy form');
  var paymentStatusEl = formEl.querySelector('.payment__card-status');
  var inputsStoreEl = formEl.querySelectorAll('input[name="store"]');
  var storeMapImgEl = formEl.querySelector('.deliver__store-map-img');

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

  var cardNumberInputHandler = function (evt) {
    var cardInput = evt.target;
    var paymentStatus = 'Не определён';

    if (cardInput.value.length !== 16) {
      cardInput.setCustomValidity('Номер карты должен состоять из 16 символов');
      return;
    }

    if (checkCardNumber(cardInput.value)) {
      cardInput.setCustomValidity('');
      paymentStatus = 'Одобрен';
    } else {
      cardInput.setCustomValidity('Неверный номер кредитной карты');
    }

    paymentStatusEl.textContent = paymentStatus;
  };

  var btnSubmitHandler = function (evt) {
    if (!formEl.checkValidity()) {
      return;
    }

    evt.preventDefault();

    var onLoad = function () {
      window.modal.showModalSuccess();
    };

    var onError = function () {
      window.modal.showModalError();
    };

    var data = new FormData(formEl);
    window.upload(data, onLoad, onError);
  };

  var inputStoreClickHandler = function (evt) {
    var imageName = evt.target.value;
    storeMapImgEl.src = IMG_PATH + imageName + '.jpg';
  };

  formEl.querySelector('#payment__card-number').addEventListener('input', cardNumberInputHandler);

  formEl.addEventListener('submit', btnSubmitHandler);

  inputsStoreEl.forEach(function (input) {
    input.addEventListener('click', inputStoreClickHandler);
  });
})();
