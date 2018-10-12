'use strict';

(function () {
  var toggleTabsDelivery = function () {
    var deliverEl = document.querySelector('.deliver');
    var deliverStore = deliverEl.querySelector('.deliver__store');
    var deliverCourier = deliverEl.querySelector('.deliver__courier');

    deliverEl.querySelector('.deliver__toggle').addEventListener('click', function (evt) {
      if (!evt.target.id) {
        return;
      }

      deliverStore.classList.add('visually-hidden');
      deliverCourier.classList.add('visually-hidden');
      disableInputsInElement('.deliver');

      var id = evt.target.id;
      var classEl = '.' + id;

      document.querySelector(classEl).classList.remove('visually-hidden');
      enableInputsInElement(classEl);
    });
  };

  var toggleTabsPayment = function () {
    var paymentEl = document.querySelector('.payment');
    var paymentCard = paymentEl.querySelector('.payment__card-wrap');
    var paymentCash = paymentEl.querySelector('.payment__cash-wrap');

    paymentEl.querySelector('.payment__method').addEventListener('click', function (evt) {
      if (!evt.target.id) {
        return;
      }

      paymentCard.classList.add('visually-hidden');
      paymentCash.classList.add('visually-hidden');
      disableInputsInElement('.payment');

      var id = evt.target.id;
      var classEl = '.' + id + '-wrap';

      document.querySelector(classEl).classList.remove('visually-hidden');
      enableInputsInElement(classEl);
    });
  };

  var disableInputs = function (selector) {
    var inputs = document.querySelectorAll(selector);
    inputs.forEach(function (input) {
      input.disabled = true;
    });
  };

  var enableInputs = function (selector) {
    var inputs = document.querySelectorAll(selector);
    inputs.forEach(function (input) {
      input.disabled = false;
    });
  };

  var disableInputsInElement = function (classEl) {
    var inputsSelector = classEl + ' input:not(.toggle-btn__input), ' + classEl + ' textarea';
    disableInputs(inputsSelector);
  };

  var enableInputsInElement = function (classEl) {
    var inputsSelector = classEl + ' input:not(.toggle-btn__input), ' + classEl + ' textarea';
    enableInputs(inputsSelector);
  };

  var disableHiddenInputs = function () {
    var inputsSelector = '.buy div.visually-hidden input, .buy div.visually-hidden textarea';
    disableInputs(inputsSelector);
  };

  toggleTabsDelivery();
  toggleTabsPayment();

  window.disableHiddenInputs = disableHiddenInputs;
})();
