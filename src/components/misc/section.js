import { css, html, LitElement } from "lit";

class NCRSSection extends LitElement {
  static styles = css`
    :host {
      display: block;
      background-color: #1F2025;
      border-radius: 3px;
    }

    #header {
      padding: 0.25rem 0.5rem;
      color: white;
      border-bottom: 1px solid #2e2f34;
      background-color: #232428;
      border-top-right-radius: 3px;
      border-top-left-radius: 3px;
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