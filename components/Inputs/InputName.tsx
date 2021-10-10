import React from "react";
import { ProjectElement } from "../../types/projects";
import InputValue from "./InputValue";

export interface InputNameProps {
  char: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  message?: string;
  onChange: (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | ProjectElement
  ) => void;
}

export default function InputName(props: InputNameProps) {
  return (
    <>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">{props.char}</span>
        </div>
        <InputValue
          name={props.name}
          type={props.type}
          required={props.required ?? false}
          placeholder={props.placeholder}
          message={props.message}
          onChange={props.onChange}
        />
      </div>
    </>
  );
}
