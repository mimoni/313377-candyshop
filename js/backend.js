'use strict';

(function () {
  var URL_GOODS_LOAD = 'https://js.dump.academy/candyshop/data';
  var URL_UPLOAD_FORM = 'https://js.dump.academy/candyshop';

  var createXmlHttpRequest = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    return xhr;
  };

  window.load = function (onLoad, onError) {
    var xhr = createXmlHttpRequest(onLoad, onError);

    xhr.open('GET', URL_GOODS_LOAD);
    xhr.send();
  };

  window.upload = function (data, onLoad, onError) {
    var xhr = createXmlHttpRequest(onLoad, onError);

    xhr.open('POST', URL_UPLOAD_FORM);
    xhr.send(data);
  };
})();
