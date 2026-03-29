import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  type CSSProperties,
} from "react";
import { NumberedTextarea as NTElement, register } from "../web/index.ts";

export type { NTElement };

export interface NumberedTextareaRef {
  /** The underlying custom element */
  element: NTElement;
  /** Current line count */
  lineCount: number;
  /** Focus the textarea */
  focus: () => void;
}

export interface NumberedTextareaProps {
  /** Textarea value (controlled) */
  value?: string;
  /** Default value (uncontrolled) */
  defaultValue?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Read-only mode */
  readOnly?: boolean;
  /** Disabled mode */
  disabled?: boolean;
  /** Wrap behavior: "off" | "soft" | "hard" */
  wrap?: string;
  /** Called on every input with value and line count */
  onInput?: (value: string, lineCount: number) => void;
  /** Called on value change */
  onChange?: (value: string, lineCount: number) => void;
  /** CSS class name */
  className?: string;
  /** Inline styles applied to the host element */
  style?: CSSProperties;
}

register();

export const NumberedTextarea = forwardRef<NumberedTextareaRef, NumberedTextareaProps>(
  function NumberedTextarea(
    {
      value,
      defaultValue,
      placeholder,
      readOnly,
      disabled,
      wrap,
      onInput,
      onChange,
      className,
      style,
    },
    ref,
  ) {
    const elRef = useRef<NTElement | null>(null);
    const onInputRef = useRef(onInput);
    const onChangeRef = useRef(onChange);

    onInputRef.current = onInput;
    onChangeRef.current = onChange;

    useImperativeHandle(ref, () => ({
      get element() {
        return elRef.current!;
      },
      get lineCount() {
        return elRef.current?.lineCount ?? 1;
      },
      focus() {
        elRef.current?.shadowRoot?.querySelector("textarea")?.focus();
      },
    }));

    const handleEvent = useCallback((e: Event) => {
      const detail = (e as CustomEvent<{ value: string; lineCount: number }>).detail;
      onInputRef.current?.(detail.value, detail.lineCount);
      onChangeRef.current?.(detail.value, detail.lineCount);
    }, []);

    useEffect(() => {
      const el = elRef.current;
      if (!el) return;
      el.addEventListener("nt-input", handleEvent);
      return () => el.removeEventListener("nt-input", handleEvent);
    }, [handleEvent]);

    useLayoutEffect(() => {
      if (value !== undefined && elRef.current) {
        elRef.current.value = value;
      }
    }, [value]);

    const refCallback = useCallback(
      (node: NTElement | null) => {
        elRef.current = node;
        if (node) {
          if (value !== undefined) {
            node.value = value;
          } else if (defaultValue !== undefined) {
            node.value = defaultValue;
          }
        }
      },
      [defaultValue, value],
    );

    return (
      // @ts-expect-error -- custom element not in JSX.IntrinsicElements
      <numbered-textarea
        ref={refCallback}
        placeholder={placeholder}
        readonly={readOnly ? "" : undefined}
        disabled={disabled ? "" : undefined}
        wrap={wrap}
        class={className}
        style={style}
      />
    );
  },
);
