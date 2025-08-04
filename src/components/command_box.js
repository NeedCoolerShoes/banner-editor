import "./misc/button.js";
import { css, html, LitElement } from "lit";
import { NCRSBanner } from "../data/banner";

class NCRSCommandBox extends LitElement {
  static properties = {
    version: { type: String },
    code: { type: String },
    mode: { type: String },
    selector: { type: String },
  };

  static styles = css`
    :host {
      display: block;
      padding: 0.25rem;
    }

    textarea {
      resize: none;
      box-sizing: border-box;
      font-family: monospace;
      word-break: break-all;
      color: white;
      background-color: #131315;
      border-style: solid;
      border-width: 0px;
      padding: 0.125rem;
      width: 100%;
    }

    #controls {
      display: flex;
      gap: 0.5rem;
      align-items: flex-end;
      justify-content: space-between;
      flex-wrap: wrap;
      margin-top: 0.25rem;
    }

    #buttons {
      display: flex;
    }

    #buttons ncrs-button::part(button) {
      padding: 0rem 0.5rem;
    }

    #version-selector {
      display: flex;
      gap: 0.25rem;
      padding-bottom: 0.5rem;
    }

    #selector {
      color: white;
      background-color: #131315;
      border-style: solid;
      border-width: 0px;
      border-radius: 4px;
      padding: 0.125rem;
      width: 4rem;
    }

    select {
      font-size: small;
      color: white;
      background-color: #131315;
      border-style: solid;
      border-width: 0px;
      border-radius: 4px;
      box-shadow: 0 0 0 2px #313436;
      padding-left: 0.25rem;
    }

    fieldset {
      display: flex;
      gap: 0.25rem;
      padding: 0.125rem 0.25rem;
      border: unset;
      margin: 0px;
      margin-top: -0.25rem;
    }

    legend {
      font-size: small;
      margin-bottom: -0.125rem;
      color: rgb(169, 169, 169);
    }
  `;

  constructor() {
    super();

    this.version = NCRSBanner.toValidVersionId(this.version);
    this.code = this.code || "aa";

    this.banner = new NCRSBanner(this.version);

    this.commandModes = {
      give: this.banner.generateGiveCommand.bind(this.banner),
      setblock: this.banner.generateSetBlockCommand.bind(this.banner),
      shield: this.banner.generateShieldGiveCommand.bind(this.banner),
    };
  }

  getMode() {
    const validModes = Object.keys(this.commandModes);
    if (validModes.includes(this.mode)) {
      return this.mode;
    }

    return validModes[0];
  }

  getSelector() {
    const selector = this.selector;
    if (!selector || selector === "") {
      return "@p";
    }

    return selector;
  }

  render() {
    this.banner.setVersion(this.version);
    if (!this.banner.validate(this.code)) {
      this.banner.setVersion(NCRSBanner.latestVersion());
    }

    const mode = this.getMode();
    const commandFn = this.commandModes[mode];
    const selector = this.getSelector();
    const command = commandFn(this.code, selector);

    function select(event) {
      event.target.select();
    }

    function setSelector(event) {
      this.selector = event.target.value;
    }

    return html`
      <div id="controls">
        <div id="buttons">
          <fieldset>
            <legend>Banner</legend>
            <ncrs-button ?active=${mode === "give"} @click=${this._setGiveMode} title="Give Banner">Give</ncrs-button>
            <ncrs-button ?active=${mode === "setblock"} @click=${this._setSetblockMode} title="Setblock Banner">Setblock</ncrs-button>
          </fieldset>
          <fieldset>
            <legend>Shield</legend>
            <ncrs-button ?active=${mode === "shield"} @click=${this._setShieldMode} title="Give Shield">Give</ncrs-button>
          </fieldset>
        </div>
        <div id="version-selector">
          ${this._versionSelector()}
          <input id="selector" value=${selector} @input=${setSelector}/>
        </div>
      </div>
      <textarea rows="4" readonly @click=${select} .value=${command}></textarea>
    `;
  }

  _setGiveMode() {
    this.mode = "give";
  }

  _setSetblockMode() {
    this.mode = "setblock";
  }

  _setShieldMode() {
    this.mode = "shield";
  }

  _versionSelector() {
    const validVersions = NCRSBanner.validVersions(this.code);

    const options = validVersions.reverse().map(([key, version]) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = version.name;
      option.selected = NCRSBanner.getVersion(key) === this.banner.version;

      return option;
    });

    function update(event) {
      this.version = event.target.value;
    }

    return html`
      <select @change=${update}>
        ${options}
      </select>
    `;
  }
}

customElements.define("ncrs-banner-command-box", NCRSCommandBox);
export default NCRSCommandBox;
