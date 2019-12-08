/*
 * @description
 *          Script creates a slide-show for structure .carousel>.slides>.slide[style=background-image:url()].
 * @author  Andrii.A.Fomenko
 * @revised 2018-02-06
 */

/* Carousel Class */
class Carousel {
  constructor(s) {
    let settings = this._initConfig(s);

    this.container = document.querySelector(settings.containerID);
    this.slideItems = document.querySelectorAll(settings.slideID);
    this.interval = settings.interval;
  }

  /* _initConfig - initialization of the config; no this, therefore arrow function used */
  _initConfig = (s) => {
    let settings = {
      containerID: '.carousel',
      interval: 5000,
      slideID: '.slide',
    };

    if (s !== undefined) {
      settings.containerID = s.containerID || '.carousel';
      settings.interval = s.interval || 5000;
      settings.slideID = s.slideID || '.slide';
    }

    return settings;
  };

  /* _initProps - initialization properties */
  _initProps() {
    this.slidesCount = this.slideItems.length;
    this.currentSlide = 0;
    this.playbackStatus = true;

    this.KEY_SPACE = ' ';
    this.KEY_LEFT_ARROW = 'ArrowLeft';
    this.KEY_RIGHT_ARROW = 'ArrowRight';
    this.FA_PAUSE = '<i class="far fa-pause-circle"></i>';
    this.FA_PLAY = '<i class="far fa-play-circle"></i>';
    this.FA_PREV = '<i class="fas fa-angle-left"></i>';
    this.FA_NEXT = '<i class="fas fa-angle-right"></i>';
  }

  /* _initControl - dynamic creation of controls */
  _initControl() {
    let controls = document.createElement('div');
    const PAUSE = `<span id="pause-btn" class="control-pause">${this.FA_PAUSE}</span>`;
    const PREV = `<span id="prev-btn" class="control-prev">${this.FA_PREV}</span>`;
    const NEXT = `<span id="next-btn" class="control-next">${this.FA_NEXT}</span>`;

    controls.setAttribute('class', 'controls');
    controls.innerHTML = PAUSE + PREV + NEXT;

    this.container.appendChild(controls);

    this.pauseBtn = document.querySelector('#pause-btn');
    this.nextBtn = document.querySelector('#next-btn');
    this.prevBtn = document.querySelector('#prev-btn');
  }

  /* _initIndicator - dynamic creation of indicators */
  _initIndicator() {
    let generate = () => {
      let indicators = document.createElement('ol');

      indicators.setAttribute('class', 'indicators');

      for (let i = 0, n = this.slidesCount; i < n; i++) {
        let indicator = document.createElement('li');

        indicator.setAttribute('class', 'indicator');
        indicator.setAttribute('data-slide-to', `${i}`);
        i === 0 && indicator.classList.add('active');
        indicators.appendChild(indicator);
      }

      return indicators;
    };

    this.container.appendChild(generate());

    this.indContainer = this.container.querySelector('.indicators');
    this.indItems = this.container.querySelectorAll('.indicator');
  }

  /* _addElemListener - adding events to the elements */
  _addElemListener() {
    document.addEventListener('keydown', this._keyPress.bind(this));
    this.pauseBtn.addEventListener('click', this.pausePlay.bind(this));
    this.nextBtn.addEventListener('click', this.next.bind(this));
    this.prevBtn.addEventListener('click', this.prev.bind(this));
    this.indContainer.addEventListener('click', this._indicator.bind(this));
  }

  /* _gotoNth function */
  _gotoNth(n) {
    this.slideItems[this.currentSlide].classList.toggle('active');
    this.indItems[this.currentSlide].classList.toggle('active');
    this.currentSlide = (n + this.slidesCount) % this.slidesCount;
    this.slideItems[this.currentSlide].classList.toggle('active');
    this.indItems[this.currentSlide].classList.toggle('active');
  }

  /* _gotoNext function */
  _gotoNext() {
    this._gotoNth(this.currentSlide + 1);
  }

  /* _gotoNext function */
  _gotoPrev() {
    this._gotoNth(this.currentSlide - 1);
  }

  /* _pause function */
  _pause() {
    if (this.playbackStatus) {
      this.pauseBtn.innerHTML = this.FA_PLAY;
      this.playbackStatus = !this.playbackStatus;
      clearInterval(this.intervalID);
    }
  }

  /* _play function */
  _play() {
    this.pauseBtn.innerHTML = this.FA_PAUSE;
    this.playbackStatus = !this.playbackStatus;

    let that = this;

    this.intervalID = setInterval(() => {
      that._gotoNext();
    }, this.interval);
  }

  /* _indicator function */
  _indicator(e) {
    let target = e.target;

    if (target.classList.contains('indicator')) {
      this._pause();
      this._gotoNth(+target.getAttribute('data-slide-to'));
    }
  }

  /* _keyPress function */
  _keyPress(e) {
    if (e.key === this.KEY_LEFT_ARROW) this.prev();
    if (e.key === this.KEY_RIGHT_ARROW) this.next();
    if (e.key === this.KEY_SPACE) this.pausePlay();
  }

  /* pausePlay function */
  pausePlay() {
    this.playbackStatus ? this._pause() : this._play();
  }

  /* next function */
  next() {
    this._pause();
    this._gotoNext();
  }

  /* prev function */
  prev() {
    this._pause();
    this._gotoPrev();
  }

  /* init carousel function */
  init() {
    this._initProps();
    this._initControl();
    this._initIndicator();
    this._addElemListener();

    let that = this;

    this.intervalID = setInterval(() => {
      that._gotoNext();
    }, this.interval);
  }
}

class SwipeCarousel extends Carousel {
  // в данном случае переопределение конструктора не требуется
  // constructor(...args) {
  //   super(...args);
  //   В ES6 ключевое слово extends позволяет классу-потомку наследовать от родительского класса. Важно отметить, что конструктор класса-потомка должен вызывать super().
  // }

  _addElemListener() {
    super._addElemListener(); // В классе-потомке можно вызвать метод родительского класса с помощью super.имяМетодаРодителя().
    this.container.addEventListener('touchstart', this._swipeStart.bind(this));
    this.container.addEventListener('touchend', this._swipeEnd.bind(this));
  }

  /* _swipeStart function */
  _swipeStart(e) {
    this.swipeStartX = e.changedTouches[0].pageX;
  }

  /* _swipeEnd function */
  _swipeEnd(e) {
    this.swipeEndX = e.changedTouches[0].pageX;
    this.swipeStartX - this.swipeEndX > 100 && this.next();
    this.swipeStartX - this.swipeEndX < -100 && this.prev();
  }
}
