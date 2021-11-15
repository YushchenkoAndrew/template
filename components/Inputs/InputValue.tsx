import React from "react";
import { Event } from "../../pages/admin/projects/operation";

export interface InputValueProps {
  name: string;
  value: string;
  type?: React.HTMLInputTypeAttribute;
  required?: boolean;
  placeholder?: string;
  className?: string;
  onChange: (event: Event) => void;
  onBlur?: (event: Event) => void;
}

export default function InputValue(props: InputValueProps) {
  return (
    <>
      <input
        name={props.name}
        value={props.value}
        type={props.type ?? "text"}
        className={`form-control ${props.className}`}
        placeholder={props.placeholder ?? ""}
        required={props.required}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
      {props.required ? (
        <div className="invalid-tooltip">This field is required</div>
      ) : null}
    </>
  );
}
