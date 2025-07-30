import { css, LitElement } from "lit";
import { NCRSBanner } from "../data/banner";

class NCRSBannerColors extends LitElement {
  static properties = {
    version: {type: String, reflect: true },
    color: { type: String, reflect: true },
  };

  static styles = css`
    :host {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
    }

    button {
      all: unset;
      width: 1.5rem;
      height: 1.5rem;
      background-color: var(--color);
      box-sizing: border-box;
      cursor: pointer;
      border-radius: 2px;
      box-shadow: rgba(0, 0, 0, 0.25) 0px 1px 3px inset, rgba(0, 0, 0, 0.25) 0px -2px 1px inset;
    }

    button[data-name=black] {
      border: 1px solid gray;
    }

    button.selected {
      box-shadow: 0 0 5px #54B1FF;
      border: 1px solid #54B1FF;
      cursor: revert;
    }

    button[data-name=light_blue].selected {
      border: 1px solid white;
    }

  `;

  constructor() {
    super();
    
    this.version = NCRSBanner.toValidVersionId(this.version);
    this.banner = NCRSBanner.fromVersion(this.version);

    this.color = this.color || this.banner.getColors()[0].color;
  }

  _createColor(color) {
    const button = document.createElement("button");
    button.style.setProperty("--color", color.color);

    if (color.color === this.color) {
      button.classList.add("selected");
    }

    button.addEventListener("click", () => {
      this.color = color.color;
      this.dispatchEvent(new CustomEvent("select", { detail: color }));
    });

    button.setAttribute("data-name", color.name);
    button.setAttribute("title", color.title);

    return button;
  }

  render() {
    this.banner.setVersion(this.version);

    const colors = [];

    this.banner.getColors().forEach((color) => colors.push(this._createColor(color)));

    return colors;
  }
}

customElements.define("ncrs-banner-colors", NCRSBannerColors);

export default NCRSBannerColors;
