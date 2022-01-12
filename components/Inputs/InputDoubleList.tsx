import React, { useState } from "react";
import { Event } from "../../pages/admin/projects/operation";
import { LinkData } from "../../types/api";
import InputValue from "./InputValue";

export type DoubleType<Type> = {
  0: Type;
  1: Type;
};
export interface InputValueProps {
  char: DoubleType<string>;
  className?: string;
  name: DoubleType<string>;
  type?: DoubleType<string>;
  required?: DoubleType<boolean>;
  placeholder?: DoubleType<string>;
  onChange: (data: any) => boolean;
}

export default function InputList(props: InputValueProps) {
  const [data, onDataChange] = useState({} as { [name: string]: string });

  function onChange(event: Event) {
    onDataChange({
      ...data,
      [event.target.name]: event.target.value,
    });
  }

  return (
    <div className={`row ${props.className ?? ""}`}>
      <div className="input-group col-md-6 order-sm-1 p-2">
        <div className="input-group-prepend">
          <span className="input-group-text">{props.char[0]}</span>
        </div>
        <InputValue
          className="rounded-right"
          name={props.name[0]}
          value={data[props.name[0]] ?? ""}
          type={props.type?.[0]}
          required={props.required?.[0]}
          placeholder={props.placeholder?.[0]}
          onChange={onChange}
        />
      </div>
      <div className="input-group col-md-6 order-sm-2 p-2">
        <div className="input-group-prepend">
          <span className="input-group-text">{props.char[1]}</span>
        </div>
        <InputValue
          className="rounded-right"
          name={props.name[1]}
          value={data[props.name[1]] ?? ""}
          type={props.type?.[1]}
          required={props.required?.[1]}
          placeholder={props.placeholder?.[1]}
          onChange={onChange}
        />
        <div className="input-group-append">
          <a
            className="btn btn-primary text-light"
            onClick={(e) => {
              e.preventDefault();
              if (
                props.onChange({
                  [props.name[0]]: data[props.name[0]],
                  [props.name[1]]: data[props.name[1]],
                })
              ) {
                // Reset input on Success
                onDataChange({ [props.name[0]]: "", [props.name[1]]: "" });
              }
            }}
          >
            Create
          </a>
        </div>
      </div>
    </div>
  );
}
