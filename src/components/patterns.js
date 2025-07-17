import { css, LitElement, unsafeCSS } from "lit";
import { BANNER } from "../data/banner";
import NCRSBannerPatternPreview from "./pattern_preview";

import IMG_BANNER_BG from "../../assets/banner_bg.png";

class NCRSBannerPatterns extends LitElement {
  static properties = {
    color: { type: String },
  };

  static styles = css`
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    button {
      all: unset;
      display: block;
      background-image: url(${unsafeCSS(IMG_BANNER_BG)});
      box-sizing: border-box;
      cursor: pointer;
    }
  `;

  constructor() {
    super();

    BANNER.addEventListener("version-change", () => {
      this.requestUpdate();
    });
  }

  _createPattern(pattern) {
    const button = document.createElement("button");
    const preview = new NCRSBannerPatternPreview();
    preview.sprite = pattern.sprite;

    button.appendChild(preview);

    button.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent("select", { detail: pattern }));
    });

    button.addEventListener("mouseenter", () => {
      this.dispatchEvent(new CustomEvent("preview-show", {detail: pattern}));
    });

    button.addEventListener("mouseleave", () => {
      this.dispatchEvent(new CustomEvent("preview-hide"));
    });

    button.setAttribute("title", pattern.title);

    return button;
  }

  render() {
    const patterns = [];

    BANNER.getPatterns().forEach((pattern) => patterns.push(this._createPattern(pattern)));

    return patterns;
  }
}

customElements.define("ncrs-banner-patterns", NCRSBannerPatterns);

export default NCRSBannerPatterns;
