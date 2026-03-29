import { useRef, useState } from "react";
import { NumberedTextarea, type NumberedTextareaRef } from "../src/react/index.tsx";

const defaultCode = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`;

export function App() {
  const [lineCount, setLineCount] = useState(0);
  const editorRef = useRef<NumberedTextareaRef>(null);

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>numbered-textarea — React Example</h1>

      <h2>Controlled with event handling</h2>
      <NumberedTextarea
        ref={editorRef}
        defaultValue={defaultCode}
        placeholder="Write some code..."
        onInput={(_value, count) => setLineCount(count)}
        style={{ width: "100%", height: "300px" }}
      />
      <p style={{ color: "#777", fontSize: "0.85rem" }}>Lines: {lineCount}</p>

      <button type="button" onClick={() => editorRef.current?.focus()}>
        Focus editor
      </button>

      <h2>Dark theme (CSS custom properties via className)</h2>
      <NumberedTextarea
        className="dark-theme"
        defaultValue={'const greeting = "Hello, World!";\nconsole.log(greeting);'}
        style={{ width: "100%", height: "200px" }}
      />

      <h2>Read-only</h2>
      <NumberedTextarea
        readOnly
        value={"// This content is read-only\nconst x = 42;"}
        style={{ width: "100%", height: "120px" }}
      />
    </div>
  );
}
