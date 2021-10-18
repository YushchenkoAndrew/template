import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import md5 from "../../lib/md5";
import { Event } from "../../pages/admin/projects/[operation]";
import InputValue from "./InputValue";

export interface InputValueProps {
  char: string;
  name: string;
  value: string;
  type?: string;
  error?: boolean;
  placeholder?: string;
  onChange: (event: Event) => void;
  onBlur?: (event: Event) => void;
}

export default function InputList(props: InputValueProps) {
  // TODO:
  const temp = [
    "mdflksd",
    "jnsdjfknsdk",
    "mdflksd",
    "jnsdjfknsdk",
    "mdflksd",
    "jnsdjfknsdk",
    "mdflksd",
    "jnsdjfknsdk",
  ];

  return (
    <>
      <div className="input-group">
        <div className="input-group-prepend">
          <span className="input-group-text">{props.char}</span>
        </div>
        <InputValue
          name={props.name}
          value={props.value}
          type={props.type}
          error={props.error}
          placeholder={props.placeholder}
          onChange={props.onChange}
          onBlur={props.onBlur}
        />
        <div className="input-group-append">
          <span className="input-group-text">@</span>
        </div>
        <InputValue
          name={props.name}
          value={props.value}
          type={props.type}
          error={props.error}
          placeholder={props.placeholder}
          onChange={props.onChange}
          onBlur={props.onBlur}
        />
        <div className="input-group-append">
          <button className="btn btn-primary" type="button">
            Create
          </button>
        </div>
      </div>
      <ul className="list-group">
        {temp.map((item, i) => (
          <div key={md5(i.toString())} className="input-group mt-1">
            <div className="input-group-prepend">
              <span className="input-group-text">{props.char}</span>
            </div>
            <li className="form-control">Cras justo odio</li>
            <div className="input-group-prepend">
              <span className="input-group-text">@</span>
            </div>
            <li className="form-control">Cras justo odio</li>

            <div className="input-group-append">
              <button className="btn btn-outline-danger" type="button">
                Delete
              </button>
            </div>
          </div>
        ))}
      </ul>
    </>
  );
}
