import React from "react";
import { Event } from "../../pages/admin/projects/[operation]";
import { ProjectElement } from "../../types/projects";

export interface InputTextProps {
  name: string;
  value: string;
  rows?: number;
  required?: boolean;
  placeholder?: string;
  onChange: (event: Event) => void;
  onBlur?: (event: Event) => void;
}

export default function InputText(props: InputTextProps) {
  return (
    <div className="input-group">
      <textarea
        name={props.name}
        value={props.value}
        className="form-control"
        placeholder={props.placeholder ?? ""}
        rows={props.rows ?? 3}
        required={props.required}
        onChange={props.onChange}
        onBlur={props.onBlur}
      />
      {props.required ? (
        <div className="invalid-tooltip">This field is required</div>
      ) : null}
    </div>
  );
}
