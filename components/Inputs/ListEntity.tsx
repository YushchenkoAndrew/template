import React, { useState } from "react";
import { DoubleType } from "./InputDoubleList";

export interface ListEntityProps {
  char: DoubleType<string>;
  // name: DoubleType<string>;
  value: DoubleType<string>;
  onChange: () => void;
}

export default function ListEntity(props: ListEntityProps) {
  return (
    <>
      <div className="input-group col-md-6 order-sm-1 p-2">
        <div className="input-group-prepend">
          <span className="input-group-text">{props.char[0]}</span>
        </div>
        <li className="form-control">{props.value[0]}</li>
      </div>

      <div className="input-group col-md-6 order-sm-2 p-2">
        <div className="input-group-prepend">
          <span className="input-group-text">{props.char[1]}</span>
        </div>
        <li className="form-control">{props.value[1]}</li>

        <div className="input-group-append">
          <button
            className="btn btn-outline-danger"
            type="button"
            onClick={() => props.onChange()}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}
