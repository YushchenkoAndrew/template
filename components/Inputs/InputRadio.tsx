import React, { useEffect, useRef, useState } from "react";
import md5 from "../../lib/md5";
import { Event } from "../../pages/admin/projects/operation";
import { ProjectElement } from "../../types/projects";

export type GridOption = "sm" | "md" | "lg" | "xl";
export type Overflow = {
  on: { className: string; len: number };
  off: { className: string; len: number };
};
export interface InputRadioProps {
  name: string;
  className?: string;
  options: string[];
  placeholder?: string;
  label?: string;
  row?: boolean;
  overflow?: Overflow;
  onChange: (event: Event) => void;
}

export default function InputRadio(props: InputRadioProps) {
  const divRef = useRef<HTMLDivElement | null>(null);
  const [selected, onSelected] = useState<string | null>(
    props.placeholder || props.options[0]
  );

  return (
    <div className="input-group">
      <div
        ref={divRef}
        className={props.className ?? "btn-group btn-group-toggle"}
        data-toggle="buttons"
      >
        {props.options.map((item) => (
          <label
            key={md5(item + Math.random().toString())}
            className={`btn ${props.label ?? "btn-outline-dark"} ${
              selected === item ? "active" : ""
            }`}
          >
            <input
              type="radio"
              name={props.name}
              value={item}
              key={md5(item + Math.random().toString())}
              autoComplete="off"
              checked={selected === item}
              onChange={(event) => {
                props.onChange(event);
                onSelected(item);
              }}
            />
            {props.overflow ? (
              <>
                <span className={props.overflow.on.className}>
                  {props.overflow.on.len
                    ? item.slice(0, props.overflow.on.len) +
                      (item.length > props.overflow.on.len ? "..." : "")
                    : item}
                </span>
                <span className={props.overflow.off.className}>
                  {props.overflow.off.len
                    ? item.slice(0, props.overflow.off.len) +
                      (item.length > props.overflow.off.len ? "..." : "")
                    : item}
                </span>
              </>
            ) : (
              item
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
