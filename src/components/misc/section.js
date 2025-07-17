import { css, html, LitElement } from "lit";

class NCRSSection extends LitElement {
  static styles = css`
    :host {
      display: block;
      background-color: #1F2025;
    }

    #header {
      padding: 0.25rem 0.5rem;
      color: white;
      border-bottom: 1px solid #3D4042;
      background-image: linear-gradient(to bottom, #313436, #24272A);
    }
  `;

  render() {
    return html`
      <div id="header">
        <slot name="header"></slot>
      </div>
      <slot></slot>
    `;
  }
}

customElements.define("ncrs-section", NCRSSection);

export default NCRSSection;