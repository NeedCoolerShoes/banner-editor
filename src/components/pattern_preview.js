import { css, LitElement, unsafeCSS } from "lit";
import IMG_BANNER_SPRITES from "../../assets/banner_sprites.png";

const spriteInfo = {
  width: 100,
  x: 20,
  y: 40,
};

class NCRSBannerPatternPreview extends LitElement {
  static properties = {
    sprite: { type: Number },
  };

  static styles = css`
    :host {
      --scale: var(--ncrs-banner-scale, 1);
      --color: var(--ncrs-banner-color, black);
      --mask-x: 0px;
      --mask-y: 0px;
      --sprites: var(--ncrs-banner-sprites, url(${unsafeCSS(IMG_BANNER_SPRITES)}));

      display: block;
      image-rendering: pixelated;
      width: calc(20px * var(--scale));
      height: calc(40px * var(--scale));
      background-color: var(--color);
      mask-image: var(--sprites);
      -webkit-mask-image: var(--sprites);
      mask-position: calc(var(--mask-x) * var(--scale)) calc(var(--mask-y) * var(--scale));
      -webkit-mask-position: calc(var(--mask-x) * var(--scale)) calc(var(--mask-y) * var(--scale));
      mask-size: calc(100px * var(--scale)) auto;
      -webkit-mask-size: calc(100px * var(--scale)) auto;
    }
  `;

  constructor() {
    super();
  }

  render() {
    const sprite = Number(this.sprite) || 0;

    this._updateMask(sprite);
  }

  _updateMask(sprite) {
    const columns = spriteInfo.width / spriteInfo.x;
    const spriteX = (sprite % columns) * -spriteInfo.x;
    const spriteY = Math.floor(sprite / columns) * -spriteInfo.y;

    this.style.setProperty("--mask-x", spriteX + "px");
    this.style.setProperty("--mask-y", spriteY + "px");
  }
}

customElements.define("ncrs-banner-pattern-preview", NCRSBannerPatternPreview);

export default NCRSBannerPatternPreview;
