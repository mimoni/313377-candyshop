'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var modalSuccess = document.querySelector('.modal--success');
  var modalError = document.querySelector('.modal--error');

  var showModalSuccess = function () {
    showModal(modalSuccess);
  };

  var showModalError = function () {
    showModal(modalError);
  };

  var showModal = function (modalEl) {
    modalEl.classList.remove('modal--hidden');
    var closeBtn = modalEl.querySelector('.modal__close');

    var closeModal = function () {
      modalEl.classList.add('modal--hidden');
      document.removeEventListener('keydown', keyDownModalHandler);
    };

    var keyDownModalHandler = function (evt) {
      evt.preventDefault();

      if (evt.keyCode === ESC_KEYCODE) {
        closeModal();
      }
    };

    var clickModalHandler = function () {
      closeModal();
    };

    closeBtn.addEventListener('click', clickModalHandler);
    document.addEventListener('keydown', keyDownModalHandler);
  };

  window.modal = {
    showModalSuccess: showModalSuccess,
    showModalError: showModalError
  };
})();
