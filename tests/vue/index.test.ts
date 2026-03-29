import { mount, type VueWrapper } from "@vue/test-utils";
import { afterEach, describe, expect, test } from "vite-plus/test";
import { NumberedTextarea } from "../../src/vue/index.ts";

let wrapper: VueWrapper;

afterEach(() => {
  wrapper?.unmount();
});

function mountNT(props: Record<string, unknown> = {}) {
  wrapper = mount(NumberedTextarea, {
    props,
    attachTo: document.body,
  });
  return wrapper;
}

function getInternals(w: VueWrapper) {
  const host = w.element as HTMLElement;
  const shadow = host.shadowRoot!;
  return {
    host,
    textarea: shadow.querySelector("textarea")!,
    gutter: shadow.querySelector(".gutter")!,
    lineNumbers: () =>
      Array.from(shadow.querySelectorAll(".line-number")).map((s) => s.textContent!),
  };
}

describe("NumberedTextarea (Vue)", () => {
  test("renders the custom element", () => {
    const w = mountNT();
    expect(w.element.tagName.toLowerCase()).toBe("numbered-textarea");
    expect(w.element.shadowRoot).toBeTruthy();
  });

  test("passes placeholder prop", () => {
    const w = mountNT({ placeholder: "Enter code..." });
    const { textarea } = getInternals(w);
    expect(textarea.placeholder).toBe("Enter code...");
  });

  test("passes readonly prop", () => {
    const w = mountNT({ readonly: true });
    const { textarea } = getInternals(w);
    expect(textarea.readOnly).toBe(true);
  });

  test("passes disabled prop", () => {
    const w = mountNT({ disabled: true });
    const { textarea } = getInternals(w);
    expect(textarea.disabled).toBe(true);
  });

  test("passes wrap prop", () => {
    const w = mountNT({ wrap: "soft" });
    const { textarea } = getInternals(w);
    expect(textarea.wrap).toBe("soft");
  });

  test("sets modelValue (v-model)", () => {
    const w = mountNT({ modelValue: "line1\nline2\nline3" });
    const { textarea, lineNumbers } = getInternals(w);
    expect(textarea.value).toBe("line1\nline2\nline3");
    expect(lineNumbers()).toEqual(["1", "2", "3"]);
  });

  test("sets defaultValue for uncontrolled usage", () => {
    const w = mountNT({ defaultValue: "hello\nworld" });
    const { textarea, lineNumbers } = getInternals(w);
    expect(textarea.value).toBe("hello\nworld");
    expect(lineNumbers()).toEqual(["1", "2"]);
  });

  test("emits update:modelValue on input", () => {
    const w = mountNT();
    const { textarea } = getInternals(w);

    textarea.value = "foo\nbar";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));

    const emitted = w.emitted("update:modelValue");
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual(["foo\nbar"]);
  });

  test("emits input event with value and lineCount", () => {
    const w = mountNT();
    const { textarea } = getInternals(w);

    textarea.value = "a\nb\nc";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));

    const emitted = w.emitted("input");
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual(["a\nb\nc", 3]);
  });

  test("exposes lineCount and focus", () => {
    const w = mountNT({ modelValue: "a\nb" });

    const exposed = w.vm as unknown as {
      lineCount: () => number;
      focus: () => void;
    };

    expect(exposed.lineCount()).toBe(2);
    expect(typeof exposed.focus).toBe("function");
  });

  test("updates value when modelValue prop changes", async () => {
    const w = mountNT({ modelValue: "first" });
    const { textarea } = getInternals(w);
    expect(textarea.value).toBe("first");

    await w.setProps({ modelValue: "second\nline" });
    expect(textarea.value).toBe("second\nline");
  });

  test("shows 1 line number for empty content", () => {
    const w = mountNT();
    const { lineNumbers } = getInternals(w);
    expect(lineNumbers()).toEqual(["1"]);
  });

  test("cleans up event listener on unmount", () => {
    const w = mountNT();
    const { textarea } = getInternals(w);

    w.unmount();

    // Should not throw after unmount
    textarea.value = "after unmount";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));
  });
});
