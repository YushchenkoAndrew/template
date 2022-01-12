import React, { useImperativeHandle, useRef, useState } from "react";
import { basePath } from "../../config";
import styles from "./Terminal.module.css";

export interface TerminalProps {
  show?: boolean;
}

export interface TerminalRef {
  runCommand: (command: string) => void;
}

export default React.forwardRef((props: TerminalProps, ref) => {
  const cmdRef = useRef<HTMLDivElement>(null);
  const cmdLineRef = useRef<HTMLInputElement>(null);
  const [line, setLine] = useState("");
  const [history, setHistory] = useState<string[]>([]);

  useImperativeHandle<unknown, TerminalRef>(ref, () => ({
    runCommand(command: string) {
      fetch(`${basePath}/api/admin/exec`, {
        method: "POST",
        headers: { "content-type": "text/plain" },
        body: command,
      })
        .then((res) => res.text())
        .then((data) => setHistory([...history, command + "\n" + data]))
        .catch((err) => setHistory([...history, command + "\n" + err]))
        .finally(() => {
          cmdRef?.current?.scrollTo({
            top: cmdRef?.current?.scrollHeight,
          });
        });

      cmdLineRef?.current?.focus();
    },
  }));

  return (
    <div
      ref={cmdRef}
      className={`container bg-dark p-3 ${styles["terminal"]} ${
        props.show ? "" : "d-none"
      }`}
      onClick={() => cmdLineRef?.current?.focus()}
    >
      {history.map((item, key) => (
        <pre key={key} className="text-light mb-0">
          {"> " + item}
        </pre>
      ))}
      <div>
        <span className="text-light mr-2">$</span>
        <input
          ref={cmdLineRef}
          type="text"
          className={`w-75 bg-dark border-0 text-light ${styles["terminal-line"]}`}
          onChange={(e) => setLine(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            if (line === "") return setHistory([...history, ""]);
            setLine("");

            fetch(`${basePath}/api/admin/exec`, {
              method: "POST",
              headers: { "content-type": "text/plain" },
              body: line,
            })
              .then((res) => res.text())
              .then((data) => setHistory([...history, line + "\n" + data]))
              .catch((err) => setHistory([...history, line + "\n" + err]))
              .finally(() => {
                cmdRef?.current?.scrollTo({
                  top: cmdRef?.current?.scrollHeight,
                });
              });

            cmdLineRef?.current?.focus();
          }}
          value={line}
        />
      </div>
    </div>
  );
});
