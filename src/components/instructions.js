import { css, LitElement, unsafeCSS } from "lit";
import { NCRSBanner } from "../data/banner";
import NCRSBannerPatternPreview from "./pattern_preview";

import IMG_BANNER_BG from "../../assets/banner_bg.png";

const BANNER = NCRSBanner.fromLatestVersion();

class NCRSBannerInstructions extends LitElement {
  static properties = {
    banner: {type: String, reflect: true},
  }

  static styles = css`
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    .pattern-bg {
      background-image: url(${unsafeCSS(IMG_BANNER_BG)});
    }
  `;

  constructor() {
    super();
    this.banner = this.banner || "";
  }

  render() {
    const params = this.banner.match(/.{1,2}/g);

    if (!params) {
      return;
    }
    
    const children = [];

    for (let i = 0; i < params.length; i++) {
      const data = BANNER.fromEncoding(params[i]);

      const div = document.createElement("div");
      div.classList.add("pattern-bg");

      if (i == 0) {
        div.appendChild(this._createBase(data.color));
      } else {
        div.appendChild(this._createLayer(data.pattern, data.color));
      }

      children.push(div);
    }

    return children;
  }

  _createBase(color) {
    const base = new NCRSBannerPatternPreview();
    base.style.setProperty("--ncrs-banner-color", color.color);
    base.title = `${color.title} Base`;

    return base;
  }

  _createLayer(pattern, color) {
    const layer = new NCRSBannerPatternPreview();
    layer.setAttribute("sprite", pattern.sprite);
    layer.style.setProperty("--ncrs-banner-color", color.color);
    layer.title = `${color.title} ${pattern.title}`;

    return layer;
  }
}

customElements.define("ncrs-banner-instructions", NCRSBannerInstructions);

export default NCRSBannerInstructions;