import { COLORS_1_13, PATTERNS_1_16 } from "../data.js";
import BaseVersion from "./base.js";

class Version1_16 extends BaseVersion {
  constructor() {
    super({ id: "1_16", name: "1.16 to 1.20", colors: COLORS_1_13, patterns: PATTERNS_1_16 });
  }

  generateGiveCommand(banner, selector = "@p") {
    const bannerData = this.parse(banner);

    return this._generateGiveCommand(bannerData, selector);
  }

  generateSetBlockCommand(banner) {
    const bannerData = this.parse(banner);

    return this._generateSetblockCommand(bannerData);
  }

  generateShieldGiveCommand(banner, selector = "@p") {
    const bannerData = this.parse(banner);

    return this._generateShieldGiveCommand(bannerData, selector);
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

  _generateShieldGiveCommand(bannerData, selector) {
    const base = bannerData.shift();

    const code = base.code.code;
    if (bannerData.length < 1) { return `give ${selector} minecraft:shield{BlockEntityTag:{Base:${code}}}`; }

    const patterns = this._patternsJSON(bannerData);

    return `give ${selector} minecraft:shield{BlockEntityTag:{Base:${code},Patterns:${patterns}}}`;
  }
}

export default Version1_16;
