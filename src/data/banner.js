import Version1_8 from "./versions/v1_8.js";
import Version1_13 from "./versions/v1_13.js";
import Version1_16 from "./versions/v1_16.js";
import Version1_21 from "./versions/v1_21.js";

class NCRSBanner extends EventTarget {
  static versions = {
    "1_8": new Version1_8(),
    "1_13": new Version1_13(),
    "1_16": new Version1_16(),
    "1_21": new Version1_21(),
  }

  static getVersion(id) {
    return this.versions[id];
  }

  static validVersions(banner) {
    let output = [];

    Object.entries(this.versions).forEach(([key, version]) => {
      if (version.validate(banner)) {
        output.push([key, version]);
      }
    });

    return output;
  }

  static latestVersion() {
    return Object.keys(this.versions).at(-1);
  }

  constructor(versionId) {
    super();

    this.setVersion(versionId);
  }
  version;
  versionId;

  setVersion(versionId) {
    this.versionId = versionId;
    this.version = NCRSBanner.getVersion(this.versionId);
    this.dispatchEvent(new CustomEvent("version-change", {detail: this.version}));
    return this.version;
  }

  getColors() {
    return this.version.colors;
  }

  getPatterns() {
    return this.version.patterns;
  }

  defaultColor() {
    return this.getColors()[0];
  }

  defaultPattern() {
    return this.getPatterns()[0];
  }

  getColor(color) {
    return this.getColors().find((e) => e.color === color);
  }

  getPattern(pattern) {
    return this.getPatterns().find((e) => e.sprite === pattern);
  }

  generateGiveCommand(banner, selector) {
    return this.version.generateGiveCommand(banner, selector);
  }

  generateSetBlockCommand(banner) {
    return this.version.generateSetBlockCommand(banner);
  }

  fromEncoding(banner) {
    return this.version.fromEncoding(banner);
  }

  parse(banner) {
    return this.version.parse(banner);
  }

  validate(banner) {
    return this.version.validate(banner);
  }
}

const BANNER = new NCRSBanner("1_21");
window.BANNER = BANNER;

export { NCRSBanner, BANNER };
