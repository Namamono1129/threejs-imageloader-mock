"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var originalFunc = document.createElementNS;

var activate = function activate(trigger) {
  document.createElementNS = function (url, tag) {
    if (tag != 'img') {
      return originalFunc.bind(document, url, tag);
    }

    return new ImageElementMock(trigger);
  };
};

var ImageElementMock =
/*#__PURE__*/
function () {
  function ImageElementMock(trigger) {
    _classCallCheck(this, ImageElementMock);

    this.trigger = trigger;
  }

  _createClass(ImageElementMock, [{
    key: "addEventListener",
    value: function addEventListener(type, listener) {
      var _this = this;

      if (type != this.trigger) {
        return;
      } // Func calls need little timeout in order to ensure load() function to return value


      if (type == 'load') {
        setTimeout(function () {
          listener.call(_this);
        }, 0);
      } else if (type == 'error') {
        setTimeout(function () {
          listener(new Error("An error occurred on loading image."));
        }, 0);
      } else {
        throw new Error("Program Error: this may be a bug on threejs-imageloader-mock.");
      }
    } // NOP because this class does not have ordinary event system

  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, listener) {}
  }]);

  return ImageElementMock;
}();

module.exports = {
  success: function success() {
    activate('load');
  },
  fail: function fail() {
    activate('error');
  }
};