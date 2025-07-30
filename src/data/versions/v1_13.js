import { COLORS_1_13, PATTERNS_1_8 } from "../data.js";
import BaseVersion from "./base.js";

class Version1_13 extends BaseVersion {
  constructor() {
    super({ id: "1_13", name: "1.13 to 1.15", colors: COLORS_1_13, patterns: PATTERNS_1_8 });
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

    const name = base.color.name;
    if (bannerData.length < 1) { return `give ${selector} minecraft:${name}_banner`; }

    const patterns = this._patternsJSON(bannerData);

    return `give ${selector} minecraft:${name}_banner{BlockEntityTag:{Patterns:${patterns}}}`;
  }

  _generateSetblockCommand(bannerData) {
    const base = bannerData.shift();

    const name = base.color.name;
    if (bannerData.length < 1) { return `setblock ~ ~ ~ minecraft:${name}_banner`; }

    const patterns = this._patternsJSON(bannerData);
    
    return `setblock ~ ~ ~ minecraft:${name}_banner{Patterns:${patterns}}`;
  }
}

export default Version1_13;
