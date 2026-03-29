# numbered-textarea

A textarea with line numbers — like VS Code, but as a drop-in component. Available as a Web Component (with React and Vue wrappers coming soon).

## Install

```bash
npm install numbered-textarea
# or
pnpm add numbered-textarea
# or
yarn add numbered-textarea
```

## Quick Start

### Web Component

```html
<script type="module">
  import { register } from "numbered-textarea";
  register();
</script>

<numbered-textarea placeholder="Write some code..."></numbered-textarea>
```

```js
// Or in a JS/TS module
import { register } from "numbered-textarea";
register();

const el = document.querySelector("numbered-textarea");
el.value = "const x = 1;\nconst y = 2;";
console.log(el.lineCount); // 2
```

## API

### `register(tagName?: string): typeof NumberedTextarea`

Registers the custom element. Call once before using the tag. Safe to call multiple times — subsequent calls are no-ops.

```js
register(); // registers <numbered-textarea>
register("code-editor"); // registers <code-editor>
```

### `NumberedTextarea` class

The custom element class. You can also extend it or use it directly:

```js
import { NumberedTextarea } from "numbered-textarea";
customElements.define("my-editor", NumberedTextarea);
```

### Attributes

| Attribute     | Type      | Description                                               |
| ------------- | --------- | --------------------------------------------------------- |
| `value`       | `string`  | The text content                                          |
| `placeholder` | `string`  | Placeholder text when empty                               |
| `readonly`    | `boolean` | Prevents editing                                          |
| `disabled`    | `boolean` | Disables the textarea                                     |
| `wrap`        | `string`  | Wrapping behavior (`off`, `soft`, `hard`). Default: `off` |

### Properties

| Property    | Type     | Description                        |
| ----------- | -------- | ---------------------------------- |
| `value`     | `string` | Get/set the text content           |
| `lineCount` | `number` | Read-only count of lines (1-based) |

### Events

| Event      | Detail                                 | Description                 |
| ---------- | -------------------------------------- | --------------------------- |
| `nt-input` | `{ value: string, lineCount: number }` | Fires on every input change |

```js
editor.addEventListener("nt-input", (e) => {
  console.log(e.detail.lineCount);
});
```

## Styling

The component uses Shadow DOM but provides two ways to customize its appearance from the outside.

### CSS Custom Properties

Set these on the `<numbered-textarea>` element or any ancestor:

| Property                 | Default            | Description            |
| ------------------------ | ------------------ | ---------------------- |
| `--nt-font-family`       | `monospace`        | Font family            |
| `--nt-font-size`         | `14px`             | Font size              |
| `--nt-line-height`       | `1.5`              | Line height            |
| `--nt-border`            | `1px solid #ccc`   | Outer border           |
| `--nt-border-radius`     | `4px`              | Border radius          |
| `--nt-bg`                | `#fff`             | Textarea background    |
| `--nt-color`             | `#333`             | Textarea text color    |
| `--nt-padding`           | `8px`              | Textarea padding       |
| `--nt-placeholder-color` | `#aaa`             | Placeholder text color |
| `--nt-gutter-bg`         | `#f5f5f5`          | Gutter background      |
| `--nt-gutter-color`      | `#999`             | Gutter text color      |
| `--nt-gutter-border`     | `1px solid #ddd`   | Gutter right border    |
| `--nt-gutter-padding`    | `8px 12px 8px 8px` | Gutter padding         |
| `--nt-gutter-min-width`  | `40px`             | Gutter minimum width   |

**Example — dark theme:**

```css
numbered-textarea {
  --nt-bg: #1e1e1e;
  --nt-color: #d4d4d4;
  --nt-gutter-bg: #252526;
  --nt-gutter-color: #858585;
  --nt-gutter-border: 1px solid #333;
  --nt-border: 1px solid #333;
  --nt-font-family: "Fira Code", monospace;
}
```

### `::part()` Selectors

For full CSS control, target Shadow DOM parts directly:

| Part          | Element                   |
| ------------- | ------------------------- |
| `wrapper`     | Outer flex container      |
| `gutter`      | Line numbers column       |
| `textarea`    | The `<textarea>`          |
| `line-number` | Each line number `<span>` |

**Example:**

```css
numbered-textarea::part(gutter) {
  background: #e8f0fe;
  color: #1a73e8;
  font-weight: bold;
}

numbered-textarea::part(textarea) {
  background: #f8f9fa;
}
```

## Sizing

The component respects standard CSS sizing. Set `width` and `height` on the element:

```css
numbered-textarea {
  width: 100%;
  height: 400px;
}
```

## Examples

See the [`examples/`](./examples/) directory for live demos:

- **[`web-component.html`](./examples/web-component.html)** — Default, dark theme, `::part()` styling, and readonly usage

Run with:

```bash
npx vp dev
# open examples/web-component.html in your browser
```

## Development

```bash
pnpm install
pnpm test        # run tests
pnpm run build   # build the library
```

## License

MIT
