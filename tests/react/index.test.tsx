import { cleanup, render } from "@testing-library/react";
import { createRef } from "react";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
import { NumberedTextarea, type NumberedTextareaRef } from "../../src/react/index.tsx";

afterEach(cleanup);

function getInternals(container: HTMLElement) {
  const host = container.querySelector("numbered-textarea")!;
  const shadow = host.shadowRoot!;
  return {
    host,
    textarea: shadow.querySelector("textarea")!,
    gutter: shadow.querySelector(".gutter")!,
    lineNumbers: () =>
      Array.from(shadow.querySelectorAll(".line-number")).map((s) => s.textContent!),
  };
}

describe("NumberedTextarea (React)", () => {
  test("renders the custom element", () => {
    const { container } = render(<NumberedTextarea />);
    const el = container.querySelector("numbered-textarea");
    expect(el).toBeTruthy();
    expect(el!.shadowRoot).toBeTruthy();
  });

  test("passes placeholder prop", () => {
    const { container } = render(<NumberedTextarea placeholder="Enter code..." />);
    const { textarea } = getInternals(container);
    expect(textarea.placeholder).toBe("Enter code...");
  });

  test("passes readOnly prop", () => {
    const { container } = render(<NumberedTextarea readOnly />);
    const { textarea } = getInternals(container);
    expect(textarea.readOnly).toBe(true);
  });

  test("passes disabled prop", () => {
    const { container } = render(<NumberedTextarea disabled />);
    const { textarea } = getInternals(container);
    expect(textarea.disabled).toBe(true);
  });

  test("passes wrap prop", () => {
    const { container } = render(<NumberedTextarea wrap="soft" />);
    const { textarea } = getInternals(container);
    expect(textarea.wrap).toBe("soft");
  });

  test("sets controlled value", () => {
    const { container } = render(<NumberedTextarea value={"line1\nline2\nline3"} />);
    const { textarea, lineNumbers } = getInternals(container);
    expect(textarea.value).toBe("line1\nline2\nline3");
    expect(lineNumbers()).toEqual(["1", "2", "3"]);
  });

  test("sets defaultValue for uncontrolled usage", () => {
    const { container } = render(<NumberedTextarea defaultValue={"hello\nworld"} />);
    const { textarea, lineNumbers } = getInternals(container);
    expect(textarea.value).toBe("hello\nworld");
    expect(lineNumbers()).toEqual(["1", "2"]);
  });

  test("calls onInput when typing", () => {
    const handler = vi.fn();
    const { container } = render(<NumberedTextarea onInput={handler} />);
    const { textarea } = getInternals(container);

    textarea.value = "foo\nbar";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith("foo\nbar", 2);
  });

  test("calls onChange when typing", () => {
    const handler = vi.fn();
    const { container } = render(<NumberedTextarea onChange={handler} />);
    const { textarea } = getInternals(container);

    textarea.value = "a\nb\nc";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));

    expect(handler).toHaveBeenCalledOnce();
    expect(handler).toHaveBeenCalledWith("a\nb\nc", 3);
  });

  test("exposes ref with element, lineCount, and focus", () => {
    const ref = createRef<NumberedTextareaRef>();
    render(<NumberedTextarea ref={ref} value={"a\nb"} />);

    expect(ref.current).toBeTruthy();
    expect(ref.current!.lineCount).toBe(2);
    expect(typeof ref.current!.focus).toBe("function");
  });

  test("applies className", () => {
    const { container } = render(<NumberedTextarea className="dark-theme" />);
    const el = container.querySelector("numbered-textarea");
    expect(el!.classList.contains("dark-theme")).toBe(true);
  });

  test("applies inline style", () => {
    const { container } = render(<NumberedTextarea style={{ width: "100%", height: "300px" }} />);
    const el = container.querySelector("numbered-textarea") as HTMLElement;
    expect(el.style.width).toBe("100%");
    expect(el.style.height).toBe("300px");
  });

  test("updates value on re-render (controlled)", () => {
    const { container, rerender } = render(<NumberedTextarea value="first" />);
    const { textarea } = getInternals(container);
    expect(textarea.value).toBe("first");

    rerender(<NumberedTextarea value={"second\nline"} />);
    expect(textarea.value).toBe("second\nline");
  });

  test("cleans up event listener on unmount", () => {
    const handler = vi.fn();
    const { container, unmount } = render(<NumberedTextarea onInput={handler} />);
    const { textarea } = getInternals(container);

    unmount();

    textarea.value = "after unmount";
    textarea.dispatchEvent(new Event("input", { bubbles: true }));

    expect(handler).not.toHaveBeenCalled();
  });
});
