((window) => {
  const d = document;

  const isTouchDevice = () => {
    const el = document.createElement('div');
    el.setAttribute('ongesturestart', 'return;'); // or try "ontouchstart"
    return typeof el.ongesturestart === 'function';
  };

  const handleRotate = (e, card, highlight, overlay, text, options) => {
    const cardDimension = {
      w: card.getBoundingClientRect().width,
      h: card.getBoundingClientRect().height,
    };
    // mouse position relative to top of card

    let pageX = e.pageX;
    let pageY = e.pageY;
    if (pageX === undefined) {
      pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    const pos = {
      x: pageX - card.offsetLeft,
      y: pageY - card.offsetTop,
    };
    const delta = {
      x: 0,
      y: 0,
    };
    // if mouse position is inside the card, animate it. Else, return to initial position.
    if (pos.x >= 0 && pos.x <= cardDimension.w && pos.y >= 0 && pos.y <= cardDimension.h) {
      delta.x = (pos.y - (cardDimension.h / 2)) / (cardDimension.h / -2);
      delta.y = (pos.x - (cardDimension.w / 2)) / (cardDimension.w / 2);

      Object.assign(card.style, {
        transition: '',
      });
      Object.assign(overlay.style, {
        transition: '',
      });
      Object.assign(text.style, {
        transition: '',
      });
    } else {
      delta.x = 0;
      delta.y = 0;

      Object.assign(card.style, {
        transition: options.transitionTime,
        transitionTimingFunction: options.animationBezier,
      });
      Object.assign(overlay.style, {
        transition: options.transitionTime,
        transitionTimingFunction: options.animationBezier,
      });
      Object.assign(text.style, {
        transition: options.transitionTime,
        transitionTimingFunction: options.animationBezier,
      });
    }

    const rotation = {
      x: delta.x * options.maxRotation,
      y: delta.y * options.maxRotation,
    };

    const movement = {
      x: delta.y * options.maxMovement,
      y: delta.x * options.maxMovement,
    };

    // animation the card relative to mouse position.

    Object.assign(card.style, {
      transform: `
        perspective(400px)
        rotateX(${rotation.x}deg)
        rotateY(${rotation.y}deg)
        translate3d(${movement.x}px, ${movement.y}px, 0)
      `,
    });
    Object.assign(overlay.style, {
      transform: `
        perspective(10000px)
        rotateX(${rotation.x}deg)
        rotateY(${rotation.y}deg)
        translate3d(${movement.x * 1.125}px, ${movement.y * -1.125}px, 0)
      `,
    });
    Object.assign(text.style, {
      transform: `
        perspective(10000px)
        rotateX(${rotation.x}deg)
        rotateY(${rotation.y}deg)
        translate3d(${movement.x * 1.25}px, ${movement.y * -1.25}px, 0)
      `,
    });
    Object.assign(highlight.style, {
      background: `
        linear-gradient(
        to bottom left,
        rgba(255, 255, 255, 0.05),
        rgba(255, 255, 255, 0.1) ${delta.x * 50}%,
        rgba(255, 255, 255, 0.125) ${delta.y * 100}%,
        rgba(255, 255, 255, 0.1) ${delta.x * 150}%,
        rgba(0, 0, 0, 0.05))
      `,
    });
  };

  const subscribeCard = (selector, options = {
    transitionTime: '0.3s',
    animationBezier: 'cubic-bezier(.47,.1,.33,1.83)',
    maxRotation: 5,
    maxMovement: 2,
  }) => {
    const cards = d.querySelectorAll(selector);

    [].forEach.call(cards, (card) => {
      const highlight = card.querySelector('.highlight');
      const overlay = card.querySelector('.overlay');
      const text = overlay.querySelector('h2');

      if (!isTouchDevice()) {
        d.addEventListener('mousemove', (e) => {
          handleRotate(e, card, highlight, overlay, text, options);
        });
      }
    });
  };

  if (typeof module === 'object' && module && typeof module.exports === 'object') {
    module.exports = subscribeCard;
  } else {
    window.subscribeCard = subscribeCard;
    if (typeof define === 'function' && define.amd) {
      define('subscribeCard', [], () => { return subscribeCard; });
    }
  }
})(window);
