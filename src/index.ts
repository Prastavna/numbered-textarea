const styles = /* css */ `
  :host {
    display: inline-block;
    font-family: var(--nt-font-family, monospace);
    font-size: var(--nt-font-size, 14px);
    line-height: var(--nt-line-height, 1.5);
    border: var(--nt-border, 1px solid #ccc);
    border-radius: var(--nt-border-radius, 4px);
    overflow: hidden;
    box-sizing: border-box;
  }

  .wrapper {
    display: flex;
    height: 100%;
    width: 100%;
  }

  .gutter {
    box-sizing: border-box;
    padding: var(--nt-gutter-padding, 8px 12px 8px 8px);
    background: var(--nt-gutter-bg, #f5f5f5);
    color: var(--nt-gutter-color, #999);
    text-align: right;
    user-select: none;
    overflow: hidden;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    border-right: var(--nt-gutter-border, 1px solid #ddd);
    min-width: var(--nt-gutter-min-width, 40px);
  }

  .line-number {
    display: block;
    white-space: nowrap;
  }

  textarea {
    flex: 1;
    box-sizing: border-box;
    padding: var(--nt-padding, 8px);
    margin: 0;
    border: none;
    outline: none;
    resize: none;
    background: var(--nt-bg, #fff);
    color: var(--nt-color, #333);
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    overflow-y: auto;
    overflow-x: auto;
    white-space: pre;
    min-height: 0;
  }

  textarea::placeholder {
    color: var(--nt-placeholder-color, #aaa);
  }
`;

export class NumberedTextarea extends HTMLElement {
  static get observedAttributes(): string[] {
    return ["value", "placeholder", "readonly", "disabled", "wrap"];
  }

  #shadow: ShadowRoot;
  #textarea!: HTMLTextAreaElement;
  #gutter!: HTMLElement;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback(): void {
    this.#render();
    this.#textarea.addEventListener("input", this.#onInput);
    this.#textarea.addEventListener("scroll", this.#onScroll);
    this.#updateLineNumbers();
  }

  disconnectedCallback(): void {
    this.#textarea.removeEventListener("input", this.#onInput);
    this.#textarea.removeEventListener("scroll", this.#onScroll);
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null): void {
    if (!this.#textarea) return;

    switch (name) {
      case "value":
        this.#textarea.value = value ?? "";
        this.#updateLineNumbers();
        break;
      case "placeholder":
        this.#textarea.placeholder = value ?? "";
        break;
      case "readonly":
        this.#textarea.readOnly = value !== null;
        break;
      case "disabled":
        this.#textarea.disabled = value !== null;
        break;
      case "wrap":
        this.#textarea.wrap = value ?? "off";
        break;
    }
  }

  get value(): string {
    return this.#textarea?.value ?? "";
  }

  set value(v: string) {
    if (this.#textarea) {
      this.#textarea.value = v;
      this.#updateLineNumbers();
    }
  }

  get lineCount(): number {
    return (this.value.match(/\n/g) ?? []).length + 1;
  }

  #render(): void {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(styles);
    this.#shadow.adoptedStyleSheets = [sheet];

    const wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");
    wrapper.setAttribute("part", "wrapper");

    this.#gutter = document.createElement("div");
    this.#gutter.classList.add("gutter");
    this.#gutter.setAttribute("part", "gutter");
    this.#gutter.setAttribute("aria-hidden", "true");

    this.#textarea = document.createElement("textarea");
    this.#textarea.setAttribute("part", "textarea");
    this.#textarea.spellcheck = false;
    this.#textarea.wrap = this.getAttribute("wrap") ?? "off";

    if (this.hasAttribute("placeholder")) {
      this.#textarea.placeholder = this.getAttribute("placeholder")!;
    }
    if (this.hasAttribute("readonly")) {
      this.#textarea.readOnly = true;
    }
    if (this.hasAttribute("disabled")) {
      this.#textarea.disabled = true;
    }
    if (this.hasAttribute("value")) {
      this.#textarea.value = this.getAttribute("value")!;
    }

    wrapper.appendChild(this.#gutter);
    wrapper.appendChild(this.#textarea);
    this.#shadow.appendChild(wrapper);
  }

  #onInput = (): void => {
    this.#updateLineNumbers();
    this.dispatchEvent(
      new CustomEvent("nt-input", {
        detail: { value: this.value, lineCount: this.lineCount },
        bubbles: true,
        composed: true,
      }),
    );
  };

  #onScroll = (): void => {
    this.#gutter.scrollTop = this.#textarea.scrollTop;
  };

  #updateLineNumbers(): void {
    const count = this.lineCount;
    const existing = this.#gutter.children.length;

    if (existing < count) {
      const fragment = document.createDocumentFragment();
      for (let i = existing + 1; i <= count; i++) {
        const span = document.createElement("span");
        span.classList.add("line-number");
        span.setAttribute("part", "line-number");
        span.textContent = String(i);
        fragment.appendChild(span);
      }
      this.#gutter.appendChild(fragment);
    } else if (existing > count) {
      for (let i = existing; i > count; i--) {
        this.#gutter.lastChild?.remove();
      }
    }
  }
}

export function register(tagName: string = "numbered-textarea"): typeof NumberedTextarea {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, NumberedTextarea);
  }
  return NumberedTextarea;
}
