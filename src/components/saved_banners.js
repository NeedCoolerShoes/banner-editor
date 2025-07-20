import { css, html, LitElement } from "lit";
import { BANNER } from "../data/banner";
import NCRSBannerPreview from "./banner_preview.js";
import NCRSBannerIcon from "./misc/icon.js";

class NCRSSavedBanners extends LitElement {
  static properties = {
    code: {type: String},
  }

  static styles = css`
    #saved-banners {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
      padding: 0.25rem;
    }

    ncrs-banner-preview {
      position: relative;
      cursor: pointer;
    }

    #saved-banners > button {
      all: unset;
      user-select: none;
      cursor: pointer;
      width: 20px;
      height: 40px;
      color: white;
      text-align: center;
      font-size: large;
      font-weight: bold;
    }

    .banner {
      position: relative;
    }

    .remove {
      all: unset;
      display: none;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: -20px;
      width: 20px;
      height: 20px;
      z-index: 20;
      cursor: pointer;
      background-color: #131315;
    }

    .banner:hover .remove {
      display: flex;
    }

    input {
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

    input:focus-visible {
      outline: none;
    }

    label {
      font-size: small;
      margin-left: 0.25rem;
      color: #A9A9A9;
    }
  `;

  constructor() {
    super();
  }

  render() {
    function select(event) {
      event.target.select();
    }

    return html`
      <div id="saved-banners">
        ${this._savedBanners()}
        <button id="save-button" title="Save current banner." @click=${this._saveBanner}>+</button>
      </div>
      <label for="share-saved-banners">Share Saved Banners</label>
      <input id="share-saved-banners" readonly value=${this.toURL()} @click=${select}>
    `;
  }

  eventLoadBanner(banner) {
    this.dispatchEvent(new CustomEvent("load-banner", {detail: banner}));
  }

  toURL() {
    const banners = BANNER.persistence.get("banners", []);

    if (banners.length < 1) {
      return "";
    }

    const codes = banners.join("_");

    return `${location.origin}${location.pathname}?=${codes}`
  }

  _savedBanners() {
    const banners = BANNER.persistence.get("banners", []);

    return banners.map(code => {
      return this._createSavedBannerEntry(code);
    })
  }

  _createSavedBannerEntry(banner) {
    function load() {
      this.eventLoadBanner(banner);
    }

    function remove() {
      this._removeBanner(banner);
    }

    return html`
      <div class="banner">
        <ncrs-banner-preview @click=${load} banner=${banner} title="Load saved banner."></ncrs-banner-preview>
        <button class="remove" @click=${remove} title="Remove banner from saved banners.">
          <ncrs-banner-icon icon="remove"></ncrs-banner-icon>
        </button>
      </div>
    `;
  }

  _saveBanner() {
    const banners = BANNER.persistence.get("banners", []);
    
    if (this.code.length <= 2) { return; } 
    if (banners.includes(this.code)) { return; }

    banners.push(this.code);
    BANNER.persistence.set("banners", banners);

    this.requestUpdate();
  }

  _removeBanner(banner) {
    const banners = BANNER.persistence.get("banners", []);

    const idx = banners.indexOf(banner);

    if (idx > -1) {
      banners.splice(idx, 1);
      BANNER.persistence.set("banners", banners);
    }

    this.requestUpdate();
  }
}

customElements.define("ncrs-banner-saved-banners", NCRSSavedBanners);
export default NCRSSavedBanners;