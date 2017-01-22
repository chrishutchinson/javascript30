/**
 * Create a `<clock-hand>` element that accepts a `tick` attribute which defines its position on the clock
 * Each hand uses the tick value to calculate its own rotation value
 */
customElements.define('clock-hand', class extends HTMLElement {

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.shadowRoot.innerHTML = `
      <style>
      :host div {
        background: #000;
        width: 50%;
        height: 1px;
        position: absolute;
        transform: rotate(-90deg) translate(150px, 150px);
        transform-origin: 150px 150px;
        position: absolute;
        top: 0;
        left: 0;
        transition: all 0.05s cubic-bezier(0, 3.32, 1, 1);
      }

      :host div.second {
        background: red;
      }

      :host div.hour {
        width: 35%;
      }
      </style>
      <div class="${this.type}"></div>
    `;

    this.hand = this.shadowRoot.querySelector('div');
  }

  static get observedAttributes() {
    return ['tick'];
  }

  get tick() {
    return this.getAttribute('tick');
  }

  get type() {
    return this.getAttribute('type');
  }

  attributeChangedCallback() {
    const rotate = this.calculatePosition(this.tick);
    this.hand.style.transform = `rotate(${rotate}deg) translate(150px, 150px)`;
  }

  calculatePosition(tick) {
    return (tick * 6) - 90;
  }

});



/**
 * The `<clock-face>` element renders the three `<clock-hand>` elements and manages the JS date logic
 */
customElements.define('clock-face', class extends HTMLElement {

  constructor() {
    super();

    this.attachShadow({ mode: 'open' });

    this.render();

    this.hands = {
      hour: this.shadowRoot.querySelector('clock-hand[type="hour"]'),
      minute: this.shadowRoot.querySelector('clock-hand[type="minute"]'),
      second: this.shadowRoot.querySelector('clock-hand[type="second"]'),
    };

    setInterval(() => {
      const { hours, minutes, seconds } = this.calculateTime(new Date);

      this.hands.hour.setAttribute('tick', hours);
      this.hands.minute.setAttribute('tick', minutes);
      this.hands.second.setAttribute('tick', seconds);
    }, 1000);
  }

  calculateTime(now) {
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    if(hours >= 12) {
      hours = hours - 12;
    }

    hours = hours * 5;

    return { hours, minutes, seconds };
  }

  render() {
    const { hours, minutes, seconds } = this.calculateTime(new Date);

    this.shadowRoot.innerHTML = `
      <style>
      :host div.face {
        background: #FFF;
        border: 30px solid goldenrod;
        border-radius: 50%;
        width: 300px;
        height: 300px;
        position: relative;
      }

      :host div.face:after {
        content: '';
        width: 14px;
        height: 14px;
        position: absolute;
        top: 50%;
        left: 50%;
        background: goldenrod;
        border-radius: 50%;
        transform: translate(-50%, -50%);
      }
      </style>
      <div class="face">
        <clock-hand tick="${minutes}" type="minute"></clock-hand>
        <clock-hand tick="${hours}" type="hour"></clock-hand>
        <clock-hand tick="${seconds}" type="second"></clock-hand>
      </div>
    `;
  }

});