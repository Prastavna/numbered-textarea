import {
  defineComponent,
  h,
  onMounted,
  onUnmounted,
  ref,
  watch,
  type PropType,
  type SlotsType,
} from "vue";
import { NumberedTextarea as NTElement, register } from "../web/index.ts";

export type { NTElement };

register();

export const NumberedTextarea = defineComponent({
  name: "NumberedTextarea",
  props: {
    modelValue: { type: String as PropType<string>, default: undefined },
    defaultValue: { type: String as PropType<string>, default: undefined },
    placeholder: { type: String as PropType<string>, default: undefined },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    wrap: { type: String as PropType<string>, default: "off" },
  },
  emits: {
    "update:modelValue": (_value: string) => true,
    input: (_value: string, _lineCount: number) => true,
  },
  slots: Object as SlotsType<Record<string, never>>,
  setup(props, { emit, expose }) {
    const hostRef = ref<NTElement | null>(null);

    function getLineCount(): number {
      return hostRef.value?.lineCount ?? 1;
    }

    function focus(): void {
      hostRef.value?.shadowRoot?.querySelector("textarea")?.focus();
    }

    expose({
      element: hostRef,
      lineCount: getLineCount,
      focus,
    });

    function handleEvent(e: Event) {
      const detail = (e as CustomEvent<{ value: string; lineCount: number }>).detail;
      emit("update:modelValue", detail.value);
      emit("input", detail.value, detail.lineCount);
    }

    onMounted(() => {
      const el = hostRef.value;
      if (!el) return;

      if (props.modelValue !== undefined) {
        el.value = props.modelValue;
      } else if (props.defaultValue !== undefined) {
        el.value = props.defaultValue;
      }

      el.addEventListener("nt-input", handleEvent);
    });

    onUnmounted(() => {
      hostRef.value?.removeEventListener("nt-input", handleEvent);
    });

    watch(
      () => props.modelValue,
      (val) => {
        if (val !== undefined && hostRef.value) {
          hostRef.value.value = val;
        }
      },
    );

    return () =>
      h("numbered-textarea", {
        ref: hostRef,
        placeholder: props.placeholder,
        readonly: props.readonly ? "" : undefined,
        disabled: props.disabled ? "" : undefined,
        wrap: props.wrap,
      });
  },
});
