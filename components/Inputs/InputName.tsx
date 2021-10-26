import React from "react";
import { Event } from "../../pages/admin/projects/[operation]";
import { ProjectElement } from "../../types/projects";
import InputValue from "./InputValue";

export interface InputNameProps {
  char: string;
  name: string;
  value: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  onChange: (event: Event) => void;
  onBlur?: (event: Event) => void;
}

export default function InputName(props: InputNameProps) {
  return (
    <div className="input-group">
      <div className="input-group-prepend">
        <span className="input-group-text">{props.char}</span>
      </div>
      <InputValue
        name={props.name}
        value={props.value}
        type={props.type}
        required={props.required}
        placeholder={props.placeholder}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
    </div>
  );
}
