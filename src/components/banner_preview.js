import { css, LitElement, unsafeCSS } from "lit";
import NCRSBannerPatternPreview from "./pattern_preview";
import { NCRSBanner } from "../data/banner";

const BANNER = NCRSBanner.fromLatestVersion();

import IMG_BANNER_SPRITES from "../../assets/banner_sprites.png";
import IMG_SHIELD_SPRITES from "../../assets/shield_sprites.png";

class NCRSBannerPreview extends LitElement {
  static properties = {
    banner: { type: String },
  };

  static styles = css`
    :host {
      --scale: var(--ncrs-banner-scale, 1);

      position: relative;
      display: block;
      width: calc(20px * var(--scale));
      height: calc(40px * var(--scale));
    }

    :host(.ncrs-banner-sprites) {
      --ncrs-banner-sprites: url(${unsafeCSS(IMG_BANNER_SPRITES)});
    }

    :host(.ncrs-shield-sprites) {
      --ncrs-banner-sprites: url(${unsafeCSS(IMG_SHIELD_SPRITES)});
    }

    ncrs-banner-pattern-preview {
      position: absolute;
      left: 0px;
      top: 0px;
    }
  `;

  constructor() {
    super();

    this.banner = this.banner || "pa";
  }

  _createBase(color) {
    const base = new NCRSBannerPatternPreview();
    base.style.setProperty("--ncrs-banner-color", color);

    return base;
  }

  _createLayer(sprite, color) {
    const layer = new NCRSBannerPatternPreview();
    layer.setAttribute("sprite", sprite);
    layer.style.setProperty("--ncrs-banner-color", color);

    return layer;
  }

  render() {
    const params = this.banner.match(/.{1,2}/g);

    if (!params) {
      return;
    }

    const children = [];

    for (let i = 0; i < params.length; i++) {
      const data = BANNER.fromEncoding(params[i]);
      if (i == 0) {
        children.push(this._createBase(data.color.color));
      } else {
        children.push(this._createLayer(data.pattern.sprite, data.color.color));
      }
    }

    return children;
  }
}

customElements.define("ncrs-banner-preview", NCRSBannerPreview);

export default NCRSBannerPreview;