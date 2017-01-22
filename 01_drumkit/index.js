// Define our drum-key component
customElements.define('drum-key', class extends HTMLElement {

  /** Gotta construct */
  constructor() {
    // And call super
    super();

    // Create a Shadow DOM
    this.attachShadow({ mode: 'open' });

    // Setup our DOM
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: inline-block;
        }

        :host li.key {
          height: 3.2rem;
          width: 4rem;
          padding: 0.4rem 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          margin: auto;
          background: rgba(0, 0, 0, 0.8);
          color: #FFFFFF;
          border: 2px solid transparent;
          transition: all 0.07s;
          font-family: sans-serif;
          text-transform: uppercase;
        }

        :host li.key.pressed {
          transform: scale(1.1);
          border-color: goldenrod;
        }

        :host li.key kbd {
          font-size: 2rem;
        }

        :host li.key span {
          letter-spacing: 0.1em;
          font-size: 0.7rem;
        }
      </style>
      <li class="key" data-key="${this.key}">
        <kbd>${this.letter}</kbd>
        <span>${this.sound}</span>

        <audio src="./assets/${this.sound}.wav" preload="auto"></audio>
      </li>
    `;

    // Store some elements, we'll need them later
    this.audioPlayer = this.shadowRoot.querySelector('audio');
    this.keyElement = this.shadowRoot.querySelector('li.key');

    // Setup an event listener when a key is pressed
    window.addEventListener('keydown', e => {
      if(e.keyCode === this.key) {
        this.audioPlayer.currentTime = 0;
        this.audioPlayer.play();
        this.active = true;
      }
    });

    // Setup an event listener when a key is released
    window.addEventListener('keyup', e => {
      if(e.keyCode === this.key) {
        this.active = false;
      }
    });
  }

  // We care if the 'active' attribute changes
  static get observedAttributes() {
    return ['active'];
  }

  // Callback run when the 'active' attribute changes
  attributeChangedCallback() {
    if (this.active) {
      this.keyElement.classList.add('pressed');
    } else {
      this.keyElement.classList.remove('pressed');
    }
  }

  // Getters and setters for various properties
  get key() {
    return parseInt(this.getAttribute('key'));
  }

  get letter() {
    return this.getAttribute('letter');
  }

  get sound() {
    return this.getAttribute('sound');
  }

  get active() {
    return this.hasAttribute('active');
  }

  set active(val) {
    if(val) {
      return this.setAttribute('active', '');
    } else {
      return this.removeAttribute('active');
    }
  }

})