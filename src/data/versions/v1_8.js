import { COLORS_1_8, PATTERNS_1_8 } from "../data.js";
import BaseVersion from "./base.js";

class Version1_8 extends BaseVersion {
  constructor() {
    super({ id: "1_8", name: "1.8 to 1.12", colors: COLORS_1_8, patterns: PATTERNS_1_8 });
  }

  generateGiveCommand(banner, selector = "@p") {
    const bannerData = this.parse(banner);

    return this._generateGiveCommand(bannerData, selector);
  }

  generateSetBlockCommand(banner) {
    const bannerData = this.parse(banner);

    return this._generateSetblockCommand(bannerData);
  }

  _patternsJSON(bannerData) {
    return JSON.stringify(
      bannerData.map((data) => {
        return { Pattern: data.pattern.code, Color: data.color.code };
      })
    ).replaceAll('"', "");
  }

  _generateGiveCommand(bannerData, selector) {
    const base = bannerData.shift();

    const code = base.color.code;
    if (bannerData.length < 1) { return `give ${selector} minecraft:banner 1 0 {BlockEntityTag:{Base:${code}}}`; }

    const patterns = this._patternsJSON(bannerData);

    return `give ${selector} minecraft:banner 1 0 {BlockEntityTag:{Base:${code},Patterns:${patterns}}}`;
  }

  _generateSetblockCommand(bannerData) {
    const base = bannerData.shift();

    const code = base.color.code;
    if (bannerData.length < 1) { return `setblock ~ ~ ~ minecraft:standing_banner 0 replace {Base:${code}}`; }

    const patterns = this._patternsJSON(bannerData);

    return `setblock ~ ~ ~ minecraft:standing_banner 0 replace {Base:${code},Patterns:${patterns}}`;
  }
}

export default Version1_8;
