import { css, html, LitElement } from "lit";

import IMG_ARROW_DOWN from "../../../assets/icons/arrow_down.png";
import IMG_ARROW_UP from "../../../assets/icons/arrow_up.png";
import IMG_EYE_CLOSED from "../../../assets/icons/eye_closed.png";
import IMG_EYE_OPEN from "../../../assets/icons/eye.png";
import IMG_HANDLE from "../../../assets/icons/handle.png";
import IMG_REMOVE from "../../../assets/icons/remove.png";

const ICON_MAP = {
  arrow_down: IMG_ARROW_DOWN,
  arrow_up: IMG_ARROW_UP,
  eye_closed: IMG_EYE_CLOSED,
  eye_open: IMG_EYE_OPEN,
  handle: IMG_HANDLE,
  remove: IMG_REMOVE,
}

class NCRSBannerIcon extends LitElement {
  static properties = {
    icon: {type: String},
    alt: {type: String},
    width: {type: String},
    height: {type: String},
  }

  static styles = css`
    :host {
      --width: var(--ncrs-icon-width, var(--ncrs-icon-size, 16px));
      --height: var(--ncrs-icon-height, var(--ncrs-icon-size, 16px));

      background-image: var(--image);
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;

      display: inline-block;
      width: var(--width);
      height: var(--height);
    }
  `;

  constructor(icon) {
    super();

    if (icon) {
      this.icon = icon;
    }
  }

  render() {
    if (this.width) {
      this.style.setProperty("--width", this.width + "px");
    }

    if (this.height) {
      this.style.setProperty("--height", this.height + "px");
    }

    this.style.setProperty("--image", `url(${ICON_MAP[this.icon]})`);
  }
}

customElements.define("ncrs-banner-icon", NCRSBannerIcon);

export default NCRSBannerIcon;