import React, { useRef, useState } from "react";
import InputName from "../../Inputs/InputName";
import InputRadio from "../../Inputs/InputRadio";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";

export interface PortProps {
  show?: boolean;
}

export interface PortRef {}

export default React.forwardRef((props: PortProps, ref) => {
  const [minimized, onMinimize] = useState({
    resources: false,
    env: false,
  });

  return (
    <div className={`border rounded mx-1 py-2 ${props.show ? "" : "d-none"}`}>
      <InputTemplate className="col-8" label="Protocol">
        <InputRadio
          name="flag"
          placeholder={"TCP"}
          className="btn-group btn-group-sm btn-group-toggle"
          options={["TCP", "UDP", "HTTP", "PROXY"]}
          label="btn-outline-info"
          onChange={(event) => {}}
        />
      </InputTemplate>

      <div className="row mx-1 w-100">
        <InputTemplate className="col-6" label="Port">
          <div className="input-group">
            <InputValue
              name="title"
              className="rounded"
              value={""}
              placeholder={"test"}
              onChange={() => null}
              // onBlur={onDataCache}
            />
          </div>
        </InputTemplate>

        <InputTemplate className="col-6" label="Target Port">
          <div className="input-group">
            <InputValue
              name="title"
              className="rounded"
              value={""}
              placeholder={"test"}
              onChange={() => null}
              // onBlur={onDataCache}
            />
          </div>
        </InputTemplate>
      </div>

      <InputTemplate className="mx-3" label="Node Port">
        <div className="input-group">
          <InputName
            name="title"
            char="?"
            value={""}
            placeholder={"test"}
            onChange={() => null}
            // onBlur={onDataCache}
          />
        </div>
      </InputTemplate>
    </div>
  );
});
