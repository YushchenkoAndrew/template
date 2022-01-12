import {
  faChevronDown,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import InputName from "../../Inputs/InputName";
import InputTemplate from "../../Inputs/InputTemplate";

export interface NamespaceProps {
  show?: boolean;
  value: { [name: string]: any };
  onChange: (value: { [name: string]: any }) => void;
}

export interface NamespaceRef {}

export default React.forwardRef((props: NamespaceProps, ref) => {
  const [minimized, onMinimized] = useState(true);
  return (
    <div
      className={`card col-12 col-md-8 col-lg-5 p-3 m-3 ${
        props.show ? "" : "d-none"
      }`}
    >
      <InputTemplate
        labelClassName="font-weight-bold ml-2"
        label={[
          "Metadata ",
          <FontAwesomeIcon icon={minimized ? faChevronDown : faChevronRight} />,
        ]}
        onClick={() => onMinimized(!minimized)}
      >
        <div
          className={`container border rounded mx-1 py-2 ${
            minimized ? "" : "d-none"
          }`}
        >
          <InputTemplate className="w-100" label="Name">
            <InputName
              char="@"
              name="name"
              required
              value={props.value.metadata.name}
              placeholder={"namespace"}
              onChange={(event) => {
                props.value.metadata.name = event.target.value.replace(" ", "");
                props.onChange(props.value);
              }}
              // onBlur={onDataCache}
            />
          </InputTemplate>
        </div>
      </InputTemplate>
    </div>
  );
});
