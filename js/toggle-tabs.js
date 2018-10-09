'use strict';

(function () {
  var toggleTabsDelivery = function () {
    var deliverEl = document.querySelector('.deliver');
    var deliverStore = deliverEl.querySelector('.deliver__store');
    var deliverCourier = deliverEl.querySelector('.deliver__courier');
    var inputsStore = deliverEl.querySelectorAll('.deliver__store input');
    var textArea = deliverEl.querySelectorAll('.deliver__courier textarea');
    var inputsCourier = deliverEl.querySelectorAll('.deliver__courier input');

    deliverEl.querySelector('.deliver__toggle').addEventListener('click', function (evt) {
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
    var paymentEl = document.querySelector('.payment');
    var paymentCard = paymentEl.querySelector('.payment__card-wrap');
    var paymentCash = paymentEl.querySelector('.payment__cash-wrap');
    var inputs = paymentEl.querySelectorAll('.payment__inputs input');


    paymentEl.querySelector('.payment__method').addEventListener('click', function (evt) {
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
