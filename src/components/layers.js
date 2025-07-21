import { css, html, LitElement, unsafeCSS } from "lit";
import Sortable from "sortablejs";
import { BANNER } from "../data/banner";
import IMG_BANNER_BG from "../../assets/banner_bg.png";

const LAYER_SELECTOR_CSS = css`
  .layer-selector {
    display: none;
    position: absolute;
    align-items: start;
    gap: 0.5rem;
    top: 20px;
    left: 0px;
    z-index: 10;
  }

  *:hover > .layer-selector,
  *:focus > .layer-selector {
    display: flex;
    flex-direction: column;
  }

  .layer-selector ncrs-banner-colors,
  .layer-selector ncrs-banner-patterns {
    background-color: #1f2025;
    padding: 0.25rem;
    border: 1px solid #4e5053;
  }

  .layer-selector ncrs-banner-colors {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }

  .layer-selector ncrs-banner-patterns {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 0.25rem;
  }

  @media screen and (min-width: 484px) {
    .layer-selector {
      left: -80px;
    }
  }

  @media screen and (min-width: 893px) {
    *:hover > .layer-selector,
    *:focus > .layer-selector {
      flex-direction: row;
    }

    .layer-selector ncrs-banner-colors {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
    }
  }
`;

class NCRSLayer extends LitElement {
  static properties = {
    color: { type: String, reflect: true },
    pattern: { type: Number, reflect: true },
    hidden: { type: Boolean, reflect: true },
  };

  static styles = [
    css`
      :host {
        position: relative;
        display: flex;
        border-bottom: 1px solid #4e5053;
        box-sizing: border-box;
      }

      :host(:first-child) #move .up {
        display: none;
      }

      :host(:last-child) #move .down {
        display: none;
      }

      :host([hidden])::before {
        content: "";
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        background-color: rgba(85, 86, 87, 0.5);
        pointer-events: none;
        z-index: 5;
      }

      button {
        all: unset;
        display: block;
        line-height: 0px;
        cursor: pointer;
      }

      #color {
        background-color: var(--ncrs-banner-color);
        width: 8px;
        border-right: 1px solid #4e5053;
      }

      #main {
        display: flex;
        align-items: center;
        flex-grow: 1;
        padding: 0.5rem;
      }

      #change-types {
        position: relative;
        background-image: url(${unsafeCSS(IMG_BANNER_BG)});
        border: 1px solid #4e5053;
      }

      #toggle {
        position: relative;
        z-index: 6;
        margin-right: 0.5rem;
      }

      .spacer {
        flex-grow: 1;
      }

      .handle {
        cursor: move;
      }

      #move {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      #move button {
        line-height: 1rem;
      }

      #buttons {
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
    `,
    LAYER_SELECTOR_CSS,
  ];

  constructor() {
    super();

    this.color = this.color || BANNER.defaultColor().color;
    this.pattern = this.pattern || BANNER.defaultPattern().sprite;

    BANNER.addEventListener("version-change", () => {
      this.requestUpdate();
    });
  }
  eventMoveUp = new CustomEvent("move-up");
  eventMoveDown = new CustomEvent("move-down");
  eventUpdate = new CustomEvent("update");
  eventRemove = new CustomEvent("remove");

  render() {
    this.style.setProperty("--ncrs-banner-color", this.color);

    return html`
      <div id="color"></div>
      <div id="main">
        <button id="toggle" @click=${this._toggleVisible}>
          <ncrs-banner-icon icon="${this.hidden ? "eye_closed" : "eye_open"}"></ncrs-banner-icon>
        </button>
        <button id="change-types">
          <ncrs-banner-pattern-preview sprite=${this.pattern}></ncrs-banner-pattern-preview>
          <div class="layer-selector">
            <ncrs-banner-colors @select=${this._changeColor} color=${this.color}></ncrs-banner-colors>
            <ncrs-banner-patterns @select=${this._changePattern}></ncrs-banner-patterns>
          </div>
        </button>
        <div class="spacer"></div>
        <div id="buttons">
          <div id="move">
            <button class="up" @click=${this._moveUp}><ncrs-banner-icon icon="arrow_up"></ncrs-banner-icon></button>
            <button class="down" @click=${this._moveDown}><ncrs-banner-icon icon="arrow_down"></ncrs-banner-icon></button>
          </div>
          <ncrs-banner-icon icon="handle" height="23" part="handle" class="handle"></ncrs-banner-icon>
          <button id="remove" @click=${this._remove}><ncrs-banner-icon icon="remove"></ncrs-banner-icon></button>
        </div>
      </div>
    `;
  }

  getPattern() {
    return BANNER.getPattern(this.pattern);
  }

  getColor() {
    return BANNER.getColor(this.color);
  }

  _toggleVisible() {
    this.hidden = !this.hidden;
    this.dispatchEvent(this.eventUpdate);
  }

  _changeColor(event) {
    this.color = event.detail.color;
    this.dispatchEvent(this.eventUpdate);
  }

  _changePattern(event) {
    this.pattern = event.detail.sprite;
    this.dispatchEvent(this.eventUpdate);
  }

  _moveUp() {
    this.dispatchEvent(this.eventMoveUp);
  }

  _moveDown() {
    this.dispatchEvent(this.eventMoveDown);
  }

  _remove() {
    this.dispatchEvent(this.eventRemove);
  }
}

class NCRSLayerList extends LitElement {
  static properties = {
    baseColor: { type: String },
  };

  static styles = [
    css`
      :host {
        display: flex;
        flex-direction: column;
      }

      button {
        all: unset;
        display: block;
        cursor: pointer;
      }

      #change-color {
        padding: 0.5rem;
      }

      #change-color button {
        position: relative;
        border: 1px solid #4e5053;
      }

      #base {
        display: flex;
        box-sizing: border-box;
        border-bottom: 1px solid #4e5053;
      }

      #color {
        background-color: var(--ncrs-banner-color);
        width: 8px;
        border-right: 1px solid #4e5053;
      }

      #layers ncrs-banner-layer:nth-child(7) {
        border-top: 1px solid rgb(255, 127, 0);
      }

      #layers ncrs-banner-layer:nth-child(n + 7) {
        background-color: rgba(255, 127, 0, 0.1);
      }

      #layers ncrs-banner-layer:nth-child(17) {
        border-top: 1px solid rgb(255, 0, 0);
      }

      #layers ncrs-banner-layer:nth-child(n + 17) {
        background-color: rgba(255, 0, 0, 0.1);
      }

      #base-color {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
      }

      .sortable-fallback {
        display: none;
      }
    `,
    LAYER_SELECTOR_CSS,
  ];

  constructor() {
    super();

    this.baseColor = this.baseColor || BANNER.defaultColor().color;

    this.layers = document.createElement("div");
    this.layers.id = "layers";
  }
  eventUpdate = new CustomEvent("update");

  addLayer(color, sprite) {
    const layer = new NCRSLayer();
    layer.color = color;
    layer.pattern = sprite;

    layer.addEventListener("move-up", () => {
      if (layer.previousSibling) {
        this.layers.insertBefore(layer, layer.previousSibling);
        this.dispatchEvent(this.eventUpdate);
      }
    });

    layer.addEventListener("move-down", () => {
      if (layer.nextSibling) {
        this.layers.insertBefore(layer, layer.nextSibling.nextSibling);
        this.dispatchEvent(this.eventUpdate);
      }
    });

    layer.addEventListener("update", () => {
      this.dispatchEvent(this.eventUpdate);
    });

    layer.addEventListener("remove", () => {
      layer.remove();
      this.dispatchEvent(this.eventUpdate);
    });

    this.layers.appendChild(layer);

    this.dispatchEvent(this.eventUpdate);
  }

  render() {
    this.style.setProperty("--ncrs-banner-color", this.baseColor);

    return html`
      <div id="base">
        <div id="color"></div>
        <div id="change-color">
          <button>
            <ncrs-banner-pattern-preview sprite="0"></ncrs-banner-pattern-preview>
            <div class="layer-selector">
              <ncrs-banner-colors id="base-color" color=${this.baseColor} @select=${this._changeColor}></ncrs-banner-colors>
            </div>
          </button>
        </div>
      </div>
      ${this.layers}
    `;
  }

  firstUpdated() {
    this.dispatchEvent(this.eventUpdate);

    const sortable = new Sortable(this.layers, {
      handle: ".handle",
      touchStartThreshold: 3,
      onEnd: (event) => {
        event.preventDefault();
        this.dispatchEvent(this.eventUpdate);
      },
    });
  }

  empty() {
    return this.layers.children.length <= 0;
  }

  encode() {
    if (!this.layers) {
      return;
    }

    let encoding = BANNER.getColor(this.baseColor).encode;
    encoding += "a";

    this.layers.querySelectorAll("ncrs-banner-layer").forEach((layer) => {
      if (layer.hidden) { return; }

      encoding += layer.getColor().encode;
      encoding += layer.getPattern().encode;
    });

    return encoding;
  }

  decode(banner) {
    this.layers.replaceChildren();
    BANNER.parse(banner).forEach((layer, idx) => {
      if (idx === 0) {
        this.baseColor = layer.color.color;
        return;
      }
      this.addLayer(layer.color.color, layer.pattern.sprite);
    });
    this.dispatchEvent(this.eventUpdate);
  }

  clear() {
    this.layers.replaceChildren();
    this.dispatchEvent(this.eventUpdate);
  }

  _changeColor(event) {
    this.baseColor = event.detail.color;
    this.dispatchEvent(this.eventUpdate);
  }
}

customElements.define("ncrs-banner-layer", NCRSLayer);
customElements.define("ncrs-banner-layer-list", NCRSLayerList);

export { NCRSLayer, NCRSLayerList };
