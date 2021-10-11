import React from "react";
import { Event } from "../../pages/admin/projects/add";
import { ProjectElement } from "../../types/projects";

export interface InputTextProps {
  name: string;
  rows?: number;
  error?: boolean;
  placeholder?: string;
  onChange: (event: Event) => void;
}

export default function InputText(props: InputTextProps) {
  return (
    <>
      <textarea
        name={props.name}
        className="form-control"
        placeholder={props.placeholder ?? ""}
        rows={props.rows ?? 3}
        onChange={props.onChange}
      />
      {props.error ? (
        <div className="text-danger small w-100">This field is required</div>
      ) : null}
    </>
  );
}
