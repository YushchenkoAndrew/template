import React from "react";

export interface InputValueProps {
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  message?: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export default function InputValue(props: InputValueProps) {
  return (
    <>
      <input
        name={props.name}
        type={props.type ?? "text"}
        className="form-control"
        placeholder={props.placeholder ?? ""}
        required={props.required}
        onChange={props.onChange}
      />
      {props.required ? (
        <div className="invalid-feedback w-100">{props.message}</div>
      ) : null}
    </>
  );
}
