import React from "react";

export interface InputTextProps {
  name: string;
  rows?: number;
  required?: boolean | undefined;
  placeholder?: string;
  message?: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
}

export default function InputText(props: InputTextProps) {
  return (
    <>
      <textarea
        name={props.name}
        className="form-control"
        placeholder={props.placeholder ?? ""}
        required={props.required}
        rows={props.rows ?? 3}
        onChange={props.onChange}
      />
      {props.required ? (
        <div className="invalid-feedback w-100">{props.message}</div>
      ) : null}
    </>
  );
}
