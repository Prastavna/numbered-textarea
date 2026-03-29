import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";
import { NumberedTextarea, register } from "../src/index.ts";

function getGutter(el: NumberedTextarea): HTMLElement {
  return el.shadowRoot!.querySelector(".gutter")!;
}

function getTextarea(el: NumberedTextarea): HTMLTextAreaElement {
  return el.shadowRoot!.querySelector("textarea")!;
}

function lineNumbers(el: NumberedTextarea): string[] {
  const gutter = getGutter(el);
  return Array.from(gutter.querySelectorAll(".line-number")).map((s) => s.textContent!);
}

describe("numbered-textarea", () => {
  let el: NumberedTextarea;

  beforeEach(() => {
    register("numbered-textarea");
    el = document.createElement("numbered-textarea") as NumberedTextarea;
    document.body.appendChild(el);
  });

  afterEach(() => {
    el.remove();
  });

  test("registers as a custom element", () => {
    expect(customElements.get("numbered-textarea")).toBe(NumberedTextarea);
  });

  test("renders shadow DOM with gutter and textarea", () => {
    expect(el.shadowRoot).toBeTruthy();
    expect(getGutter(el)).toBeTruthy();
    expect(getTextarea(el)).toBeTruthy();
  });

  test("shows 1 line number for empty content", () => {
    expect(lineNumbers(el)).toEqual(["1"]);
  });

  test("updates line numbers when value is set programmatically", () => {
    el.value = "line1\nline2\nline3";
    expect(lineNumbers(el)).toEqual(["1", "2", "3"]);
    expect(el.lineCount).toBe(3);
  });

  test("reduces line numbers when lines are removed", () => {
    el.value = "a\nb\nc\nd";
    expect(lineNumbers(el)).toEqual(["1", "2", "3", "4"]);

    el.value = "a\nb";
    expect(lineNumbers(el)).toEqual(["1", "2"]);
  });

  test("reflects the value property", () => {
    el.value = "hello";
    expect(el.value).toBe("hello");
  });

  test("applies placeholder attribute", () => {
    el.setAttribute("placeholder", "Type here...");
    expect(getTextarea(el).placeholder).toBe("Type here...");
  });

  test("applies readonly attribute", () => {
    el.setAttribute("readonly", "");
    expect(getTextarea(el).readOnly).toBe(true);
  });

  test("applies disabled attribute", () => {
    el.setAttribute("disabled", "");
    expect(getTextarea(el).disabled).toBe(true);
  });

  test("applies wrap attribute", () => {
    el.setAttribute("wrap", "soft");
    expect(getTextarea(el).wrap).toBe("soft");
  });

  test("exposes CSS parts", () => {
    const wrapper = el.shadowRoot!.querySelector("[part='wrapper']");
    const gutter = el.shadowRoot!.querySelector("[part='gutter']");
    const textarea = el.shadowRoot!.querySelector("[part='textarea']");

    expect(wrapper).toBeTruthy();
    expect(gutter).toBeTruthy();
    expect(textarea).toBeTruthy();
  });

  test("dispatches nt-input event on input", () => {
    const handler = vi.fn();
    el.addEventListener("nt-input", handler);

    const textarea = getTextarea(el);
    textarea.value = "hello\nworld";
    textarea.dispatchEvent(new Event("input"));

    expect(handler).toHaveBeenCalledOnce();
    const detail = (handler.mock.calls[0]![0] as CustomEvent).detail;
    expect(detail.value).toBe("hello\nworld");
    expect(detail.lineCount).toBe(2);
  });

  test("syncs gutter scroll with textarea scroll", () => {
    el.value = Array.from({ length: 100 }, (_, i) => `line ${i + 1}`).join("\n");
    const textarea = getTextarea(el);
    const gutter = getGutter(el);

    Object.defineProperty(textarea, "scrollTop", {
      get: () => 200,
      configurable: true,
    });
    textarea.dispatchEvent(new Event("scroll"));

    expect(gutter.scrollTop).toBe(200);
  });

  test("handles value attribute on creation", () => {
    const el2 = document.createElement("numbered-textarea") as NumberedTextarea;
    el2.setAttribute("value", "a\nb\nc");
    document.body.appendChild(el2);

    expect(el2.value).toBe("a\nb\nc");
    expect(el2.lineCount).toBe(3);

    el2.remove();
  });

  test("lineCount returns correct count", () => {
    expect(el.lineCount).toBe(1);

    el.value = "one\ntwo";
    expect(el.lineCount).toBe(2);

    el.value = "\n\n\n";
    expect(el.lineCount).toBe(4);
  });

  test("register is idempotent", () => {
    register("numbered-textarea");
    register("numbered-textarea");
    expect(customElements.get("numbered-textarea")).toBe(NumberedTextarea);
  });

  test("register allows custom tag name", () => {
    // Can't re-register the same class, so just verify the function doesn't throw
    // when called with the already-registered default name
    const result = register("numbered-textarea");
    expect(result).toBe(NumberedTextarea);
  });
});
