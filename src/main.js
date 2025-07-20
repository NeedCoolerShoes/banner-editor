import "./style.css";
import "./components/banner_preview.js";
import "./components/misc/section.js";
import "./components/misc/icon.js";
import "./components/misc/button.js";
import "./components/misc/modal.js";
import "./components/colors.js";
import "./components/patterns.js";
import "./components/layers.js";
import "./components/command_box.js";
import "./components/saved_banners.js";

import { css, html, LitElement, unsafeCSS } from "lit";
import { BANNER, NCRSBanner } from "./data/banner.js";
import { NCRSLayerList } from "./components/layers.js";
import NCRSBannerPatternPreview from "./components/pattern_preview.js";

import IMG_BANNER_OVERLAY from "/assets/banner_overlay.png";
import Modal from "./components/misc/modal.js";

class NCRSBannerUI extends LitElement {
  static properties = {
    code: { type: String, reflect: true },
    _color: { state: true },
  };

  static styles = css`
    :host {
      display: grid;
      grid-template-columns: 1fr 1fr 2fr;
      gap: 0.5rem;
    }

    h2 {
      font-size: medium;
      font-weight: normal;
      margin: 0px;
    }

    hr {
      width: 100%;
      height: 0px;
      border-top-width: 100%;
      border-color: #4e5053;
      box-sizing: border-box;
    }

    ncrs-button {
      text-align: center;
      font-size: large;
      font-weight: bold;
    }

    ncrs-button::part(button) {
      padding-top: 0.25rem;
      padding-bottom: 0.25rem;
    }

    #layers ncrs-banner-layer-list {
      min-height: 413px;
    }

    #patterns {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.5rem;
    }

    #patterns ncrs-banner-patterns {
      display: grid;
      grid-template-columns: repeat(19, 1fr);
    }

    #preview-section {
      background-color: transparent;
    }

    #preview {
      --ncrs-banner-scale: 8;
      padding: 1rem;
      display: flex;
      justify-content: center;
    }

    #preview .skew {
      transform: rotateY(-7deg);
      transform-origin: 100% 50%;
      transform-style: preserve-3d;
      perspective: 1400px;
      position: relative;
      perspective-origin: 200% 20%;
    }

    #preview .wave {
      position: relative;
      transform-origin: 50% 0%;
      position: relative;
      animation: wave 5s ease-in-out infinite;
      border-right: 3px solid rgba(163, 163, 162, 0.5);
    }

    #preview-overlay {
      display: none;
      position: absolute;
      top: 0px;
    }

    #preview-overlay.visible {
      display: block;
    }

    #preview-texture-overlay {
      top: 0px;
      width: calc(20px * var(--ncrs-banner-scale));
      height: calc(40px * var(--ncrs-banner-scale));
      position: absolute;
      background-image: url(${unsafeCSS(IMG_BANNER_OVERLAY)});
      background-size: calc(20px * var(--ncrs-banner-scale)) calc(40px * var(--ncrs-banner-scale));
    }

    #buttons {
      display: flex;
      flex-direction: column;
    }

    #patterns-area {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    #patterns-area [slot="header"] {
      display: flex;
      justify-content: space-between;
    }

    #patterns-area select {
      font-size: small;
      color: white;
      background-color: #131315;
      border-style: solid;
      border-width: 0px;
      border-radius: 4px;
      box-shadow: 0 0 0 2px #313436;
      padding-left: 0.25rem;
    }

    #share-link {
      font-size: medium;
      font-family: monospace;
      box-sizing: border-box;
      color: white;
      background-color: #131315;
      border-style: solid;
      border-width: 0px;
      border-radius: 4px;
      padding: 0.5rem;
      width: 100%;
    }

    #share-link:focus-visible {
      outline: none;
    }

    #url-banner {
      margin-top: 0.5rem;
    }
    
    #url-banner > div {
      display: flex;
      padding: 0.25rem;
      gap: 0.25rem;
    }

    #url-banner ncrs-banner-preview {
      cursor: pointer;
    }

    ncrs-modal {
      z-index: 50;
    }

    @keyframes wave {
      0% {
        transform: rotateX(1deg);
      }
      50% {
        transform: rotateX(-6deg);
      }
      100% {
        transform: rotateX(1deg);
      }
    }
  `;

  constructor() {
    super();

    this._color = BANNER.defaultColor().color;
    this.layers = new NCRSLayerList();
    this.layers.addEventListener("update", () => {
      this.code = this.layers.encode();
    });

    this.previewOverlay = new NCRSBannerPatternPreview();
    this.previewOverlay.id = "preview-overlay";

    this.galleryModal = this._createGalleryModal();

    BANNER.addEventListener("version-change", () => {
      this.requestUpdate();
    });

    this._setCode();
    this.layers.decode(this.code);

    window.addEventListener("popstate", () => {
      this.loadFromURL();
    });
  }
  urlBanners = [];

  render() {
    this._updateURL();

    function select(event) {
      event.target.select();
    }

    return html`
      <section id="preview-area">
        <ncrs-section id="preview-section">
          <h2 slot="header">Preview</h2>
          <div id="preview">
            <div class="skew">
              <div class="wave">
                <ncrs-banner-preview banner=${this.code}></ncrs-banner-preview>
                ${this.previewOverlay}
                <div id="preview-texture-overlay"></div>
              </div>
            </div>
          </div>
        </ncrs-section>
        <div id="buttons">
          <ncrs-button @click=${this._randomize}>Randomize!</ncrs-button>
          <ncrs-button @click=${this._clear}>Clear All</ncrs-button>
          <ncrs-button @click=${this._openShareModal}>Share to Gallery</ncrs-button>
        </div>
        ${this._renderURLBanners()}
      </section>
      <section id="layers-area">
        <ncrs-section id="layers">
          <h2 slot="header">Layers</h2>
          ${this.layers}
        </ncrs-section>
      </section>
      <section id="patterns-area">
        <ncrs-section>
          <div slot="header">
            <h2>Layer Creation</h2>
            ${this._versionSelector()}
          </div>
          <div id="patterns" style="--ncrs-banner-color: ${this._color};">
            <ncrs-banner-colors @select=${this._updateColor}></ncrs-banner-colors>
            <hr/>
            <ncrs-banner-patterns @select=${this._addLayer} @preview-show=${this._showPreview} @preview-hide=${this._hidePreview}>
            </ncrs-banner-patterns>
          </div>
        </ncrs-section>
        <ncrs-section>
          <h2 slot="header">Share Link</h2>
          <input id="share-link" readonly @click=${select} value=${location.toString()}>
        </ncrs-section>
        <ncrs-section>
          <h2 slot="header">Generate Command</h2>
          <ncrs-banner-command-box version=${BANNER.versionId} code=${this.code}></ncrs-banner-command-box>
        </ncrs-section>
        <ncrs-section>
          <h2 slot="header">Saved Banners</h2>
          <ncrs-banner-saved-banners code=${this.code} @load-banner=${this._loadSavedBanner}></ncrs-banner-saved-banners>
        </ncrs-section>
      </section>
      ${this.galleryModal}
    `;
  }

  setBanner(code) {
    this.layers.decode(code);
  }

  loadFromURL() {
    const path = new URLSearchParams(location).get("search");
    const banners = path.replaceAll(/[?=]/g, "").split("_");

    if (banners[0] === "") { return; }

    this.urlBanners = banners;

    this.setBanner(banners[0]);
  }

  _setCode() {
    if (this.code) { return; }

    this.loadFromURL();
    if (this.code) { return; }

    this._loadFromPersistence();
    if (this.code) { return; }

    this.code = "aa";
  }

  _loadFromPersistence() {
    const banner = BANNER.persistence.get("current", null);
    if (!banner) { return; }

    this.code = banner;
  }

  _loadSavedBanner(event) {
    this.setBanner(event.detail);
  }

  _updateURL(replace = false) {
    const current = new URLSearchParams(location);
    const path = "?=" + this.code;
    if (current.get("search") == path) { return }
    
    if (this.layers.empty()) {
      history.replaceState({}, "", location.pathname)
    } else {
      if (replace) {
        history.replaceState({}, "", path)
      } else {
        history.pushState({}, "", path)
      }
    }

    BANNER.persistence.set("current", this.code);
  }

  _updateColor(event) {
    this._color = event.detail.color;
  }

  _addLayer(event) {
    this.layers.addLayer(this._color, event.detail.sprite);
  }

  _showPreview(event) {
    this.previewOverlay.style.setProperty("--ncrs-banner-color", this._color);
    this.previewOverlay.sprite = event.detail.sprite;
    this.previewOverlay.classList.add("visible");
  }

  _hidePreview() {
    this.previewOverlay.classList.remove("visible");
  }

  _versionSelector() {
    const validVersions = NCRSBanner.validVersions(this.code);

    const options = validVersions.reverse().map(([key, version]) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = version.name;
      option.selected = (NCRSBanner.getVersion(key) === BANNER.version);

      return option;
    });

    function update(event) {
      BANNER.setVersion(event.target.value);
    }

    return html`
      <select @change=${update}>
        ${options}
      </select>
    `;
  }

  _randomize() {
    let str = ""
    const count = Math.floor((Math.random() * 6) + 2)
    for (let i = 0; i < count; i++) {
      const colorIdx = Math.floor(Math.random() * BANNER.getColors().length)
      const patternIdx = Math.floor(Math.random() * BANNER.getPatterns().length)
      const color = BANNER.getColors()[colorIdx]
      const pattern = BANNER.getPatterns()[patternIdx]

      if (i == 0) {
        str += (color.encode + "a")
      } else {
        str += (color.encode + pattern.encode)
      }
    }

    this.layers.decode(str);
  }

  _clear() {
    this.layers.clear();
  }

  _renderURLBanners() {
    if (this.urlBanners.length < 1) { return; }

    const banners = this.urlBanners.map(banner => {
      function load() {
        this.setBanner(banner);
      }

      return html`
        <ncrs-banner-preview @click=${load} banner=${banner} title="Load URL banner."></ncrs-banner-preview>
      `;
    })

    return html`
      <ncrs-section id="url-banner">
        <h2 slot="header">URL Banner</h2>
        <div>
          ${banners}
        </div>
      </ncrs-section>
    `;
  }

  _createGalleryModal() {
    const modal = new Modal();
    modal.id = "export-modal";
    modal.part = "export-form";

    const slot = document.createElement("slot");
    slot.name = "export-form";

    modal.appendChild(slot);

    return modal;
  }

  _openShareModal() {
    this.galleryModal.show();
  }
}

customElements.define("ncrs-banner-ui", NCRSBannerUI);

export default NCRSBannerUI;
