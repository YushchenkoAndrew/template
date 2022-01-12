import React from "react";
import InputName from "../../Inputs/InputName";
import InputTemplate from "../../Inputs/InputTemplate";
import InputValue from "../../Inputs/InputValue";

export interface PathProps {
  show?: boolean;
}

export interface PathRef {}

export default React.forwardRef((props: PathProps, ref) => {
  return (
    <div className={`border rounded mx-1 py-2 ${props.show ? "" : "d-none"}`}>
      <InputTemplate className="mx-3" label="Path">
        <InputName
          name="title"
          char="/"
          value={""}
          placeholder={"test"}
          onChange={() => null}
          // onBlur={onDataCache}
        />
      </InputTemplate>

      <InputTemplate className="mx-3" label="Service Port">
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
  );
});
