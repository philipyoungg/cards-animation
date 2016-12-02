'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var handleRotate = function handleRotate(e, card, highlight, overlay, text, cardDimension, options) {
  // mouse position relative to top of card
  var pos = {
    x: e.pageX - card.offsetLeft,
    y: e.pageY - card.offsetTop
  };
  var rotation = {
    x: 0,
    y: 0
  };
  // if mouse position is inside the card, animate it. Else, return to initial position.
  if (pos.x >= 0 && pos.x <= cardDimension.w && pos.y >= 0 && pos.y <= cardDimension.h) {
    pos.x = e.pageX - card.offsetLeft;
    pos.y = e.pageY - card.offsetTop;

    rotation.x = (pos.y - cardDimension.h / 2) / (cardDimension.h / -10);
    rotation.y = (pos.x - cardDimension.w / 2) / (cardDimension.w / 10);

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
    pos.x = 0;
    pos.y = 0;
    rotation.x = 0;
    rotation.y = 0;

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

  // start the animation relative to mouse position.

  _extends(card.style, {
    transform: '\n      perspective(400px)\n      rotateX(' + rotation.x + 'deg)\n      rotateY(' + rotation.y + 'deg)\n      translateY(' + rotation.x / 2 + 'px)\n      translateX(' + rotation.y / 2 + 'px)\n    '
  });
  _extends(overlay.style, {
    transform: '\n      perspective(10000px)\n      rotateX(' + rotation.x + 'deg)\n      rotateY(' + rotation.y + 'deg)\n      translateY(' + rotation.x * -1.125 + 'px)\n      translateX(' + rotation.y * 1.125 + 'px)\n    '
  });
  _extends(text.style, {
    transform: '\n      perspective(10000px)\n      rotateX(' + rotation.x + 'deg)\n      rotateY(' + rotation.y + 'deg)\n      translateY(' + rotation.x * -1.25 + 'px)\n      translateX(' + rotation.y * 1.25 + 'px)\n    '
  });
  _extends(highlight.style, {
    background: '\n      linear-gradient(\n      to bottom left,\n      rgba(255, 255, 255, 0.1),\n      rgba(255, 255, 255, 0.125) ' + rotation.x * 10 + '%,\n      rgba(255, 255, 255, 0.15) ' + rotation.y * 20 + '%,\n      rgba(255, 255, 255, 0.125) ' + rotation.x * 30 + '%,\n      rgba(0, 0, 0, 0.05))\n    '
  });
};

var subscribeCard = function subscribeCard(selector) {
  var options = {
    transitionTime: '0.3s',
    animationBezier: 'cubic-bezier(.47,.1,.33,1.83)'
  };

  var d = document;
  var cards = d.querySelectorAll(selector);

  [].forEach.call(cards, function (card) {
    var highlight = card.querySelector('.highlight');
    var overlay = card.querySelector('.overlay');
    var text = overlay.querySelector('h2');

    var cardDimension = {
      w: card.getBoundingClientRect().width,
      h: card.getBoundingClientRect().height
    };

    d.addEventListener('mousemove', function (e) {
      handleRotate(e, card, highlight, overlay, text, cardDimension, options);
    });
  });
};

subscribeCard('.container');
