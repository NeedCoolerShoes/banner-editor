import { COLORS_1_21, PATTERNS_1_21 } from "../data.js";
import BaseVersion from "./base.js";

class Version1_21 extends BaseVersion {
  constructor() {
    super({ id: "1_21", name: "1.21+", colors: COLORS_1_21, patterns: PATTERNS_1_21 });
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
        return { pattern: data.pattern.code, color: data.color.code };
      })
    );
  }

  _generateGiveCommand(bannerData, selector) {
    const base = bannerData.shift();

    const name = base.color.name;
    if (bannerData.length < 1) { return `give ${selector} minecraft:${name}_banner`; }

    const patterns = this._patternsJSON(bannerData);

    return `give ${selector} minecraft:${name}_banner[banner_patterns=${patterns}]`;
  }

  _generateSetblockCommand(bannerData) {
    const base = bannerData.shift();

    const name = base.color.name;
    if (bannerData.length < 1) { return `setblock ~ ~ ~ minecraft:${name}_banner`; }

    const patterns = this._patternsJSON(bannerData);

    return `setblock ~ ~ ~ minecraft:${name}_banner{patterns:${patterns}}`;
  }

  _generateShieldGiveCommand(bannerData, selector) {
    const base = bannerData.shift();

    const name = base.color.name;
    if (bannerData.length < 1) { return `give ${selector} minecraft:shield[base_color="${name}"]`; }

    const patterns = this._patternsJSON(bannerData);

    return `give ${selector} minecraft:shield[base_color="${name}",banner_patterns=${patterns}]`;
  }
}

export default Version1_21;
