import React, { useState } from "react";
import md5 from "../../lib/md5";
import { ProjectElement } from "../../types/projects";

export interface InputRadioProps {
  name: string;
  options: string;
  onChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | ProjectElement
  ) => void;
}

export default function InputRadio(props: InputRadioProps) {
  const [selected, onSelected] = useState<string | null>(
    props.options.split(" ")[0]
  );

  return (
    <div className="input-group">
      <div className="btn-group btn-group-toggle" data-toggle="buttons">
        {props.options.split(" ").map((item) => (
          <label
            key={md5(item + Math.random().toString())}
            className={`btn btn-outline-dark ${
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
            {item}
          </label>
        ))}
      </div>
    </div>
  );
}
