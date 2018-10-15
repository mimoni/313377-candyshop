'use strict';

(function () {
  var URL_GOODS_LOAD = 'https://js.dump.academy/candyshop/data';
  var URL_UPLOAD_FORM = 'https://js.dump.academy/candyshop';

  var createXmlHttpRequest = function (loadHandler, errorHandler) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        loadHandler(xhr.response);
      } else {
        errorHandler('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      errorHandler('Произошла ошибка соединения');
    });

    return xhr;
  };

  var load = function (loadHandler, errorHandler) {
    var xhr = createXmlHttpRequest(loadHandler, errorHandler);

    xhr.open('GET', URL_GOODS_LOAD);
    xhr.send();
  };

  var upload = function (data, loadHandler, errorHandler) {
    var xhr = createXmlHttpRequest(loadHandler, errorHandler);

    xhr.open('POST', URL_UPLOAD_FORM);
    xhr.send(data);
  };

  window.backend = {
    load: load,
    upload: upload
  };
})();
