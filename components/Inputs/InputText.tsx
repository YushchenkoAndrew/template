import React from "react";
import { Event } from "../../pages/admin/projects/[operation]";
import { ProjectElement } from "../../types/projects";

export interface InputTextProps {
  name: string;
  value: string;
  rows?: number;
  error?: boolean;
  placeholder?: string;
  onChange: (event: Event) => void;
  onBlur?: (event: Event) => void;
}

export default function InputText(props: InputTextProps) {
  return (
    <>
      <textarea
        name={props.name}
        value={props.value}
        className="form-control"
        placeholder={props.placeholder ?? ""}
        rows={props.rows ?? 3}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
      {props.error ? (
        <div className="text-danger small w-100">This field is required</div>
      ) : null}
    </>
  );
}
