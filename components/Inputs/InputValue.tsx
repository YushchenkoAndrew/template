import React from "react";
import { Event } from "../../pages/admin/projects/add";
import { ProjectElement } from "../../types/projects";

export interface InputValueProps {
  name: string;
  type?: string;
  error?: boolean;
  placeholder?: string;
  onChange: (event: Event) => void;
}

export default function InputValue(props: InputValueProps) {
  return (
    <>
      <input
        name={props.name}
        type={props.type ?? "text"}
        className="form-control"
        placeholder={props.placeholder ?? ""}
        onChange={props.onChange}
      />
      {props.error ? (
        <div className="text-danger small w-100">This field is required</div>
      ) : null}
    </>
  );
}
