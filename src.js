const handleRotate = (e, card, highlight, overlay, text, cardDimension, options) => {
  // mouse position relative to top of card
  const pos = {
    x: e.pageX - card.offsetLeft,
    y: e.pageY - card.offsetTop,
  };
  const rotation = {
    x: 0,
    y: 0,
  };
  // if mouse position is inside the card, animate it. Else, return to initial position.
  if (pos.x >= 0 && pos.x <= cardDimension.w && pos.y >= 0 && pos.y <= cardDimension.h) {
    pos.x = e.pageX - card.offsetLeft;
    pos.y = e.pageY - card.offsetTop;

    rotation.x = (pos.y - (cardDimension.h / 2)) / (cardDimension.h / -10);
    rotation.y = (pos.x - (cardDimension.w / 2)) / (cardDimension.w / 10);

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
    pos.x = 0;
    pos.y = 0;
    rotation.x = 0;
    rotation.y = 0;

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

  // start the animation relative to mouse position.

  Object.assign(card.style, {
    transform: `
      perspective(400px)
      rotateX(${rotation.x}deg)
      rotateY(${rotation.y}deg)
      translateY(${rotation.x / 2}px)
      translateX(${rotation.y / 2}px)
    `,
  });
  Object.assign(overlay.style, {
    transform: `
      perspective(10000px)
      rotateX(${rotation.x}deg)
      rotateY(${rotation.y}deg)
      translateY(${rotation.x * -1.125}px)
      translateX(${rotation.y * 1.125}px)
    `,
  });
  Object.assign(text.style, {
    transform: `
      perspective(10000px)
      rotateX(${rotation.x}deg)
      rotateY(${rotation.y}deg)
      translateY(${rotation.x * -1.25}px)
      translateX(${rotation.y * 1.25}px)
    `,
  });
  Object.assign(highlight.style, {
    background: `
      linear-gradient(
      to bottom left,
      rgba(255, 255, 255, 0.1),
      rgba(255, 255, 255, 0.125) ${rotation.x * 10}%,
      rgba(255, 255, 255, 0.15) ${rotation.y * 20}%,
      rgba(255, 255, 255, 0.125) ${rotation.x * 30}%,
      rgba(0, 0, 0, 0.05))
    `,
  });
};

const subscribeCard = (selector) => {
  const options = {
    transitionTime: '0.3s',
    animationBezier: 'cubic-bezier(.47,.1,.33,1.83)',
  };

  const d = document;
  const cards = d.querySelectorAll(selector);

  [].forEach.call(cards, (card) => {
    const highlight = card.querySelector('.highlight');
    const overlay = card.querySelector('.overlay');
    const text = overlay.querySelector('h2');

    const cardDimension = {
      w: card.getBoundingClientRect().width,
      h: card.getBoundingClientRect().height,
    };

    d.addEventListener('mousemove', (e) => {
      handleRotate(e, card, highlight, overlay, text, cardDimension, options);
    });
  });
};

subscribeCard('.container');
