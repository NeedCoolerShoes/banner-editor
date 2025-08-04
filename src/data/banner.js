import Version1_8 from "./versions/v1_8.js";
import Version1_13 from "./versions/v1_13.js";
import Version1_16 from "./versions/v1_16.js";
import Version1_21 from "./versions/v1_21.js";
import PersistenceManager from "../persistence.js";

const LATEST_VERSION = "1_21";
const PERSISTENCE = new PersistenceManager("ncrs-banner");

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

  static toValidVersionId(id) {
    if (Object.keys(this.versions).includes(id)) { return id; }

    return this.latestVersion();
  }

  static latestVersion() {
    return Object.keys(this.versions).at(-1);
  }

  static fromVersion(id) {
    return new NCRSBanner(id);
  }

  static fromLatestVersion() {
    return new NCRSBanner(this.latestVersion());
  }

  constructor(versionId) {
    super();

    if (versionId) {
      this.setVersion(versionId);
    } else {
      this.setLatestVersion();
    }
  }
  version;
  versionId;

  setVersion(versionId) {
    const newVersion = NCRSBanner.getVersion(versionId);

    if (!newVersion) { return; }

    this.versionId = versionId;
    this.version = newVersion;
    this.dispatchEvent(new CustomEvent("version-change", {detail: this.version}));
    return this.version;
  }

  setLatestVersion() {
    return this.setVersion(LATEST_VERSION);
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

  generateShieldGiveCommand(banner) {
    return this.version.generateShieldGiveCommand(banner);
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

export { NCRSBanner, PERSISTENCE };
