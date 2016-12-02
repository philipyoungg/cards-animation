'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

(function (window) {
  var d = document;

  var isTouchDevice = function isTouchDevice() {
    var el = document.createElement('div');
    el.setAttribute('ongesturestart', 'return;'); // or try "ontouchstart"
    return typeof el.ongesturestart === 'function';
  };

  var handleRotate = function handleRotate(e, card, highlight, overlay, text, options) {
    var cardDimension = {
      w: card.getBoundingClientRect().width,
      h: card.getBoundingClientRect().height
    };
    // mouse position relative to top of card

    var pageX = e.pageX;
    var pageY = e.pageY;
    if (pageX === undefined) {
      pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    var pos = {
      x: pageX - card.offsetLeft,
      y: pageY - card.offsetTop
    };
    var delta = {
      x: 0,
      y: 0
    };
    // if mouse position is inside the card, animate it. Else, return to initial position.
    if (pos.x >= 0 && pos.x <= cardDimension.w && pos.y >= 0 && pos.y <= cardDimension.h) {
      delta.x = (pos.y - cardDimension.h / 2) / (cardDimension.h / -2);
      delta.y = (pos.x - cardDimension.w / 2) / (cardDimension.w / 2);

      _extends(card.style, {
        transition: ''
      });
      _extends(overlay.style, {
        transition: ''
      });
      _extends(text.style, {
        transition: ''
      });
    } else {
      delta.x = 0;
      delta.y = 0;

      _extends(card.style, {
        transition: options.transitionTime,
        transitionTimingFunction: options.animationBezier
      });
      _extends(overlay.style, {
        transition: options.transitionTime,
        transitionTimingFunction: options.animationBezier
      });
      _extends(text.style, {
        transition: options.transitionTime,
        transitionTimingFunction: options.animationBezier
      });
    }

    var rotation = {
      x: delta.x * options.maxRotation,
      y: delta.y * options.maxRotation
    };

    var movement = {
      x: delta.y * options.maxMovement,
      y: delta.x * options.maxMovement
    };

    // animation the card relative to mouse position.

    _extends(card.style, {
      transform: '\n        perspective(400px)\n        rotateX(' + rotation.x + 'deg)\n        rotateY(' + rotation.y + 'deg)\n        translate3d(' + movement.x + 'px, ' + movement.y + 'px, 0)\n      '
    });
    _extends(overlay.style, {
      transform: '\n        perspective(10000px)\n        rotateX(' + rotation.x + 'deg)\n        rotateY(' + rotation.y + 'deg)\n        translate3d(' + movement.x * 1.125 + 'px, ' + movement.y * -1.125 + 'px, 0)\n      '
    });
    _extends(text.style, {
      transform: '\n        perspective(10000px)\n        rotateX(' + rotation.x + 'deg)\n        rotateY(' + rotation.y + 'deg)\n        translate3d(' + movement.x * 1.25 + 'px, ' + movement.y * -1.25 + 'px, 0)\n      '
    });
    _extends(highlight.style, {
      background: '\n        linear-gradient(\n        to bottom left,\n        rgba(255, 255, 255, 0.05),\n        rgba(255, 255, 255, 0.1) ' + delta.x * 50 + '%,\n        rgba(255, 255, 255, 0.125) ' + delta.y * 100 + '%,\n        rgba(255, 255, 255, 0.1) ' + delta.x * 150 + '%,\n        rgba(0, 0, 0, 0.05))\n      '
    });
  };

  var subscribeCard = function subscribeCard(selector) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      transitionTime: '0.3s',
      animationBezier: 'cubic-bezier(.47,.1,.33,1.83)',
      maxRotation: 5,
      maxMovement: 2
    };

    var cards = d.querySelectorAll(selector);

    [].forEach.call(cards, function (card) {
      var highlight = card.querySelector('.highlight');
      var overlay = card.querySelector('.overlay');
      var text = overlay.querySelector('h2');

      if (!isTouchDevice()) {
        d.addEventListener('mousemove', function (e) {
          handleRotate(e, card, highlight, overlay, text, options);
        });
      }
    });
  };

  if ((typeof module === 'undefined' ? 'undefined' : _typeof(module)) === 'object' && module && _typeof(module.exports) === 'object') {
    module.exports = subscribeCard;
  } else {
    window.subscribeCard = subscribeCard;
    if (typeof define === 'function' && define.amd) {
      define('subscribeCard', [], function () {
        return subscribeCard;
      });
    }
  }
})(window);
