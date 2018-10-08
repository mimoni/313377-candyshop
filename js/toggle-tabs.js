'use strict';

(function () {
  var toggleTabsDelivery = function () {
    var deliverStore = document.querySelector('.deliver__store');
    var deliverCourier = document.querySelector('.deliver__courier');
    var inputsStore = document.querySelectorAll('.deliver__store input');
    var textArea = document.querySelectorAll('.deliver__courier textarea');
    var inputsCourier = document.querySelectorAll('.deliver__courier input');

    document.querySelector('.deliver__toggle').addEventListener('click', function (evt) {
      if (!evt.target.id) {
        return;
      }

      deliverStore.classList.add('visually-hidden');
      deliverCourier.classList.add('visually-hidden');

      var id = evt.target.id;
      document.querySelector('.' + id).classList.remove('visually-hidden');
      toggleDisableInputs(inputsStore);
      toggleDisableInputs(inputsCourier);
      toggleDisableInputs(textArea);
    });
  };

  var toggleTabsPayment = function () {
    var paymentCard = document.querySelector('.payment__card-wrap');
    var paymentCash = document.querySelector('.payment__cash-wrap');
    var inputs = document.querySelectorAll('.payment__inputs input');


    document.querySelector('.payment__method').addEventListener('click', function (evt) {
      if (!evt.target.id) {
        return;
      }

      paymentCard.classList.add('visually-hidden');
      paymentCash.classList.add('visually-hidden');

      var id = evt.target.id;
      document.querySelector('.' + id + '-wrap').classList.remove('visually-hidden');
      toggleDisableInputs(inputs);
    });
  };

  var toggleDisableInputs = function (inputs) {
    inputs.forEach(function (input) {
      input.disabled = !input.disabled;
    });
  };

  toggleTabsDelivery();
  toggleTabsPayment();
})();
