<script setup lang="ts">
import { ref } from "vue";
import { NumberedTextarea } from "../src/vue/index.ts";

const defaultCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`;

const lineCount = ref(0);
const editorRef = ref<{ focus: () => void } | null>(null);
</script>

<template>
  <div style="max-width: 800px; margin: 40px auto; font-family: system-ui, sans-serif">
    <h1>numbered-textarea — Vue Example</h1>

    <h2>With v-model and event handling</h2>
    <NumberedTextarea
      ref="editorRef"
      :default-value="defaultCode"
      placeholder="Write some code..."
      style="width: 100%; height: 300px"
      @input="(_v: string, count: number) => (lineCount = count)"
    />
    <p style="color: #777; font-size: 0.85rem">Lines: {{ lineCount }}</p>
    <button @click="editorRef?.focus()">Focus editor</button>

    <h2>Dark theme (CSS custom properties via class)</h2>
    <NumberedTextarea
      class="dark-theme"
      default-value='const greeting = "Hello, World!";
console.log(greeting);'
      style="width: 100%; height: 200px"
    />

    <h2>Read-only</h2>
    <NumberedTextarea
      readonly
      model-value="// This content is read-only
const x = 42;"
      style="width: 100%; height: 120px"
    />
  </div>
</template>
