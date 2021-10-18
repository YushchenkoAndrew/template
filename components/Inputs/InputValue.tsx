import React from "react";
import { Event } from "../../pages/admin/projects/[operation]";

export interface InputValueProps {
  name: string;
  value: string;
  type?: string;
  error?: boolean;
  placeholder?: string;
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
        className="form-control"
        placeholder={props.placeholder ?? ""}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
      {props.error ? (
        <div className="text-danger small w-100">This field is required</div>
      ) : null}
    </>
  );
}
